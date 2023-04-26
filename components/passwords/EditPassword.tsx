"use client";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/utils/handleToast";
import { PasswordType } from "@/lib/types/dbTypes";
import { decrypt, encrypt } from "@/utils/encryption";

type Props = {
  password: PasswordType;
};
const EditPassword = ({ password }: Props) => {
  const [site, setSite] = useState(password.site);
  const [username, setUsername] = useState(password.username);
  const [newPassword, setNewPassword] = useState(decrypt(password.password));
  const queryClient = useQueryClient();

  const passwordMutation = useMutation({
    mutationFn: () => {
      return axios.put("/api/passwords", {
        id: password.id,
        site,
        username,
        password: encrypt(newPassword),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["passwords"]);
      setSite(data.data.data.site);
      setUsername(data.data.data.username);
      setNewPassword(decrypt(data.data.data.password));
      if (passwordMutation.isError) showToast("error", "Error editing password");
      else showToast("success", "Password edited successfully");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (site.trim() === "" || username.trim() === "" || newPassword.trim() === "") {
      showToast("error", "Site, Username or Password missing!");
      return;
    }
    passwordMutation.mutate();
  };

  return (
    <form id="form" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="site">Site</label>
        <Input wide={"lg"} id="site" type="text" autoFocus={true} placeholder="Enter Site" value={site} onChange={(e) => setSite(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username">Username</label>
        <Input wide={"lg"} id="username" type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <Input
          wide={"lg"}
          id="password"
          type="text"
          placeholder="Enter Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      {passwordMutation.isLoading ? (
        <Button size={"lg"} variant={"disabled"} disabled>
          Please Wait...
        </Button>
      ) : (
        <Button size={"lg"}>Save</Button>
      )}
    </form>
  );
};
export default EditPassword;
