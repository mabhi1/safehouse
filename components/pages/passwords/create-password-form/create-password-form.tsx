"use client";

import { addPassword } from "@/actions/passwords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockIcon, Plus, UnlockIcon } from "lucide-react";
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
} from "@/components/ui/dialog";
import { useState } from "react";
import { deriveKey, encryptAES } from "@/lib/crypto";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { toast } from "sonner";

type CreatePasswordFormValues = {
  site: string;
  username: string;
  password: string;
};

export const CreatePasswordForm = ({ uid, salt, hash }: { uid: string; salt: string; hash: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { getMasterPassword } = useMasterPassword();
  const [showPassword, setShowPassword] = useState(false);
  const initialFormValues: CreatePasswordFormValues = {
    site: "",
    username: "",
    password: "",
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      setOpenDialog(false);
      const masterPassword = (await getMasterPassword(salt, hash)) as string;
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
  });

  const handleButtonClick = async () => {
    try {
      await getMasterPassword(salt, hash);
      setOpenDialog(true);
    } catch (error) {
      toast.error("Error getting master password");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div>
        <Button className="hidden md:block" data-testid="addPasswordButton" onClick={handleButtonClick}>
          Add Password
        </Button>
        <Button variant="outline" size="icon" className="md:hidden" onClick={handleButtonClick}>
          <Plus className="w-[1.2rem] h-[1.2rem]" />
        </Button>
      </div>
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
