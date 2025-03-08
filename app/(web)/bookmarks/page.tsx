import { getBookmarksByUser } from "@/prisma/db/bookmarks";
import { auth } from "@clerk/nextjs/server";
import BookmarksTable from "@/components/pages/bookmarks/bookmarks-table";

export const dynamic = "force-dynamic";

export default async function Bookmarks() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data: bookmarks } = await getBookmarksByUser(userId);

  return (
    <div>
      <BookmarksTable bookmarks={bookmarks || []} userId={userId} />
    </div>
  );
}
