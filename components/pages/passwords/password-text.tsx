"use client";
import { useState, useTransition } from "react";
import { decrypt, encrypt } from "@/actions/encryption";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function PasswordText({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  const [encryption, setEncryption] = useState(password);
  const [isPending, startTransition] = useTransition();

  const handleEncrypt = () => {
    startTransition(async () => {
      setEncryption(await encrypt(encryption));
      setVisible(false);
    });
  };

  const handleDecrypt = () => {
    startTransition(async () => {
      setEncryption(await decrypt(encryption));
      setVisible(true);
    });
  };

  return (
    <div
      className={cn("cursor-pointer w-full", visible ? "break-words" : "truncate")}
      onClick={() => {
        visible ? handleEncrypt() : handleDecrypt();
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : encryption}
    </div>
  );
}
