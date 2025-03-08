"use client";

import { ExpenseType } from "@/lib/db-types";
import { amountFormatter, dateFormatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export const expensesTableColumns: ColumnDef<ExpenseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <div className="min-w-max">{dateFormatter(row.getValue("date"))}</div>;
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
