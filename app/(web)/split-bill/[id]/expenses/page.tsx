import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBillGroupById } from "@/prisma/db/billGroups";
import { getBillExpensesByGroup } from "@/prisma/db/billExpenses";
import { getUsersByIds } from "@/actions/users";
import ExpenseList from "@/components/pages/split-bill/expense-list";

export const metadata = {
  title: "Split Bill - Group Expenses",
};

export default async function ExpensesPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { data: group, error: groupError } = await getBillGroupById(params.id);
  const { data: expenses } = await getBillExpensesByGroup(params.id);

  // Check if user is a member of the group
  const isMember = group?.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember || groupError || !group) {
    return redirect("/split-bill");
  }

  // Get all member user IDs from the group
  const memberUserIds = group.members.map((member: { userId: string }) => member.userId);

  // Collect all unique user IDs from expenses (paidBy and shares)
  const expenseUserIdsArray: string[] = [];

  if (expenses) {
    // Add paidBy users
    expenses.forEach((expense) => {
      if (!expenseUserIdsArray.includes(expense.paidBy)) {
        expenseUserIdsArray.push(expense.paidBy);
      }

      // Add users from shares
      expense.shares.forEach((share) => {
        if (!expenseUserIdsArray.includes(share.member.userId)) {
          expenseUserIdsArray.push(share.member.userId);
        }
      });
    });
  }

  // Combine all unique user IDs
  const allUserIds: string[] = [];
  [...memberUserIds, ...expenseUserIdsArray].forEach((id) => {
    if (!allUserIds.includes(id)) {
      allUserIds.push(id);
    }
  });

  // Fetch user data for all users (both current members and possibly removed users)
  const { data: allUsersData } = await getUsersByIds(allUserIds);

  // Identify which users have been removed from the group
  const removedUserIds = expenseUserIdsArray.filter((id) => !memberUserIds.includes(id));

  // Enhance group members with user data
  const enhancedMembers = group.members.map((member: { id: string; userId: string }) => {
    const userData = allUsersData!.find((user) => user.id === member.userId)!;
    return {
      ...member,
      user: userData,
    };
  });

  // Enhance expenses with user data for each share's member
  const enhancedExpenses = expenses?.map((expense) => {
    // Check if the expense was paid by a removed user
    const isPaidByRemovedUser = removedUserIds.includes(expense.paidBy);

    // Transform history changes to the expected format
    const transformedHistory = expense.history?.map((entry) => ({
      ...entry,
      changes: entry.changes as Record<string, { old: any; new: any }>,
    }));

    return {
      ...expense,
      history: transformedHistory,
      user: allUsersData!.find((user) => user.id === expense.paidBy)!,
      isPaidByRemovedUser,
      shares: expense.shares.map((share) => {
        // Check if this share belongs to a removed user
        const isRemovedUser = removedUserIds.includes(share.member.userId);

        return {
          ...share,
          member: {
            ...share.member,
            user: allUsersData!.find((user) => user.id === share.member.userId)!,
            isRemovedUser,
          },
        };
      }),
    };
  });

  return (
    <div className="mt-6">
      <ExpenseList
        expenses={enhancedExpenses || []}
        members={enhancedMembers}
        groupId={params.id}
        userId={userId}
        allUsers={allUsersData || []}
      />
    </div>
  );
}
