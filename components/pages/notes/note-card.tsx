import { Button } from "@/components/ui/button";
import MarkedText from "@/components/ui/marked-text";
import { NotesType } from "@/lib/db-types";
import Link from "next/link";
import DeleteButton from "./delete-button";

export default function NoteCard({ note, searchTerm = "" }: { note: NotesType; searchTerm?: string }) {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });

  return (
    <div className="flex flex-col gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded p-2 justify-between overflow-hidden">
      <div className="text-base uppercase break-words">
        <MarkedText text={note.title} searchTerm={searchTerm} />
      </div>
      <div className="overflow-y-auto min-h-[12rem] h-[12rem] p-1 bg-transparent">
        {note.description.split("\n").map((i, key) => {
          return (
            <div key={key} className="break-words">
              <MarkedText text={i} searchTerm={searchTerm} />
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex gap-2 justify-end my-2">
          <Link href={`/notes/${note.id}`}>
            <Button variant="ghost">Edit</Button>
          </Link>
          <DeleteButton noteId={note.id} />
        </div>
        <div className="text-slate-500 text-xs border-t border-slate-500 pt-1">
          Updated : {dateFormatter.format(new Date(note.updatedAt))}
        </div>
      </div>
    </div>
  );
}
