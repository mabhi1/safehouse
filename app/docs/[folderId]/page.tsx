"use client";
import useAuth from "@/components/auth/AuthProvider";
import Files from "@/components/docs/Files";
import Folders from "@/components/docs/Folders";
import Location from "@/components/docs/Location";
import Button from "@/components/ui/Button";
import { getCurrentFolder } from "@/lib/docs/getDocsData";
import { useState, useEffect } from "react";

type Props = {
  params: { folderId: string };
};
const FolderId = ({ params: { folderId } }: Props) => {
  const currentUser = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getCurrentPath() {
      if (folderId === "root") return;
      if (!currentUser) return;
      try {
        await getCurrentFolder({ folderId, currentUser: currentUser.uid });
      } catch (error) {
        setError(true);
      }
    }
    getCurrentPath();
  }, [folderId, currentUser]);

  if (error) throw new Error();
  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex justify-between gap-5 items-center">
        <div className="flex gap-5 items-center">
          <h1>Docs</h1>
          <span className="hidden md:flex">
            <Location folderId={folderId} />
          </span>
        </div>
        <div className="flex gap-5">
          <Button variant={"outline"}>Add Files</Button>
          <Button variant={"outline2"}>Add Folder</Button>
        </div>
      </div>
      <span className="md:hidden">
        <Location folderId={folderId} />
      </span>
      <Folders folderId={folderId} />
      <Files folderId={folderId} />
    </div>
  );
};
export default FolderId;
