import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Bookmarks",
  description: "Manage your bookmarks with ease",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  // If no user, we'll just render the children (which will handle redirection)
  if (!userId) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
