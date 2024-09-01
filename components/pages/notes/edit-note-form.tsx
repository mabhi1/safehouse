"use client";

import { EditNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NotesType } from "@/lib/db-types";
import { Loader2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type EditNoteFormValues = {
  title: string;
  description: string;
};

export function EditNoteForm({ note, uid }: { note: NotesType; uid: string }) {
  const initialFormValues: EditNoteFormValues = {
    title: note.title,
    description: note.description,
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<EditNoteFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => EditNote(note.id, values.title.trim(), values.description.trim(), uid),
    successRedirectUrl: "/notes",
  });

  return (
    <form id="form" className="flex flex-col gap-5 pl-5 w-96" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="title">
          Title<span className="text-destructive">*</span>
        </label>
        <Input
          name="title"
          id="title"
          type="text"
          autoFocus={true}
          placeholder="Enter Title"
          value={formValues.title}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">
          Description<span className="text-destructive">*</span>
        </label>
        <Textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          value={formValues.description}
          onChange={handleInputChange}
          rows={7}
          cols={45}
        />
      </div>
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
    </form>
  );
}
