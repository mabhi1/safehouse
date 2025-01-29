"use client";

import { deleteCard } from "@/actions/cards";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { DeleteButton } from "@/components/ui/delete-button";
import MarkedText from "@/components/ui/marked-text";
import { decryptAES, deriveKey, encryptAES } from "@/lib/crypto";
import { CardType } from "@/lib/db-types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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
  const [encryptedDetails, setEncryptedDetails] = useState(card);
  const [isPending, startTransition] = useTransition();
  const { getMasterPassword } = useMasterPassword();

  const toggleVisibility = (master: string) => {
    startTransition(async () => {
      const key = await deriveKey(master, salt);
      const newDetails = isVisible
        ? {
            ...encryptedDetails,
            number: JSON.stringify(encryptAES(key, Buffer.from(encryptedDetails.number))),
            cvv: JSON.stringify(encryptAES(key, Buffer.from(encryptedDetails.cvv))),
          }
        : {
            ...encryptedDetails,
            number: decryptAES(key, JSON.parse(encryptedDetails.number)).toString(),
            cvv: decryptAES(key, JSON.parse(encryptedDetails.cvv)).toString(),
          };
      setEncryptedDetails(newDetails);
      setIsVisible(!isVisible);
    });
  };

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
        styles[encryptedDetails.type]
      )}
    >
      <div className="text-lg uppercase font-light truncate">
        <>{<MarkedText searchTerm={searchTerm} text={encryptedDetails.bank} />}</>{" "}
        <>{<MarkedText searchTerm={searchTerm} text={encryptedDetails.type} />}</> <>Card</>
      </div>
      <div
        className="flex flex-col gap-1"
        onClick={async () => {
          try {
            const master = (await getMasterPassword(salt, hash)) as string;
            toggleVisibility(master);
          } catch (error) {
            toast.error("Wrong master password");
          }
        }}
      >
        <div className={cn("break-words", isVisible ? "break-words" : "truncate")}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 mb-1 animate-spin" /> : getDetail(encryptedDetails.number)}
        </div>
        <div className="flex justify-between gap-2">
          <div>{encryptedDetails.expiry}</div>
          <div className={isVisible ? "break-words" : "truncate"}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : getDetail(encryptedDetails.cvv)}
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
