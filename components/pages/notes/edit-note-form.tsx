"use client";

import { editNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NotesType } from "@/lib/db-types";
import { Loader2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type EditNoteFormValues = {
  title: string;
  description: string;
};

export function EditNoteForm({ note, uid }: { note: NotesType; uid: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: EditNoteFormValues = {
    title: note.title,
    description: note.description,
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<EditNoteFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => editNote(note.id, values.title.trim(), values.description.trim(), uid),
    onSuccess: () => setOpenDialog(false),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>Enter title and description and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Title<span className="text-destructive">*</span>
            </Label>
            <Input
              name="title"
              id="title"
              type="text"
              autoFocus={true}
              required
              placeholder="Enter Title"
              value={formValues.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Description<span className="text-destructive">*</span>
            </Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Enter Description"
              value={formValues.description}
              required
              onChange={handleInputChange}
              rows={7}
              cols={45}
            />
          </div>
          <DialogFooter>
            <Button disabled={isPending}>
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
}
