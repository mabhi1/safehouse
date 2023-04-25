import { TaskType } from "@/lib/types/dbTypes";
import dayjs from "dayjs";

export const generateDate = (month = dayjs().month(), year = dayjs().year(), task: TaskType[] = []) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

  const arrayOfDate = [];

  // const checkEvents = (d: dayjs.Dayjs) => {
  //   return (
  //     task.filter((t: TaskType) => {
  //       if (
  //         new Date(t.from).getDate() === d.toDate().getDate() &&
  //         new Date(t.from).getFullYear() == d.toDate().getFullYear() &&
  //         new Date(t.from).getMonth() == d.toDate().getMonth()
  //       )
  //         return t;
  //     }).length > 0
  //   );
  // };

  // create prefix date
  for (let i = 0; i < firstDateOfMonth.day(); i++) {
    const date: dayjs.Dayjs = firstDateOfMonth.day(i);
    arrayOfDate.push({
      currentMonth: false,
      date,
      events: false,
    });
  }

  // generate current date
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    arrayOfDate.push({
      events: false,
      currentMonth: true,
      date: firstDateOfMonth.date(i),
      today: firstDateOfMonth.date(i).toDate().toDateString() === dayjs().toDate().toDateString(),
    });
  }

  const remaining = 42 - arrayOfDate.length;

  for (let i = lastDateOfMonth.date() + 1; i <= lastDateOfMonth.date() + remaining; i++) {
    arrayOfDate.push({
      events: false,
      currentMonth: false,
      date: lastDateOfMonth.date(i),
    });
  }
  return arrayOfDate;
};

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
