import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import { MasterPasswordProvider } from "@/components/providers/master-password-provider";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId)
    return (
      <>
        <Header />
        <main className="w-full max-w-[90rem] mx-auto pt-1 px-5 pb-5 text-sm flex-1">{children}</main>
        <Footer />
      </>
    );

  const { data, error } = await getEncryptionByUser(userId);
  if (error) return <EncryptionError error={error} />;

  return (
    <MasterPasswordProvider salt={data?.salt || ""} hash={data?.hash || ""}>
      <Header />
      <main className="w-full max-w-[90rem] mx-auto pt-1 px-5 pb-5 text-sm flex-1">{children}</main>
      <Footer />
    </MasterPasswordProvider>
  );
}
