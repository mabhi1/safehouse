import prisma from "..";

export async function getPasswordsByUser(uid: string, { key, type }: { key: string; type: string }) {
  console.log(key, type, "abhi");
  try {
    const data = await prisma.passwords.findMany({
      where: {
        uid,
      },
      orderBy: { [key]: type },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPasswordByUser(site: string, username: string, password: string, uid: string) {
  try {
    const data = await prisma.passwords.create({
      data: {
        site,
        username,
        password,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getPasswordById(id: string) {
  try {
    const data = await prisma.passwords.findUnique({
      where: {
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePasswordById(id: string, site: string, username: string, password: string, uid: string) {
  try {
    const data = await prisma.passwords.update({
      where: {
        id,
        uid,
      },
      data: {
        site,
        username,
        password,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deletePasswordById(id: string, uid: string) {
  try {
    const data = await prisma.passwords.delete({
      where: {
        id,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
