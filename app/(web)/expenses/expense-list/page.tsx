import { getAllCategories, getAllCurrencies, getAllPaymentTypes, getExpensesByUser } from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";
import { ExpenseListComp } from "@/components/pages/expenses/expense-list/expense-list-comp";

export const dynamic = "force-dynamic";

export default async function ExpenseListPage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: expenseData, error } = await getExpensesByUser(userId!);
  if (!expenseData || error) throw new Error("User not found");

  const { data: categoryData } = await getAllCategories(userId);
  const { data: paymentTypeData } = await getAllPaymentTypes(userId);
  const { data: currencyData } = await getAllCurrencies();

  return (
    <ExpenseListComp
      categoryData={categoryData || []}
      expenseData={expenseData}
      paymentTypeData={paymentTypeData || []}
      currencyData={currencyData || []}
      userId={userId}
    />
  );
}
