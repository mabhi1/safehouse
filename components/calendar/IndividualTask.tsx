import { TaskType } from "@/lib/types/dbTypes";
import { MdDelete } from "react-icons/md";

type Props = {
  task: TaskType;
};
const IndividualTask = ({ task }: Props) => {
  return (
    <div key={task.id} className="even:bg-slate-100 flex flex-col border-b border-slate-300 hover:bg-slate-100 p-2">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div>{task.title}</div>
        <div className="flex gap-1 text-slate-500 text-sm">
          <div>{task.from}</div>
          {task.to && <span>-</span>}
          <div>{task.to}</div>
        </div>
      </div>
      <div className="text-slate-500 text-sm min-h-[3rem]">{!task.description ? "No Description" : task.description}</div>
      <div className="flex justify-end">
        <MdDelete className="cursor-pointer text-red-700" />
      </div>
    </div>
  );
};
export default IndividualTask;
