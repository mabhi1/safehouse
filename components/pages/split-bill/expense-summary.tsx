"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserExpenseSummaryAction } from "@/actions/bill-expenses";
import { Loader2, ArrowUp, ArrowDown, Coins } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserResult } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";

// Helper function to check if an amount is effectively zero (accounting for floating point errors)
const isEffectivelyZero = (amount: number): boolean => {
  return Math.abs(amount) < 0.01; // Consider amounts less than 0.01 as zero
};

interface ExpenseSummaryProps {
  groupId: string;
  userId: string;
  groupMembers: Member[];
  groupSummary?: MemberSummary[];
  removedUserIds?: string[];
}

interface Member {
  id: string;
  userId: string;
  user: UserResult;
}

interface MemberSummary {
  userId: string;
  name: string;
  email: string;
  isGroupOwner: boolean;
  isRemovedUser?: boolean;
  paid: Record<string, number>;
  owes: Record<string, number>;
  balance: Record<string, number>;
  debts: Record<string, Record<string, number>>; // Who owes this user
  credits: Record<string, Record<string, number>>; // Who this user owes to
}

export default function ExpenseSummary({
  groupId,
  userId,
  groupMembers,
  groupSummary: propGroupSummary,
  removedUserIds = [],
}: ExpenseSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [groupSummary, setGroupSummary] = useState<MemberSummary[]>(propGroupSummary || []);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        // Fetch user summary
        const userResult = await getUserExpenseSummaryAction(groupId);
        if (userResult.error) {
          throw new Error(userResult.error);
        }

        // If groupSummary was not provided as a prop, we need to fetch it
        if (!propGroupSummary || propGroupSummary.length === 0) {
          // This code is kept for backward compatibility
          // but should not be needed anymore since we're passing the summary as a prop as a prop
          // from the parent component
          toast.error("Group summary data not available");
        } else {
          // Process the group summary to handle removed users with settled dues
          const processedSummary = propGroupSummary
            .map((member) => {
              // For removed users with no financial activity, skip them completely
              if (member.isRemovedUser) {
                const hasNonZeroBalance = Object.values(member.balance).some((amount) => !isEffectivelyZero(amount));
                const hasNonZeroPaid = Object.values(member.paid).some((amount) => !isEffectivelyZero(amount));
                const hasNonZeroOwes = Object.values(member.owes).some((amount) => !isEffectivelyZero(amount));

                // Check if they have any non-zero credits or debts with the current user
                const hasNonZeroCreditsWithCurrentUser =
                  member.credits[userId] &&
                  Object.values(member.credits[userId]).some((amount) => !isEffectivelyZero(amount));

                const hasNonZeroDebtsWithCurrentUser =
                  member.debts[userId] &&
                  Object.values(member.debts[userId]).some((amount) => !isEffectivelyZero(amount));

                // If they have no financial activity at all, skip them
                if (
                  !hasNonZeroBalance &&
                  !hasNonZeroPaid &&
                  !hasNonZeroOwes &&
                  !hasNonZeroCreditsWithCurrentUser &&
                  !hasNonZeroDebtsWithCurrentUser
                ) {
                  return null;
                }
              }

              // For the current user, remove any credits/debts to/from removed users with zero balance
              if (member.userId === userId) {
                // Process credits (who this user owes to)
                const processedCredits: Record<string, Record<string, number>> = {};

                Object.entries(member.credits).forEach(([creditorId, currencies]) => {
                  // Skip removed users with zero balance
                  if (member.isRemovedUser && Object.values(currencies).every((amount) => isEffectivelyZero(amount))) {
                    return;
                  }

                  const processedCurrencies: Record<string, number> = {};

                  Object.entries(currencies).forEach(([currency, amount]) => {
                    // Skip zero amounts
                    if (isEffectivelyZero(amount)) return;

                    processedCurrencies[currency] = amount;
                  });

                  if (Object.keys(processedCurrencies).length > 0) {
                    processedCredits[creditorId] = processedCurrencies;
                  }
                });

                // Process debts (who owes this user)
                const processedDebts: Record<string, Record<string, number>> = {};

                Object.entries(member.debts).forEach(([debtorId, currencies]) => {
                  // Skip removed users with zero balance
                  if (member.isRemovedUser && Object.values(currencies).every((amount) => isEffectivelyZero(amount))) {
                    return;
                  }

                  const processedCurrencies: Record<string, number> = {};

                  Object.entries(currencies).forEach(([currency, amount]) => {
                    // Skip zero amounts
                    if (isEffectivelyZero(amount)) return;

                    processedCurrencies[currency] = amount;
                  });

                  if (Object.keys(processedCurrencies).length > 0) {
                    processedDebts[debtorId] = processedCurrencies;
                  }
                });

                return {
                  ...member,
                  credits: processedCredits,
                  debts: processedDebts,
                };
              }

              return member;
            })
            .filter(Boolean) as MemberSummary[];

          setGroupSummary(processedSummary);
        }
      } catch (error) {
        console.error("Error fetching expense summaries:", error);
        toast.error("Failed to load expense summaries");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [groupId, userId, groupMembers, propGroupSummary]);

  // Update groupSummary when propGroupSummary changes
  useEffect(() => {
    if (propGroupSummary && propGroupSummary.length > 0) {
      // Process the group summary to handle removed users with settled dues
      const processedSummary = propGroupSummary
        .map((member) => {
          // For removed users with no financial activity, skip them completely
          if (member.isRemovedUser) {
            const hasNonZeroBalance = Object.values(member.balance).some((amount) => !isEffectivelyZero(amount));
            const hasNonZeroPaid = Object.values(member.paid).some((amount) => !isEffectivelyZero(amount));
            const hasNonZeroOwes = Object.values(member.owes).some((amount) => !isEffectivelyZero(amount));

            // Check if they have any non-zero credits or debts with the current user
            const hasNonZeroCreditsWithCurrentUser =
              member.credits[userId] &&
              Object.values(member.credits[userId]).some((amount) => !isEffectivelyZero(amount));

            const hasNonZeroDebtsWithCurrentUser =
              member.debts[userId] && Object.values(member.debts[userId]).some((amount) => !isEffectivelyZero(amount));

            // If they have no financial activity at all, skip them
            if (
              !hasNonZeroBalance &&
              !hasNonZeroPaid &&
              !hasNonZeroOwes &&
              !hasNonZeroCreditsWithCurrentUser &&
              !hasNonZeroDebtsWithCurrentUser
            ) {
              return null;
            }
          }

          // For the current user, remove any credits/debts to/from removed users with zero balance
          if (member.userId === userId) {
            // Process credits (who this user owes to)
            const processedCredits: Record<string, Record<string, number>> = {};

            Object.entries(member.credits).forEach(([creditorId, currencies]) => {
              // Skip removed users with zero balance
              if (member.isRemovedUser && Object.values(currencies).every((amount) => isEffectivelyZero(amount))) {
                return;
              }

              const processedCurrencies: Record<string, number> = {};

              Object.entries(currencies).forEach(([currency, amount]) => {
                // Skip zero amounts
                if (isEffectivelyZero(amount)) return;

                processedCurrencies[currency] = amount;
              });

              if (Object.keys(processedCurrencies).length > 0) {
                processedCredits[creditorId] = processedCurrencies;
              }
            });

            // Process debts (who owes this user)
            const processedDebts: Record<string, Record<string, number>> = {};

            Object.entries(member.debts).forEach(([debtorId, currencies]) => {
              // Skip removed users with zero balance
              if (member.isRemovedUser && Object.values(currencies).every((amount) => isEffectivelyZero(amount))) {
                return;
              }

              const processedCurrencies: Record<string, number> = {};

              Object.entries(currencies).forEach(([currency, amount]) => {
                // Skip zero amounts
                if (isEffectivelyZero(amount)) return;

                processedCurrencies[currency] = amount;
              });

              if (Object.keys(processedCurrencies).length > 0) {
                processedDebts[debtorId] = processedCurrencies;
              }
            });

            return {
              ...member,
              credits: processedCredits,
              debts: processedDebts,
            };
          }

          return member;
        })
        .filter(Boolean) as MemberSummary[];

      setGroupSummary(processedSummary);
    }
  }, [propGroupSummary, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter out members with no financial activity (all zero balances)
  const activeMembers = groupSummary.filter((member) => {
    // Check if there's any non-zero balance
    const hasNonZeroBalance = Object.values(member.balance).some((amount) => !isEffectivelyZero(amount));

    // Check if there's any non-zero paid amount
    const hasNonZeroPaid = Object.values(member.paid).some((amount) => !isEffectivelyZero(amount));

    // Check if there's any non-zero owed amount
    const hasNonZeroOwes = Object.values(member.owes).some((amount) => !isEffectivelyZero(amount));

    // Include the current user regardless of balance
    if (member.userId === userId) return true;

    // For removed users, only show them if they have non-zero balances
    if (member.isRemovedUser) {
      // Check if they have any non-zero credits or debts with the current user
      const hasNonZeroCreditsWithCurrentUser =
        member.credits[userId] && Object.values(member.credits[userId]).some((amount) => !isEffectivelyZero(amount));

      const hasNonZeroDebtsWithCurrentUser =
        member.debts[userId] && Object.values(member.debts[userId]).some((amount) => !isEffectivelyZero(amount));

      return (
        hasNonZeroBalance ||
        hasNonZeroPaid ||
        hasNonZeroOwes ||
        hasNonZeroCreditsWithCurrentUser ||
        hasNonZeroDebtsWithCurrentUser
      );
    }

    // Always show active members
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl">
        Expense Summary <Badge variant="outline">{activeMembers.length}</Badge>
      </h2>

      {activeMembers.length > 0 ? (
        <div className="space-y-4">
          {activeMembers.map((member) => (
            <Card
              key={member.userId}
              className={cn(
                member.userId === userId && "border-primary bg-primary/5",
                member.isRemovedUser && "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center flex-wrap gap-2">
                  <span className="font-medium">{member.userId === userId ? "You" : member.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Who the member owes money to */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                      Owes
                    </h4>
                    {Object.keys(member.credits).length > 0 &&
                    Object.values(member.owes).some((amount) => !isEffectivelyZero(amount)) ? (
                      <div className="space-y-2">
                        {Object.entries(member.credits).map(([creditorId, currencies]) => {
                          const creditor = activeMembers.find((m) => m.userId === creditorId);
                          const isRemovedUser = removedUserIds.includes(creditorId);

                          // Check if there are any non-zero amounts
                          const hasNonZeroAmount = Object.values(currencies).some(
                            (amount) => !isEffectivelyZero(amount)
                          );
                          if (!hasNonZeroAmount) return null;

                          return (
                            <div
                              key={creditorId}
                              className={cn(
                                "flex flex-col md:flex-row justify-between border-b pb-2 last:border-0 last:pb-0",
                                isRemovedUser && "bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {creditor ? (creditor.userId === userId ? "You" : creditor.name) : "Unknown User"}
                                  {isRemovedUser && <span className="ml-1 italic">(removed)</span>}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                {Object.entries(currencies).map(([currency, amount]) => {
                                  if (isEffectivelyZero(amount)) return null;
                                  return (
                                    <div key={currency} className="text-sm">
                                      <span className="font-medium text-red-600">
                                        {amount.toFixed(2)} {currency}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">No outstanding debts</div>
                    )}
                  </div>

                  {/* Who owes money to the member */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                      Owed
                    </h4>
                    {Object.keys(member.debts).length > 0 &&
                    Object.entries(member.balance).some(([_, amount]) => amount > 0) ? (
                      <div className="space-y-2">
                        {Object.entries(member.debts).map(([debtorId, currencies]) => {
                          const debtor = activeMembers.find((m) => m.userId === debtorId);
                          const isRemovedUser = removedUserIds.includes(debtorId);

                          // Check if there are any non-zero amounts
                          const hasNonZeroAmount = Object.values(currencies).some(
                            (amount) => !isEffectivelyZero(amount)
                          );
                          if (!hasNonZeroAmount) return null;

                          return (
                            <div
                              key={debtorId}
                              className={cn(
                                "border-b pb-2 last:border-0 last:pb-0 flex flex-col md:flex-row justify-between",
                                isRemovedUser && "bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {debtor ? (debtor.userId === userId ? "You" : debtor.name) : "Unknown User"}
                                  {isRemovedUser && <span className="ml-1 italic">(removed)</span>}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                {Object.entries(currencies).map(([currency, amount]) => {
                                  if (isEffectivelyZero(amount)) return null;
                                  return (
                                    <div key={currency} className="text-sm">
                                      <span className="font-medium text-green-600">
                                        {amount.toFixed(2)} {currency}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">No one owes money to this member</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border rounded-lg">
          <Coins className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Expense Data</h3>
          <p className="text-muted-foreground">Add expenses to see group summary.</p>
        </div>
      )}
    </div>
  );
}
