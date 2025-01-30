"use server";

import { createEncryptionByUser } from "@/prisma/db/encryption";
import { revalidatePath } from "next/cache";

const createEncryption = async (uid: string, salt: string, hash: string, recovery: string, isReset: boolean) => {
  const res = await createEncryptionByUser(uid, salt, hash, recovery, isReset);
  revalidatePath("/passwords");
  revalidatePath("/cards");
  return res;
};

export { createEncryption };
