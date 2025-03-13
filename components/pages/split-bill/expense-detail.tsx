"use client";

import { deleteBillExpenseAction } from "@/actions/bill-expenses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, AlertTriangle, ArrowLeft } from "lucide-react";
import { Expense, Member, UserResult } from "@/lib/db-types";
import { Separator } from "@/components/ui/separator";
import { dateFormatter } from "@/lib/utils";
import { DeleteButton } from "@/components/ui/delete-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import EditExpenseForm from "./edit-expense-form";
import ExpenseHistory from "./expense-history";
import Image from "next/image";
import Link from "next/link";
import DeleteImageButton from "./delete-image-button";

interface ExpenseDetailProps {
  expense: Expense;
  members: Member[];
  groupId: string;
  userId: string;
  allUsers?: UserResult[];
}

export default function ExpenseDetail({ expense, members, groupId, userId, allUsers }: ExpenseDetailProps) {
  // Calculate the amount the user is getting or has to give
  const calculateUserBalance = () => {
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

  const { amount: balanceAmount, isGetting } = calculateUserBalance();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href={`/split-bill/${groupId}/expenses`}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to expenses</span>
        </Link>
      </div>

      <Card className={cn(expense.isPaidByRemovedUser && "border-amber-300 bg-amber-50 dark:bg-amber-950/20")}>
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
              <ExpenseHistory
                expenseId={expense.id}
                history={expense.history || []}
                users={allUsers || members.map((member) => member.user)}
                currentUserId={userId}
              />

              <EditExpenseForm
                expense={{
                  id: expense.id,
                  title: expense.title,
                  description: expense.description,
                  amount: expense.amount,
                  currencyId: expense.currency.id,
                  splitType: expense.splitType,
                  paidBy: expense.paidBy,
                  shares: expense.shares.map((share) => ({
                    id: share.id,
                    memberId: share.member.id,
                    amount: share.amount,
                    percentage: share.percentage || null,
                  })),
                  imageUrl: expense.imageUrl,
                }}
                members={members}
                groupId={groupId}
                userId={userId}
              />

              <DeleteButton
                deleteAction={deleteBillExpenseAction}
                successMessage="Expense deleted successfully"
                id={expense.id!}
                uid={expense.id!}
                successRedirect={`/split-bill/${groupId}/expenses`}
                dialogDescription="This action will permanently delete the expense from our servers."
                hideIcon
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </DeleteButton>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {expense.imageUrl && (
            <div className="mb-4">
              <div className="flex flex-col items-center mb-2">
                <a
                  href={expense.imageUrl}
                  target="_blank"
                  className="flex flex-col items-center text-center rounded hover:bg-accent p-1 gap-1"
                >
                  <Image
                    src={expense.imageUrl}
                    width={200}
                    height={200}
                    alt={expense.title}
                    priority
                    className="rounded-md"
                  />
                </a>
              </div>
              <DeleteImageButton expense={expense} groupId={groupId} userId={userId} />
            </div>
          )}

          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">
                {expense.currency.symbol}
                {expense.amount.toFixed(2)} {expense.currency.code}
              </p>
              <p className="text-muted-foreground flex gap-[2px]">
                <span>Paid by</span>
                {expense.paidBy === userId ? (
                  <span>You</span>
                ) : (
                  <span>
                    {expense.user.firstName} {expense.user.lastName}
                  </span>
                )}
                {expense.isPaidByRemovedUser && <span className="ml-1 italic">(removed)</span>}
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="font-medium capitalize">Split: {expense.splitType}</p>
              <div className="text-muted-foreground">
                {expense.shares.map((share) => (
                  <p
                    key={share.id}
                    className={cn("text-xs", share.member.isRemovedUser && "italic text-amber-600 dark:text-amber-400")}
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

          <div className="mt-6 p-4 rounded-md bg-muted">
            <h3 className="text-sm font-medium mb-2">Your balance for this expense</h3>
            <p
              className={cn(
                "text-lg font-bold",
                isGetting ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {isGetting ? "You get " : "You owe "}
              {expense.currency.symbol}
              {balanceAmount.toFixed(2)} {expense.currency.code}
            </p>
          </div>

          <Separator className="my-4" />
          <div className="flex justify-between">
            <p className="text-muted-foreground text-xs flex gap-1 items-center">
              <span className="mt-[2px]">Updated: {dateFormatter(expense.updatedAt)}</span>
            </p>
            {expense.addedBy && (
              <p className="text-muted-foreground text-xs flex items-center mt-1 gap-1">
                <span>Added by</span>
                {(() => {
                  const adder = members.find((m) => m.userId === expense.addedBy);
                  if (!adder) return <span className="italic">Unknown user</span>;
                  return (
                    <span className={expense.addedBy === userId ? "font-medium" : ""}>
                      {expense.addedBy === userId ? "You" : `${adder.user.firstName} ${adder.user.lastName}`}
                    </span>
                  );
                })()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
