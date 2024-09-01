import prisma from "..";

export async function getNotesByUser(uid: string) {
  try {
    const data = await prisma.notes.findMany({
      where: {
        uid: uid,
      },
      orderBy: { updatedAt: "desc" },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function createNoteByUser(title: string, description: string, uid: string) {
  try {
    const data = await prisma.notes.create({
      data: {
        title: title,
        description: description,
        uid: uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getNoteById(id: string) {
  try {
    const data = await prisma.notes.findUnique({
      where: {
        id: id,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNoteById(id: string, title: string, description: string) {
  try {
    const data = await prisma.notes.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        updatedAt: new Date(),
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNoteById(id: string) {
  try {
    const data = await prisma.notes.delete({
      where: {
        id: id,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
