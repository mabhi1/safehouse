"use server";

import { createCardByUser, deleteCardById, searchCardsByText } from "@/prisma/db/cards";
import { CardType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { encrypt } from "./encryption";

export async function addCard(bank: string, cvv: string, expiry: string, number: string, type: CardType, uid: string) {
  const newExpiry = expiry.split("-").reverse();
  newExpiry[1] = newExpiry[1].substring(2);
  const finalExpiry = newExpiry.join("/");
  const res = await createCardByUser(bank, await encrypt(cvv), finalExpiry, await encrypt(number), type, uid);
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
