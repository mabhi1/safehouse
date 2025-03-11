"use server";

import {
  createBillExpense,
  getBillExpensesByGroup,
  deleteBillExpense,
  getUserExpenseSummary,
  getGroupExpenseSummary,
  updateBillExpense,
} from "@/prisma/db/billExpenses";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createBillExpenseAction(
  title: string,
  amount: number,
  currencyId: string,
  groupId: string,
  splitType: "equal" | "percentage" | "amount",
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = []
) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  const result = await createBillExpense(title, amount, currencyId, userId, groupId, splitType, description, shares);

  if (result.data) {
    revalidatePath(`/split-bill/${groupId}/expenses`);
  }

  return result;
}

export async function deleteBillExpenseAction(id: string, groupId: string) {
  const result = await deleteBillExpense(id);

  revalidatePath(`/split-bill/${groupId}/expenses`);
  return result;
}

export async function getBillExpensesByGroupAction(groupId: string) {
  try {
    const result = await getBillExpensesByGroup(groupId);

    if (result.error) {
      return { error: result.error };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error getting bill expenses:", error);
    return { error: "Failed to get expenses" };
  }
}

export async function getUserExpenseSummaryAction(groupId: string) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  return await getUserExpenseSummary(groupId, userId);
}

export async function getGroupExpenseSummaryAction(groupId: string) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  return await getGroupExpenseSummary(groupId);
}

export async function updateBillExpenseAction(
  id: string,
  title: string,
  amount: number,
  currencyId: string,
  groupId: string,
  splitType: "equal" | "percentage" | "amount",
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = []
) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  const result = await updateBillExpense(id, title, amount, currencyId, splitType, description, shares);

  if (result.data) {
    revalidatePath(`/split-bill/${groupId}/expenses`);
  }

  return result;
}
