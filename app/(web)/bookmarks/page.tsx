import { getBookmarksByUser } from "@/prisma/db/bookmarks";
import { auth } from "@clerk/nextjs/server";
import BookmarksTable from "@/components/pages/bookmarks/bookmarks-table";

export const dynamic = "force-dynamic";

export default async function Bookmarks({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];
  const { data: bookmarks } = await getBookmarksByUser(userId);

  return (
    <div>
      <BookmarksTable bookmarks={bookmarks || []} userId={userId} searchText={searchText} />
    </div>
  );
}
