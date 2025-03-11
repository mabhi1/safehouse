"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/firebase";
import { FileType, FolderType } from "@/lib/db-types";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteFolderButton({ userId, folderId }: { userId: string; folderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const storage = getStorage();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        // delete all folders inside
        let error = false;
        const folderQuery = query(collection(db, "folders"), where("uid", "==", userId));
        const folderSnapshot = await getDocs(folderQuery);
        folderSnapshot.forEach((dir) => {
          const data = dir.data();
          if (data.uid !== userId) error = true;
          data.path.map(async (p: FolderType) => {
            if (p.id === folderId) {
              await deleteDoc(doc(db, "folders", dir.id));
              return;
            }
          });
        });
        if (error) return;
        // delete all files inside
        const fileQuery = query(collection(db, "files"), where("uid", "==", userId));
        const fileSnapshot = await getDocs(fileQuery);
        fileSnapshot.forEach((dir) => {
          const data = dir.data();
          if (data.uid !== userId) {
            error = true;
            return;
          }
          data.path.map(async (p: FileType) => {
            if (p.id === folderId) {
              const fileRef = ref(storage, data.dbId);
              // Delete the file
              deleteObject(fileRef)
                .then(async () => {
                  await deleteDoc(doc(db, "files", dir.id));
                  // File deleted successfully
                })
                .catch(() => {
                  // Uh-oh, an error occurred!
                });

              return;
            }
          });
        });
        if (error) throw new Error();
        await deleteDoc(doc(db, "folders", folderId));
        toast.success("Action completed successfully");
        router.refresh();
      } catch {
        toast.error("Unable to complete the action");
      }
    });
  };

  return isPending ? (
    <Loader2 className="mr-2 w-4 h-4 animate-spin mx-2 my-1.5" />
  ) : (
    <AlertDialog>
      <AlertDialogTrigger className="w-full text-left text-destructive px-2 py-1.5 text-sm hover:bg-accent">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and remove the item from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
