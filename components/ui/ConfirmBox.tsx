"use client";
import { CiWarning } from "react-icons/ci";
import Button from "./Button";

type Props = {};
const ConfirmBox = (props: Props) => {
  const handleClose = () => {
    const modal = document.querySelector("[data-modal]") as HTMLDialogElement;
    const actioButton = document.querySelector("[data-modal-action]") as HTMLButtonElement;
    actioButton.removeEventListener("click", () => {});
    modal.close();
  };

  return (
    <dialog
      data-modal
      className="rounded border shadow bg-slate-50"
      onClick={(e) => {
        const { tagName } = e.target as HTMLElement;
        if (tagName === "DIALOG") handleClose();
      }}
    >
      <div className="flex flex-col rounded p-5 items-center gap-3 md:gap-5 bg-slate-50 text-slate-900 ">
        <CiWarning className="text-5xl" />
        <div>Are you sure?</div>
        <div className="flex gap-5 justify-center">
          <Button data-modal-action size={"sm"}>
            {"Yes, I'm sure"}
          </Button>
          <Button variant={"destructive"} size={"sm"} onClick={handleClose}>
            {"No, Cancel"}
          </Button>
        </div>
      </div>
    </dialog>
  );
};
export default ConfirmBox;
