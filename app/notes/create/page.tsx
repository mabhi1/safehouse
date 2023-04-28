import Button from "@/components/ui/Button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import NewNote from "@/components/notes/NewNote";

type Props = {};
const CreateNote = (props: Props) => {
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center md:items-start">
      <Link href={"/notes"} className="flex gap-1 items-center w-full">
        <IoArrowBack className="text-cyan-900" />
        <Button variant={"link"}>Back to Notes</Button>
      </Link>
      <div className="justify-center md:justify-start md:ml-10 flex flex-col gap-3 md:gap-5">
        <div>Create a Note</div>
        <NewNote />
      </div>
    </div>
  );
};
export default CreateNote;
