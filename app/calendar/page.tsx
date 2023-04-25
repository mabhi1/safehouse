"use client";
import useAuth from "@/components/auth/AuthProvider";
import CalendarView from "@/components/calendar/CalendarView";
import Input from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillCaretDownSquareFill, BsFillCaretUpSquareFill } from "react-icons/bs";
import Loading from "../loading";
import { TaskType } from "@/lib/types/dbTypes";
import TaskView from "@/components/calendar/TaskView";
import TaskDetail from "@/components/calendar/TaskSummary";
import FilteredEvents from "@/components/calendar/FilteredEvents";

type Props = {};
const Calendar = (props: Props) => {
  const currentDate = dayjs();
  const [selectDate, setSelectDate] = useState(currentDate);
  const [today, setToday] = useState(currentDate);
  const [task, setTask] = useState<TaskType[]>([]);
  const [mode, setMode] = useState("close");
  const [showTask, setShowTask] = useState<TaskType[]>([]);
  const [upTask, setUpTask] = useState<TaskType[]>([]);
  const [taskMode, setTaskMode] = useState("close");
  const [term, setTerm] = useState("");
  const currentUser = useAuth();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tasks?uid=${currentUser?.uid}`);
      setTask(data.tasks);
      return data;
    },
  });

  useEffect(() => {
    setShowTask(task?.filter((t) => new Date(t.from).getDate() === selectDate.date()));
    setUpTask(
      task.filter((t) => {
        if (!t.from) return false;
        const td = new Date(t.from);
        const cd = new Date();
        if ((td.getMonth() - cd.getMonth() === 0 && td.getDate() >= cd.getDate()) || td.getMonth() - cd.getMonth() === 1) {
          if (td.getDate() === cd.getDate()) {
            if (td.getHours() > cd.getHours() || (td.getHours() === cd.getHours() && td.getMinutes() > cd.getMinutes())) return true;
          } else {
            return true;
          }
        }
      })
    );
  }, [task, selectDate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    setTerm(value);
  };

  if (tasksQuery.isLoading) return <Loading />;
  if (tasksQuery.isError) throw tasksQuery.error;

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex justify-between gap-5 items-center">
        <div>Events</div>
        <span className="relative">
          <Input variant="iconSmall" wide="md" type="text" placeholder="Search" onChange={handleSearch} />
          <BiSearchAlt2 className="text-slate-400 absolute top-1/2 -translate-y-1/2 left-2" />
        </span>
      </div>

      <div className="flex flex-col-reverse justify-end lg:flex-row flex-wrap gap-5 lg:gap-2 lg:divide-x-2 h-full">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-5 w-full lg:w-[75%]">
          <div
            onClick={() => {
              document.getElementById("mobileCalendar")?.classList.toggle("hidden");
              mode === "close" ? setMode("open") : setMode("close");
            }}
            className="md:hidden w-full flex p-1 rounded px-2 items-center border border-slate-300 justify-between"
          >
            <span>Calendar</span>
            {mode === "close" ? <BsFillCaretDownSquareFill className="text-xl" /> : <BsFillCaretUpSquareFill className="text-xl" />}
          </div>
          <section id="mobileCalendar" className="lg:sticky top-24 transition-all duration-200 hidden md:flex flex-col w-[90%] md:w-60 lg:w-72">
            <CalendarView
              currentDate={currentDate}
              selectDate={selectDate}
              setSelectDate={setSelectDate}
              setToday={setToday}
              task={task}
              today={today}
            />
          </section>
          <section className={"flex-1 md:pl-2 md:border-l-2 h-full flex flex-col overflow-y-auto w-full"}>
            <TaskView selectDate={selectDate} setTask={setTask} showTask={showTask} />
          </section>
        </div>
        <div className={"lg:pl-2 lg:flex-1 flex flex-col"}>
          {term.length > 0 ? (
            <>
              <div>Search Results</div>
              <FilteredEvents setTask={setTask} task={task} term={term} />
            </>
          ) : (
            <>
              <div
                onClick={() => {
                  document.getElementById("mobileTask")?.classList.toggle("hidden");
                  taskMode === "close" ? setTaskMode("open") : setTaskMode("close");
                }}
                className="lg:hidden w-full flex p-1 rounded px-2 items-center border border-slate-300 justify-between"
              >
                <span>Upcoming Events</span>
                {taskMode === "close" ? <BsFillCaretDownSquareFill className="text-xl" /> : <BsFillCaretUpSquareFill className="text-xl" />}
              </div>
              <div className="hidden lg:block">Upcoming Events</div>

              <span id="mobileTask" className="hidden lg:block">
                <TaskDetail upcomingTasks={upTask} />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Calendar;
