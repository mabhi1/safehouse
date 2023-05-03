"use client";
import { useState } from "react";
import { PasswordType } from "@/lib/types/dbTypes";
import Button from "../ui/Button";
import { dateFormatter } from "@/utils/dateFormatter";
import { decrypt } from "@/utils/encryption";
import MarkedText from "../ui/MarkedText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { showToast } from "@/utils/handleToast";
import Spinner from "../ui/Spinner";
import { openConfirmBox } from "@/utils/handleModal";

type Props = {
  password: PasswordType;
  searchTerm: string;
  setPasswords: React.Dispatch<React.SetStateAction<PasswordType[]>>;
};
const IndividualPassword = ({ password, searchTerm, setPasswords }: Props) => {
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();
  const passwordsMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/passwords/?id=${password.id}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["passwords"]);
      if (passwordsMutation.isError) showToast("error", "Error deleting password");
      else {
        setPasswords((passwords) => passwords.filter((password) => password.id !== data?.data?.data?.id));
        showToast("success", "Password deleted successfully");
      }
    },
  });

  const handleDelete = async () => {
    passwordsMutation.mutate();
  };

  if (!password) return <></>;

  if (passwordsMutation.isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner size="md" />
      </div>
    );

  return (
    <div className="flex flex-col justify-between shadow transition-shadow duration-300 hover:shadow-lg border rounded p-2 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="break-words">
          <MarkedText text={password.site} searchTerm={searchTerm} />
        </div>
        <div className="break-words">
          <MarkedText text={password.username} searchTerm={searchTerm} />
        </div>
        <div className="break-words">{visible ? decrypt(password.password) : "********"}</div>
      </div>
      <div>
        <div className="flex gap-4 justify-end my-2">
          <Button variant="link" onClick={() => setVisible((visible) => !visible)}>
            {visible ? "Hide" : "Show"}
          </Button>
          <Link href={`/passwords/${password.id}`}>
            <Button variant="link">Edit</Button>
          </Link>
          <Button variant="link" onClick={() => openConfirmBox(handleDelete)}>
            Delete
          </Button>
        </div>
        <div className="text-slate-500 italic text-xs border-t border-slate-500 pt-1">Updated : {dateFormatter(password.updatedAt)}</div>
      </div>
    </div>
  );
};
export default IndividualPassword;
