import { getNotesByUser } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";
import NotesPage from "@/components/pages/notes/notes-page";

export const dynamic = "force-dynamic";

export default async function Notes({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];
  const { data, error } = await getNotesByUser(userId!);
  if (!data || error) throw new Error("User not found");

  return <NotesPage notes={data} userId={userId!} searchText={searchText} />;
}
