import { createPasswordByUser, deletePasswordById, getPasswordsByUser } from "@/prisma/db/passwords";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const key = searchParams.get("key") || "updatedAt";
    const type = searchParams.get("type") || "desc";
    if (!uid) throw "";
    const { data, error } = await getPasswordsByUser(uid, { key, type });
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Error fetching passwords", {
      status: 404,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { site, username, password, uid } = await request.json();
    if (!site.trim().length || !username.trim().length || !password.trim().length || !uid.trim().length) throw "";
    const { data, error } = await createPasswordByUser(site, username, password, uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Error saving password", {
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
    const { data, error } = await deletePasswordById(id, uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Error deleting password", {
      status: 404,
    });
  }
}
