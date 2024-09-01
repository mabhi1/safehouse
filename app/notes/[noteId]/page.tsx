import { EditNoteForm } from "@/components/pages/notes/edit-note-form";
import { getNoteById } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: { noteId: string };
};
export default async function Note({ params: { noteId } }: Props) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await getNoteById(noteId);
  if (!data || error) throw new Error("Note does not exist");
  return <EditNoteForm note={data} uid={userId} />;
}
