import { CardType } from "@prisma/client";
import prisma from "..";

export async function GetCardsByUser(uid: string, { key, type }: { key: string; type: string }) {
  try {
    const data = await prisma.cards.findMany({
      where: {
        uid,
      },
      orderBy: { [key]: type },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createCardByUser(
  bank: string,
  cvv: string,
  expiry: string,
  number: string,
  type: CardType,
  uid: string
) {
  try {
    const data = await prisma.cards.create({
      data: {
        bank,
        cvv,
        expiry,
        number,
        type,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteCardById(id: string, uid: string) {
  try {
    const data = await prisma.cards.delete({
      where: {
        id,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
