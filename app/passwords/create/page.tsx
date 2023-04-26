import Button from "@/components/ui/Button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import NewPassword from "@/components/passwords/NewPassword";

type Props = {};
const CreatePassword = (props: Props) => {
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center md:items-start">
      <Link href={"/passwords"} className="flex gap-1 items-center w-full">
        <IoArrowBack className="text-cyan-900" />
        <Button variant={"link"}>Back to Passwords</Button>
      </Link>
      <div className="ml-10 flex flex-col gap-3 md:gap-5">
        <div>Create a Password</div>
        <NewPassword />
      </div>
    </div>
  );
};
export default CreatePassword;
