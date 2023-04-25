import { TaskType } from "@/lib/types/dbTypes";
import { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";

type Props = {
  task: TaskType[];
  term: string;
  setTask: React.Dispatch<React.SetStateAction<TaskType[]>>;
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FilteredEvents = ({ task, term, setTask }: Props) => {
  const [filtered, setFiltered] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setFiltered(
      task.filter((t) => {
        if (t.title.toLowerCase().includes(term.toLowerCase()) || t.description.toLowerCase().includes(term.toLowerCase())) return t;
      })
    );
    setLoading(false);
  }, [task, term]);

  if (loading) return <Spinner size="sm" />;
  if (term.length > 0 && filtered.length <= 0) return <div>No events found</div>;
  return (
    <div>
      {filtered.map((t) => {
        const d = new Date(t.from);
        return (
          <div key={t.id} className="flex border-b border-slate-300 py-2 last:border-0 hover:bg-slate-100">
            <div className="bg-cyan-100 dark:bg-cyan-800 min-w-[4rem] flex flex-col justify-center items-center py-3">
              <div className="text-xl leading-none">{d.getDate()}</div>
              <div className="text-sm">{months[d.getMonth()]}</div>
            </div>
            <div className="px-2">
              <div>{t.title}</div>
              <div className="text-sm text-slate-500 h-10 overflow-hidden">{t.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default FilteredEvents;
