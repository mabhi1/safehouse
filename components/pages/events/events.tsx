import { Badge } from "@/components/ui/badge";
import { getEventsByDateAndUser } from "@/prisma/db/events";
import CreateEventForm from "./create-event-form";
import EventCard from "./event-card";
import { dateFormatter } from "@/lib/utils";

export default async function Events({
  startTime,
  endTime,
  userId,
}: {
  startTime: Date;
  endTime: Date;
  userId: string;
}) {
  const { data, error } = await getEventsByDateAndUser(startTime, endTime, userId);
  if (!data || error) throw new Error("User not found");

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Events</span>
          <Badge variant="secondary" className="font-normal">
            {data.length}
          </Badge>
        </div>
        {/* <SortNotes /> */}
        <CreateEventForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.length <= 0 && <div className="text-lg">No events for {dateFormatter(startTime)}</div>}
        {data.map((event) => (
          <EventCard event={event} key={event.id} userId={userId} />
        ))}
      </ul>
    </div>
  );
}
