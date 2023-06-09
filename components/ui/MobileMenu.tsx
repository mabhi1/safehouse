"use client";
import Link from "next/link";
import { FcHome, FcDocument, FcCalendar, FcLock, FcNews, FcLibrary, FcIpad } from "react-icons/fc";
import { closeMobileMenu } from "@/utils/toggleMobile";

type Props = {};
const classes = {
  navLink: "flex gap-2 items-center w-full p-2.5 hover:bg-slate-200 rounded",
  navIcon: "text-lg",
};
const MobileMenu = (props: Props) => {
  return (
    <>
      <nav
        id="closeMobileMenu"
        className="md:hidden fixed -left-full transition-all duration-300 bottom-0 top-16 p-5 z-40 w-3/4 shadow-lg border backdrop-blur border-r-slate-200 flex flex-col bg-slate-50/80"
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
        {/* <Link href={"/accounts"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcLibrary className={classes.navIcon} />
          Accounts
        </Link> */}
        <Link href={"/cards"} className={classes.navLink} onClick={closeMobileMenu}>
          <FcIpad className={classes.navIcon} />
          Cards
        </Link>
        <Link href={"/passwords"} className={classes.navLink + " mb-2"} onClick={closeMobileMenu}>
          <FcLock className={classes.navIcon} />
          Passwords
        </Link>
      </nav>
    </>
  );
};
export default MobileMenu;
