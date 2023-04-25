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
