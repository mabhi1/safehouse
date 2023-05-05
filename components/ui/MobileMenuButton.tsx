"use client";

import { toggleMobileMenu } from "@/utils/toggleMobile";

type Props = {};
const MobileMenuButton = (props: Props) => {
  return (
    <div
      onClick={(e) => toggleMobileMenu(e.target as HTMLDivElement)}
      className={`md:hidden w-[1.8rem] h-[0.2rem] mr-2 transition-all duration-300 before:transition-all before:duration-300 after:transition-all after:duration-300 before:-top-[0.5rem] after:-bottom-[0.5rem] before:w-[1.8rem] after:w-[1.8rem] before:right-0 after:right-0 before:h-[0.2rem] after:h-[0.2rem] relative before:absolute after:absolute bg-slate-500 before:bg-slate-500 after:bg-slate-500`}
    ></div>
  );
};
export default MobileMenuButton;
