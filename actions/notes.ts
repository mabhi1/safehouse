"use server";

import { createNoteByUser, deleteNoteById, updateNoteById } from "@/prisma/db/notes";
import { revalidatePath } from "next/cache";

export async function DeleteNote(noteId: string, uid: string) {
  const res = await deleteNoteById(noteId, uid);
  revalidatePath("/notes");
  return res;
}

export async function AddNote(title: string, description: string, uid: string) {
  const res = await createNoteByUser(title, description, uid);
  revalidatePath("/notes");
  return res;
}

export async function EditNote(noteId: string, title: string, description: string, uid: string) {
  const res = await updateNoteById(noteId, title, description, uid);
  revalidatePath("/notes");
  return res;
}
