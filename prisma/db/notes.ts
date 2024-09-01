import prisma from "..";

export async function getNotesByUser(uid: string) {
  try {
    const data = await prisma.notes.findMany({
      where: {
        uid,
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
        title,
        description,
        uid,
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
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNoteById(id: string, title: string, description: string, uid: string) {
  try {
    const data = await prisma.notes.update({
      where: {
        id,
        uid,
      },
      data: {
        title: title,
        description: description,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNoteById(id: string, uid: string) {
  try {
    const data = await prisma.notes.delete({
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
