"use client";
import { FileType } from "@/lib/types/dbTypes";
import { useState, useEffect } from "react";
import useAuth from "../auth/AuthProvider";
import { getFiles } from "@/lib/docs/getDocsData";
import IndividualFile from "./IndividualFile";
import Spinner from "../ui/Spinner";

type Props = {
  folderId: string;
};

const Files = ({ folderId }: Props) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  useEffect(() => {
    async function getAllContent() {
      if (!currentUser) return;
      setLoading(true);
      setFiles(await getFiles({ currentUser: currentUser.uid, folderId }));
      setLoading(false);
    }
    getAllContent();
  }, [currentUser, folderId]);

  if (loading)
    return (
      <div className="w-20">
        <Spinner size="md" />
      </div>
    );
  return (
    <div className="flex flex-col gap-2">
      {files.length === 1 ? <div>1 File</div> : <div>{files.length.toString() + " Files"}</div>}
      <div className="flex flex-wrap gap-3">
        {files.map((file) => (
          <IndividualFile file={file} key={file.id} />
        ))}
      </div>
    </div>
  );
};
export default Files;
