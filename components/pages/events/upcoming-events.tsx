import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getEventsByDateAndUser } from "@/prisma/db/events";
import EventCard from "./event-card";

export default async function UpcomingEvents({
  nextMonthStart,
  nextMonthEnd,
  userId,
  collapsible = true,
}: {
  nextMonthStart: Date;
  nextMonthEnd: Date;
  userId: string;
  collapsible?: boolean;
}) {
  const { data, error } = await getEventsByDateAndUser(nextMonthStart, nextMonthEnd, userId);
  if (!data || error) throw new Error("User not found");

  return (
    <Accordion type="single" collapsible={collapsible} defaultValue={collapsible ? undefined : "item-1"}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-base uppercase">Upcoming Events</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-3 h-80 overflow-y-auto">
            {data.length <= 0 && <div>No upcoming events</div>}
            {data.map((event) => (
              <EventCard event={event} key={event.id} upcoming={true} />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
