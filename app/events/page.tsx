import CalendarDates from "@/components/pages/events/calendar-dates";
import Events from "@/components/pages/events/events";
import UpcomingEvents from "@/components/pages/events/upcoming-events";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default function CalendarPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const today = new Date();
  const month = (parseInt(searchParams.month) || today.getMonth()) + 1;
  const date = parseInt(searchParams.date) || today.getDate();
  const year = parseInt(searchParams.year) || today.getFullYear();

  const dateSelected = new Date(`${month}/${date}/${year}`);
  const startTime = new Date(dateSelected.setHours(0, 0, 0, 0));
  const endTime = new Date(dateSelected.setHours(23, 59, 59, 999));

  const nextMonthEnd = new Date(new Date().setMonth(today.getMonth() + 1));

  return (
    <div className="h-full flex gap-5">
      <Events startTime={startTime} endTime={endTime} userId={userId} />
      <div className="flex flex-col gap-5">
        <CalendarDates dateSelected={dateSelected} />
        <UpcomingEvents nextMonthStart={today} nextMonthEnd={nextMonthEnd} userId={userId} />
      </div>
    </div>
  );
}
