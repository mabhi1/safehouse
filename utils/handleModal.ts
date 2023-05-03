export const openConfirmBox = (action: () => void) => {
  const modal = document.querySelector("[data-modal]") as HTMLDialogElement;
  const actioButton = document.querySelector("[data-modal-action]") as HTMLButtonElement;
  actioButton.addEventListener("click", () => {
    action();
    modal.close();
    actioButton.removeEventListener("click", () => {});
  });
  modal.showModal();
};
