"use server";

import {
  createBillExpense,
  getBillExpensesByGroup,
  deleteBillExpense,
  getUserExpenseSummary,
  getGroupExpenseSummary,
  updateBillExpense,
  deleteBillExpenseImage,
} from "@/prisma/db/billExpenses";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createBillExpenseAction(
  title: string,
  amount: number,
  currencyId: string,
  groupId: string,
  splitType: "equal" | "percentage" | "amount",
  paidBy: string,
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = [],
  imageUrl?: string
) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  if (splitType === "amount") {
    const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
    if (Math.abs(totalShares - amount) > 0.01) {
      return {
        error: `The sum of shares (${totalShares.toFixed(2)}) must equal the total amount (${amount.toFixed(2)})`,
        data: null,
      };
    }
  } else if (splitType === "percentage") {
    const totalPercentage = shares.reduce((sum, share) => sum + (share.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return {
        error: `The sum of percentages (${totalPercentage.toFixed(2)}%) must equal 100%`,
        data: null,
      };
    }
  }

  const result = await createBillExpense(
    title,
    amount,
    currencyId,
    paidBy,
    groupId,
    splitType,
    userId,
    description,
    shares,
    imageUrl
  );

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
  paidBy: string,
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = [],
  imageUrl?: string
) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  if (splitType === "amount") {
    const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
    if (Math.abs(totalShares - amount) > 0.01) {
      return {
        error: `The sum of shares (${totalShares.toFixed(2)}) must equal the total amount (${amount.toFixed(2)})`,
        data: null,
      };
    }
  } else if (splitType === "percentage") {
    const totalPercentage = shares.reduce((sum, share) => sum + (share.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return {
        error: `The sum of percentages (${totalPercentage.toFixed(2)}%) must equal 100%`,
        data: null,
      };
    }
  }

  const result = await updateBillExpense(
    id,
    title,
    amount,
    currencyId,
    splitType,
    paidBy,
    userId,
    description,
    shares,
    imageUrl
  );

  if (result.data) {
    revalidatePath(`/split-bill/${groupId}/expenses`);
  }

  return result;
}

export async function deleteBillExpenseImageAction(id: string, groupId: string, userId: string) {
  const result = await deleteBillExpenseImage(id, userId);

  revalidatePath(`/split-bill/${groupId}/expenses`);
  return result;
}
