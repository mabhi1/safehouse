"use server";

import {
  createPasswordByUser,
  deletePasswordById,
  searchPasswordsByText,
  updatePasswordById,
} from "@/prisma/db/passwords";
import { revalidatePath } from "next/cache";

export async function deletePassword(passwordId: string, uid: string) {
  const res = await deletePasswordById(passwordId, uid);
  revalidatePath("/passwords");
  return res;
}

export async function addPassword(site: string, username: string, password: string, uid: string) {
  const res = await createPasswordByUser(site, username, password, uid);
  revalidatePath("/passwords");
  return res;
}

export async function editPassword(passwordId: string, site: string, username: string, password: string, uid: string) {
  const res = await updatePasswordById(passwordId, site, username, password, uid);
  revalidatePath("/passwords");
  return res;
}

export async function searchPasswords(text: string, userId: string) {
  const res = await searchPasswordsByText(text, userId);
  return res;
}
