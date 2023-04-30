import Button from "@/components/ui/Button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import NewCard from "@/components/bank/NewCard";

type Props = {};
const createCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center md:items-start">
      <Link href={"/cards"} className="flex gap-1 items-center w-full">
        <IoArrowBack className="text-cyan-900" />
        <Button variant={"link"}>Back to Cards</Button>
      </Link>
      <div className="justify-center md:justify-start md:ml-10 flex flex-col gap-3 md:gap-5">
        <div>Add a Card</div>
        <NewCard />
      </div>
    </div>
  );
};
export default createCard;
