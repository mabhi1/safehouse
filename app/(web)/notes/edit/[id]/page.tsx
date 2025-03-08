import { getNoteById } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import EditNoteFormPage from "@/components/pages/notes/edit-note-form-page";

export const dynamicParams = true;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getNoteById(params.id);
  return {
    title: data ? `Edit Note: ${data.title}` : "Edit Note",
  };
}

export default async function EditNotePage({ params }: Props) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: note, error } = await getNoteById(params.id);

  if (!note || error || note.uid !== userId) {
    redirect("/notes");
  }

  return <EditNoteFormPage note={note} userId={userId} />;
}
