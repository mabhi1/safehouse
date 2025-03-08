import prisma from "..";

export async function getBookmarksByUser(uid: string) {
  try {
    const data = await prisma.bookmarks.findMany({
      where: {
        uid,
      },
      orderBy: { title: "asc" },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function createBookmarkByUser(title: string, comment: string, url: string, uid: string) {
  try {
    const data = await prisma.bookmarks.create({
      data: {
        title,
        comment,
        url,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getBookmarkById(id: string) {
  try {
    const data = await prisma.bookmarks.findUnique({
      where: {
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchBookmarksByText(text: string, userId: string) {
  try {
    if (text.trim().length < 3) return { data: [], error: null };
    const data = await prisma.bookmarks.findMany({
      where: {
        OR: [
          { title: { contains: text, mode: "insensitive" } },
          { comment: { contains: text, mode: "insensitive" } },
          { url: { contains: text, mode: "insensitive" } },
        ],
        uid: userId,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateBookmarkById(id: string, title: string, comment: string, url: string, uid: string) {
  try {
    const data = await prisma.bookmarks.update({
      where: {
        id,
        uid,
      },
      data: {
        title,
        comment,
        url,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteBookmarkById(id: string, uid: string) {
  try {
    const data = await prisma.bookmarks.delete({
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
