import Link from "next/link";
import { GrDocumentText, GrNotes } from "react-icons/gr";
import { GoCalendar } from "react-icons/go";
import { BsBank2, BsSafe2 } from "react-icons/bs";
import Button from "./Button";
import LogoutBtn from "../auth/LogoutBtn";

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
        <Link href={"/docs"} className={classes.navLink}>
          <GrDocumentText className={classes.navIcon} />
          Docs
        </Link>
        <Link href={"/notes"} className={classes.navLink}>
          <GrNotes className={classes.navIcon} />
          Notes
        </Link>
        <Link href={"/calendar"} className={classes.navLink}>
          <GoCalendar className={classes.navIcon} />
          Calendar
        </Link>
        <Link href={"/banks"} className={classes.navLink}>
          <BsBank2 className={classes.navIcon} />
          Banks
        </Link>
        <Link href={"/passwords"} className={classes.navLink + " mb-2"}>
          <BsSafe2 className={classes.navIcon} />
          Passwords
        </Link>
        <LogoutBtn />
      </nav>
    </>
  );
};
export default MobileMenu;
