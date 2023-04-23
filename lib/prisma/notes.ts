import prisma from ".";
import { NotesType } from "../types/dbTypes";

export async function getNotesByUser(uid: string) {
  try {
    const notes: NotesType[] = await prisma.notes.findMany({
      where: {
        uid: uid,
      },
    });
    return notes;
  } catch (error) {
    return error;
  }
}
