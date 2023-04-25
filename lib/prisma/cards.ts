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
