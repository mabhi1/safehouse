export const showToast = (type: string, message: string) => {
  // Current Toast type and messge
  let messageBox = document.getElementById(`${type}-toast-message`);
  let toast = document.getElementById(`${type}-toast`);

  // Hide every other toast
  const allToast = Array.from(document.getElementsByClassName("toast"));
  if (allToast.length <= 0) return;
  allToast.map((toast) => {
    if (toast.id !== `${type}-toast-message`) toast.classList.add("translate-x-[150%]");
  });

  // Show current toast
  if (!toast || !messageBox) return;
  messageBox.textContent = message;
  setTimeout(() => {
    if (toast) toast.classList.remove("translate-x-[150%]");
  }, 100);

  // Hide current toast after 4 seconds
  setTimeout(() => {
    if (toast) {
      toast.classList.add("translate-x-[150%]");
    }
  }, 4000);

  setTimeout(() => {
    if (messageBox) {
      messageBox.textContent = "";
    }
  }, 4300);
};
