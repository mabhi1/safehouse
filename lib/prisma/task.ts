import prisma from ".";
import { TaskType } from "../types/dbTypes";

export async function GetTasksByUser(uid: string) {
  try {
    const tasks: TaskType[] = await prisma.tasks.findMany({
      where: {
        uid: uid,
      },
    });
    return tasks;
  } catch (error) {
    return error;
  }
}

export async function createTaskByUser(data: TaskType) {
  try {
    const task = await prisma.tasks.create({
      data: {
        title: data.title,
        description: data.description,
        createdAt: new Date(),
        from: data.from,
        to: data.to,
        uid: data.uid,
        updatedAt: new Date(),
      },
    });
    return [task, null];
  } catch (error) {
    return [null, error];
  }
}

export async function deleteTaskById(id: string) {
  try {
    const task = await prisma.tasks.delete({
      where: {
        id: id,
      },
    });
    return [task, null];
  } catch (error) {
    return [null, error];
  }
}
