import { auth } from "@clerk/nextjs/server";
import NewNoteForm from "@/components/pages/notes/new-note-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Note",
};

export default async function NewNotePage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  return <NewNoteForm userId={userId} />;
}
