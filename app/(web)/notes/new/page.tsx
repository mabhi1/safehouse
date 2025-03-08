import { auth } from "@clerk/nextjs/server";
import CreateNoteForm from "@/components/pages/notes/create-note-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Note",
};

export default async function NewNotePage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  return <CreateNoteForm userId={userId} />;
}
