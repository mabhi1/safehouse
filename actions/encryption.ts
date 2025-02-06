"use server";

import { createEncryptionByUser, updateEncryptionByUser } from "@/prisma/db/encryption";
import { revalidatePath } from "next/cache";

const createEncryption = async (uid: string, salt: string, hash: string, recovery: string) => {
  const res = await createEncryptionByUser(uid, salt, hash, recovery);
  revalidatePath("/passwords");
  return res;
};

const updateEncryption = async (uid: string, salt: string, hash: string, recovery: string) => {
  revalidatePath("/passwords");
  const res = await updateEncryptionByUser(uid, salt, hash, recovery);
  return res;
};

export { createEncryption, updateEncryption };
