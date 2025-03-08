"use client";

import { NotesType } from "@/lib/db-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import CreateNoteForm from "./create-note-form";
import { cn, isMatching } from "@/lib/utils";

interface NotesSidebarProps {
  notes: NotesType[];
  userId?: string;
}

export default function NotesSidebar({ notes, userId }: NotesSidebarProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = useMemo(
    () => (searchTerm ? notes.filter((note) => isMatching(note.title, searchTerm)) : notes),
    [searchTerm, notes]
  );

  return (
    <div className="space-y-2 lg:space-y-5 sticky top-4 w-full lg:w-72">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Link href="/notes" className="text-xl capitalize">
            Notes
          </Link>
          <Badge variant="secondary" className="font-normal">
            {filteredNotes.length}
          </Badge>
        </div>
        {userId && <CreateNoteForm uid={userId} />}
      </div>

      <Input placeholder="Search notes" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <ul className="flex flex-col divide-y">
        {filteredNotes.length === 0 && <li className="p-3 text-sm text-muted-foreground">No notes found</li>}

        {filteredNotes.map((note) => {
          const isActive = pathname === `/notes/${note.id}`;
          return (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <li
                className={cn(
                  "flex gap-2 justify-center md:justify-start items-center bg-background hover:bg-muted p-3 lg:pr-20 rounded-lg transition-all duration-500",
                  isActive && "bg-muted"
                )}
              >
                <span className="truncate font-medium">{note.title}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
