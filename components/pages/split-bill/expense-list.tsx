"use client";

import { deleteBillExpenseAction } from "@/actions/bill-expenses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Trash, Calendar, AlertTriangle } from "lucide-react";
import CreateExpenseForm from "./create-expense-form";
import { UserResult } from "@/lib/db-types";
import { Separator } from "@/components/ui/separator";
import { dateFormatter } from "@/lib/utils";
import { DeleteButton } from "@/components/ui/delete-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import EditExpenseForm from "./edit-expense-form";

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
  splitType: "equal" | "percentage" | "amount";
  createdAt: Date;
  updatedAt: Date;
  user: UserResult;
  isPaidByRemovedUser?: boolean;
  shares: Share[];
}

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  groupId: string;
  userId: string;
}

export default function ExpenseList({ expenses, members, groupId, userId }: ExpenseListProps) {
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
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className={cn(expense.isPaidByRemovedUser && "border-amber-300 bg-amber-50 dark:bg-amber-950/20")}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{expense.title}</CardTitle>
                      {expense.description && <CardDescription>{expense.description}</CardDescription>}
                    </div>
                    {expense.isPaidByRemovedUser && (
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 flex items-center gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Removed user
                      </Badge>
                    )}
                  </div>
                  <div className="flex">
                    {expense.paidBy === userId && (
                      <EditExpenseForm
                        expense={{
                          id: expense.id,
                          title: expense.title,
                          description: expense.description,
                          amount: expense.amount,
                          currencyId: expense.currency.id,
                          splitType: expense.splitType,
                          shares: expense.shares.map((share) => ({
                            id: share.id,
                            memberId: share.member.id,
                            amount: share.amount,
                            percentage: share.percentage || null,
                          })),
                        }}
                        members={members}
                        groupId={groupId}
                        userId={userId}
                      />
                    )}
                    {expense.paidBy === userId && (
                      <DeleteButton
                        deleteAction={deleteBillExpenseAction}
                        successMessage="Expense deleted successfully"
                        id={expense.id!}
                        uid={expense.id!}
                        successRedirect={`/split-bill/${groupId}`}
                        dialogDescription="This action will permanently delete the expense from our servers."
                        hideIcon
                        size="icon"
                      >
                        <Trash className="h-4 w-4" />
                      </DeleteButton>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">
                      {expense.currency.symbol}
                      {expense.amount.toFixed(2)} {expense.currency.code}
                    </p>
                    <p className="text-muted-foreground">
                      Paid by {expense.user.firstName} {expense.user.lastName}
                      {expense.paidBy === userId && <span className="ml-1 font-medium">(You)</span>}
                      {expense.isPaidByRemovedUser && <span className="ml-1 italic">(removed)</span>}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-medium capitalize">Split: {expense.splitType}</p>
                    <div className="text-muted-foreground">
                      {expense.shares.map((share) => (
                        <p
                          key={share.id}
                          className={cn(
                            "text-xs",
                            share.member.isRemovedUser && "italic text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {share.member.userId === userId
                            ? "You "
                            : `${share.member.user.firstName} ${share.member.user.lastName} `}
                          {share.member.isRemovedUser && "(removed) "}
                          {expense.currency.symbol}
                          {share.amount.toFixed(2)}
                          {expense.splitType === "percentage" && share.percentage && (
                            <span> ({share.percentage.toFixed(1)}%)</span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
                <p className="text-muted-foreground text-xs flex gap-1 items-center">
                  <Calendar className="h-4 w-4" />
                  <span className="mt-[2px]">{dateFormatter(expense.updatedAt)}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
