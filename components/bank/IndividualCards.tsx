import { CardType } from "@/lib/types/dbTypes";
import { decrypt } from "@/utils/encryption";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import MarkedText from "../ui/MarkedText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/utils/handleToast";
import Spinner from "../ui/Spinner";
import { openConfirmBox } from "@/utils/handleModal";

type Props = {
  card: CardType;
  searchTerm: string;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
};
const styles = {
  credit: "bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800",
  debit: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
};
const IndividualCards = ({ card, searchTerm, setCards }: Props) => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const cardMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/cards/?id=${card.id}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cards"]);
      if (cardMutation.isError) showToast("error", "Error deleting Card");
      else {
        setCards((cardList) => cardList.filter((card) => card.id !== data?.data?.data?.id));
        showToast("success", "Card deleted successfully");
      }
    },
  });

  const handleDelete = async () => {
    cardMutation.mutate();
  };

  if (!card) return <></>;

  if (cardMutation.isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner size="md" />
      </div>
    );

  return (
    <div className={`flex flex-col aspect-video p-2 md:p-4 text-slate-50 gap-2 justify-between rounded select-none ${styles[card.type]}`}>
      <div className="flex flex-nowrap gap-1">
        <span>{<MarkedText searchTerm={searchTerm} text={card.bank} />}</span>
        <span>{<MarkedText searchTerm={searchTerm} text={card.type} />}</span>
      </div>
      {show ? (
        <div className="flex flex-col">
          <div className="break-words">{decrypt(card.number)}</div>
          <div className="flex justify-between">
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
        <MdDelete className="cursor-pointer text-xl" onClick={() => openConfirmBox(handleDelete)} />
      </div>
    </div>
  );
};
export default IndividualCards;
