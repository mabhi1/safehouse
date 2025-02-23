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
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteFileButton({ fileId, fileDbId }: { fileId: string; fileDbId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const storage = getStorage();

  const handleDeleteFile = () => {
    const fileRef = ref(storage, fileDbId);
    // Delete the file
    startTransition(async () => {
      deleteObject(fileRef)
        .then(async () => {
          await deleteDoc(doc(db, "files", fileId));
          toast.success("Action completed successfully");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Unable to complete the action");
        });
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
          <AlertDialogAction onClick={handleDeleteFile}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
