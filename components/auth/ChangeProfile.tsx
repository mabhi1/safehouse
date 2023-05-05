import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";
import { showToast } from "@/utils/handleToast";
import { updatePhoto } from "@/firebase/firebaseFunctions";
import { User } from "firebase/auth";

type Props = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const ChangeProfile = ({ user, setUser }: Props) => {
  const storage = getStorage();
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (e: React.FormEvent) => {
    if (loading) return;
    e.preventDefault();

    const { files } = document.getElementById("file") as HTMLInputElement;
    if (!files || files.length <= 0) return;

    const storageRef = ref(storage, user.uid);

    setLoading(true);
    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, files[0] as any);

    uploadTask.on(
      "state_changed",
      () => {},
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const url = await getDownloadURL(storageRef);
          try {
            updatePhoto(url);
            showToast("success", `Photo uploaded successfully`);
            setUser({ ...user, photoURL: url });
            setLoading(false);
            (document.getElementById("file") as HTMLInputElement).value = "";
          } catch (error) {
            showToast("error", `Error uploading photo`);
            setLoading(false);
            console.error(error);
          }
        });
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-3 md:pt-5 border-t border-slate-200">
      <div>Change Profile Picture</div>
      <form className="flex w-fit rounded gap-3" onSubmit={handleFileSubmit}>
        <Input wide={"lg"} type="file" id="file" name="file" className="w-full p-0 border-0" accept="image/*" />
        {loading ? (
          <Button variant={"disabled"} disabled>
            <span className="hidden md:inline mr-1">Please </span>Wait...
          </Button>
        ) : (
          <Button>Upload</Button>
        )}
      </form>
    </div>
  );
};
export default ChangeProfile;
