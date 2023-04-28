"use client";
import { useState, useEffect } from "react";
import useAuth from "../auth/AuthProvider";
import { FolderType } from "@/lib/types/dbTypes";
import IndividualFolder from "./IndividualFolder";
import { getFolders } from "@/lib/docs/getDocsData";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import FolderModal from "./FolderModal";

type Props = {
  folderId: string;
};
const Folders = ({ folderId }: Props) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [folderModal, setFolderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  useEffect(() => {
    async function getAllContent() {
      if (!currentUser) return;
      setLoading(true);
      setFolders(await getFolders({ currentUser: currentUser.uid, folderId }));
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
        {folders.length === 1 ? <div>1 Folder</div> : <div>{folders.length.toString() + " Folders"}</div>}
        <Button variant={"link"} onClick={() => setFolderModal(true)}>
          Add Folder
        </Button>
        <FolderModal open={folderModal} setOpen={setFolderModal} folderId={folderId} setFolders={setFolders} />
      </div>
      <div className="flex flex-wrap gap-3">
        {folders.map((folder) => (
          <IndividualFolder folder={folder} key={folder.id} />
        ))}
      </div>
    </div>
  );
};
export default Folders;
