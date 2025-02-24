"use client";

import { ExpenseCategoryType, ExpenseCurrencyType, ExpenseType } from "@/lib/db-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import CategoryCustomReport from "./category-custom-report";

interface DashboardPageProps {
  expenseData: ExpenseType[];
  currencyData: ExpenseCurrencyType[];
  categories: ExpenseCategoryType[];
}

export default function ReportsIndexPage({ currencyData, expenseData, categories }: DashboardPageProps) {
  // Default to the first currency, if available
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData[0]?.id || "");

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center">
        <div className="text-xl capitalize">Reports and Analytics</div>
        {currencyData.length > 0 && (
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="w-40">
              {currencyData.map(({ id, code, symbol }) => (
                <SelectItem key={id} value={id}>
                  {code} {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="grid grid-cols-1">
        <CategoryCustomReport
          expenseData={expenseData.filter((expense) => expense.currencyId === selectedCurrency)}
          categories={categories}
        />
      </div>
    </div>
  );
}
