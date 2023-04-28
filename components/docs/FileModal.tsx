import { FileType, FolderType } from "@/lib/types/dbTypes";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getCurrentFolder, getFiles } from "@/lib/docs/getDocsData";
import useAuth from "../auth/AuthProvider";
import { showToast } from "@/utils/handleToast";
import { v4 as uuidV4 } from "uuid";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
  setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
};
const FileModal = ({ open, setOpen, folderId, setFiles }: Props) => {
  const currentUser = useAuth();
  const storage = getStorage();
  useEffect(() => {
    const fileInput = document.getElementById("files") as HTMLInputElement;
    if (open) {
      fileInput.value = "";
      fileInput.focus();
      const progressBar = document.getElementById("progress") as HTMLProgressElement;
      const messageDiv = document.getElementById("uploadMessage") as HTMLDivElement;
      progressBar.value = 0;
      messageDiv.textContent = "";
    }
  }, [open]);

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { files } = document.getElementById("files") as HTMLInputElement;
    if (!files || files.length <= 0) return;

    const progressBar = document.getElementById("progress") as HTMLProgressElement;
    const messageDiv = document.getElementById("uploadMessage") as HTMLDivElement;
    let currentFolder: FolderType;
    if (folderId !== "root") {
      currentFolder = await getCurrentFolder({ currentUser: currentUser?.uid || "", folderId });
    }

    for (let i = 0; i < files.length; i++) {
      let error = false;
      const Allfiles = await getFiles({ folderId, currentUser: currentUser?.uid || "" });
      Allfiles.forEach((file) => {
        if (file.uid !== currentUser?.uid) {
          error = true;
          return;
        }
        if (file.name.toLowerCase() === files[i].name.toLowerCase()) {
          error = true;
          showToast("error", `${files[i].name} already exists! Rename and upload.`);
        }
      });

      if (error) return;
      const dbId = uuidV4();
      const storageRef = ref(storage, dbId);

      // 'file' comes from the Blob or File API
      const uploadTask = uploadBytesResumable(storageRef, files[i] as any);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = progress;
            messageDiv.textContent = `Uploading ${files[i].name}`;
          }
        },
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const url = await getDownloadURL(storageRef);
            const newId = uuidV4();
            try {
              await setDoc(doc(db, "files", newId), {
                dbId: dbId,
                name: files[i].name,
                path:
                  folderId !== "root" ? [...currentFolder.path, { id: currentFolder.id, name: currentFolder.name }] : [{ id: "root", name: "root" }],
                parentId: folderId ? folderId : "root",
                createdAt: serverTimestamp(),
                uid: currentUser?.uid,
                url: url,
              });
              const docSnap = await getDoc(doc(db, "files", newId));
              messageDiv.textContent = `Uploading Done`;
              setOpen(false);
              //@ts-ignore
              setFiles((prevFiles) => [...prevFiles, { ...docSnap.data(), id: docSnap.id }]);
              showToast("success", `Files uploaded successfully`);
            } catch (error) {
              console.error(error);
            }
          });
        }
      );
    }
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
      <form className="flex flex-col justify-center border w-fit rounded p-5 md:p-10 shadow gap-3 bg-slate-50" onSubmit={handleFileSubmit}>
        <div className="flex gap-3">
          <Input variant={"compact"} wide={"md"} type="file" multiple={true} id="files" name="file" className="p-0 border-0" />
          <Button variant={"outline"}>Upload</Button>
          <Button type="button" variant={"outline3"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
        <div id="uploadMessage"></div>
        <progress id="progress" max="100" value="0" className="w-full"></progress>
      </form>
    </div>
  );
};
export default FileModal;
