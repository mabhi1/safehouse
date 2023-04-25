import { CardType } from "@/lib/types/dbTypes";
import { decrypt } from "@/utils/encryption";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import MarkedText from "../ui/MarkedText";

type Props = {
  card: CardType;
  searchTerm: string;
};
const styles = {
  credit: "bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800",
  debit: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
};
const IndividualCards = ({ card, searchTerm }: Props) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`flex flex-col aspect-video p-2 md:p-4 text-slate-50 gap-2 justify-between rounded select-none ${styles[card.type]}`}>
      <div className="flex flex-nowrap gap-1">
        <span>{<MarkedText searchTerm={searchTerm} text={card.bank} />}</span>
        <span>{<MarkedText searchTerm={searchTerm} text={card.type} />}</span>
      </div>
      {show ? (
        <div className="flex flex-col">
          <div className="">{decrypt(card.number)}</div>
          <div className="flex gap-16">
            <div>{card.expiry}</div>
            <div>{decrypt(card.cvv)}</div>
          </div>
        </div>
      ) : (
        <div className="animate-pulse flex flex-col gap-4 h-10 mt-2">
          <div className="h-2 bg-slate-300 rounded"></div>
          <div className="flex gap-16">
            <div className="h-2 w-32 bg-slate-300 rounded"></div>
            <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        {show ? (
          <AiFillEyeInvisible onClick={() => setShow((show) => !show)} className="cursor-pointer text-xl" />
        ) : (
          <AiFillEye onClick={() => setShow((show) => !show)} className="cursor-pointer text-xl" />
        )}
        <MdDelete className="cursor-pointer text-xl" />
      </div>
    </div>
  );
};
export default IndividualCards;
