import DashboardPage from "@/components/pages/expenses/dashboard/dashboard-page";
import { getAllCategories, getAllCurrencies, getExpensesByUserAndDate } from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";

async function ExpensesPage() {
  const { userId } = auth();

  const { data: categories } = await getAllCategories(userId!);
  const today = new Date();

  // Current Month
  const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Last Month
  const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const { data: lastMonthExpenseData } = await getExpensesByUserAndDate(userId!, firstDayLastMonth, lastDayLastMonth);
  const { data: currentMonthExpenseData } = await getExpensesByUserAndDate(
    userId!,
    firstDayCurrentMonth,
    lastDayCurrentMonth
  );
  const { data: usedCurrencyData } = await getAllCurrencies({ onlyUsed: true });

  return (
    <DashboardPage
      currencyData={usedCurrencyData || []}
      lastMonthExpenses={lastMonthExpenseData || []}
      currentMonthExpenses={currentMonthExpenseData || []}
      categories={categories || []}
    />
  );
}
export default ExpensesPage;
