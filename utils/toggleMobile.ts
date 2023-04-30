export const toggleMobileMenu = (target: HTMLDivElement) => {
  if (document.getElementById("mobile-menu-btn")) target.removeAttribute("id");
  else target.setAttribute("id", "mobile-menu-btn");

  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu?.classList.toggle("-left-full");
  mobileMenu?.classList.toggle("left-0");
};

export const closeMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) menuBtn.removeAttribute("id");

  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu?.classList.toggle("-left-full");
  setTimeout(() => {
    mobileMenu?.classList.toggle("left-0");
  }, 300);
};

export const toggleMobileSearchForm = () => {
  const mobileSearchForm = document.getElementById("mobileSearchForm");
  mobileSearchForm?.classList.toggle("-mt-20");
  mobileSearchForm?.classList.toggle("mb-[0.7rem]");
  mobileSearchForm?.classList.toggle("mt-0");
};
