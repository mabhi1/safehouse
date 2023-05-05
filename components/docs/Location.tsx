"use client";
import { getCurrentFolder } from "@/lib/docs/getDocsData";
import { useEffect, useState } from "react";
import useAuth from "../auth/AuthProvider";
import Link from "next/link";
import { FolderType } from "@/lib/types/dbTypes";

type Props = {
  folderId: string;
};
const Location = ({ folderId }: Props) => {
  const [current, setCurrent] = useState<FolderType>();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    async function getCurrentPath() {
      if (folderId === "root") return;
      if (!auth?.currentUser) return;
      setLoading(true);
      const currentFolder = (await getCurrentFolder({ folderId, currentUser: auth.currentUser.uid })) as FolderType;
      setCurrent(currentFolder);
      setLoading(false);
    }
    getCurrentPath();
  }, [folderId, auth?.currentUser]);

  if (loading) return <div className="italic bg-slate-200 p-1 rounded">root</div>;
  return (
    <div className="italic bg-slate-200 p-1 rounded">
      {folderId === "root" ? (
        "root"
      ) : (
        <div className="flex">
          {current?.path.map((each: { id: string; name: string }) => {
            return (
              <div key={each.id} className="flex">
                <span>
                  <Link href={each.id === "root" ? "/docs" : `/docs/${each.id}`}>{each.name}</Link>
                </span>
                <span>{" / "}</span>
              </div>
            );
          })}
          <span>{current?.name}</span>
        </div>
      )}
    </div>
  );
};
export default Location;
