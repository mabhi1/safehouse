import { getEncryptionByUser } from "@/prisma/db/encryption";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) throw "";
    const { data, error } = await getEncryptionByUser(uid);
    if (error || !data) throw "";
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Error fetching passwords", {
      status: 404,
    });
  }
}
