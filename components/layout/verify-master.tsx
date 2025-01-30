"use client";

import { useEffect } from "react";
import { useMasterPassword } from "../providers/master-password-provider";
import { useRouter } from "next/navigation";

function VerifyMasterPassword({ salt, hash }: { salt: string; hash: string }) {
  const { assignMasterPassword } = useMasterPassword();
  const router = useRouter();

  useEffect(() => {
    async function verifyMaster() {
      try {
        await assignMasterPassword(salt, hash);
      } catch (error) {
        router.back();
      }
    }
    verifyMaster();
  }, [hash, router, salt]);
  return <></>;
}
export default VerifyMasterPassword;
