import { TaskType } from "@/lib/types/dbTypes";
import { months, generateDate } from "@/utils/calendar";
import dayjs from "dayjs";
import Button from "../ui/Button";

type Props = {
  selectDate: dayjs.Dayjs;
  setSelectDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  today: dayjs.Dayjs;
  setToday: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  currentDate: dayjs.Dayjs;
  task: TaskType[];
};
const CalendarView = ({ selectDate, setSelectDate, today, setToday, currentDate, task }: Props) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const displayDates = () => {
    return generateDate(today.month(), today.year(), task).map(({ date, currentMonth, today, events }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          if (!currentMonth) setToday(date);
          setSelectDate(date);
        }}
        key={date.toString()}
        className={
          (currentMonth ? "after:bg-slate-900 " : "text-gray-400 after:bg-slate-400 ") +
          (selectDate.toDate().toDateString() === date.toDate().toDateString()
            ? "before:block before:bg-cyan-600 text-slate-50 after:bg-slate-50 "
            : today
            ? "before:bg-fuchsia-200 before:block "
            : "before:hidden hover:text-slate-50 bg-transparent hover:before:block ") +
          (events ? "after:content-[''] after:absolute after:rounded-full after:bottom-[6px] after:h-[4px] after:w-[4px] " : "") +
          "date hover:before:bg-cyan-600 cursor-pointer border-t border-slate-300 flex justify-center items-center aspect-square"
        }
      >
        {date.date()}
      </Button>
    ));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center px-2">
        <div className="h-8 flex justify-start items-center w-32">
          {months[today.month()]}, {today.year()}
        </div>
        <Button
          variant={"ghost"}
          onClick={() => {
            setToday(today.month(today.month() - 1));
          }}
          className="h-8 w-5 rounded flex justify-center items-center cursor-pointer hover:bg-cyan-500 hover:text-slate-50"
        >
          &lt;
        </Button>
        <Button
          variant={"link"}
          onClick={() => {
            setToday(currentDate);
            setSelectDate(currentDate);
          }}
        >
          Today
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setToday(today.month(today.month() + 1));
          }}
          className="h-8 w-5 rounded flex justify-center items-center cursor-pointer hover:bg-cyan-500 hover:text-slate-50"
        >
          &gt;
        </Button>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            return (
              <div key={idx} className="flex justify-center items-center">
                {day}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 mt-3 rounded">{displayDates()}</div>
      </div>
    </div>
  );
};
export default CalendarView;
