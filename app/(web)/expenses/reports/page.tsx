import ReportsIndexPage from "@/components/pages/expenses/reports/reports-index-page";
import { getAllCategories, getAllCurrencies, getExpensesByUser } from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";

export default async function ReportsAndAnalyticsPage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: expenseData, error } = await getExpensesByUser(userId!);
  if (!expenseData || error) throw new Error("User not found");

  const { data: categories } = await getAllCategories(userId!);
  const { data: currencyData } = await getAllCurrencies({ onlyUsed: true });

  return (
    <ReportsIndexPage expenseData={expenseData || []} currencyData={currencyData || []} categories={categories || []} />
  );
}
