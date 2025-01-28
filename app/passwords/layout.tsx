import EncryptionEnrollment from "@/components/layout/encryption-enrollment";
import { EncryptionError } from "@/components/layout/encryption-error";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Passwords",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data, error } = await getEncryptionByUser(userId);
  if (error) return <EncryptionError error={error} />;
  if (!data) return <EncryptionEnrollment />;

  return <>{children}</>;
}
