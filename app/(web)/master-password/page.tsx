import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import MasterPasswordComp from "@/components/pages/master-password/master-password-comp";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";

async function MasterPasswordPage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const { data, error } = await getEncryptionByUser(userId);
  if (error) return <EncryptionError error={error} />;

  return <MasterPasswordComp data={data} userId={userId} />;
}
export default MasterPasswordPage;
