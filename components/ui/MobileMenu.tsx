"use client";
import Link from "next/link";
import { FcHome, FcDocument, FcCalendar, FcLock, FcNews, FcLibrary } from "react-icons/fc";
import LogoutBtn from "../auth/LogoutBtn";
import { closeMobileMenu } from "@/utils/toggleMobileMenu";

type Props = {};
const classes = {
  navLink: "flex gap-2 items-center w-full p-2.5 hover:bg-slate-200 rounded",
  navIcon: "text-lg",
};
const MobileMenu = (props: Props) => {
  return (
    <>
      <nav
        id="mobileMenu"
        className="lg:hidden fixed -left-full transition-all duration-300 bottom-0 top-16 p-5 z-40 w-3/4 shadow-lg border backdrop-blur border-r-slate-200 flex flex-col bg-slate-50/80"
      >
        <Link href={"/"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcHome className={classes.navIcon} />
          Home
        </Link>
        <Link href={"/docs"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcDocument className={classes.navIcon} />
          Docs
        </Link>
        <Link href={"/notes"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcNews className={classes.navIcon} />
          Notes
        </Link>
        <Link href={"/calendar"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcCalendar className={classes.navIcon} />
          Calendar
        </Link>
        <Link href={"/bank"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcLibrary className={classes.navIcon} />
          Bank
        </Link>
        <Link href={"/passwords"} className={classes.navLink + " mb-2"} onClick={closeMobileMenu}>
          <FcLock className={classes.navIcon} />
          Passwords
        </Link>
        <LogoutBtn />
      </nav>
    </>
  );
};
export default MobileMenu;
