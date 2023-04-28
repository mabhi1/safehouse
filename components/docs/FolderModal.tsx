import { getFolders, getCurrentFolder } from "@/lib/docs/getDocsData";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useEffect, useState } from "react";
import useAuth from "../auth/AuthProvider";
import { showToast } from "@/utils/handleToast";
import { v4 as uuidV4 } from "uuid";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { FolderType } from "@/lib/types/dbTypes";
import Spinner from "../ui/Spinner";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
  setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
};
const FolderModal = ({ open, setOpen, folderId, setFolders }: Props) => {
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  useEffect(() => {
    if (open) document.getElementById("folderInput")?.focus();
    setFolder("");
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    let error = false;
    if (folder.trim() === "") {
      setLoading(false);
      return;
    }
    const folderList = await getFolders({ folderId, currentUser: currentUser!.uid });
    folderList.forEach((doc) => {
      if (doc.name.toLowerCase() === folder.toLowerCase()) {
        error = true;
        return;
      }
    });
    if (error) {
      setLoading(false);
      showToast("error", "Folder already exists");
      return;
    }
    const newId = uuidV4();
    let currentFolder;
    if (folderId !== "root") {
      currentFolder = await getCurrentFolder({ currentUser: currentUser?.uid || "", folderId });
    }
    try {
      await setDoc(doc(db, "folders", newId), {
        name: folder,
        path: folderId !== "root" ? [...currentFolder?.path, { id: folderId, name: currentFolder?.name }] : [{ id: "root", name: "root" }],
        parentId: folderId,
        createdAt: serverTimestamp(),
        uid: currentUser?.uid,
      });
      const docSnap = await getDoc(doc(db, "folders", newId));
      //@ts-ignore
      setFolders((prevFolders) => [...prevFolders, { ...docSnap.data(), id: docSnap.id }]);
      showToast("success", "Folder added successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div
      className={(open ? "fixed" : "hidden") + " fixed inset-0 z-50 flex justify-center items-center bg-slate-200/50"}
      onClick={(e) => {
        const { tagName } = e.target as HTMLElement;
        if (tagName === "DIV") setOpen(false);
      }}
      onKeyUp={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {loading ? (
        <div className="flex flex-col gap-3 md:gap-5 justify-center items-center">
          <Spinner size="md" />
          <div>Creating Folder...</div>
        </div>
      ) : (
        <form className="flex justify-center border w-fit rounded p-5 items-center md:p-10 shadow gap-3 bg-slate-50" onSubmit={handleSubmit}>
          <Input
            id="folderInput"
            variant={"compact"}
            type="text"
            placeholder="Folder Name"
            wide={"md"}
            autoFocus={true}
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
          <Button variant={"outline2"}>Create</Button>
          <Button type="button" variant={"outline3"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
};
export default FolderModal;
