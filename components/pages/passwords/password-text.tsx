"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { decryptAES, deriveKey } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function PasswordText({ password }: { password: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState(password);
  const { masterPassword, salt, openPasswordDialog } = useMasterPassword();

  useEffect(() => {
    async function findDecryptedPassword() {
      const key = await deriveKey(masterPassword, salt);
      const newPassword = decryptAES(key, JSON.parse(password)).toString();
      setDecryptedPassword(newPassword);
    }
    if (masterPassword && masterPassword.length > 0) findDecryptedPassword();
    else openPasswordDialog();
  }, [masterPassword, password, salt]);

  const getPassword = (pass: any) => {
    try {
      const parsed = JSON.parse(pass);
      return parsed["ciphertext"] + parsed["authTag"] + parsed["iv"];
    } catch (error) {
      return pass;
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div
        className={cn("cursor-pointer w-full", isVisible ? "break-words" : "truncate")}
        onClick={() => setIsVisible(!isVisible)}
        data-testid="togglePassword"
      >
        {getPassword(isVisible ? decryptedPassword : password)}
      </div>
      <Copy
        className="w-4 aspect-square cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(decryptedPassword);
          toast.success("Password copied!");
        }}
      />
    </div>
  );
}
