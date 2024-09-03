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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { decrypt, encrypt } from "@/actions/encryption";

type CreatePasswordFormValues = {
  site: string;
  username: string;
  password: string;
};

export const EditPasswordForm = ({ password, uid }: { password: PasswordType; uid: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const initialFormValues: CreatePasswordFormValues = {
    site: password.site,
    username: password.username,
    password: password.password,
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) =>
      editPassword(password.id, values.site.trim(), values.username.trim(), values.password.trim(), uid),
    successRedirectUrl: "/passwords",
  });

  const toggleVisibility = async () => {
    showPassword
      ? handleInputChange({ target: { id: "password", value: await encrypt(formValues.password) } })
      : handleInputChange({ target: { id: "password", value: await decrypt(formValues.password) } });
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
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
            <Input
              id="site"
              type="text"
              autoFocus={true}
              placeholder="Enter Site"
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
              type="text"
              placeholder="Enter Username"
              value={formValues.username}
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formValues.password}
                onChange={handleInputChange}
              />
              {showPassword ? (
                <UnlockIcon
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={toggleVisibility}
                />
              ) : (
                <LockIcon
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={toggleVisibility}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isPending}>
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
