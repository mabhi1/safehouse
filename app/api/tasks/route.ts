import { GetTasksByUser } from "@/lib/prisma/task";
import { TaskType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const tasks = (await GetTasksByUser(uid)) as TaskType[];
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
}
