"use client";

import { deleteCard } from "@/actions/cards";
import { decrypt, encrypt } from "@/actions/encryption";
import { DeleteButton } from "@/components/ui/delete-button";
import MarkedText from "@/components/ui/marked-text";
import { CardType } from "@/lib/db-types";
import { cn } from "@/lib/utils";
import { EyeIcon, Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const styles = {
  credit: "bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800",
  debit: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
};

export default function CardsCard({
  card,
  uid,
  searchTerm = "",
}: {
  card: CardType;
  uid: string;
  searchTerm?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [encryptedDetails, setEncryptedDetails] = useState(card);
  const [isPending, startTransition] = useTransition();

  const toggleVisibility = () => {
    startTransition(async () => {
      const newDetails = isVisible
        ? {
            ...encryptedDetails,
            number: await encrypt(encryptedDetails.number),
            cvv: await encrypt(encryptedDetails.cvv),
          }
        : {
            ...encryptedDetails,
            number: await decrypt(encryptedDetails.number),
            cvv: await decrypt(encryptedDetails.cvv),
          };
      setEncryptedDetails(newDetails);
      setIsVisible(!isVisible);
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col aspect-video p-2 md:p-4 text-slate-50 gap-2 justify-between rounded select-none shadow transition-shadow duration-300 hover:shadow-lg",
        styles[encryptedDetails.type]
      )}
    >
      <div className="flex flex-nowrap gap-1 text-lg uppercase font-light">
        <span>{<MarkedText searchTerm={searchTerm} text={encryptedDetails.bank} />}</span>
        <span>{<MarkedText searchTerm={searchTerm} text={encryptedDetails.type} />}</span>
        <span>Card</span>
      </div>
      <div className="flex flex-col gap-1" onClick={toggleVisibility}>
        <div className={cn("break-words", isVisible ? "break-words" : "truncate")}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 mb-1 animate-spin" /> : encryptedDetails.number}
        </div>
        <div className="flex justify-between">
          <div className={isVisible ? "break-words" : "truncate"}>{encryptedDetails.expiry}</div>
          <div className={isVisible ? "break-words" : "truncate"}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : encryptedDetails.cvv}
          </div>
        </div>
      </div>
      <DeleteButton
        id={card.id}
        uid={uid}
        deleteAction={deleteCard}
        dialogDescription="This action will permanently remove the note from our servers."
        className="text-white hover:text-white m-0 p-0 ml-auto h-auto"
        variant="link"
      />
    </div>
  );
}
