import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CalendarClock } from "lucide-react";
import UpcomingEvents from "./upcoming-events";

export function MobileUpcomingEvents({
  nextMonthStart,
  nextMonthEnd,
  userId,
}: {
  nextMonthStart: Date;
  nextMonthEnd: Date;
  userId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <CalendarClock className="w-[1.2rem] h-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UpcomingEvents
          nextMonthStart={nextMonthStart}
          nextMonthEnd={nextMonthEnd}
          userId={userId}
          collapsible={false}
        />
      </DialogContent>
    </Dialog>
  );
}
