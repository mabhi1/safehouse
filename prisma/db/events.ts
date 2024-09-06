import prisma from "..";

export async function getEventsByDateAndUser(start: Date, end: Date, uid: string) {
  try {
    const data = await prisma.events.findMany({
      where: {
        uid,
        date: {
          gte: start,
          lte: end,
        },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getEventsByDate(start: Date, end: Date) {
  try {
    const data = await prisma.events.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function createEventByUser(title: string, description: string, date: Date, uid: string) {
  try {
    const data = await prisma.events.create({
      data: {
        title,
        description,
        date,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateEventById(id: string, title: string, description: string, date: Date, uid: string) {
  try {
    const data = await prisma.events.update({
      where: {
        id,
        uid,
      },
      data: {
        title,
        description,
        date,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteEventById(id: string, uid: string) {
  try {
    const data = await prisma.events.delete({
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
