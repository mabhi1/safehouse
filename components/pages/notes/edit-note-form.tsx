"use client";

import { editNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleSlash, Save } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { NotesType } from "@/lib/db-types";
import { dateFormatter } from "@/lib/utils";

type EditNoteFormValues = {
  title: string;
  description: string;
};

export default function EditNoteForm({ note, userId }: { note: NotesType; userId: string }) {
  const router = useRouter();
  const initialFormValues: EditNoteFormValues = {
    title: note.title,
    description: note.description,
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<EditNoteFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      const result = await editNote(note.id, values.title.trim(), values.description.trim(), userId);
      return result;
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <Link href="/notes" className="flex lg:hidden items-center mr-auto gap-2">
        <MoveLeft className="w-4 h-4" />
        <span className="text-lg capitalize">All Notes</span>
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between lg:gap-20">
            <Input
              name="title"
              id="title"
              type="text"
              autoFocus={true}
              required
              placeholder="Enter Title"
              value={formValues.title}
              onChange={handleInputChange}
              className="text-2xl md:text-2xl border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center gap-2 md:gap-5">
              <Button
                type="button"
                variant="secondary"
                ICON={CircleSlash}
                onClick={() => router.push(`/notes/${note.id}`)}
                mobileVariant
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending} disabled={!isValid} ICON={Save} mobileVariant>
                Save
              </Button>
            </div>
          </div>

          <div className="text-slate-500 text-xs border-t border-slate-200 pt-2">
            Updated: {dateFormatter(new Date())}
          </div>
          <Textarea
            name="description"
            id="description"
            placeholder="Enter Description"
            value={formValues.description}
            required
            onChange={handleInputChange}
            rows={10}
            className="min-h-[200px] border-none resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </form>
    </div>
  );
}
