"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseCategoryType, ExpenseType } from "@/lib/db-types";
import { Filter, Minus, RotateCcw, X } from "lucide-react";
import CreateExpenseForm from "./create-expense-form";
import { DataTable } from "./data-table";
import { expensesTableColumns } from "./expenses-table-columns";
import { useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseListCompProps {
  expenseData: ExpenseType[];
  userId: string;
  categoryData: ExpenseCategoryType[];
  paymentTypeData: ExpenseCategoryType[];
  currencyData: { id: string; code: string; name: string; symbol: string }[];
}

export const ExpenseListComp = ({
  expenseData,
  userId,
  categoryData,
  paymentTypeData,
  currencyData,
}: ExpenseListCompProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({
    date: [undefined, undefined] as [Date | undefined, Date | undefined],
    category: "",
    paymentType: "",
    currency: "",
    amount: [0, Number.MAX_SAFE_INTEGER] as [number, number],
  });

  // Function to filter expenses
  const getFilteredExpenses = useMemo(() => {
    return expenseData.filter((expense) => {
      const { date, category, paymentType, currency, amount } = filterData;
      const searchMatch = !searchTerm || expense.title.toLowerCase().includes(searchTerm);
      const dateMatch = !date[0] || !date[1] || (date[0] <= expense.date && expense.date <= date[1]);
      const categoryMatch = !category || expense.categoryId === category;
      const paymentTypeMatch = !paymentType || expense.paymentTypeId === paymentType;
      const currencyMatch = !currency || expense.currencyId === currency;
      const amountMatch = amount[0] <= expense.amount && expense.amount <= amount[1];

      return searchMatch && dateMatch && categoryMatch && paymentTypeMatch && currencyMatch && amountMatch;
    });
  }, [searchTerm, filterData, expenseData]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-xl capitalize">Expenses</span>
          <Badge variant="secondary" className="font-normal">
            {getFilteredExpenses.length}
          </Badge>
        </div>
        <Input
          placeholder="Search Title"
          className="h-9 w-48 md:w-56"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trim().toLowerCase())}
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" ICON={Filter}>
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="space-y-10 w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter expenses</SheetTitle>
              <SheetDescription>Select filters and click save when done.</SheetDescription>
            </SheetHeader>

            <div className="space-y-5">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={filterData.date[0]}
                    onChange={(e) =>
                      setFilterData((prev) => ({
                        ...prev,
                        date: [e.target.value ? new Date(e.target.value) : undefined, prev.date[1]],
                      }))
                    }
                  />
                  <Minus className="w-4 h-4" />
                  <DatePicker
                    value={filterData.date[1]}
                    onChange={(e) =>
                      setFilterData((prev) => ({
                        ...prev,
                        date: [prev.date[0], e.target.value ? new Date(e.target.value) : undefined],
                      }))
                    }
                  />
                </div>
              </div>

              {/* Category Filter */}
              <FilterSelect
                label="Category"
                value={filterData.category}
                onChange={(value: string) => setFilterData((prev) => ({ ...prev, category: value }))}
                options={categoryData}
              />

              {/* Payment Type Filter */}
              <FilterSelect
                label="Payment Type"
                value={filterData.paymentType}
                onChange={(value: string) => setFilterData((prev) => ({ ...prev, paymentType: value }))}
                options={paymentTypeData}
              />

              {/* Currency Filter */}
              <FilterSelect
                label="Currency"
                value={filterData.currency}
                onChange={(value: string) => setFilterData((prev) => ({ ...prev, currency: value }))}
                options={currencyData.map(({ id, name, symbol }) => ({
                  id,
                  name: `${name} ${symbol}`,
                }))}
              />

              {/* Amount Filter */}
              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={filterData.amount[0]}
                    onChange={(e) =>
                      setFilterData((prev) => ({
                        ...prev,
                        amount: [parseInt(e.target.value) || 0, prev.amount[1]],
                      }))
                    }
                  />
                  <Minus className="w-4 h-4" />
                  <Input
                    type="number"
                    min={0}
                    value={filterData.amount[1]}
                    onChange={(e) =>
                      setFilterData((prev) => ({
                        ...prev,
                        amount: [prev.amount[0], parseInt(e.target.value) || Number.MAX_SAFE_INTEGER],
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="gap-2">
              <Button
                ICON={RotateCcw}
                variant="secondary"
                type="button"
                onClick={() =>
                  setFilterData({
                    date: [undefined, undefined],
                    category: "",
                    paymentType: "",
                    currency: "",
                    amount: [0, Number.MAX_SAFE_INTEGER],
                  })
                }
              >
                Reset
              </Button>
              <SheetClose asChild>
                <Button type="button" ICON={X}>
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <CreateExpenseForm
          uid={userId}
          categoryData={categoryData}
          paymentTypeData={paymentTypeData}
          currencyData={currencyData}
        />
      </div>

      <DataTable columns={expensesTableColumns} data={getFilteredExpenses} />
    </div>
  );
};

interface FilterSelectType {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (ExpenseCategoryType | ExpenseCategoryType | { id: string; name: string })[];
}

// Reusable Select Filter Component
const FilterSelect = ({ label, value, onChange, options }: FilterSelectType) => (
  <div className="flex flex-col gap-2">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ id, name }: { id: string; name: string }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
