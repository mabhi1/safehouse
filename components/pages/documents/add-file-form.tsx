"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/firebase";
import { FileType } from "@/lib/db-types";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";

interface Props {
  folderId: string;
  allFiles: FileType[];
  userId: string;
  currentFilePath:
    | {
        id: string;
        path: any;
        name: any;
      }
    | undefined;
}

export const AddFileForm = ({ folderId, currentFilePath, userId, allFiles }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const router = useRouter();
  const storage = getStorage();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProgressValue(0);
    setUploadMessage("");
  }, [openDialog]);

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { files } = document.getElementById("files") as HTMLInputElement;
    if (!files || files.length <= 0) return;

    for (let i = 0; i < files.length; i++) {
      let error = false;
      allFiles.forEach((file) => {
        if (file.uid !== userId) {
          error = true;
          return;
        }
        if (file.name.toLowerCase() === files[i].name.toLowerCase()) {
          error = true;
          toast.error(`${files[i].name} already exists! Rename and upload.`);
        }
      });

      if (error) return;
      const dbId = uuidV4();
      const storageRef = ref(storage, dbId);

      // 'file' comes from the Blob or File API
      const uploadTask = uploadBytesResumable(storageRef, files[i] as any);
      startTransition(() => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            if (snapshot.totalBytes > 0) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgressValue(progress);
              setUploadMessage(`Uploading ${files[i].name}`);
            }
          },
          () => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async () => {
              const url = await getDownloadURL(storageRef);
              const newId = uuidV4();
              try {
                await setDoc(doc(db, "files", newId), {
                  dbId: dbId,
                  name: files[i].name,
                  path:
                    folderId !== "root"
                      ? [...currentFilePath?.path, { id: currentFilePath?.id, name: currentFilePath?.name }]
                      : [{ id: "root", name: "root" }],
                  parentId: folderId ? folderId : "root",
                  createdAt: serverTimestamp(),
                  uid: userId,
                  url: url,
                });
                setUploadMessage(`Uploading Done`);
                setOpenDialog(false);
                toast.success(`${files[i].name} uploaded successfully`);
                router.refresh();
              } catch {
                toast.error(`Unable to upload ${files[i].name}`);
              }
            });
          }
        );
      });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create File</DialogTitle>
          <DialogDescription>Enter name for your file and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Name<span className="text-destructive">*</span>
            </Label>
            <Input type="file" multiple={true} id="files" name="file" autoFocus required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button loading={isPending} type="submit">
              Save
            </Button>
          </DialogFooter>
          <div className="text-center">
            <div id="uploadMessage" className="text-xs">
              {uploadMessage}
            </div>
            <Progress id="progress" value={progressValue} className="w-full"></Progress>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
