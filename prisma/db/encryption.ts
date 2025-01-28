import prisma from "..";

export async function getEncryptionByUser(uid: string) {
  try {
    const data = await prisma.encryption.findUnique({ where: { uid } });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function createEncryptionByUser(uid: string, salt: string, hash: string, recovery: string) {
  try {
    const existing = await getEncryptionByUser(uid);
    if (existing.data) throw new Error("Encryption already exists");
    const data = await prisma.encryption.create({ data: { uid, salt, hash, recovery } });
    return { data: JSON.stringify(data), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
