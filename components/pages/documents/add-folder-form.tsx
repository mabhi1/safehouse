"use client";

import { addFolder } from "@/actions/documents";
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
import { FolderType } from "@/lib/db-types";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AddFolderFormValues = {
  name: string;
};

interface Props {
  folderId: string;
  folders: FolderType[];
  userId: string;
  currentFolderPath:
    | {
        id: string;
        path: any;
        name: any;
      }
    | undefined;
}

export const AddFolderForm = ({ folderId, folders, currentFolderPath, userId }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const pathname = usePathname();
  const initialFormValues: AddFolderFormValues = {
    name: "",
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<AddFolderFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values: AddFolderFormValues) =>
      await addFolder(values.name.trim(), folderId, currentFolderPath, userId, folders, pathname),
    onSuccess: () => setOpenDialog(false),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Folder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>Enter name for your folder and click save when you&apos;re done.</DialogDescription>
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
