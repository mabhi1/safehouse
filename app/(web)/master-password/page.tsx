import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import MasterPasswordComp from "@/components/pages/master-password/master-password-comp";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function MasterPasswordPage() {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const { data, error } = await getEncryptionByUser(userId);
  if (error) return <EncryptionError error={error} />;

  return <MasterPasswordComp data={data} userId={userId} />;
}
export default MasterPasswordPage;
