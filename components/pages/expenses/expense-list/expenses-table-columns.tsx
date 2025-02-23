"use client";

import { ExpenseType } from "@/lib/db-types";
import { amountFormatter, dateFormatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const expensesTableColumns: ColumnDef<ExpenseType>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return dateFormatter(row.getValue("date"));
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div>
          <Link href={`/expenses/expense-list/${row.original.id}`} className="text-primary">
            {row.getValue("title")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <>{row.original.category.name}</>;
    },
  },
  {
    accessorKey: "paymentType",
    header: () => <div className="min-w-fit w-24">Payment Type</div>,
    cell: ({ row }) => {
      return <>{row.original.paymentType.name}</>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const expense = row.original;

      return <div className="text-right font-medium">{amountFormatter(expense.currency.code, expense.amount)}</div>;
    },
  },
];
