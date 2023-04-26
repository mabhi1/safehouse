import Button from "@/components/ui/Button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import EditNote from "@/components/notes/EditNote";
import { getNoteById } from "@/lib/prisma/notes";
import { NotesType } from "@/lib/types/dbTypes";

type Props = {
  params: { noteId: string };
};
const Edit = async ({ params: { noteId } }: Props) => {
  const [note, error] = (await getNoteById(noteId)) as [NotesType, string];
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center md:items-start">
      <Link href={"/notes"} className="flex gap-1 items-center w-full">
        <IoArrowBack className="text-cyan-900" />
        <Button variant={"link"}>Back to Notes</Button>
      </Link>
      <div className="ml-10 flex flex-col gap-3 md:gap-5">
        {error ? (
          <div>Note not found</div>
        ) : (
          <>
            <div>Edit Note</div>
            <EditNote note={note} />
          </>
        )}
      </div>
    </div>
  );
};
export default Edit;
