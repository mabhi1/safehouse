import { EncryptionError } from "@/components/pages/master-password/encryption-error";
import SuccessComponent from "@/components/pages/master-password/success-component";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function MasterPasswordIdPage() {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const { data, error } = await getEncryptionByUser(userId);
  if (!data || error) return <EncryptionError error={error} />;

  return <SuccessComponent data={data} />;
}
export default MasterPasswordIdPage;
