"use client";
import useAuth from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../loading";
import IndividualNotes from "@/components/notes/IndividualNotes";
import { NotesType } from "@/lib/types/dbTypes";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

type Props = {
  term: string;
};
const NotesPage = ({ term }: Props) => {
  const [notes, setNotes] = useState<NotesType[]>([]);
  const currentUser = useAuth();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notes?uid=${currentUser?.uid}`);
      setNotes(data.notes);
      return data;
    },
  });

  const showNotes = () => {
    if (notes.length === 0) return <div>No Notes to display</div>;
    return notes?.map((note: NotesType) => {
      return <IndividualNotes note={note} key={note.id} searchTerm={""} setNotes={setNotes} />;
    });
  };

  if (notesQuery.isLoading) return <Loading />;
  if (notesQuery.isError) throw notesQuery.error;

  if (!notesQuery.isLoading) {
    return (
      <>
        <div className="flex md:hidden items-center justify-between mb-3">
          <div>Notes</div>
          <Link href={"/notes/create"}>
            <Button variant={"outline"}>Add Note</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">{showNotes()}</div>
      </>
    );
  }
};
export default NotesPage;
