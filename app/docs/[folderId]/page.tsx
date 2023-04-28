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
      <Location folderId={folderId} />
      <Folders folderId={folderId} />
      <Files folderId={folderId} />
    </div>
  );
};
export default FolderId;
