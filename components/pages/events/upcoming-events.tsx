import { getEventsByDateAndUser } from "@/prisma/db/events";
import EventCard from "./event-card";

export default async function UpcomingEvents({
  nextMonthStart,
  nextMonthEnd,
  userId,
}: {
  nextMonthStart: Date;
  nextMonthEnd: Date;
  userId: string;
}) {
  const { data, error } = await getEventsByDateAndUser(nextMonthStart, nextMonthEnd, userId);
  if (!data || error) throw new Error("User not found");

  return (
    <ul className="space-y-3">
      <span className="text-base uppercase">Upcoming Events</span>
      {data.length <= 0 && <div>No upcoming events</div>}
      {data.map((event) => (
        <EventCard event={event} key={event.id} upcoming={true} />
      ))}
    </ul>
  );
}
