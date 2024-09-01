import PasswordCard from "@/components/pages/passwords/password-card";
import { Button } from "@/components/ui/button";
import { GetPasswordsByUser } from "@/prisma/db/passwords";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Passwords() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await GetPasswordsByUser(userId);
  if (!data || error) throw new Error("User not found");

  return (
    <>
      <div className="lg:hidden flex justify-between items-center bg-background mb-5">
        <span className="uppercase text-base">Passwords</span>
        <Button size="sm">Create</Button>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {data.length <= 0 && <div className="text-lg">No Saved Passwords</div>}
        {data.map((password) => (
          <PasswordCard key={password.id} password={password} uid={userId} />
        ))}
      </ul>
    </>
  );
}
