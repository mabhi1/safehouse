"use server";

import {
  createExpenseByUser,
  deleteExpenseById,
  deleteMultipleExpensesById,
  searchExpensesByText,
  updateExpenseById,
} from "@/prisma/db/expenses";
import { revalidatePath } from "next/cache";

export async function deleteExpense(expenseId: string, uid: string) {
  const res = await deleteExpenseById(expenseId, uid);
  revalidatePath("/expenses");
  return res;
}

export async function addExpense(
  amount: number,
  categoryId: string,
  paymentTypeId: string,
  currencyId: string,
  date: Date,
  title: string,
  description: string,
  uid: string
) {
  const res = await createExpenseByUser(amount, categoryId, paymentTypeId, currencyId, date, title, description, uid);
  revalidatePath("/expenses");
  return res;
}

export async function editExpense(
  id: string,
  amount: number,
  categoryId: string,
  paymentTypeId: string,
  currencyId: string,
  date: Date,
  title: string,
  description: string,
  uid: string
) {
  const res = await updateExpenseById(id, amount, categoryId, paymentTypeId, currencyId, date, title, description, uid);
  revalidatePath("/expenses");
  return res;
}

export async function searchExpenses(text: string, userId: string) {
  const res = await searchExpensesByText(text, userId);
  return res;
}

export async function deleteMultipleExpenses(expenseIds: string[], uid: string) {
  const res = await deleteMultipleExpensesById(expenseIds, uid);
  revalidatePath("/expenses");
  return res;
}
