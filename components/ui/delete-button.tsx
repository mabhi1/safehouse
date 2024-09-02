"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
  uid: string;
  deleteAction: (id: string, uid: string) => Promise<{ data: any; error: any }>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

export function DeleteButton({
  id,
  uid,
  deleteAction,
  loadingMessage = "Please wait",
  successMessage = "Item deleted successfully",
  errorMessage = "Unable to delete item",
  dialogTitle = "Are you absolutely sure?",
  dialogDescription = "This action cannot be undone. This will permanently delete and remove the item from our servers.",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const { data, error } = await deleteAction(id, uid);
      if (!data || error) toast.error(errorMessage);
      else toast.success(successMessage);
    });
  };

  return isPending ? (
    <Button variant="ghost" disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingMessage}
    </Button>
  ) : (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-destructive hover:text-destructive">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
