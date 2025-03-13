"use client";

import { NotesType } from "@/lib/db-types";
import { dateFormatter } from "@/lib/utils";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteNote } from "@/actions/notes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePenLine, MoveLeft } from "lucide-react";

interface NoteDetailProps {
  note: NotesType;
  userId: string;
}

export default function NoteDetail({ note, userId }: NoteDetailProps) {
  const { id, title, description, updatedAt } = note;
  console.log(description);
  return (
    <div className="flex flex-col gap-5">
      <Link href="/notes" className="flex lg:hidden items-center mr-auto gap-2">
        <MoveLeft className="w-4 h-4" />
        <span className="text-lg capitalize">All Notes</span>
      </Link>
      <div className="flex items-center justify-between lg:gap-20">
        <h1 className="text-2xl">{title}</h1>
        <div className="flex items-center gap-2 md:gap-5">
          <Link href={`/notes/edit/${id}`}>
            <Button variant="secondary" ICON={FilePenLine} mobileVariant>
              Edit
            </Button>
          </Link>
          <DeleteButton
            id={id}
            uid={userId}
            deleteAction={deleteNote}
            dialogDescription="This action will permanently remove the note from our servers."
            variant="destructive"
            mobileVariant
          />
        </div>
      </div>

      <div className="text-slate-500 text-xs border-t border-slate-200 pt-2">
        Updated: {dateFormatter(new Date(updatedAt))}
      </div>

      <div>
        <div
          className="whitespace-pre-wrap flex flex-col gap-1"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      </div>
    </div>
  );
}
