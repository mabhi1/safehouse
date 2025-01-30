"use client";

import { deleteCard } from "@/actions/cards";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { DeleteButton } from "@/components/ui/delete-button";
import MarkedText from "@/components/ui/marked-text";
import { decryptAES, deriveKey } from "@/lib/crypto";
import { CardType } from "@/lib/db-types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const styles = {
  credit: "bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800",
  debit: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
};

export default function CardsCard({
  card,
  uid,
  searchTerm = "",
  salt,
  hash,
}: {
  card: CardType;
  uid: string;
  searchTerm?: string;
  salt: string;
  hash: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedDetails, setDecryptedDetails] = useState(card);
  const { masterPassword } = useMasterPassword();

  useEffect(() => {
    async function decryptData() {
      const key = await deriveKey(masterPassword, salt);
      const decryptedData = {
        ...card,
        number: decryptAES(key, JSON.parse(card.number)).toString(),
        cvv: decryptAES(key, JSON.parse(card.cvv)).toString(),
      };
      setDecryptedDetails(decryptedData);
    }
    if (masterPassword) decryptData();
  }, [masterPassword, card, salt]);

  const getDetail = (data: any) => {
    const parsed = JSON.parse(data);
    if (typeof parsed === "number") return parsed;
    return parsed["ciphertext"] + parsed["authTag"] + parsed["iv"];
  };

  return (
    <li
      key={card.id}
      className={cn(
        "flex flex-col aspect-video p-4 text-slate-50 gap-2 justify-between rounded select-none shadow transition-shadow duration-300 hover:shadow-lg",
        styles[card.type]
      )}
    >
      <div className="text-lg uppercase font-light truncate">
        <>{<MarkedText searchTerm={searchTerm} text={card.bank} />}</>{" "}
        <>{<MarkedText searchTerm={searchTerm} text={card.type} />}</> <>Card</>
      </div>
      <div
        className="flex flex-col gap-1"
        onClick={() => {
          setIsVisible(!isVisible);
        }}
      >
        <div className={cn("break-words", isVisible ? "break-words" : "truncate")}>
          {isVisible ? getDetail(decryptedDetails.number) : getDetail(card.number)}
        </div>
        <div className="flex justify-between gap-2">
          <div>{card.expiry}</div>
          <div className={isVisible ? "break-words" : "truncate"}>
            {isVisible ? getDetail(decryptedDetails.cvv) : getDetail(card.cvv)}
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
    </li>
  );
}
