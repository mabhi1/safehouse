"use server";

import { createEncryptionByUser } from "@/prisma/db/encryption";
import crypto from "crypto-js";

const encrypt = async (plainText: string) => {
  const encryptedPassword = crypto.AES.encrypt(plainText, `${process.env.PASSWORD_SECRET_KEY}`).toString();
  return encryptedPassword;
};

const decrypt = async (encrypted: string) => {
  const decryptedPassword = crypto.AES.decrypt(encrypted, `${process.env.PASSWORD_SECRET_KEY}`).toString(
    crypto.enc.Utf8
  );
  return decryptedPassword;
};

const createEncryption = async (uid: string, salt: string, hash: string, recovery: string) => {
  const res = await createEncryptionByUser(uid, salt, hash, recovery);
  return res;
};

export { encrypt, decrypt, createEncryption };
