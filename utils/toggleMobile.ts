"use client";
export const toggleMobileMenu = (target: HTMLDivElement) => {
  if (document.getElementById("mobile-menu-btn")) {
    target.removeAttribute("id");
    const mobileMenu = document.getElementById("openMobileMenu");
    mobileMenu?.setAttribute("id", "closeMobileMenu");
  } else {
    target.setAttribute("id", "mobile-menu-btn");
    const mobileMenu = document.getElementById("closeMobileMenu");
    mobileMenu?.setAttribute("id", "openMobileMenu");
  }
};

export const closeMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) menuBtn.removeAttribute("id");

  const mobileMenu = document.getElementById("openMobileMenu");
  mobileMenu?.setAttribute("id", "closeMobileMenu");
};

export const toggleMobileSearchForm = () => {
  const mobileSearchForm = document.getElementById("mobileSearchForm");
  mobileSearchForm?.classList.toggle("-mt-20");
  mobileSearchForm?.classList.toggle("mb-[0.7rem]");
  mobileSearchForm?.classList.toggle("mt-0");
};
