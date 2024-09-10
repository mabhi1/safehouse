import { deleteEvent } from "@/actions/events";
import { DeleteButton } from "@/components/ui/delete-button";
import MarkedText from "@/components/ui/marked-text";
import { EventType } from "@/lib/db-types";
import Link from "next/link";
import EditEventForm from "./edit-event-form";
import { dateFormatter } from "@/lib/utils";

export default function EventCard({
  event,
  searchTerm = "",
  upcoming = false,
  userId,
}: {
  event: EventType;
  searchTerm?: string;
  upcoming?: boolean;
  userId?: string;
}) {
  if (upcoming) {
    const month = event.date.getMonth();
    const date = event.date.getDate();
    const year = event.date.getFullYear();

    return (
      <li>
        <Link
          key={event.id}
          className="flex flex-col shadow transition-shadow duration-300 hover:shadow-lg border rounded p-5 overflow-hidden"
          href={`/events?month=${month}&date=${date}&year=${year}`}
        >
          <div>{dateFormatter(event.date)}</div>
          <div className="break-words text-lg font-medium">{event.title}</div>
        </Link>
      </li>
    );
  }
  return (
    <li
      key={event.id}
      className="flex flex-col shadow transition-shadow duration-300 hover:shadow-lg border rounded p-5 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="break-words text-xl font-medium w-2/3">
          <MarkedText text={event.title} searchTerm={searchTerm} />
        </div>
        <div>{dateFormatter(event.date)}</div>
      </div>
      <div className="break-words my-3 flex-1">
        <MarkedText text={event.description} searchTerm={searchTerm} />
      </div>
      <div>
        <div className="flex justify-end my-1">
          <EditEventForm event={event} uid={userId!} />
          <DeleteButton
            id={event.id}
            uid={userId!}
            deleteAction={deleteEvent}
            dialogDescription="This action will permanently remove the event from our servers."
          />
        </div>
        <div className="text-slate-500 text-xs border-t border-slate-500 pt-1">
          Updated : {dateFormatter(event.updatedAt)}
        </div>
      </div>
    </li>
  );
}
