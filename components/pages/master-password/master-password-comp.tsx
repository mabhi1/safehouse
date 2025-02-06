"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { decryptAES, deriveKey, encryptAES, generateHash, generateRecoveryKey, generateSalt } from "@/lib/crypto";
import { createEncryption, updateEncryption } from "@/actions/encryption";
import { CheckCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EncryptionDataType, PasswordType } from "@/lib/db-types";
import Spinner from "@/components/layout/spinner";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterPassword } from "@/components/providers/master-password-provider";

export default function MasterPasswordComp({ data, userId }: { data: EncryptionDataType | null; userId: string }) {
  const [masterPassword, setMasterPassword] = useState("");
  const [oldMasterPassword, setOldMasterPassword] = useState("");
  const [reset, setReset] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verificationType, setVerificationType] = useState("old-master-password");
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
    if (verificationType === "old-master-password" && oldMasterPassword.localeCompare(masterPassword) === 0) {
      toast.info("Passwords should be different");
      return;
    }
    setResetStep("Generating hash for the new key");
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const recoveryKeyBuffer = Buffer.from(recoveryKey, "hex");
        const DEK =
          verificationType === "old-master-password"
            ? await deriveKey(oldMasterPassword, data.salt)
            : decryptAES(recoveryKeyBuffer, JSON.parse(data.recovery));
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

        // Generating new recovery key
        setResetStep("Generating new recovery key and storing its hash");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dekHash = generateHash(derivedDEK);
        const newRecoveryKey = generateRecoveryKey();
        const newRecoveryKeyBuffer = Buffer.from(newRecoveryKey, "hex");
        const encryptedDEK = encryptAES(newRecoveryKeyBuffer, derivedDEK);
        await updateEncryption(userId, salt, dekHash, JSON.stringify(encryptedDEK));

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

        setResetStep("Master password reset complete");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        saveMasterPassword(masterPassword);
        sessionStorage.setItem("safehouse-recovery-key", newRecoveryKey);
        router.push(`/master-password/success`);
      } catch (error: any) {
        if (error.message.localeCompare("Unsupported state or unable to authenticate data") === 0)
          toast.error(
            verificationType === "old-master-password" ? "Incorrect old master password" : "Incorrect recovery key"
          );
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
      const res = await createEncryption(userId, salt, dekHash, JSON.stringify(encryptedDEK));
      if (res.error || !res.data) toast.error(`Error creating your hash. ${res.error.message}.`);
      else {
        saveMasterPassword(masterPassword);
        sessionStorage.setItem("safehouse-recovery-key", recoveryKey);
        router.push(`/master-password/success`);
      }
    });
  };

  return (
    <div className="space-y-5">
      {data ? (
        <>
          <div className="flex flex-col-reverse md:flex-row gap-5 items-center md:items-start">
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
              {isPending ? (
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
                      <Label htmlFor="masterPassword">New Master Password</Label>
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
                    <div className="space-y-1">
                      <Label htmlFor="verification-type">Verification Type</Label>
                      <Select
                        defaultValue="old-master-password"
                        value={verificationType}
                        onValueChange={setVerificationType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Verification type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="old-master-password">Old Master Password</SelectItem>
                          <SelectItem value="recovery-key">Recovery Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={verificationType}>
                        {verificationType === "old-master-password" ? "Old Master Password" : "Recovery Key"}
                      </Label>
                      <Input
                        id={verificationType}
                        type={verificationType === "old-master-password" ? "password" : "text"}
                        placeholder={`Enter ${
                          verificationType === "old-master-password" ? "Old Master Password" : "Recovery Key"
                        }`}
                        value={verificationType === "old-master-password" ? oldMasterPassword : recoveryKey}
                        onChange={(e) =>
                          verificationType === "old-master-password"
                            ? setOldMasterPassword(e.target.value)
                            : setRecoveryKey(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-4 justify-end">
                      <Button type="button" variant="secondary" onClick={() => setReset(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !masterPassword.length ||
                          Object.values(isValid).filter((x) => x === false).length > 0 ||
                          isPending ||
                          verificationType === "old-master-password"
                            ? oldMasterPassword.trim().length <= 0
                            : recoveryKey.trim().length <= 0
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
            <Image src="/reset-password.png" alt="Reset Password" width={2084} height={1554} className="w-60 lg:w-96" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col-reverse md:flex-row gap-5 items-center md:items-start">
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
                <div className="flex gap-4 justify-end">
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
            </div>
            <Image
              src="/master-password.png"
              alt="Reset Password"
              width={1024}
              height={1024}
              className="w-60 lg:w-96"
            />
          </div>
        </>
      )}
    </div>
  );
}
