import { CreatePasswordForm } from "@/components/pages/passwords/create-password-form";
import PasswordCard from "@/components/pages/passwords/password-card";
import { Badge } from "@/components/ui/badge";
import { getPasswordsByUser } from "@/prisma/db/passwords";
import { auth } from "@clerk/nextjs/server";
import SortPasswords from "@/components/pages/passwords/sort-passwords";
import { getSortKey, PasswordSortValues } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Passwords({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await getPasswordsByUser(
    userId,
    getSortKey("passwords", searchParams["sort"] as PasswordSortValues)
  );
  if (!data || error) throw new Error("User not found");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <span className="text-base uppercase mr-auto">
          Passwords
          <Badge variant="secondary" className="font-normal ml-1">
            {data.length}
          </Badge>
        </span>
        <SortPasswords />
        <CreatePasswordForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {data.length <= 0 && <div className="text-lg">No Saved Passwords</div>}
        {data.map((password) => (
          <PasswordCard key={password.id} password={password} uid={userId} />
        ))}
      </ul>
    </div>
  );
}
