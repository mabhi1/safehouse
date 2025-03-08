import NotesSidebar from "@/components/pages/notes/notes-sidebar";
import { getNotesByUser } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Notes() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: notes } = await getNotesByUser(userId);

  return (
    <div>
      <div className="space-y-4 hidden lg:block">
        <h1 className="text-xl capitalize">Notes</h1>
        <div className="p-6 border rounded-lg bg-muted/50 text-center">
          <h2 className="text-xl font-medium mb-2">Welcome to your notes</h2>
          <p className="text-muted-foreground">
            Select a note from the sidebar to view its contents, or create a new note to get started.
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:hidden gap-5">
        <NotesSidebar notes={notes || []} userId={userId} />
      </div>
    </div>
  );
}
