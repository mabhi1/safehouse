"use client";
import Input from "@/components/ui/Input";
import { BiSearchAlt2 } from "react-icons/bi";
import useAuth from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../loading";
import IndividualNotes from "@/components/notes/IndividualNotes";
import { NotesType } from "@/lib/types/dbTypes";
import { useState } from "react";

type Props = {};
const Notes = (props: Props) => {
  const [notes, setNotes] = useState([]);
  const [term, setTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const currentUser = useAuth();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notes?uid=${currentUser?.uid}`);
      setNotes(data.notes);
      return data;
    },
  });

  const filterNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim().toLowerCase();
    setTerm(text);
    setFilteredNotes(
      notes.filter((note: NotesType) => {
        if (note.name.toLowerCase().includes(text) || note.description.toLowerCase().includes(text)) return note;
      })
    );
  };

  const showNotes = (notesList: NotesType[]) => {
    if (notesList.length === 0) return <div>No Notes to display</div>;
    return notesList.map((note: NotesType) => {
      return <IndividualNotes note={note} key={note.id} searchTerm={term} />;
    });
  };

  if (notesQuery.isLoading) return <Loading />;
  if (notesQuery.isError) throw notesQuery.error;

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex justify-between gap-5 items-center">
        <h1>Notes</h1>
        <span className="relative">
          <Input variant="iconSmall" wide="md" type="text" placeholder="Search" onChange={filterNotes} />
          <BiSearchAlt2 className="text-slate-400 absolute top-1/2 -translate-y-1/2 left-2" />
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">{term ? showNotes(filteredNotes) : showNotes(notes)}</div>
    </div>
  );
};
export default Notes;
