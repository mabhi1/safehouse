"use server";

import { createEncryptionByUser } from "@/prisma/db/encryption";

const createEncryption = async (uid: string, salt: string, hash: string, recovery: string) => {
  const res = await createEncryptionByUser(uid, salt, hash, recovery);
  return res;
};

export { createEncryption };
