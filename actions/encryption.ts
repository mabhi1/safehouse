"use server";

import crypto from "crypto-js";
import { revalidatePath } from "next/cache";

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

export { encrypt, decrypt };
