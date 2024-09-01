"use server";

import crypto from "crypto-js";
import { revalidatePath } from "next/cache";

const encrypt = async (plainText: string) => {
  console.log(process.env.DATABASE_URL);
  const encryptedPassword = crypto.AES.encrypt(plainText, `${process.env.PASSWORD_SECRET_KEY}`).toString();
  revalidatePath("passwords");
  return encryptedPassword;
};

const decrypt = async (encrypted: string) => {
  const decryptedPassword = crypto.AES.decrypt(encrypted, `${process.env.PASSWORD_SECRET_KEY}`).toString(
    crypto.enc.Utf8
  );
  revalidatePath("passwords");
  return decryptedPassword;
};

export { encrypt, decrypt };
