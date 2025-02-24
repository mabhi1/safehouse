"use client";

import { editPassword } from "@/actions/passwords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleSlash, LockIcon, Save, UnlockIcon } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { deriveKey, encryptAES } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";

type CreatePasswordFormValues = {
  site: string;
  username: string;
  password: string;
};

export const EditPasswordForm = ({ password, uid }: { password: PasswordType; uid: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { masterPassword, salt, openPasswordDialog } = useMasterPassword();

  useEffect(() => {
    if (!masterPassword || !masterPassword.length) openPasswordDialog();
  }, [masterPassword]);

  const initialFormValues: CreatePasswordFormValues = {
    site: password.site,
    username: password.username,
    password: "",
  };

  const onSubmit = async (values: CreatePasswordFormValues) => {
    const key = await deriveKey(masterPassword, salt);
    const encryptedPassword = JSON.stringify(encryptAES(key, Buffer.from(values.password.trim())));
    return editPassword(password.id, values.site.trim(), values.username.trim(), encryptedPassword, uid);
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: onSubmit,
    onSuccess: () => setOpenDialog(false),
    validations: {
      site: (value) => {
        try {
          new URL(`https://${value}`);
          return true;
        } catch (error) {
          // toast.error("Invalid site entered");
          return false;
        }
      },
    },
  });

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost" data-testid="editPasswordButton">
          Edit
        </Button>
      </DialogTrigger>
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
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground text-sm">https://</div>
              <Input
                id="site"
                data-testid="siteInput"
                type="text"
                placeholder="Enter Site"
                required
                value={formValues.site}
                onChange={handleInputChange}
                className="pl-[53px]"
              />
            </div>
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
                autoFocus
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
              <Button variant="secondary" ICON={CircleSlash}>
                Cancel
              </Button>
            </DialogClose>
            <Button loading={isPending} disabled={!isValid} data-testid="passwordSubmitButton" ICON={Save}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
