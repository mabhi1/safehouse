"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { decryptAES, deriveKey } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";

export default function PasswordText({ password, salt }: { password: string; salt: string; hash: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState(password);
  const { masterPassword } = useMasterPassword();

  useEffect(() => {
    async function findDecryptedPassword() {
      const key = await deriveKey(masterPassword, salt);
      const newPassword = decryptAES(key, JSON.parse(password)).toString();
      setDecryptedPassword(newPassword);
    }
    if (masterPassword) findDecryptedPassword();
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
    <div
      className={cn("cursor-pointer w-full", isVisible ? "break-words" : "truncate")}
      onClick={() => setIsVisible(!isVisible)}
      data-testid="togglePassword"
    >
      {getPassword(isVisible ? decryptedPassword : password)}
    </div>
  );
}
