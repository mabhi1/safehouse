"use client";

import { decryptAES } from "@/lib/crypto";
import { EncryptionDataType } from "@/lib/db-types";
import { CircleCheckBig, Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

function SuccessComponent({ data }: { data: EncryptionDataType }) {
  const recoveryKey = sessionStorage.getItem("safehouse-recovery-key");
  if (!recoveryKey) throw new Error("Invalid Recovery Key");

  setTimeout(() => {
    sessionStorage.removeItem("safehouse-recovery-key");
  }, 2000);
  const recoveryKeyBuffer = Buffer.from(recoveryKey, "hex");
  decryptAES(recoveryKeyBuffer, JSON.parse(data.recovery));

  return (
    <div className="flex flex-col-reverse md:flex-row gap-5 items-center md:items-start justify-between">
      <div className="flex flex-col gap-5">
        <div className="text-base uppercase flex gap-2">
          <span className="text-green-600">Recovery key generated successfully</span>
          <CircleCheckBig className="w-5 h-5 bg-green-600 rounded-full text-primary-foreground" />
        </div>
        <div>
          Below is your unique recovery key. This key is essential for resetting your master password if you ever forget
          it.
        </div>
        <div className="space-y-2">
          <div>⚠️ Important:</div>
          <ul className="list-disc list-inside">
            <li>This recovery key will not be shown again.</li>
            <li>Store it in a safe and secure place.</li>
            <li>Without this key, you may lose access to your encrypted data.</li>
          </ul>
        </div>
        <div className="text-destructive">🔒 Do not share this key with anyone.</div>
        <div className="space-y-2">
          <div>Your Recovery Key:</div>
          <div className="bg-muted text-muted-foreground p-2 rounded-lg flex justify-between">
            <span className="w-72 lg:w-full overflow-auto no-scrollbar">{recoveryKey}</span>
            <Copy
              className="w-4 aspect-square cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(recoveryKey);
                toast.success("Recovery key copied");
              }}
            />
          </div>
          <div>✅ Save it securely before proceeding.</div>
        </div>
      </div>
      <Image src="/master-success.png" alt="Reset Password" width={200} height={200} className="w-60 lg:w-96" />
    </div>
  );
}
export default SuccessComponent;
