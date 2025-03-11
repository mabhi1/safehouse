import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBillGroupById, isUserGroupCreator } from "@/prisma/db/billGroups";
import { getGroupExpenseSummary } from "@/prisma/db/billExpenses";
import { getUsersByIds } from "@/actions/users";
import Link from "next/link";
import EditGroupForm from "@/components/pages/split-bill/edit-group-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteBillGroupAction } from "@/actions/bill-groups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, AlertTriangle, ArrowDown, ArrowUp, MoveLeft } from "lucide-react";
import BillTabs from "@/components/pages/split-bill/bill-tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to check if an amount is effectively zero (accounting for floating point errors)
const isEffectivelyZero = (amount: number): boolean => {
  return Math.abs(amount) < 0.01; // Consider amounts less than 0.01 as zero
};

export default async function BillGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const { data: group, error: groupError } = await getBillGroupById(params.id);
  const { data: isCreator } = await isUserGroupCreator(params.id, userId);
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

      return {
        ...member,
        name: userData ? `${userData.firstName} ${userData.lastName}` : "Unknown",
        email: userData?.email || "",
        isRemovedUser,
        credits: processedCredits,
        debts: processedDebts,
      };
    }) || [];

  // Find the current user's summary in the enhanced group data
  const currentUserSummary = enhancedGroupSummary.find((member) => member.userId === userId);

  return (
    <div className="flex flex-col gap-5">
      <Link href="/split-bill" className="flex lg:hidden items-center mr-auto gap-2">
        <MoveLeft className="w-4 h-4" />
        <span className="text-lg capitalize">All Groups</span>
      </Link>
      <div className="flex gap-5 items-start">
        <div className="mr-auto">
          <h2 className="text-2xl">{group.name}</h2>
          <p className="text-xs text-muted-foreground">{group.description || "Manage your bill group and members."}</p>
        </div>

        <EditGroupForm
          groupId={group.id}
          userId={userId}
          initialName={group.name}
          initialDescription={group.description || ""}
        />

        {isCreator && (
          <DeleteButton
            id={group.id}
            uid={userId}
            deleteAction={deleteBillGroupAction}
            dialogDescription="This action will permanently remove the group from our servers."
            variant="destructive"
            mobileVariant
            successRedirect="/split-bill"
            successMessage="Group deleted successfully"
          />
        )}
      </div>

      {currentUserSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          {/* Who the current user owes money to */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                <span className="font-medium">You Owe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(currentUserSummary.credits).length > 0 &&
              Object.values(currentUserSummary.owes).some((amount) => !isEffectivelyZero(amount)) ? (
                <div className="space-y-4">
                  {Object.entries(currentUserSummary.credits).map(([creditorId, currencies]) => {
                    const creditor = enhancedGroupSummary.find((m) => m.userId === creditorId);
                    const isRemovedUser = removedUserIds.includes(creditorId);

                    // Check if there are any non-zero amounts
                    const hasNonZeroAmount = Object.values(currencies).some((amount) => !isEffectivelyZero(amount));
                    if (!hasNonZeroAmount) return null;

                    return (
                      <div
                        key={creditorId}
                        className={cn(
                          "flex flex-col md:flex-row justify-between border-b pb-3 last:border-0 last:pb-0",
                          isRemovedUser && "bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {creditor ? creditor.name : "Unknown User"}
                            {isRemovedUser && <span className="ml-1 italic">(removed)</span>}
                          </p>
                          {isRemovedUser && (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 flex items-center gap-1 text-xs"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Removed
                            </Badge>
                          )}
                        </div>
                        {Object.entries(currencies).map(([currency, amount]) => {
                          if (isEffectivelyZero(amount)) return null;
                          return (
                            <div key={currency} className="flex justify-between items-center text-sm mt-1">
                              <span className="font-medium text-red-600">
                                {amount.toFixed(2)} {currency}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No outstanding debts to other members</div>
              )}
            </CardContent>
          </Card>

          {/* Who owes money to the current user */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="font-medium ml-1">You are owed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(currentUserSummary.debts).length > 0 &&
              Object.entries(currentUserSummary.balance).some(([_, amount]) => amount > 0) ? (
                <div className="space-y-4">
                  {Object.entries(currentUserSummary.debts).map(([debtorId, currencies]) => {
                    const debtor = enhancedGroupSummary.find((m) => m.userId === debtorId);
                    const isRemovedUser = removedUserIds.includes(debtorId);

                    // Check if there are any non-zero amounts
                    const hasNonZeroAmount = Object.values(currencies).some((amount) => !isEffectivelyZero(amount));
                    if (!hasNonZeroAmount) return null;

                    return (
                      <div
                        key={debtorId}
                        className={cn(
                          "border-b pb-3 last:border-0 last:pb-0 flex flex-col md:flex-row justify-between",
                          isRemovedUser && "bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{debtor ? debtor.name : "Unknown User"}</p>
                          {isRemovedUser && (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 flex items-center gap-1 text-xs"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Removed
                            </Badge>
                          )}
                        </div>
                        {Object.entries(currencies).map(([currency, amount]) => {
                          if (isEffectivelyZero(amount)) return null;
                          return (
                            <div key={currency} className="flex justify-between items-center text-sm mt-1">
                              <span className="font-medium text-green-600">
                                {amount.toFixed(2)} {currency}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No one owes money to this member</div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center p-6 border rounded-lg">
          <Coins className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Debt Information</h3>
          <p className="text-muted-foreground">Add expenses to see detailed debt information.</p>
        </div>
      )}

      <BillTabs billId={params.id} />

      {children}
    </div>
  );
}
