import { TaskType } from "@/lib/types/dbTypes";
import dayjs from "dayjs";
import Button from "../ui/Button";
import IndividualTask from "./IndividualTask";

type Props = {
  selectDate: dayjs.Dayjs;
  setTask: React.Dispatch<React.SetStateAction<TaskType[]>>;
  showTask: TaskType[];
};
const TaskView = ({ selectDate, setTask, showTask }: Props) => {
  return (
    <>
      <div className="text-slate-500 mb-3 underline underline-offset-2">{selectDate.toDate().toDateString()}</div>
      {showTask.length === 0 && <div>No Events to display</div>}
      {showTask.map((task) => {
        return <IndividualTask task={task} key={task.id} />;
      })}
    </>
  );
};
export default TaskView;
