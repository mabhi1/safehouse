"use client";

import { NotesType } from "@/lib/db-types";
import { dateFormatter } from "@/lib/utils";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteNote } from "@/actions/notes";
import { EditNoteForm } from "./edit-note-form";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

interface NoteDetailProps {
  note: NotesType;
  userId: string;
}

export default function NoteDetail({ note, userId }: NoteDetailProps) {
  const { id, title, description, updatedAt } = note;

  return (
    <div className="space-y-4">
      <Link href="." className="flex lg:hidden items-center mr-auto gap-2">
        <MoveLeft className="w-4 h-4" />
        <span className="text-lg capitalize">All Notes</span>
      </Link>
      <div className="flex items-center justify-between lg:gap-20">
        <h1 className="text-2xl">{title}</h1>
        <div className="flex items-center gap-2 md:gap-5">
          <EditNoteForm note={note} uid={userId} />
          <DeleteButton
            id={id}
            uid={userId}
            deleteAction={deleteNote}
            dialogDescription="This action will permanently remove the note from our servers."
            variant="destructive"
          />
        </div>
      </div>

      <div className="text-slate-500 text-xs border-t border-slate-200 pt-2">
        Updated: {dateFormatter(new Date(updatedAt))}
      </div>

      <div>
        <div className="whitespace-pre-wrap">
          {description.split("\n").map((line, index) => (
            <div key={index} className="break-words">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
