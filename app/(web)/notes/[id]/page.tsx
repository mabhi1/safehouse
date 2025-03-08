import { getNoteById } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NoteDetail from "@/components/pages/notes/note-detail";

export const dynamicParams = true;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getNoteById(params.id);
  return {
    title: data ? `Note: ${data.title}` : "Note",
  };
}

export default async function NotePage({ params }: Props) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: note, error } = await getNoteById(params.id);

  if (!note || error || note.uid !== userId) {
    redirect("/notes");
  }

  return <NoteDetail note={note} userId={userId} />;
}
