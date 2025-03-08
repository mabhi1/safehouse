import { getNotesByUser } from "@/prisma/db/notes";
import { auth } from "@clerk/nextjs/server";
import NotesSidebar from "@/components/pages/notes/notes-sidebar";

export const metadata = {
  title: "Notes",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  // If no user, we'll just render the children (which will handle redirection)
  if (!userId) {
    return <>{children}</>;
  }

  const { data: notes } = await getNotesByUser(userId);

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-14 md:pt-4">
      <div className="hidden lg:block">
        <NotesSidebar notes={notes || []} userId={userId} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
