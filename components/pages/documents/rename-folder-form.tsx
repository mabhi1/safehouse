"use client";

import { renameFolder } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type RenameFolderFormValues = {
  name: string;
};

interface Props {
  folderId: string;
  userId: string;
  folderName: string;
}

export const RenameFolderForm = ({ userId, folderId, folderName }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const pathname = usePathname();
  const initialFormValues: RenameFolderFormValues = {
    name: folderName,
  };

  const onSubmit = async (values: RenameFolderFormValues) => {
    const res = await renameFolder(userId, values.name.trim(), folderId, pathname);
    if (!res.error) setOpenDialog(false);
    return res;
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<RenameFolderFormValues>({
    initialValues: initialFormValues,
    onSubmit,
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent">Rename</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>Enter new name for your folder and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter Folder Name"
              autoFocus
              required
              value={formValues.name}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
