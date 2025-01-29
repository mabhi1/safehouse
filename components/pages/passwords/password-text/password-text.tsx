"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { decryptAES, deriveKey, encryptAES } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { toast } from "sonner";

export default function PasswordText({ password, salt, hash }: { password: string; salt: string; hash: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [encryptedPassword, setEncryptedPassword] = useState(password);
  const [isPending, startTransition] = useTransition();
  const { getMasterPassword } = useMasterPassword();

  const toggleVisibility = (master: string) => {
    startTransition(async () => {
      const key = await deriveKey(master, salt);
      const newPassword = isVisible
        ? JSON.stringify(encryptAES(key, Buffer.from(encryptedPassword)))
        : decryptAES(key, JSON.parse(encryptedPassword)).toString();
      setEncryptedPassword(newPassword);
      setIsVisible(!isVisible);
    });
  };

  const getPassword = (pass: any) => {
    try {
      const parsed = JSON.parse(pass);
      return parsed["ciphertext"] + parsed["authTag"] + parsed["iv"];
    } catch (error) {
      return pass;
    }
  };

  return (
    <div
      className={cn("cursor-pointer w-full", isVisible ? "break-words" : "truncate")}
      onClick={async () => {
        try {
          const master = (await getMasterPassword(salt, hash)) as string;
          toggleVisibility(master);
        } catch (error) {
          toast.error("Wrong master password");
        }
      }}
      data-testid="togglePassword"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : getPassword(encryptedPassword)}
    </div>
  );
}
