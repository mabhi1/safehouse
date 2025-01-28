"use client";

import { FormEvent, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { deriveKey, encryptAES, generateHash, generateRecoveryKey, generateSalt } from "@/lib/crypto";
import { createEncryption } from "@/actions/encryption";
import { useAuth } from "@clerk/nextjs";
import { Copy } from "lucide-react";

export default function EncryptionEnrollment() {
  const [masterPassword, setMasterPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [recoveryKey, setRecoveryKey] = useState("");
  const { userId } = useAuth();
  if (!userId) return null;

  const handleEnrollment = async (e: FormEvent) => {
    e.preventDefault();
    if (masterPassword !== verifyPassword) return toast.error("Passwords do not match");
    const salt = generateSalt();

    // 2. Derive the DEK from master password
    const derivedDEK = await deriveKey(masterPassword, salt);

    // 3. Hash the DEK for password verification
    const dekHash = generateHash(derivedDEK);

    // 4. Generate a Recovery Key
    const recoveryKey = generateRecoveryKey();

    // 5. Encrypt the DEK using the Recovery Key
    const recoveryKeyBuffer = Buffer.from(recoveryKey, "hex");
    const encryptedDEK = encryptAES(recoveryKeyBuffer, derivedDEK);

    startTransition(async () => {
      const res = await createEncryption(userId, salt, dekHash, JSON.stringify(encryptedDEK));
      if (res.error || !res.data) toast.error("Error creating your hash. Please try again later.");
      else {
        setRecoveryKey(recoveryKey);
        setSubmitted(true);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="text-xl md:text-2xl w-full">Encryption Enrollment</div>
      <div>
        You need to complete encryption enrollment to store your sensitive data. A master password is needed and this
        will be used everytime to encrypt and decrypt your data. Your master password will not be stored in the database
        and used only to store a hash for encryption, decryption and to recover your data in case you forget your master
        password. To know the encryption and decryption technique in detail click here.
      </div>
      {submitted ? (
        <div className="space-y-5">
          <div>
            Your hash has been saved successfully and a recovery key has been generated. Please copy the recovery key
            generated and store it in a secure place. This recovery key should not be shared with anyone will be used to
            recover your data in case you forget your master password.
          </div>
          <div className="space-y-2">
            <div>Recovery Key</div>
            <div className="bg-muted text-muted-foreground w-full max-w-xl p-2 rounded flex justify-between items-center">
              <span>{recoveryKey}</span>
              <Copy
                className="w-4 aspect-square cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(recoveryKey);
                  toast.success("Recovery key copied");
                }}
              />
            </div>
          </div>
          <Button variant="secondary" asChild>
            <a href="/">Go home</a>
          </Button>
        </div>
      ) : (
        <form className="space-y-5 w-full max-w-xl" onSubmit={handleEnrollment}>
          <div className="space-y-1">
            <Label htmlFor="masterPassword">Master Password</Label>
            <Input
              autoFocus
              id="masterPassword"
              type="password"
              placeholder="Enter master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="verifyPassword">Re-enter Master Password</Label>
            <Input
              id="verifyPassword"
              type="password"
              placeholder="Re-enter master password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!masterPassword.length || isPending}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
