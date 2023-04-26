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

export async function createNoteByUser({ name, description, uid }: NotesType) {
  try {
    const data = await prisma.notes.create({
      data: {
        name: name,
        description: description,
        uid: uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function getNoteById(id: string) {
  try {
    const data = await prisma.notes.findUnique({
      where: {
        id: id,
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function updateNoteById(id: string, name: string, description: string) {
  try {
    const data = await prisma.notes.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: description,
        updatedAt: new Date(),
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
