import { getNotesByUser } from "@/lib/prisma/notes";
import { NotesType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const notes = (await getNotesByUser(uid)) as NotesType[];
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
}
