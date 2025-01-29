"use server";

import { createCardByUser, deleteCardById, searchCardsByText } from "@/prisma/db/cards";
import { CardType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addCard(bank: string, cvv: string, expiry: string, number: string, type: CardType, uid: string) {
  const res = await createCardByUser(bank, cvv, expiry, number, type, uid);
  console.log(res.error);
  revalidatePath("/cards");
  return res;
}

export async function deleteCard(cardId: string, uid: string) {
  const res = await deleteCardById(cardId, uid);
  revalidatePath("/cards");
  return res;
}

export async function searchCards(text: string, userId: string) {
  const res = await searchCardsByText(text, userId);
  return res;
}
