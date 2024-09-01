"use client";

import { DeleteNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteButton({ noteId }: { noteId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const { data, error } = await DeleteNote(noteId);
      if (!data || error) toast.error("Unable to delete note");
      else toast.success("Note deleted successfully");
    });
  };

  return (
    <>
      <input type="hidden" name="noteId" value={noteId} />
      {isPending ? (
        <Button variant="ghost" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button variant="ghost" onClick={handleSubmit}>
          Delete
        </Button>
      )}
    </>
  );
}
