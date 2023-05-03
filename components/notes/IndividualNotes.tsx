import { NotesType } from "@/lib/types/dbTypes";
import Button from "../ui/Button";
import MarkedText from "../ui/MarkedText";
import Link from "next/link";
import { showToast } from "@/utils/handleToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "../ui/Spinner";
import { openConfirmBox } from "@/utils/handleModal";

type Props = {
  note: NotesType;
  searchTerm: string;
  setNotes: React.Dispatch<React.SetStateAction<NotesType[]>>;
};
const IndividualNotes = ({ note, searchTerm, setNotes }: Props) => {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });
  const queryClient = useQueryClient();
  const notesMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/notes/?id=${note.id}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["notes"]);
      if (notesMutation.isError) showToast("error", "Error deleting note");
      else {
        setNotes((notes) => notes.filter((note) => note.id !== data?.data?.data?.id));
        showToast("success", "Note deleted successfully");
      }
    },
  });

  const handleDelete = async () => {
    notesMutation.mutate();
  };

  if (!note) return <></>;

  if (notesMutation.isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner size="md" />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 rounded p-2 justify-between overflow-hidden">
      <div className="underline underline-offset-2 break-words">
        <MarkedText text={note.name} searchTerm={searchTerm} />
      </div>
      <div className="overflow-y-auto min-h-[10rem] h-[10rem] p-1 bg-transparent">
        {note.description.split("\n").map((i, key) => {
          return (
            <div key={key} className="break-words">
              <MarkedText text={i} searchTerm={searchTerm} />
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex gap-4 justify-end my-2">
          <Link href={`/notes/${note.id}`}>
            <Button variant="link">Edit</Button>
          </Link>
          <Button variant="link" onClick={() => openConfirmBox(handleDelete)}>
            Delete
          </Button>
        </div>
        <div className="text-slate-500 italic text-xs border-t border-slate-500 pt-1">Updated : {dateFormatter.format(new Date(note.updatedAt))}</div>
      </div>
    </div>
  );
};
export default IndividualNotes;
