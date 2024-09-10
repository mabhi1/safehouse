"use client";

import { ChangeEvent } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  value: Date;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {
          target: {
            id: string;
            value: string | Date;
          };
        }
  ) => void;
}
export function DatePicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => d && onChange({ target: { id: "date", value: d } })}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
