"use server";

import { createPasswordByUser, deletePasswordById, updatePasswordById } from "@/prisma/db/passwords";
import { revalidatePath } from "next/cache";
import { encrypt } from "./encryption";

export async function deletePassword(passwordId: string, uid: string) {
  const res = await deletePasswordById(passwordId, uid);
  revalidatePath("/passwords");
  return res;
}

export async function addPassword(site: string, username: string, password: string, uid: string) {
  const res = await createPasswordByUser(site, username, await encrypt(password), uid);
  revalidatePath("/passwords");
  return res;
}

export async function editPassword(passwordId: string, site: string, username: string, password: string, uid: string) {
  const res = await updatePasswordById(passwordId, site, username, await encrypt(password), uid);
  revalidatePath("/passwords");
  return res;
}
