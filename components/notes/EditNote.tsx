"use client";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/utils/handleToast";
import { NotesType } from "@/lib/types/dbTypes";

type Props = {
  note: NotesType;
};
const EditNote = ({ note }: Props) => {
  const [title, setTitle] = useState(note.name);
  const [description, setDescription] = useState(note.description);
  const queryClient = useQueryClient();

  const notesMutation = useMutation({
    mutationFn: () => {
      return axios.put("/api/notes", {
        id: note.id,
        name: title,
        description,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["notes"]);
      setTitle(data.data.data.name);
      setDescription(data.data.data.description);
      if (notesMutation.isError) showToast("error", "Error editing note");
      else showToast("success", "Note edited successfully");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") {
      showToast("error", "Title or Description missing!");
      return;
    }
    notesMutation.mutate();
  };

  return (
    <form id="form" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="title">Title</label>
        <Input
          wide={"lg"}
          id="title"
          type="text"
          autoFocus={true}
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-72 lg:w-96 md:w-80"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          cols={45}
        ></textarea>
      </div>
      {notesMutation.isLoading ? (
        <Button size={"lg"} variant={"disabled"} disabled>
          Please Wait...
        </Button>
      ) : (
        <Button size={"lg"}>Save</Button>
      )}
    </form>
  );
};
export default EditNote;
