import prisma from ".";
import { CardType } from "../types/dbTypes";

export async function GetCardsByUser(uid: string) {
  try {
    const cards: CardType[] = await prisma.cards.findMany({
      where: {
        uid: uid,
      },
    });
    return cards;
  } catch (error) {
    return error;
  }
}

export async function createCardByUser(data: CardType) {
  try {
    const card = await prisma.cards.create({
      data: {
        bank: data.bank,
        createdAt: new Date(),
        cvv: data.cvv,
        expiry: data.expiry,
        number: data.number,
        type: data.type,
        uid: data.uid,
        updatedAt: new Date(),
      },
    });
    return [card, null];
  } catch (error) {
    return [null, error];
  }
}

export async function deleteCardById(id: string) {
  try {
    const card = await prisma.cards.delete({
      where: {
        id: id,
      },
    });
    return [card, null];
  } catch (error) {
    return [null, error];
  }
}
