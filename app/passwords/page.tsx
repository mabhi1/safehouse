import { CreatePasswordForm } from "@/components/pages/passwords/create-password-form/create-password-form";
import PasswordCard from "@/components/pages/passwords/password-card/password-card";
import { Badge } from "@/components/ui/badge";
import { getPasswordsByUser } from "@/prisma/db/passwords";
import { auth } from "@clerk/nextjs/server";
import SortPasswords from "@/components/pages/passwords/sort-passwords/sort-passwords";
import { getSortKey, isMatching, PasswordSortValues } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Passwords({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];
  const { data, error } = await getPasswordsByUser(
    userId,
    getSortKey("passwords", searchParams["sort"] as PasswordSortValues)
  );
  if (!data || error) throw new Error("User not found");

  function getFilteredList() {
    if (searchText && searchText.trim().length)
      return data!.filter(
        (password) => isMatching(password.site, searchText) || isMatching(password.username, searchText)
      );
    else return data;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Passwords</span>
          <Badge variant="secondary" className="font-normal">
            {data.length}
          </Badge>
        </div>
        <SortPasswords isSearching={!!searchText?.trim().length} />
        <CreatePasswordForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {data.length <= 0 && <div className="text-lg">No Saved Passwords</div>}
        {getFilteredList()!.map((password) => (
          <PasswordCard key={password.id} password={password} uid={userId} searchTerm={searchText} />
        ))}
      </ul>
    </div>
  );
}
