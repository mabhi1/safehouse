import { v4 as uuidv4 } from "uuid";

export const showToast = (type: "success" | "error" | "info" | "warning", message: string) => {
  // Current Toast type and messge
  let messageBox = document.getElementById(`${type}-toast-message`);
  let toast = document.getElementById(`${type}-toast`);
  let newId = uuidv4();
  if (toast) toast.dataset.id = newId;

  // Hide every other toast
  const allToast = Array.from(document.getElementsByClassName("toast"));
  if (allToast.length <= 0) return;
  allToast.map((toast) => {
    if (toast.id !== `${type}-toast-message`) toast.classList.add("translate-x-[150%]");
  });

  // handle Close Button
  const closeBtn = document.querySelector("[data-toast-close]") as HTMLButtonElement;
  closeBtn.addEventListener("click", () => {
    if (toast && toast.dataset.id === newId) {
      toast.classList.add("translate-x-[150%]");
      setTimeout(() => {
        if (messageBox) messageBox.textContent = "";
      }, 100);
    }
  });

  // Show current toast
  if (!toast || !messageBox) return;
  messageBox.textContent = message;
  setTimeout(() => {
    if (toast) toast.classList.remove("translate-x-[150%]");
  }, 100);

  // Hide current toast after 4 seconds
  setTimeout(() => {
    if (toast && toast.dataset.id === newId) {
      toast.classList.add("translate-x-[150%]");
      setTimeout(() => {
        if (messageBox) messageBox.textContent = "";
      }, 100);
    }
  }, 4000);
};
