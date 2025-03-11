"use server";

import { getAllCurrencies, getCurrencyById } from "@/prisma/db/currency";
import { auth } from "@clerk/nextjs/server";

export async function getAllCurrenciesAction() {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  return await getAllCurrencies();
}

export async function getCurrencyByIdAction(id: string) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  return await getCurrencyById(id);
}
