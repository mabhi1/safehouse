"use client";

import { NotesType } from "@/lib/db-types";
import NoteCard from "./note-card";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import CreateNoteForm from "./create-note-form";
import { Badge } from "@/components/ui/badge";
import { isMatching } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface NotesPageProps {
  notes: NotesType[];
  userId: string;
  searchText?: string;
}

export default function NotesPage({ notes, userId, searchText }: NotesPageProps) {
  const [searchTerm, setSearchTerm] = useState(searchText || "");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Create a memoized function to update URL
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (searchText) setSearchTerm(searchText);
  }, [searchText]);

  useEffect(() => {
    const queryString = createQueryString("search", searchTerm);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [searchTerm, router, pathname, createQueryString]);

  const filteredNotes = useMemo(
    () =>
      searchTerm
        ? notes.filter((note) => isMatching(note.title, searchTerm) || isMatching(note.description, searchTerm))
        : notes,
    [searchTerm, notes]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-xl capitalize">Notes</span>
          <Badge variant="secondary" className="font-normal">
            {filteredNotes.length}
          </Badge>
        </div>
        <div>
          <Input
            placeholder="Search Notes"
            className="h-9 w-36 md:w-56"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreateNoteForm uid={userId} />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredNotes.length <= 0 && <div className="text-lg">No Saved Notes</div>}
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} uid={userId} searchTerm={searchTerm} />
        ))}
      </ul>
    </div>
  );
}
