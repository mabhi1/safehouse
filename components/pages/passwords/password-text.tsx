"use client";

import { useState, useTransition } from "react";
import { decrypt, encrypt } from "@/actions/encryption";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function PasswordText({ password }: { password: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [encryptedPassword, setEncryptedPassword] = useState(password);
  const [isPending, startTransition] = useTransition();

  const toggleVisibility = () => {
    startTransition(async () => {
      const newPassword = isVisible ? await encrypt(encryptedPassword) : await decrypt(encryptedPassword);
      setEncryptedPassword(newPassword);
      setIsVisible(!isVisible);
    });
  };

  return (
    <div className={cn("cursor-pointer w-full", isVisible ? "break-words" : "truncate")} onClick={toggleVisibility}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : encryptedPassword}
    </div>
  );
}
