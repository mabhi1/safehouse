"use server";

import { createNoteByUser, deleteNoteById } from "@/prisma/db/notes";
import { revalidatePath } from "next/cache";

export async function DeleteNote(noteId: string) {
  const res = await deleteNoteById(noteId);
  revalidatePath("/notes");
  return res;
}

export async function AddNote(title: string, description: string, uid: string) {
  const res = await createNoteByUser(title, description, uid);
  revalidatePath("/notes");
  return res;
}
