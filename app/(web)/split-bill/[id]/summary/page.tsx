import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBillGroupById } from "@/prisma/db/billGroups";
import { getGroupExpenseSummary } from "@/prisma/db/billExpenses";
import { getUsersByIds } from "@/actions/users";
import ExpenseSummary from "@/components/pages/split-bill/expense-summary";

export const metadata = {
  title: "Split Bill - Expense Summary",
};

// Helper function to check if an amount is effectively zero (accounting for floating point errors)
const isEffectivelyZero = (amount: number): boolean => {
  return Math.abs(amount) < 0.01; // Consider amounts less than 0.01 as zero
};

export default async function SummaryPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { data: group, error: groupError } = await getBillGroupById(params.id);
  const { data: groupSummary } = await getGroupExpenseSummary(params.id);

  // Check if user is a member of the group
  const isMember = group?.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember || groupError || !group) {
    return redirect("/split-bill");
  }

  // Get all member user IDs from the group
  const memberUserIds = group.members.map((member: { userId: string }) => member.userId);

  // Collect all unique user IDs from the expense summary
  const summaryUserIds: string[] = [];

  if (groupSummary) {
    // Add all user IDs from the summary
    groupSummary.forEach((member) => {
      if (!summaryUserIds.includes(member.userId)) {
        summaryUserIds.push(member.userId);
      }

      // Add creditor IDs
      Object.keys(member.credits).forEach((creditorId) => {
        if (!summaryUserIds.includes(creditorId)) {
          summaryUserIds.push(creditorId);
        }
      });

      // Add debtor IDs
      Object.keys(member.debts).forEach((debtorId) => {
        if (!summaryUserIds.includes(debtorId)) {
          summaryUserIds.push(debtorId);
        }
      });
    });
  }

  // Combine all unique user IDs
  const allUserIds: string[] = [];
  [...memberUserIds, ...summaryUserIds].forEach((id) => {
    if (!allUserIds.includes(id)) {
      allUserIds.push(id);
    }
  });

  // Fetch user data for all users (both current members and possibly removed users)
  const { data: allUsersData } = await getUsersByIds(allUserIds);

  // Identify which users have been removed from the group
  const removedUserIds = summaryUserIds.filter((id) => !memberUserIds.includes(id));

  // Enhance group members with user data
  const enhancedMembers = group.members.map((member: { id: string; userId: string }) => {
    const userData = allUsersData!.find((user) => user.id === member.userId)!;
    return {
      ...member,
      user: userData,
    };
  });

  // Enhance group summary with user data and properly handle removed users
  const enhancedGroupSummary =
    groupSummary?.map((member) => {
      const userData = allUsersData!.find((user) => user.id === member.userId);
      const isRemovedUser = removedUserIds.includes(member.userId);

      // Process credits (who this user owes to)
      const processedCredits: Record<string, Record<string, number>> = {};

      // If this is the current user, completely remove any credits to removed users with zero balance
      if (member.userId === userId) {
        Object.entries(member.credits).forEach(([creditorId, currencies]) => {
          // Skip removed users with zero balance
          if (removedUserIds.includes(creditorId)) {
            // Check if all currency amounts are effectively zero
            const allZero = Object.values(currencies).every((amount) => isEffectivelyZero(amount));
            if (allZero) return; // Skip this creditor completely
          }

          // For non-removed users or removed users with non-zero balance
          const processedCurrencies: Record<string, number> = {};

          Object.entries(currencies).forEach(([currency, amount]) => {
            // Skip zero amounts for removed users
            if (removedUserIds.includes(creditorId) && isEffectivelyZero(amount)) return;

            // Keep the original amount
            processedCurrencies[currency] = amount;
          });

          if (Object.keys(processedCurrencies).length > 0) {
            processedCredits[creditorId] = processedCurrencies;
          }
        });
      } else {
        // For other users, process normally
        Object.entries(member.credits).forEach(([creditorId, currencies]) => {
          const processedCurrencies: Record<string, number> = {};

          Object.entries(currencies).forEach(([currency, amount]) => {
            // Skip zero amounts for removed users
            if (removedUserIds.includes(creditorId) && isEffectivelyZero(amount)) return;

            // Keep the original amount
            processedCurrencies[currency] = amount;
          });

          if (Object.keys(processedCurrencies).length > 0) {
            processedCredits[creditorId] = processedCurrencies;
          }
        });
      }

      // Process debts (who owes this user)
      const processedDebts: Record<string, Record<string, number>> = {};

      // If this is the current user, completely remove any debts from removed users with zero balance
      if (member.userId === userId) {
        Object.entries(member.debts).forEach(([debtorId, currencies]) => {
          // Skip removed users with zero balance
          if (removedUserIds.includes(debtorId)) {
            // Check if all currency amounts are effectively zero
            const allZero = Object.values(currencies).every((amount) => isEffectivelyZero(amount));
            if (allZero) return; // Skip this debtor completely
          }

          // For non-removed users or removed users with non-zero balance
          const processedCurrencies: Record<string, number> = {};

          Object.entries(currencies).forEach(([currency, amount]) => {
            // Skip zero amounts for removed users
            if (removedUserIds.includes(debtorId) && isEffectivelyZero(amount)) return;

            // Keep the original amount
            processedCurrencies[currency] = amount;
          });

          if (Object.keys(processedCurrencies).length > 0) {
            processedDebts[debtorId] = processedCurrencies;
          }
        });
      } else {
        // For other users, process normally
        Object.entries(member.debts).forEach(([debtorId, currencies]) => {
          const processedCurrencies: Record<string, number> = {};

          Object.entries(currencies).forEach(([currency, amount]) => {
            // Skip zero amounts for removed users
            if (removedUserIds.includes(debtorId) && isEffectivelyZero(amount)) return;

            // Keep the original amount
            processedCurrencies[currency] = amount;
          });

          if (Object.keys(processedCurrencies).length > 0) {
            processedDebts[debtorId] = processedCurrencies;
          }
        });
      }

      // Process balance, paid, and owes
      let processedBalance: Record<string, number> = {};
      let processedPaid: Record<string, number> = {};
      let processedOwes: Record<string, number> = {};

      // Only filter out zero balances for removed users
      if (isRemovedUser) {
        Object.entries(member.balance).forEach(([currency, amount]) => {
          if (!isEffectivelyZero(amount)) {
            processedBalance[currency] = amount;
          }
        });

        Object.entries(member.paid).forEach(([currency, amount]) => {
          if (!isEffectivelyZero(amount)) {
            processedPaid[currency] = amount;
          }
        });

        Object.entries(member.owes).forEach(([currency, amount]) => {
          if (!isEffectivelyZero(amount)) {
            processedOwes[currency] = amount;
          }
        });
      } else {
        // Keep all balances for current members
        processedBalance = { ...member.balance };
        processedPaid = { ...member.paid };
        processedOwes = { ...member.owes };
      }

      return {
        ...member,
        name: userData ? `${userData.firstName} ${userData.lastName}` : "Unknown",
        email: userData?.email || "",
        isRemovedUser,
        credits: processedCredits,
        debts: processedDebts,
        balance: processedBalance,
        paid: processedPaid,
        owes: processedOwes,
      };
    }) || [];

  return (
    <div>
      <ExpenseSummary
        groupId={params.id}
        userId={userId}
        groupMembers={enhancedMembers}
        groupSummary={enhancedGroupSummary}
      />
    </div>
  );
}
