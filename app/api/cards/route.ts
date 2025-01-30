import { GetCardsByUser, updateManyCardsByUser } from "@/prisma/db/cards";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const key = searchParams.get("key") || "updatedAt";
    const type = searchParams.get("type") || "desc";
    if (!uid) throw "";
    const { data, error } = await GetCardsByUser(uid, { key, type });
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Error fetching notes", {
      status: 404,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { cards, multiple } = await request.json();
    if (multiple) {
      if (!cards.length) throw "";
      const { data, error } = await updateManyCardsByUser(cards);
      if (error || !data) throw "";
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    return new Response("Error saving card", {
      status: 404,
    });
  }
}
