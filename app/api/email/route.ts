import { contactUsMessageEmail } from "@/actions/emails";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, email, name, type } = await request.json();
    if (!message.trim().length || !email.trim().length || !name.trim().length || !type.trim().length) throw "";
    if (type === "contact") {
      await contactUsMessageEmail(message, email, name);
      return new Response(JSON.stringify({ data: "Email sent successfully" }), { status: 200 });
    } else {
      throw new Error();
    }
  } catch (error) {
    return new Response("Error sending email", {
      status: 404,
    });
  }
}
