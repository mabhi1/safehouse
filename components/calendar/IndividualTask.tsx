import { TaskType } from "@/lib/types/dbTypes";
import { dateFormatter } from "@/utils/dateFormatter";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import ConfirmBox from "../ui/ConfirmBox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/utils/handleToast";
import Spinner from "../ui/Spinner";

type Props = {
  setTask: React.Dispatch<React.SetStateAction<TaskType[]>>;
  task: TaskType;
};
const IndividualTask = ({ task, setTask }: Props) => {
  const [confirm, setConfirm] = useState(false);
  const queryClient = useQueryClient();
  const eventMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/tasks/?id=${task.id}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      if (eventMutation.isError) showToast("error", "Error deleting Event");
      else {
        setTask((taskList) => taskList.filter((task) => task.id !== data.data.data.id));
        showToast("success", "Event deleted successfully");
      }
    },
  });

  const handleDelete = async () => {
    eventMutation.mutate();
  };

  if (!task) return <></>;

  if (eventMutation.isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner size="md" />
      </div>
    );

  return (
    <div key={task.id} className="even:bg-slate-100 flex flex-col border-b border-slate-300 hover:bg-slate-100 p-2">
      <ConfirmBox open={confirm} setOpen={setConfirm} action={handleDelete} />
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div>{task.title}</div>
        <div className="flex gap-1 text-slate-500 text-sm">
          <div>{dateFormatter(new Date(task.from))}</div>
          {task.to && <span>-</span>}
          <div>{dateFormatter(new Date(task.to))}</div>
        </div>
      </div>
      <div className="text-slate-500 text-sm min-h-[3rem]">{!task.description ? "No Description" : task.description}</div>
      <div className="flex justify-end">
        <MdDelete className="cursor-pointer text-red-700" onClick={() => setConfirm(true)} />
      </div>
    </div>
  );
};
export default IndividualTask;
