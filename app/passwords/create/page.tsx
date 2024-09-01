import { CreatePasswordForm } from "@/components/pages/passwords/create-password-form";
import { auth } from "@clerk/nextjs/server";

export default function CreatePassword() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  return <CreatePasswordForm uid={userId} />;
}
