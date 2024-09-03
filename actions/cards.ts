"use server";

import { createCardByUser, deleteCardById } from "@/prisma/db/cards";
import { CardType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { encrypt } from "./encryption";

export async function addCard(bank: string, cvv: string, expiry: string, number: string, type: CardType, uid: string) {
  const res = await createCardByUser(bank, await encrypt(cvv), expiry, await encrypt(number), type, uid);
  revalidatePath("/cards");
  return res;
}

export async function deleteCard(cardId: string, uid: string) {
  const res = await deleteCardById(cardId, uid);
  revalidatePath("/cards");
  return res;
}
