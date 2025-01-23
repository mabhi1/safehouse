import { getPasswordsByUser } from "@/prisma/db/passwords";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const key = searchParams.get("key") || "updatedAt";
    const type = searchParams.get("type") || "desc";
    if (!uid) throw "";
    const { data, error } = await getPasswordsByUser(uid, { key, type });
    if (error) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error fetching passwords", {
      status: 404,
    });
  }
}
