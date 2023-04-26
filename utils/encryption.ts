import crypto from "crypto-js";

const encrypt = (plainText: string) => {
  const encryptedPassword = crypto.AES.encrypt(plainText, `${process.env.NEXT_PUBLIC_SECRET_KEY}`).toString();
  return encryptedPassword;
};

const decrypt = (encrypted: string) => {
  const decryptedPassword = crypto.AES.decrypt(encrypted, `${process.env.NEXT_PUBLIC_SECRET_KEY}`).toString(crypto.enc.Utf8);
  return decryptedPassword;
};

export { encrypt, decrypt };
