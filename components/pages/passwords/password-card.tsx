import MarkedText from "@/components/ui/marked-text";
import { PasswordType } from "@/lib/db-types";
import { deletePassword } from "@/actions/passwords";
import { DeleteButton } from "@/components/ui/delete-button";
import PasswordText from "./password-text";
import { EditPasswordForm } from "./edit-password-form";
import { dateFormatter } from "@/lib/utils";
import Favicon from "./favicon";

interface PasswordCardProps {
  password: PasswordType;
  searchTerm?: string;
  uid: string;
}

export default function PasswordCard({ password, searchTerm = "", uid }: PasswordCardProps) {
  const { id, site, username, updatedAt } = password;

  let url;
  try {
    url = new URL(`https://${site}`);
  } catch {
    url = { hostname: site };
  }
  const domain = url.hostname.split(".");
  const title = domain[0] === "www" ? domain[1] : domain[0];

  return (
    <li
      data-testid={`password${password.id}`}
      key={password.id}
      className="flex flex-col justify-between shadow transition-shadow duration-300 hover:shadow-lg border rounded p-5 overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Favicon websiteUrl={site} />
          <div className="break-words text-lg capitalize">
            <MarkedText text={title} searchTerm={searchTerm} />
          </div>
        </div>
        <div className="break-words">
          <MarkedText text={username} searchTerm={searchTerm} />
        </div>
        <PasswordText password={password.password} />
      </div>
      <div className="mt-5">
        <div className="flex justify-end my-1">
          <EditPasswordForm uid={uid} password={password} />
          <DeleteButton
            id={id}
            uid={uid}
            deleteAction={deletePassword}
            dialogDescription="This action will permanently remove the password from our servers."
            hideIcon
          />
        </div>
        <div className="text-slate-500 text-xs border-t border-slate-500 pt-2">
          Updated : {dateFormatter(updatedAt)}
        </div>
      </div>
    </li>
  );
}
