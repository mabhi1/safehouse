import IndividualExpensePage from "@/components/pages/expenses/individual-expense/individual-expense-page";
import {
  getAllCategories,
  getAllCurrencies,
  getAllExpenses,
  getAllPaymentTypes,
  getExpenseById,
  getExpenseByIdAndUser,
} from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamicParams = true;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const { data } = await getExpenseById(id);
  return {
    title: data ? data.title : "Expense",
  };
}

export async function generateStaticParams() {
  const { data } = await getAllExpenses();

  if (!data || data.length === 0) return [];
  return data.map((expense) => ({
    id: expense.id,
  }));
}

export default async function ExpenseIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const id = (await params).id;
  const { data: currentExpense, error: currentExpenseError } = await getExpenseByIdAndUser(id, userId);
  const { data: categoryData } = await getAllCategories(userId);
  const { data: paymentTypeData } = await getAllPaymentTypes(userId);
  const { data: currencyData } = await getAllCurrencies();

  if (!currentExpense || currentExpenseError) redirect("/not-found");

  return (
    <IndividualExpensePage
      expense={currentExpense!}
      categoryData={categoryData || []}
      paymentTypeData={paymentTypeData || []}
      currencyData={currencyData || []}
    />
  );
}
