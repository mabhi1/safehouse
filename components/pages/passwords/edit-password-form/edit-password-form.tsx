"use client";

import { editPassword } from "@/actions/passwords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockIcon, UnlockIcon } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { PasswordType } from "@/lib/db-types";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { decryptAES, deriveKey, encryptAES } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";

type CreatePasswordFormValues = {
  site: string;
  username: string;
  password: string;
};

export const EditPasswordForm = ({
  password,
  uid,
  salt,
  hash,
}: {
  password: PasswordType;
  uid: string;
  salt: string;
  hash: string;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { getMasterPassword } = useMasterPassword();
  const initialFormValues: CreatePasswordFormValues = {
    site: password.site,
    username: password.username,
    password: password.password,
  };

  const onSubmit = async (values: CreatePasswordFormValues) => {
    if (!showPassword) toggleVisibility();
    const key = await deriveKey((await getMasterPassword(salt, hash)) as string, salt);
    const encryptedPassword = JSON.stringify(encryptAES(key, Buffer.from(values.password.trim())));
    return editPassword(password.id, values.site.trim(), values.username.trim(), encryptedPassword, uid);
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: onSubmit,
    onSuccess: () => setOpenDialog(false),
  });

  const toggleVisibility = async () => {
    const key = await deriveKey((await getMasterPassword(salt, hash)) as string, salt);
    showPassword
      ? handleInputChange({
          target: { id: "password", value: JSON.stringify(encryptAES(key, Buffer.from(formValues.password))) },
        })
      : handleInputChange({
          target: { id: "password", value: decryptAES(key, JSON.parse(formValues.password)).toString() },
        });
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Button
        variant="ghost"
        data-testid="editPasswordButton"
        onClick={async () => {
          await getMasterPassword(salt, hash);
          setOpenDialog(true);
        }}
      >
        Edit
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
          <DialogDescription>Enter password details and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="site">
              Site<span className="text-destructive">*</span>
            </Label>
            <Input
              id="site"
              data-testid="siteInput"
              type="text"
              autoFocus={true}
              placeholder="Enter Site"
              required
              value={formValues.site}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">
              Username<span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              data-testid="usernameInput"
              type="text"
              placeholder="Enter Username"
              value={formValues.username}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">
              Password<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                data-testid="passwordInput"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formValues.password}
                required
                onChange={handleInputChange}
                className="pr-10"
              />
              {showPassword ? (
                <UnlockIcon
                  data-testid="passwordUnlockIcon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={toggleVisibility}
                />
              ) : (
                <LockIcon
                  data-testid="passwordLockIcon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={toggleVisibility}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} data-testid="passwordSubmitButton">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
