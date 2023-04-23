"use client";
import Input from "@/components/ui/Input";
import { BiSearchAlt2 } from "react-icons/bi";
import useAuth from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../loading";
import IndividualNotes from "@/components/notes/IndividualNotes";
import { NotesType } from "@/lib/types/dbTypes";
import NewNote from "@/components/notes/NewNote";

type Props = {};
const Notes = (props: Props) => {
  const currentUser = useAuth();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notes?uid=${currentUser?.uid}`);
      return data;
    },
  });

  if (notesQuery.isLoading) return <Loading />;
  if (notesQuery.isError) throw notesQuery.error;

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex justify-between gap-5 items-center">
        <h1>Notes</h1>
        <span className="relative">
          <Input variant="iconSmall" wide="md" type="text" placeholder="Search" />
          <BiSearchAlt2 className="text-slate-400 absolute top-1/2 -translate-y-1/2 left-2" />
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        <NewNote />
        {notesQuery.data.notes.map((note: NotesType) => {
          return <IndividualNotes note={note} key={note.id} />;
        })}
      </div>
    </div>
  );
};
export default Notes;
