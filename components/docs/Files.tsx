"use client";
import { FileType } from "@/lib/types/dbTypes";
import { useState, useEffect } from "react";
import useAuth from "../auth/AuthProvider";
import { getFiles } from "@/lib/docs/getDocsData";
import IndividualFile from "./IndividualFile";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import FileModal from "./FileModal";

type Props = {
  folderId: string;
};

const Files = ({ folderId }: Props) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [fileModal, setFileModal] = useState(false);
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
      <div className="flex gap-3 md:gap-5 items-center">
        {files.length === 1 ? <div>1 File</div> : <div>{files.length.toString() + " Files"}</div>}
        <Button variant={"link"} onClick={() => setFileModal(true)}>
          Add Files
        </Button>
        <FileModal open={fileModal} setOpen={setFileModal} folderId={folderId} setFiles={setFiles} />
      </div>
      <div className="flex flex-wrap gap-3">
        {files.map((file) => (
          <IndividualFile file={file} key={file.id} setFiles={setFiles} setLoading={setLoading} />
        ))}
      </div>
    </div>
  );
};
export default Files;
