import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalendarDates from "./calendar-dates";
import { CalendarDays } from "lucide-react";

export function MobileCalendar({ dateSelected, searchText = "" }: { dateSelected: Date; searchText?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <CalendarDays className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 w-fit border-0">
        <CalendarDates dateSelected={dateSelected} searchText={searchText} />
      </DialogContent>
    </Dialog>
  );
}
