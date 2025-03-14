"use client";

import { addPassword } from "@/actions/passwords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleSlash, LockIcon, Plus, Save, UnlockIcon } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
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

export const CreatePasswordForm = ({ uid }: { uid: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { masterPassword, salt, openPasswordDialog } = useMasterPassword();
  const [showPassword, setShowPassword] = useState(false);
  const initialFormValues: CreatePasswordFormValues = {
    site: "",
    username: "",
    password: "",
  };

  useEffect(() => {
    if (!masterPassword || !masterPassword.length) openPasswordDialog();
  }, [masterPassword]);

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      const key = await deriveKey(masterPassword, salt);
      return addPassword(
        values.site.trim(),
        values.username.trim(),
        JSON.stringify(encryptAES(key, Buffer.from(values.password.trim()))),
        uid
      );
    },
    successRedirectUrl: "/passwords",
    onSuccess: () => setOpenDialog(false),
    validations: {
      site: (value) => {
        try {
          new URL(`https://${value}`);
          return true;
        } catch {
          return false;
        }
      },
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button data-testid="addPasswordButton" mobileVariant ICON={Plus}>
          Add Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Password</DialogTitle>
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
                autoFocus={true}
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
                required
                onChange={handleInputChange}
                className="pr-8"
              />
              {showPassword ? (
                <UnlockIcon
                  data-testid="passwordUnlockIcon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <LockIcon
                  data-testid="passwordLockIcon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={() => setShowPassword(true)}
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
