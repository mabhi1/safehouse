"use client";

import Loading from "@/app/loading";
import useAuth from "@/components/auth/AuthProvider";
import IndividualNotes from "@/components/notes/IndividualNotes";
import { NotesType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  params: { term: string };
};
const NotesTerm = ({ params: { term } }: Props) => {
  const [note, setNotes] = useState<NotesType[]>([]);
  const auth = useAuth();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notes?uid=${auth?.currentUser?.uid}`);
      setNotes(
        data.notes.filter((note: NotesType) => {
          if (note.name.toLowerCase().includes(term) || note.description.toLowerCase().includes(term)) return note;
        })
      );
      return data;
    },
  });

  if (notesQuery.isLoading) return <Loading />;
  if (notesQuery.isError) throw notesQuery.error;

  const showNotes = () => {
    if (note.length === 0) return <div>No Notes to display</div>;
    return note?.map((note: NotesType) => {
      return <IndividualNotes note={note} key={note.id} searchTerm={term} setNotes={setNotes} />;
    });
  };

  if (!notesQuery.isLoading) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">{showNotes()}</div>;
};
export default NotesTerm;
