import prisma from "..";

export async function getPasswordsByUser(uid: string) {
  try {
    const data = await prisma.passwords.findMany({
      where: { uid },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateManyPasswordsByUser(
  passwordsData: { id: string; site: string; username: string; password: string; uid: string }[]
) {
  try {
    const updatedData = passwordsData.map(async (pass) => {
      const data = await prisma.passwords.updateMany({
        where: { id: pass.id },
        data: { site: pass.site, username: pass.username, password: pass.password, uid: pass.uid },
      });
      return data;
    });
    return { data: updatedData, error: null };
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

export async function searchPasswordsByText(text: string, userId: string) {
  try {
    if (text.trim().length < 3) return { data: [], error: null };
    const data = await prisma.passwords.findMany({
      where: {
        OR: [{ site: { contains: text, mode: "insensitive" } }, { username: { contains: text, mode: "insensitive" } }],
        uid: userId,
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
