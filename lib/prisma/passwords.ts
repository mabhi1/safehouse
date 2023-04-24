import prisma from ".";
import { PasswordType } from "../types/dbTypes";

export async function GetPasswordsByUser(uid: string) {
  try {
    const passwords: PasswordType[] = await prisma.passwords.findMany({
      where: {
        uid: uid,
      },
    });
    return passwords;
  } catch (error) {
    return error;
  }
}
