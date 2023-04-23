import { NotesType } from "@/lib/types/dbTypes";
import Input from "../ui/Input";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Button from "../ui/Button";

type Props = {
  note: NotesType;
};
const IndividualNotes = ({ note }: Props) => {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });

  return (
    <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 rounded p-2 overflow-hidden">
      <Input variant="disabled" disabled defaultValue={note.name} className="underline underline-offset-2" />
      <textarea disabled className="overflow-y-auto min-h-[10rem] h-[10rem] flex-1 p-1 dark:bg-slate-900 resize-none bg-transparent">
        {note.description}
      </textarea>
      <div className="flex gap-4 justify-end">
        <Button variant="link">Edit</Button>
        <Button variant="link">Delete</Button>
      </div>
      <div className="text-slate-500 italic text-xs border-t border-slate-500 pt-1">{dateFormatter.format(new Date(note.updatedAt))}</div>
    </div>
  );
};
export default IndividualNotes;
