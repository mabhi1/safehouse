"use client";

import { EditPassword } from "@/actions/passwords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { PasswordType } from "@/lib/db-types";

type CreatePasswordFormValues = {
  site: string;
  username: string;
  password: string;
};

export const EditPasswordForm = ({ password, uid }: { password: PasswordType; uid: string }) => {
  const initialFormValues: CreatePasswordFormValues = {
    site: password.site,
    username: password.username,
    password: password.password,
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreatePasswordFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) =>
      EditPassword(password.id, values.site.trim(), values.username.trim(), values.password.trim(), uid),
    successRedirectUrl: "/passwords",
  });

  return (
    <form id="form" className="flex flex-col gap-5 pl-5 w-96" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="site">Site</label>
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
        <label htmlFor="username">Username</label>
        <Input
          id="username"
          type="text"
          placeholder="Enter Username"
          value={formValues.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="text"
          placeholder="Enter Password"
          value={formValues.password}
          onChange={handleInputChange}
        />
      </div>
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
    </form>
  );
};
