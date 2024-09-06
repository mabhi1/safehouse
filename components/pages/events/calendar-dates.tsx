"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalendarDates({ dateSelected }: { dateSelected: Date }) {
  const [current, setCurrent] = useState<Date | undefined>(dateSelected);
  const [month, setMonth] = useState(dateSelected);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (current)
      router.push(`${pathname}?month=${current?.getMonth()}&date=${current?.getDate()}&year=${current?.getFullYear()}`);
  }, [current]);

  useEffect(() => {
    setCurrent(dateSelected);
    setMonth(dateSelected);
  }, [dateSelected]);

  return (
    <Calendar
      mode="single"
      selected={current}
      onSelect={setCurrent}
      month={month}
      onMonthChange={setMonth}
      className="rounded-md border w-fit"
      footer={
        <Button
          variant="secondary"
          onClick={() => {
            const today = new Date();
            router.push(`${pathname}?month=${today.getMonth()}&date=${today.getDate()}&year=${today.getFullYear()}`);
          }}
        >
          Go to today
        </Button>
      }
    />
  );
}
