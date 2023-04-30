import { GetTasksByUser, createTaskByUser, deleteTaskById } from "@/lib/prisma/task";
import { TaskType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const tasks = (await GetTasksByUser(uid)) as TaskType[];
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [data, error] = await createTaskByUser(body);
  return NextResponse.json({ data, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id: string = searchParams.get("id")!;
  const [data, error] = await deleteTaskById(id);
  return NextResponse.json({ data, error });
}
