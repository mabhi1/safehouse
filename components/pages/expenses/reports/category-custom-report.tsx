"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ExpenseCategoryType, ExpenseType } from "@/lib/db-types";
import { amountFormatter } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CategoryMonthlyDataProps {
  expenseData: ExpenseType[];
  categories: ExpenseCategoryType[];
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function CategoryCustomReport({ expenseData, categories }: CategoryMonthlyDataProps) {
  const [filterDate, setFilterDate] = useState<"3" | "6" | "12" | "all">("all");

  const chartDataItem = useMemo(() => {
    const item: { [key: string]: number } = { All: 0 };

    categories.forEach((category) => {
      item[category.name] = 0;
    });

    return item;
  }, [categories]);

  const [activeChart, setActiveChart] = useState<string>("All");

  const filterByDateRange = (data: ExpenseType[], filterOption: "3" | "6" | "12" | "all") => {
    const now = new Date();
    let startDate;

    switch (filterOption) {
      case "3":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "6":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "12":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case "all":
        return data; // No filtering, return all data
      default:
        throw new Error("Invalid filter option");
    }

    return data.filter((item) => new Date(item.date) >= startDate);
  };

  const chartData = useMemo(() => {
    const data: { [key: string]: any } = {};

    filterByDateRange(expenseData, filterDate).forEach((expense) => {
      const date = formatDate(expense.date);
      if (data[date]) {
        data[date][expense.category.name] = expense.amount;
        data[date]["All"] += expense.amount;
      } else {
        const newItem = { ...chartDataItem };
        newItem[expense.category.name] = expense.amount;
        newItem["All"] += expense.amount;
        data[date] = { date: date, ...newItem };
      }
    });

    return data;
  }, [expenseData, filterDate, chartDataItem]);

  const chartConfig: { [key: string]: { label: string } } = {
    expenses: {
      label: "expenses",
    },
  } satisfies ChartConfig;
  Object.keys(chartDataItem).forEach((category) => {
    chartConfig[category] = {
      label: category,
    };
  });

  const total = useMemo(() => {
    const newItem = { ...chartDataItem };
    Object.keys(newItem).forEach((key) => {
      newItem[key] = Object.values(chartData).reduce(
        (acc: number, curr: { [key: keyof typeof newItem]: number }) => acc + curr[key],
        0
      );
    });
    return newItem;
  }, [chartData, chartDataItem]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-center space-y-0 border-b p-0 md:flex-row pb-5 md:pr-8">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 sticky top-0">
          <CardTitle>Expense chart</CardTitle>
          <CardDescription>Showing {activeChart.toString().toLowerCase()} expenses for all time</CardDescription>
        </div>
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="flex flex-col md:border-r md:pr-5 w-40">
            <span className="uppercase text-xs text-muted-foreground">{activeChart}</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              {expenseData.length > 0
                ? amountFormatter(expenseData[0].currency.code, parseFloat(total[activeChart].toString()))
                : total[activeChart]}
            </span>
          </div>
          <Select value={activeChart.toString()} onValueChange={setActiveChart}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent className="w-48">
              {Object.keys(chartDataItem).map((key) => {
                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={Object.values(chartData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="expenses"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) =>
                    expenseData.length > 0
                      ? amountFormatter(expenseData[0].currency.code, parseFloat(value.toString()))
                      : value
                  }
                />
              }
            />
            <Line dataKey={activeChart} type="monotone" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-end">
        <RadioGroup
          defaultValue="all"
          onValueChange={(value: string) => setFilterDate(value as "3" | "6" | "12" | "all")}
          className="grid grid-cols-2 md:flex gap-5 justify-end pl-5 md:pl-0"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="r2" />
            <Label htmlFor="r2">Last 3 months</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6" id="r3" />
            <Label htmlFor="r3">Last 6 months</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="12" id="r4" />
            <Label htmlFor="r4">Last 1 year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="r1" />
            <Label htmlFor="r1">All time</Label>
          </div>
        </RadioGroup>
      </CardFooter>
    </Card>
  );
}
