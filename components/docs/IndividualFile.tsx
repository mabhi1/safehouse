import { db } from "@/firebase/firebase";
import { FileType } from "@/lib/types/dbTypes";
import { openConfirmBox } from "@/utils/handleModal";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { Dispatch, SetStateAction } from "react";
import { showToast } from "@/utils/handleToast";

type Props = {
  file: FileType;
  setFiles: Dispatch<SetStateAction<FileType[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};
const IndividualFile = ({ file, setFiles, setLoading }: Props) => {
  const storage = getStorage();

  const handleDeleteFile = (id: string) => {
    setLoading(true);
    const fileRef = ref(storage, file.dbId);
    // Delete the file
    deleteObject(fileRef)
      .then(async () => {
        await deleteDoc(doc(db, "files", id));
        setFiles((prevFiles) => prevFiles.filter((pre) => pre.id !== id));
        showToast("success", "File deleted successfully");
        // File deleted successfully
      })
      .catch((error) => {
        showToast("error", "Error deleting file");
        // Uh-oh, an error occurred!
      });
    setLoading(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center rounded hover:bg-slate-200">
        <Image src="/file.png" width={60} height={70} alt={file.name} priority />
        <a href={file.url} target="_blank">
          <div className="w-24 break-words text-slate-900">{file.name}</div>
        </a>
      </div>
      <MdDelete
        onClick={() =>
          openConfirmBox(() => {
            handleDeleteFile(file.id);
          })
        }
        className="cursor-pointer absolute right-0 top-0 text-red-800 text-xl"
      />
    </div>
  );
};
export default IndividualFile;
