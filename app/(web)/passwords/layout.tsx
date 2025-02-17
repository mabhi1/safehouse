import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Passwords",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  const { data, error } = await getEncryptionByUser(userId!);
  if (error) return <EncryptionError error={error} />;
  if (!data) return redirect("/master-password");

  return <>{children}</>;
}
