"use client";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import { IoAddOutline } from "react-icons/io5";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../auth/AuthProvider";

type Props = {};
const NewNote = (props: Props) => {
  const currentUser = useAuth()!;
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const notesMutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/notes", {
        name: title,
        description,
        uid: currentUser.uid,
      });
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    notesMutation.mutate();
  };

  useEffect(() => {
    if (showForm) document.getElementById("title")?.focus();
  }, [showForm]);

  if (!showForm)
    return (
      <div className="flex justify-center items-center shadow bg-slate-100 min-h-[17rem]">
        <IoAddOutline className="text-4xl shadow-md border border-slate-200 cursor-pointer" onClick={() => setShowForm((showForm) => !showForm)} />
      </div>
    );
  return (
    <form className="flex flex-col gap-2 rounded p-2 overflow-hidden min-h-[16rem]" onSubmit={handleSubmit}>
      <Input name="title" id="title" placeholder="Title" className="p-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        name="description"
        id="description"
        placeholder="Description"
        className="border-2 focus-visible:outline-none border-slate-400 min-h-[10rem] h-[10rem] rounded focus:border-cyan-900 flex-1 overflow-y-auto p-1 resize-none bg-transparent"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="flex gap-2 justify-center">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={() => setShowForm((showForm) => !showForm)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
export default NewNote;
