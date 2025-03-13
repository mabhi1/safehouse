"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import CreateExpenseForm from "./create-expense-form";
import { UserResult } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Member {
  id: string;
  userId: string;
  user: UserResult;
}

interface Share {
  id: string;
  amount: number;
  percentage?: number | null;
  member: Member & {
    isRemovedUser?: boolean;
  };
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: Currency;
  paidBy: string;
  addedBy: string;
  splitType: "equal" | "percentage" | "amount";
  createdAt: Date;
  updatedAt: Date;
  user: UserResult;
  isPaidByRemovedUser?: boolean;
  shares: Share[];
  history?: {
    id: string;
    updatedBy: string;
    changes: Record<string, { old: any; new: any }>;
    createdAt: Date;
  }[];
  imageUrl?: string | null;
}

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  groupId: string;
  userId: string;
  allUsers?: UserResult[];
}

export default function ExpenseList({ expenses, members, groupId, userId }: ExpenseListProps) {
  // Calculate the amount the user is getting or has to give for each expense
  const calculateUserBalance = (expense: Expense) => {
    // If the user paid for the expense
    const isPayer = expense.paidBy === userId;

    // Find the user's share
    const userShare = expense.shares.find((share) => share.member.userId === userId);

    if (!userShare) return { amount: 0, isGetting: false };

    if (isPayer) {
      // User paid, so they're getting money back from others (total - their share)
      const amountGetting = expense.amount - userShare.amount;
      return { amount: amountGetting, isGetting: true };
    } else {
      // User didn't pay, so they have to give their share
      return { amount: userShare.amount, isGetting: false };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">
          Expenses <Badge variant="outline">{expenses.length}</Badge>
        </h2>
        <CreateExpenseForm members={members} groupId={groupId} userId={userId} />
      </div>

      {expenses.length === 0 ? (
        <div className="text-center p-10 border rounded-lg">
          <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Expenses Yet</h3>
          <p className="text-muted-foreground mb-6">Add your first expense to start splitting bills.</p>
          <CreateExpenseForm members={members} groupId={groupId} userId={userId} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 md:gap-5">
          {expenses.map((expense) => {
            const { amount, isGetting } = calculateUserBalance(expense);

            return (
              <Link href={`/split-bill/${groupId}/expenses/${expense.id}`} key={expense.id}>
                <Card
                  className={cn(
                    "hover:bg-accent/50 transition-colors cursor-pointer",
                    expense.isPaidByRemovedUser && "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      {expense.imageUrl ? (
                        <div className="h-12 w-12 overflow-hidden">
                          <Image
                            src={expense.imageUrl}
                            width={50}
                            height={50}
                            alt={expense.title}
                            className="w-full h-full rounded-md object-fill"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                          <Receipt className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <CardTitle className="text-lg font-medium">{expense.title}</CardTitle>
                    </div>

                    <div
                      className={cn(
                        "text-right font-medium",
                        isGetting ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {isGetting ? "+" : "-"}
                      {expense.currency.symbol}
                      {amount.toFixed(2)}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
