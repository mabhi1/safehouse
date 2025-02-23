"use client";

import { useState, useMemo } from "react";
import { ExpenseCategoryType, ExpenseCurrencyType, ExpenseType } from "@/lib/db-types";
import CategoryMonthlyReport from "./category-monthly-report";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { amountFormatter, dateFormatter } from "@/lib/utils";

interface DashboardPageProps {
  lastMonthExpenses: ExpenseType[];
  currentMonthExpenses: ExpenseType[];
  categories: ExpenseCategoryType[];
  currencyData: ExpenseCurrencyType[];
}

export default function DashboardPage({
  categories,
  currencyData,
  currentMonthExpenses,
  lastMonthExpenses,
}: DashboardPageProps) {
  // Default to the first currency, if available
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData[0]?.id || "");

  // Filter expenses based on selected currency
  const filteredExpenses = useMemo(
    () => ({
      lastMonth: lastMonthExpenses.filter(({ currencyId }) => currencyId === selectedCurrency),
      currentMonth: currentMonthExpenses.filter(({ currencyId }) => currencyId === selectedCurrency),
    }),
    [selectedCurrency, lastMonthExpenses, currentMonthExpenses]
  );

  // Get top 5 expenses
  const topExpensesList = useMemo(
    () => filteredExpenses.currentMonth.sort((a, b) => b.amount - a.amount).slice(0, 5),
    [filteredExpenses.currentMonth]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-2 items-start md:items-center">
        <div>
          <div className="text-base uppercase">Dashboard</div>
          <div className="text-muted-foreground">
            You can see your current month reports and analytics here. Check the Reports/Analytics tab for custom
            reports.
          </div>
        </div>
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

      {/* Reports & Top Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CategoryMonthlyReport
          lastMonthData={filteredExpenses.lastMonth}
          currentMonthData={filteredExpenses.currentMonth}
          categories={categories}
        />

        <Card>
          <CardHeader>
            <CardTitle>Top Expenses</CardTitle>
            <CardDescription>Expenses with highest spending added this month</CardDescription>
          </CardHeader>
          {topExpensesList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topExpensesList.map(({ id, date, title, currency, amount }) => (
                  <TableRow key={id}>
                    <TableCell>{dateFormatter(date)}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{amountFormatter(currency.code, amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent>No expense added this month</CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
