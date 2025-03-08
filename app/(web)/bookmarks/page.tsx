import { getBookmarksByUser } from "@/prisma/db/bookmarks";
import { auth } from "@clerk/nextjs/server";
import BookmarksPage from "@/components/pages/bookmarks/bookmarks-page";

export const dynamic = "force-dynamic";

export default async function Bookmarks({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];
  const { data: bookmarks } = await getBookmarksByUser(userId);

  return (
    <div>
      <BookmarksPage bookmarks={bookmarks || []} userId={userId} searchText={searchText} />
    </div>
  );
}
