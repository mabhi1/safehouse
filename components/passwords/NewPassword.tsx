"use client";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../auth/AuthProvider";
import { showToast } from "@/utils/handleToast";
import { encrypt } from "@/utils/encryption";

type Props = {};
const NewPassword = (props: Props) => {
  const currentUser = useAuth()!;
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const passwordMutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/passwords", {
        site,
        username,
        password: encrypt(password),
        uid: currentUser.uid,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["passwords"]);
      setSite("");
      setUsername("");
      setPassword("");
      if (passwordMutation.isError) showToast("error", "Error creating password");
      else showToast("success", "Password created successfully");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (site.trim() === "" || username.trim() === "" || password.trim() === "") {
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
        <Input wide={"lg"} id="password" type="text" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
export default NewPassword;
