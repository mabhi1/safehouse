import { NotesType } from "@/lib/types/dbTypes";
import Button from "../ui/Button";
import MarkedText from "../ui/MarkedText";

type Props = {
  note: NotesType;
  searchTerm: string;
};
const IndividualNotes = ({ note, searchTerm }: Props) => {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });

  if (!note) return <></>;

  return (
    <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 rounded p-2 justify-between overflow-hidden">
      <div className="underline underline-offset-2">
        <MarkedText text={note.name} searchTerm={searchTerm} />
      </div>
      <div className="overflow-y-auto min-h-[10rem] h-[10rem] p-1 bg-transparent">
        {note.description.split("\n").map((i, key) => {
          return (
            <div key={key} className="break-words">
              <MarkedText text={i} searchTerm={searchTerm} />
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex gap-4 justify-end my-2">
          <Button variant="link">Edit</Button>
          <Button variant="link">Delete</Button>
        </div>
        <div className="text-slate-500 italic text-xs border-t border-slate-500 pt-1">Updated : {dateFormatter.format(new Date(note.updatedAt))}</div>
      </div>
    </div>
  );
};
export default IndividualNotes;
