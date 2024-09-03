import CreateNoteForm from "@/components/pages/notes/create-note-form";
import NoteCard from "@/components/pages/notes/note-card";
import { getNotesByUser } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import SortNotes from "@/components/pages/notes/sort-notes";
import { getSortKey, NotesSortValues } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Notes({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await getNotesByUser(userId, getSortKey("notes", searchParams["sort"] as NotesSortValues));
  if (!data || error) throw new Error("User not found");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Notes</span>
          <Badge variant="secondary" className="font-normal">
            {data.length}
          </Badge>
        </div>
        <SortNotes />
        <CreateNoteForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.length <= 0 && <div className="text-lg">No Saved Notes</div>}
        {data.map((note) => (
          <NoteCard key={note.id} note={note} uid={userId} />
        ))}
      </ul>
    </div>
  );
}
