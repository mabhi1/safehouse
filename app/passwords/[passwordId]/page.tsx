import Button from "@/components/ui/Button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { getPasswordById } from "@/lib/prisma/passwords";
import { PasswordType } from "@/lib/types/dbTypes";
import EditPassword from "@/components/passwords/EditPassword";

type Props = {
  params: { passwordId: string };
};
const Edit = async ({ params: { passwordId } }: Props) => {
  const [password, error] = (await getPasswordById(passwordId)) as [PasswordType, string];
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center md:items-start">
      <Link href={"/passwords"} className="flex gap-1 items-center w-full">
        <IoArrowBack className="text-cyan-900" />
        <Button variant={"link"}>Back to Passwords</Button>
      </Link>
      <div className="justify-center md:justify-start md:ml-10 flex flex-col gap-3 md:gap-5">
        {!password ? (
          <div>Password not found</div>
        ) : (
          <>
            <div>Edit Password</div>
            <EditPassword password={password} />
          </>
        )}
      </div>
    </div>
  );
};
export default Edit;
