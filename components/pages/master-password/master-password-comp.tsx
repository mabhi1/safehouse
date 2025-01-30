"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { decryptAES, deriveKey, encryptAES, generateHash, generateRecoveryKey, generateSalt } from "@/lib/crypto";
import { createEncryption } from "@/actions/encryption";
import { CheckCheck, Copy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { cn } from "@/lib/utils";
import { CardType, EncryptionDataType, PasswordType } from "@/lib/db-types";
import Spinner from "@/components/layout/spinner";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function MasterPasswordComp({ data, userId }: { data: EncryptionDataType | null; userId: string }) {
  const [masterPassword, setMasterPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reset, setReset] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [resetStep, setResetStep] = useState("");
  const [isPending, startTransition] = useTransition();
  const { saveMasterPassword } = useMasterPassword();
  const [isValid, setIsValid] = useState({
    eightChars: false,
    symbol: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false,
  });
  const [recoveryKey, setRecoveryKey] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleChangePassword = (password: string, type: "master" | "verify") => {
    const newValidData = { ...isValid };
    if (type === "master") {
      newValidData["eightChars"] = password.length >= 8;
      newValidData["symbol"] = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      newValidData["uppercase"] = /[A-Z]/.test(password);
      newValidData["lowercase"] = /[a-z]/.test(password);
      newValidData["number"] = /\d/.test(password);
      newValidData["match"] =
        verifyPassword.trim().length > 0 && password.trim().localeCompare(verifyPassword.trim()) === 0;
    } else {
      newValidData["match"] =
        masterPassword.trim().length > 0 && password.trim().localeCompare(masterPassword.trim()) === 0;
    }
    setIsValid(newValidData);
  };

  useEffect(() => {
    handleChangePassword(masterPassword, "master");
  }, [masterPassword]);

  const validityItem = (title: string, condition: boolean) => {
    return (
      <li className={cn("flex gap-1 items-center", condition ? "text-green-600" : "text-destructive")}>
        {condition ? <CheckCheck className="w-3 h-3" /> : <X className="w-3 h-3" />}
        {title}
      </li>
    );
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setResetStep("Generating hash for the new key");
    startTransition(async () => {
      try {
        const recoveryKeyBuffer = Buffer.from(recoveryKey, "hex");
        const DEK = decryptAES(recoveryKeyBuffer, JSON.parse(data.recovery));
        const salt = generateSalt();
        const derivedDEK = await deriveKey(masterPassword, salt);

        // Fetching Passwords
        setResetStep("Fetching passwords");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const passwordsRes = await fetch(`/api/passwords?uid=${userId}`);
        const passwordsData: PasswordType[] = await passwordsRes.json();

        // Encrypting Passwords
        setResetStep("Encrypting passwords with the new password");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newPasswordsData = passwordsData.map((password) => {
          const decryptedPassword = decryptAES(DEK, JSON.parse(password.password)).toString();
          const encryptedPassword = JSON.stringify(encryptAES(derivedDEK, Buffer.from(decryptedPassword)));
          return { ...password, password: encryptedPassword };
        });

        // Fetching Cards
        setResetStep("Fetching cards");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const cardsRes = await fetch(`/api/cards?uid=${userId}`);
        const cardsData: CardType[] = await cardsRes.json();

        // Encrypting Cards
        setResetStep("Encrypting cards with the new password");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newcardsData = cardsData.map((card) => {
          const decryptedCVV = decryptAES(DEK, JSON.parse(card.cvv)).toString();
          const encryptedCVV = JSON.stringify(encryptAES(derivedDEK, Buffer.from(decryptedCVV)));
          const decryptedNumber = decryptAES(DEK, JSON.parse(card.number)).toString();
          const encryptedNumber = JSON.stringify(encryptAES(derivedDEK, Buffer.from(decryptedNumber)));
          return { ...card, cvv: encryptedCVV, number: encryptedNumber };
        });

        // Generating new recovery key
        setResetStep("Generating new recovery key and storing its hash");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dekHash = generateHash(derivedDEK);
        const newRecoveryKey = generateRecoveryKey();
        const newRecoveryKeyBuffer = Buffer.from(newRecoveryKey, "hex");
        const encryptedDEK = encryptAES(newRecoveryKeyBuffer, derivedDEK);
        await createEncryption(userId, salt, dekHash, JSON.stringify(encryptedDEK), true);

        // Saving encrypted passwords
        setResetStep("Saving encrypted passwords");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch("/api/passwords", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            passwords: newPasswordsData,
            multiple: true,
          }),
        });

        // Saving encrypted cards
        setResetStep("Saving encrypted cards");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        fetch("/api/cards", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            cards: newcardsData,
            multiple: true,
          }),
        });

        setResetStep("Master password reset complete");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRecoveryKey(newRecoveryKey);
        setIsDialogOpen(true);
        setSubmitted(true);
        saveMasterPassword(masterPassword);
      } catch (error: any) {
        console.log(error);
        if (error.message.localeCompare("Unsupported state or unable to authenticate data") === 0)
          toast.error("Invalid recovery key");
        else toast.error(error.message);
      }
    });
  };

  const handleEnrollment = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(masterPassword))
      return toast.error("Invalid Password");
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
      const res = await createEncryption(userId, salt, dekHash, JSON.stringify(encryptedDEK), false);
      if (res.error || !res.data) toast.error(`Error creating your hash. ${res.error.message}.`);
      else {
        setRecoveryKey(recoveryKey);
        setIsDialogOpen(true);
        setSubmitted(true);
        saveMasterPassword(masterPassword);
      }
    });
  };

  return (
    <div className="space-y-5">
      {data ? (
        <>
          <div className="flex gap-5 items-start">
            <div className="space-y-5">
              <div className="text-base uppercase">Reset Master Password</div>
              <div>
                You have successfully created the master password. You can use it to encrypt and decrypt your sensitive
                data. You can submit the form below with your recovery key to reset your master password. If the
                recovery key is correct, all the data will be re-encrypted with the new master password. Don&apos;t
                close the brower window or the tab while the reset process is going on as this might result in data
                loss.
                <Link href="/encryption-strategy" className="text-primary hover:underline underline-offset-2 mx-1">
                  Click here
                </Link>
                to know more about our encryption strategy.
              </div>
              <Separator />
              {submitted ? (
                <div className="space-y-5">
                  <div className="text-green-600">Master password reset successful. Reload page to continue.</div>
                  <Button onClick={() => router.refresh()}>Reload</Button>
                </div>
              ) : isPending ? (
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <Spinner />
                  <div>Don&apos;t close the tab. Exiting will result in permanent data loss</div>
                  <div className="font-medium text-primary">{resetStep}</div>
                </div>
              ) : reset ? (
                <>
                  <div>
                    <div>To ensure a string encryption, password must meet the following requirements:</div>
                    <ul className="p-2 space-y-1">
                      {validityItem("Minimum 8 characters", isValid.eightChars)}
                      {validityItem("Atleast a symbol", isValid.symbol)}
                      {validityItem("Atleast an uppercase letter", isValid.uppercase)}
                      {validityItem("Atleast a lowercase letter", isValid.lowercase)}
                      {validityItem("Atleast a number", isValid.number)}
                      {validityItem("Passwords must match", isValid.match)}
                    </ul>
                  </div>

                  <form className="space-y-5 w-full max-w-xl" onSubmit={handleResetPassword}>
                    <div className="space-y-1">
                      <Label htmlFor="recoveryKey">Recovery Key</Label>
                      <Input
                        autoFocus
                        id="recoveryKey"
                        type="text"
                        placeholder="Enter recovery key"
                        value={recoveryKey}
                        onChange={(e) => setRecoveryKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="masterPassword">New Master Password</Label>
                      <Input
                        id="masterPassword"
                        type="password"
                        placeholder="Enter master password"
                        value={masterPassword}
                        onChange={(e) => {
                          handleChangePassword(e.target.value, "master");
                          setMasterPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="verifyPassword">Re-enter New Master Password</Label>
                      <Input
                        id="verifyPassword"
                        type="password"
                        placeholder="Re-enter master password"
                        value={verifyPassword}
                        onChange={(e) => {
                          handleChangePassword(e.target.value, "verify");
                          setVerifyPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex gap-5">
                      <Button type="button" variant="secondary" onClick={() => setReset(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !masterPassword.length ||
                          Object.values(isValid).filter((x) => x === false).length > 0 ||
                          isPending ||
                          recoveryKey.trim().length <= 0
                        }
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <Button onClick={() => setReset(true)}>Reset master password</Button>
              )}
            </div>
            <Image
              src="/reset-password.png"
              alt="Reset Password"
              width={2084}
              height={1554}
              className="w-96 hidden md:block"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-5 items-start">
            <div className="space-y-5">
              <div className="text-base uppercase">Master Password</div>
              <div>
                You need to complete encryption enrollment to store your sensitive data. A master password is needed and
                this will be used everytime to encrypt and decrypt your data. Your master password will not be stored in
                the database and used only to store a hash for encryption, decryption and to recover your data in case
                you forget your master password.
                <Link href="/encryption-strategy" className="text-primary hover:underline underline-offset-2 mx-1">
                  Click here
                </Link>
                to know more about our encryption strategy.
              </div>
              {submitted ? (
                <div className="space-y-5">
                  <div className="text-green-600">
                    Master password has been created successfully. Reload page to continue.
                  </div>
                  <Button onClick={() => router.refresh()}>Reload</Button>
                </div>
              ) : (
                <>
                  <div>
                    <div>To ensure a string encryption, password must meet the following requirements:</div>
                    <ul className="p-2 space-y-1">
                      {validityItem("Minimum 8 characters", isValid.eightChars)}
                      {validityItem("Atleast a symbol", isValid.symbol)}
                      {validityItem("Atleast an uppercase letter", isValid.uppercase)}
                      {validityItem("Atleast a lowercase letter", isValid.lowercase)}
                      {validityItem("Atleast a number", isValid.number)}
                      {validityItem("Passwords must match", isValid.match)}
                    </ul>
                  </div>
                  <form className="space-y-5 w-full max-w-xl" onSubmit={handleEnrollment}>
                    <div className="space-y-1">
                      <Label htmlFor="masterPassword">Master Password</Label>
                      <Input
                        autoFocus
                        id="masterPassword"
                        type="password"
                        placeholder="Enter master password"
                        value={masterPassword}
                        onChange={(e) => {
                          handleChangePassword(e.target.value, "master");
                          setMasterPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="verifyPassword">Re-enter Master Password</Label>
                      <Input
                        id="verifyPassword"
                        type="password"
                        placeholder="Re-enter master password"
                        value={verifyPassword}
                        onChange={(e) => {
                          handleChangePassword(e.target.value, "verify");
                          setVerifyPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex gap-5">
                      <Button type="button" variant="secondary" onClick={() => router.back()}>
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !masterPassword.length ||
                          Object.values(isValid).filter((x) => x === false).length > 0 ||
                          isPending
                        }
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
            <Image
              src="/master-password.png"
              alt="Reset Password"
              width={1024}
              height={1024}
              className="w-96 hidden md:block"
            />
          </div>
        </>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recovery key</DialogTitle>
            <DialogDescription>Your recovery key has been generated</DialogDescription>
          </DialogHeader>
          <div className="text-sm mt-5">
            Your hash has been saved successfully and a recovery key has been generated. Please copy the recovery key
            generated and store it in a secure place. This recovery key should not be shared with anyone will be used to
            recover your data in case you forget your master password.
          </div>
          <div className="bg-muted text-muted-foreground p-2 rounded flex justify-between items-center mb-5">
            <span className="text-sm w-80 overflow-auto no-scrollbar">{recoveryKey}</span>
            <Copy
              className="w-4 aspect-square cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(recoveryKey);
                toast.success("Recovery key copied");
                setCopied(true);
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} disabled={!copied}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
