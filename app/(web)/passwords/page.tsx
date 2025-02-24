import { getPasswordsByUser } from "@/prisma/db/passwords";
import { auth } from "@clerk/nextjs/server";
import PasswordsPage from "@/components/pages/passwords/passwords-page";

export const dynamic = "force-dynamic";

export default async function Passwords({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];
  const { data, error } = await getPasswordsByUser(userId!);
  if (!data || error) throw new Error("User not found");

  return <PasswordsPage passwords={data} userId={userId!} searchText={searchText} />;
}
