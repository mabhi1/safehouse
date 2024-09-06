import MarkedText from "@/components/ui/marked-text";
import { NotesType } from "@/lib/db-types";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteNote } from "@/actions/notes";
import { EditNoteForm } from "./edit-note-form";
import { dateFormatter } from "@/lib/utils";

interface NoteCardProps {
  note: NotesType;
  searchTerm?: string;
  uid: string;
}

export default function NoteCard({ note, searchTerm = "", uid }: NoteCardProps) {
  const { id, title, description, updatedAt } = note;
  return (
    <li className="shadow transition-shadow duration-300 hover:shadow-lg flex flex-col gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded p-2 justify-between overflow-hidden">
      <div className="text-base uppercase break-words">
        <MarkedText text={title} searchTerm={searchTerm} />
      </div>
      <div className="overflow-y-auto min-h-[12rem] h-[12rem] p-1 bg-transparent">
        {description.split("\n").map((i, key) => {
          return (
            <div key={key} className="break-words">
              <MarkedText text={i} searchTerm={searchTerm} />
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex justify-end my-2">
          <EditNoteForm note={note} uid={uid} />
          <DeleteButton
            id={id}
            uid={uid}
            deleteAction={deleteNote}
            dialogDescription="This action will permanently remove the note from our servers."
          />
        </div>
        <div className="text-slate-500 text-xs border-t border-slate-500 pt-1">
          Updated : {dateFormatter(new Date(updatedAt))}
        </div>
      </div>
    </li>
  );
}
