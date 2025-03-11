import { createNoteByUser, deleteNoteById, getNotesByUser, updateNoteById } from "@/prisma/db/notes";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) throw "";
    const { data, error } = await getNotesByUser(uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response("Error fetching notes", {
      status: 404,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, uid } = await request.json();
    if (!title.trim().length || !description.trim().length || !uid.trim().length) throw "";
    const { data, error } = await createNoteByUser(title, description, uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response("Error saving note", {
      status: 404,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, uid } = await request.json();
    if (!id.trim().length || !title.trim().length || !description.trim().length || !uid.trim().length) throw "";
    const { data, error } = await updateNoteById(id, title, description, uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response("Error saving note", {
      status: 404,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const id = searchParams.get("id");
    if (!uid || !id) throw "";
    const { data, error } = await deleteNoteById(id, uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response("Error deleting note", {
      status: 404,
    });
  }
}
