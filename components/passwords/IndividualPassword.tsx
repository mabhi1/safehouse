"use client";
import { useState } from "react";
import { PasswordType } from "@/lib/types/dbTypes";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { dateFormatter } from "@/utils/dateFormatter";
import { decryptPassword } from "@/utils/encryption";
import MarkedText from "../ui/MarkedText";

type Props = {
  password: PasswordType;
  searchTerm: string;
};
const IndividualPassword = ({ password, searchTerm }: Props) => {
  const [visible, setVisible] = useState(false);

  if (!password) return <></>;
  return (
    <div className="flex flex-col justify-between shadow transition-shadow duration-300 hover:shadow-lg border rounded p-2 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="break-words">
          <MarkedText text={password.site} searchTerm={searchTerm} />
        </div>
        <div className="break-words">
          <MarkedText text={password.username} searchTerm={searchTerm} />
        </div>
        <div className="break-words">{visible ? decryptPassword(password.password) : "********"}</div>
      </div>
      <div>
        <div className="flex gap-4 justify-end my-2">
          <Button variant="link" onClick={() => setVisible((visible) => !visible)}>
            {visible ? "Hide" : "Show"}
          </Button>
          <Button variant="link">Edit</Button>
          <Button variant="link">Delete</Button>
        </div>
        <div className="text-slate-500 italic text-xs border-t border-slate-500 pt-1">Updated : {dateFormatter(password.updatedAt)}</div>
      </div>
    </div>
  );
};
export default IndividualPassword;
