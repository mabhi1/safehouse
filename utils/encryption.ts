import crypto from "crypto-js";

const decryptPassword = (encryptedPassword: string) => {
  const decryptedPassword = crypto.AES.decrypt(encryptedPassword, `${process.env.NEXT_PUBLIC_SECRET_KEY}`).toString(crypto.enc.Utf8);
  console.log(encryptedPassword, process.env.NEXT_PUBLIC_SECRET_KEY, decryptedPassword);
  return decryptedPassword;
};

export { decryptPassword };
