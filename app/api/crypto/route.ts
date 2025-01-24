import { decrypt, encrypt } from "@/actions/encryption";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json();
    if (!password.trim().length || !action.trim().length) throw "";
    let result = "";
    if (action === "encrypt") result = await encrypt(password);
    if (action === "decrypt") result = await decrypt(password);
    return new Response(JSON.stringify({ password: result }), { status: 200 });
  } catch (error) {
    return new Response("Error saving password", {
      status: 404,
    });
  }
}
