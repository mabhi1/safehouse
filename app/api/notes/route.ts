import { createNoteByUser, deleteNoteById, getNotesByUser, updateNoteById } from "@/lib/prisma/notes";
import { NotesType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const notes = (await getNotesByUser(uid)) as NotesType[];
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [data, error] = await createNoteByUser(body);
  return NextResponse.json({ data, error });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const [data, error] = await updateNoteById(body.id, body.name, body.description);
  return NextResponse.json({ data, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id: string = searchParams.get("id")!;
  const [data, error] = await deleteNoteById(id);
  return NextResponse.json({ data, error });
}
