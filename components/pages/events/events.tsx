import { Badge } from "@/components/ui/badge";
import { getEventsByDateAndUser } from "@/prisma/db/events";
import CreateEventForm from "./create-event-form";
import EventCard from "./event-card";
import { dateFormatter, isMatching } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Events({
  startTime,
  endTime,
  userId,
  searchText,
  dateSelected,
}: {
  startTime: Date;
  endTime: Date;
  userId: string;
  searchText?: string;
  dateSelected: Date;
}) {
  const { data, error } = await getEventsByDateAndUser(startTime, endTime, userId);
  if (!data || error) throw new Error("User not found");

  function getFilteredList() {
    if (searchText && searchText.trim().length)
      return data!.filter((event) => isMatching(event.title, searchText) || isMatching(event.description, searchText));
    else return data;
  }
  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Events</span>
          <Badge variant="secondary" className="font-normal">
            {data.length}
          </Badge>
        </div>
        {searchText && (
          <Link
            href={`events?month=${dateSelected?.getMonth()}&date=${dateSelected?.getDate()}&year=${dateSelected?.getFullYear()}`}
            passHref
            legacyBehavior
          >
            <Button variant="secondary">Remove Search</Button>
          </Link>
        )}
        <CreateEventForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.length <= 0 && <div className="text-lg">No events for {dateFormatter(startTime)}</div>}
        {getFilteredList()!.map((event) => (
          <EventCard event={event} key={event.id} userId={userId} searchTerm={searchText} />
        ))}
      </ul>
    </div>
  );
}
