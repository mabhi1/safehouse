import VerifyMasterPassword from "@/components/layout/verify-master";
import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Passwords",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data, error } = await getEncryptionByUser(userId);
  if (error) return <EncryptionError error={error} />;
  if (!data) return redirect("/master-password");

  return (
    <>
      <VerifyMasterPassword salt={data.salt} hash={data.hash} />
      {children}
    </>
  );
}
