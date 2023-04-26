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

export async function createPasswordByUser({ site, username, password, uid }: PasswordType) {
  try {
    const data = await prisma.passwords.create({
      data: {
        site,
        username,
        password,
        uid: uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function getPasswordById(id: string) {
  try {
    const data = await prisma.passwords.findUnique({
      where: {
        id: id,
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function updatePasswordById(id: string, site: string, username: string, password: string) {
  try {
    const data = await prisma.passwords.update({
      where: {
        id: id,
      },
      data: {
        site,
        username,
        password,
        updatedAt: new Date(),
      },
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
