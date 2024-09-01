"use client";

import { AddNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export default function CreateNoteForm({ uid }: { uid: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { data, error } = await AddNote(title, description, uid);
      if (!data || error) {
        setTitle("");
        setDescription("");
        toast.error("Unable to create note");
      } else {
        toast.success("Note created successfully");
        router.push("/notes");
      }
    });
  };

  return (
    <form id="form" className="flex flex-col gap-5 pl-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Title</label>
        <Input
          name="title"
          id="title"
          type="text"
          autoFocus={true}
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Description</label>
        <Textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          cols={45}
        ></Textarea>
      </div>
      {isPending ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button>Save</Button>
      )}
    </form>
  );
}
