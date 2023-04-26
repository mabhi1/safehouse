import { CiWarning } from "react-icons/ci";
import Button from "./Button";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: () => void;
};
const ConfirmBox = ({ open, setOpen, action }: Props) => {
  return (
    <div className={(open ? "fixed" : "hidden") + " fixed inset-0 z-50 flex justify-center items-center bg-slate-200/50"}>
      <div className="flex flex-col border w-3/4 md:w-1/2 p-5 items-center md:p-10 shadow gap-5 bg-slate-50 ">
        <CiWarning className="text-5xl" />
        <div>Are you sure you want to delete this note?</div>
        <div className="flex gap-5 justify-center">
          <Button size={"sm"} onClick={() => action()}>
            Yes, I'm sure
          </Button>
          <Button variant={"destructive"} size={"sm"} onClick={() => setOpen(false)}>
            No, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmBox;
