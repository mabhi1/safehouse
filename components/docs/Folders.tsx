"use client";
import { useState, useEffect } from "react";
import useAuth from "../auth/AuthProvider";
import { FileType, FolderType } from "@/lib/types/dbTypes";
import IndividualFolder from "./IndividualFolder";
import { getFolders } from "@/lib/docs/getDocsData";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import FolderModal from "./FolderModal";
import Image from "next/image";
import Input from "../ui/Input";
import { openConfirmBox } from "@/utils/handleModal";
import { IoIosCloseCircle } from "react-icons/io";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { showToast } from "@/utils/handleToast";

type Props = {
  folderId: string;
};
const Folders = ({ folderId }: Props) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selected, setSelected] = useState<FolderType | null>(null);
  const [folderModal, setFolderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const storage = getStorage();

  useEffect(() => {
    async function getAllContent() {
      if (!currentUser) return;
      setLoading(true);
      setFolders(await getFolders({ currentUser: currentUser.uid, folderId }));
      setLoading(false);
    }
    getAllContent();
  }, [currentUser, folderId]);

  const handleDeleteFolder = async (id: string) => {
    setLoading(true);
    // delete all folders inside
    let error = false;
    const folderQuery = query(collection(db, "folders"), where("uid", "==", currentUser?.uid));
    const folderSnapshot = await getDocs(folderQuery);
    folderSnapshot.forEach((dir) => {
      const data = dir.data();
      if (data.uid !== currentUser?.uid) error = true;
      data.path.map(async (p: FolderType) => {
        if (p.id === id) {
          await deleteDoc(doc(db, "folders", dir.id));
          return;
        }
      });
    });
    if (error) return;
    // delete all files inside
    const fileQuery = query(collection(db, "files"), where("uid", "==", currentUser?.uid));
    const fileSnapshot = await getDocs(fileQuery);
    fileSnapshot.forEach((dir) => {
      const data = dir.data();
      if (data.uid !== currentUser?.uid) {
        error = true;
        return;
      }
      data.path.map(async (p: FileType) => {
        if (p.id === id) {
          const fileRef = ref(storage, data.dbId);
          // Delete the file
          deleteObject(fileRef)
            .then(async () => {
              await deleteDoc(doc(db, "files", dir.id));
              // File deleted successfully
            })
            .catch((error) => {
              // Uh-oh, an error occurred!
            });

          return;
        }
      });
    });
    if (error) {
      showToast("error", "Error deleting folder");
      return;
    }
    await deleteDoc(doc(db, "folders", id));
    setFolders((prevFolders) => prevFolders.filter((pre) => pre.id !== id));
    showToast("success", "Folder deleted successfully");
    setLoading(false);
    setSelected(null);
  };

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
          <IndividualFolder folder={folder} key={folder.id} setSelected={setSelected} />
        ))}
      </div>
      {selected && !loading && (
        <div
          data-doc-menu
          className="fixed left-0 bottom-0 right-0 bg-slate-50 p-5 flex flex-col gap-3 md:gap-5 md:flex-row border-t shadow-lg z-10 justify-center"
        >
          <div className="gap-1 flex items-center text-center justify-end rounded ">
            <Image src="/folder.png" width={40} height={40} alt={selected.name} priority />
            <div className=" break-words text-slate-900">{selected.name}</div>
          </div>
          <form className="flex flex-col md:flex-row gap-3 md:gap-5">
            <Input type="text" id="name" placeholder="New Name" />
            <Button>Rename</Button>
          </form>
          <Button
            variant={"destructive"}
            onClick={() =>
              openConfirmBox(() => {
                handleDeleteFolder(selected.id);
              })
            }
          >
            Delete
          </Button>
          <IoIosCloseCircle className="absolute top-2 left-2 text-2xl text-red-900 cursor-pointer" onClick={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
};
export default Folders;
