import { sendAlertMessageEmail } from "@/actions/emails";
import { getEventsByDate } from "@/prisma/db/events";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
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
      const email = user.primaryEmailAddress.emailAddress;
      const { data, error } = await sendAlertMessageEmail(event, email);
      if (!data || error) throw new Error(`Failed to send email for ${event.id} at ${email}`);
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Not Found", {
      status: 404,
    });
  }
}
