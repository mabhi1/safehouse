"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ExpenseCategoryType, ExpenseType } from "@/lib/db-types";
import { amountFormatter } from "@/lib/utils";

interface CategoryMonthlyDataProps {
  lastMonthData: ExpenseType[];
  currentMonthData: ExpenseType[];
  categories: ExpenseCategoryType[];
}

export default function CategoryMonthlyReport({
  lastMonthData,
  currentMonthData,
  categories,
}: CategoryMonthlyDataProps) {
  // Compute category-wise expenses
  const categoryData = useMemo(() => {
    return categories.reduce<Record<string, { category: string; expenses: number }>>((acc, category) => {
      acc[category.id] = { category: category.name, expenses: 0 };
      return acc;
    }, {});
  }, [categories]);

  // Aggregate expenses for current month
  const chartData = useMemo(() => {
    const updatedData = { ...categoryData };
    currentMonthData.forEach(({ category, amount }) => {
      updatedData[category.id].expenses += amount;
    });
    return Object.values(updatedData);
  }, [currentMonthData, categoryData]);

  // Compute percentage change
  const percentageChange = useMemo(() => {
    const lastMonthTotal = lastMonthData.reduce((sum, { amount }) => sum + amount, 0);
    const currentMonthTotal = currentMonthData.reduce((sum, { amount }) => sum + amount, 0);
    if (lastMonthTotal === 0) return currentMonthTotal > 0 ? 100 : 0; // Avoid division by zero
    return parseFloat((((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(2));
  }, [lastMonthData, currentMonthData]);

  // Chart configuration
  const chartConfig = useMemo(
    () =>
      ({
        expenses: { label: "expenses", color: "hsl(var(--chart-4))" },
        label: { color: "hsl(var(--background))" },
      } satisfies ChartConfig),
    []
  );

  // Format month
  const formattedMonth = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by category</CardTitle>
        <CardDescription>
          {formattedMonth} {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value) =>
                currentMonthData.length ? amountFormatter(currentMonthData[0].currency.code, Number(value)) : value
              }
            />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Expenses {percentageChange >= 0 ? "increased" : "decreased"} by {Math.abs(percentageChange)}% this month
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
