import CreateNoteForm from "@/components/pages/notes/create-note-form";
import { auth } from "@clerk/nextjs/server";

export default function CreateNote() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  return <CreateNoteForm uid={userId} />;
}
