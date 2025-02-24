import { ExpenseCategoryType, ExpenseType } from "@/lib/db-types";
import { amountFormatter, dateFormatter } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import EditExpenseForm from "./edit-expense-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { auth } from "@clerk/nextjs/server";
import { deleteExpense } from "@/actions/expenses";

interface IndividualExpensePageProps {
  expense: ExpenseType;
  categoryData: ExpenseCategoryType[];
  paymentTypeData: ExpenseCategoryType[];
  currencyData: {
    id: string;
    code: string;
    name: string;
    symbol: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export default function IndividualExpensePage({
  expense,
  categoryData,
  currencyData,
  paymentTypeData,
}: IndividualExpensePageProps) {
  const { userId } = auth();
  return (
    <div className="space-y-5">
      <Link href="." className="flex items-center mr-auto gap-2">
        <MoveLeft className="w-4 h-4" />
        <span className="text-lg capitalize">All Expenses</span>
      </Link>
      <div className="flex justify-between gap-3 md:gap-5">
        <div>
          <div className="text-2xl">{expense.title}</div>
          <div className="text-muted-foreground">Last updated: {dateFormatter(expense.updatedAt)}</div>
        </div>
        <div className="flex gap-2 md:gap-5">
          <EditExpenseForm
            categoryData={categoryData}
            currencyData={currencyData}
            expense={expense}
            paymentTypeData={paymentTypeData}
          />
          <DeleteButton
            variant="destructive"
            id={expense.id}
            uid={userId!}
            deleteAction={deleteExpense}
            successRedirect="/expenses/expense-list"
            dialogDescription="This action will permanently remove the expense from our servers."
            mobileVariant
          />
        </div>
      </div>
      <div className="text-base">{expense.description}</div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <div className="font-medium">Date</div>
          <div>{dateFormatter(expense.date)}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium">Amount</div>
          <div>{amountFormatter(expense.currency.code, expense.amount)}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium">Category</div>
          <div>{categoryData.find((category) => category.id === expense.categoryId)?.name}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium">Payment type</div>
          <div>{paymentTypeData.find((payment) => payment.id === expense.paymentTypeId)?.name}</div>
        </div>
      </div>
    </div>
  );
}
