import { sendMessageEmail } from "@/actions/emails";
import { getEventsByDate } from "@/prisma/db/events";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");
  try {
    if (!key || key !== process.env.CRON_SECRET) throw new Error("Invalid Key");

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const startTime = new Date(today.setHours(0, 0, 0, 0));
    const endTime = new Date(today.setHours(23, 59, 59, 999));

    const { data, error } = await getEventsByDate(startTime, endTime);
    if (error || !data || !data?.length) throw new Error("No Events found");
    for (let event of data) {
      const res = await fetch(`https://api.clerk.com/v1/users/${event.uid}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      const user = await res.json();
      const email = user.email_addresses[0].email_address;
      const { data, error } = await sendMessageEmail(event, email);
      if (!data || error) throw new Error(`Failed to send email for ${event.id} at ${email}`);
    }
    return NextResponse.json({ data: "Email Triggered", error: null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: null, error: "Not Found" }, { status: 404, statusText: "Not Found" });
  }
}
