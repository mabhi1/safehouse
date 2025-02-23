"use client";

import { addNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";

type CreateNoteFormValues = {
  title: string;
  description: string;
};

export default function CreateNoteForm({ uid }: { uid: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: CreateNoteFormValues = {
    title: "",
    description: "",
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreateNoteFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => addNote(values.title.trim(), values.description.trim(), uid),
    onSuccess: () => setOpenDialog(false),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <div>
          <Button className="hidden md:block">Add Note</Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
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
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button loading={isPending}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
