import crypto from "crypto-js";

const decrypt = (encrypted: string) => {
  const decryptedPassword = crypto.AES.decrypt(encrypted, `${process.env.NEXT_PUBLIC_SECRET_KEY}`).toString(crypto.enc.Utf8);
  console.log(encrypted, process.env.NEXT_PUBLIC_SECRET_KEY, decryptedPassword);
  return decryptedPassword;
};

export { decrypt };
