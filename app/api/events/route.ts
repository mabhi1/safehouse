import { getEventsByDateAndUser } from "@/prisma/db/events";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const uid = searchParams.get("uid");
    const searchMonth = searchParams.get("month");
    const searchDate = searchParams.get("date");
    const searchYear = searchParams.get("year");
    if (!uid || !searchMonth || !searchDate || !searchYear) throw "";

    const today = new Date();
    const month = (parseInt(searchMonth) || today.getMonth()) + 1;
    const date = parseInt(searchDate) || today.getDate();
    const year = parseInt(searchYear) || today.getFullYear();

    const dateSelected = new Date(`${month}/${date}/${year}`);
    const startTime = new Date(dateSelected.setHours(0, 0, 0, 0));
    const endTime = new Date(dateSelected.setHours(23, 59, 59, 999));

    const nextMonthEnd = new Date(new Date().setMonth(today.getMonth() + 1));

    const { data: data1, error: error1 } = await getEventsByDateAndUser(startTime, endTime, uid);
    if (error1 || !data1) throw "";

    const { data: data2, error: error2 } = await getEventsByDateAndUser(today, nextMonthEnd, uid);
    if (error2 || !data2) throw "";

    return new Response(JSON.stringify({ currentEvent: data1, upcomingEvents: data2 }), { status: 200 });
  } catch (error) {
    return new Response("Error fetching events", {
      status: 404,
    });
  }
}
