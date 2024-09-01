import { decrypt } from "@/actions/encryption";
import { EditPasswordForm } from "@/components/pages/passwords/edit-password-form";
import { getPasswordById } from "@/prisma/db/passwords";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: { passwordId: string };
};
export default async function Password({ params: { passwordId } }: Props) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await getPasswordById(passwordId);
  if (!data || error) throw new Error("Password does not exist");
  const decryptedPassword = await decrypt(data.password);
  return <EditPasswordForm password={{ ...data, password: decryptedPassword }} uid={userId} />;
}
