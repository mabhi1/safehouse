"use client";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { NotesType } from "@/lib/types/dbTypes";
import { updateNoteById } from "@/lib/prisma/notes";

type Props = {
  note: NotesType;
};
const EditNote = ({ note }: Props) => {
  const handleSave = async (e: React.FormEvent) => {};

  return (
    <form id="form" className="flex flex-col gap-3" onSubmit={handleSave}>
      <div className="flex flex-col">
        <label htmlFor="title">Title</label>
        <Input autoFocus={true} wide={"lg"} id="title" type="text" placeholder="Enter Title" defaultValue={note.name} />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-72 lg:w-96 md:w-80"
          defaultValue={note.description}
          rows={7}
          cols={45}
        ></textarea>
      </div>
      <Button size={"lg"}>Save</Button>
    </form>
  );
};
export default EditNote;
