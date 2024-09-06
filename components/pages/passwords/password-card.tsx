import MarkedText from "@/components/ui/marked-text";
import { PasswordType } from "@/lib/db-types";
import { deletePassword } from "@/actions/passwords";
import { DeleteButton } from "@/components/ui/delete-button";
import PasswordText from "./password-text";
import { EditPasswordForm } from "./edit-password-form";
import { dateFormatter } from "@/lib/utils";

interface PasswordCardProps {
  password: PasswordType;
  searchTerm?: string;
  uid: string;
}

export default function PasswordCard({ password, searchTerm = "", uid }: PasswordCardProps) {
  const { id, site, username, updatedAt } = password;

  return (
    <div className="flex flex-col justify-between shadow transition-shadow duration-300 hover:shadow-lg border rounded p-2 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="break-words">
          <MarkedText text={site} searchTerm={searchTerm} />
        </div>
        <div className="break-words">
          <MarkedText text={username} searchTerm={searchTerm} />
        </div>
        <PasswordText password={password.password} />
      </div>
      <div>
        <div className="flex justify-end my-1">
          <EditPasswordForm uid={uid} password={password} />
          <DeleteButton
            id={id}
            uid={uid}
            deleteAction={deletePassword}
            dialogDescription="This action will permanently remove the password from our servers."
          />
        </div>
        <div className="text-slate-500 text-xs border-t border-slate-500 pt-1">
          Updated : {dateFormatter(updatedAt)}
        </div>
      </div>
    </div>
  );
}
