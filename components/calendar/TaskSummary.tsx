import { TaskType } from "@/lib/types/dbTypes";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  upcomingTasks: TaskType[];
};
const TaskDetail = ({ upcomingTasks }: Props) => {
  if (upcomingTasks.length <= 0) return <div className="text-slate-500 text-sm">No Upcoming Events</div>;
  upcomingTasks.sort((a, b) => new Date(a.from).valueOf() - new Date(b.from).valueOf());
  return (
    <>
      {upcomingTasks.map((task) => {
        const d = new Date(task.from);
        return (
          <div key={task.id} className="flex border-b border-slate-300 py-2 last:border-0 hover:bg-slate-100">
            <div className="bg-cyan-100 dark:bg-cyan-800 min-w-[4rem] flex flex-col justify-center items-center py-3">
              <div className="text-xl leading-none">{d.getDate()}</div>
              <div className="text-sm">{months[d.getMonth()]}</div>
            </div>
            <div className="px-2">
              <div>{task.title}</div>
              <div className="text-sm text-slate-500 h-10 overflow-hidden">{task.description}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default TaskDetail;
