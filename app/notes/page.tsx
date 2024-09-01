import NoteCard from "@/components/pages/notes/note-card";
import { getNotesByUser } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Notes() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await getNotesByUser(userId);
  if (!data || error) throw new Error("User not found");

  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {data.length <= 0 && <div className="text-lg">No Saved Notes</div>}
      {data.map((note) => (
        <NoteCard key={note.id} note={note} uid={userId} />
      ))}
    </ul>
  );
}
