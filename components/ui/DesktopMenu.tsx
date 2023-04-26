import Link from "next/link";
import { FcHome, FcDocument, FcCalendar, FcLock, FcNews, FcLibrary, FcIpad } from "react-icons/fc";

type Props = {
  path: string;
};
const classes = {
  navLink: "flex gap-2 items-center w-full py-2.5 px-10 hover:bg-slate-200",
  navIcon: "text-lg",
  path: " bg-slate-200",
};
const DesktopMenu = ({ path }: Props) => {
  return (
    <>
      <nav className="w-52 border-r border-r-slate-200 hidden lg:flex flex-col">
        <Link href={"/"} className={classes.navLink + (path === "__PAGE__" ? classes.path : "")}>
          <FcHome className={classes.navIcon} />
          Home
        </Link>
        <Link href={"/docs"} className={classes.navLink + (path === "docs" ? classes.path : "")}>
          <FcDocument className={classes.navIcon} />
          Docs
        </Link>
        <Link href={"/notes"} className={classes.navLink + (path === "notes" ? classes.path : "")}>
          <FcNews className={classes.navIcon} />
          Notes
        </Link>
        <Link href={"/calendar"} className={classes.navLink + (path === "calendar" ? classes.path : "")}>
          <FcCalendar className={classes.navIcon} />
          Calendar
        </Link>
        <Link href={"/accounts"} className={classes.navLink + (path === "accounts" ? classes.path : "")}>
          <FcLibrary className={classes.navIcon} />
          Accounts
        </Link>
        <Link href={"/cards"} className={classes.navLink + (path === "cards" ? classes.path : "")}>
          <FcIpad className={classes.navIcon} />
          Cards
        </Link>
        <Link href={"/passwords"} className={classes.navLink + (path === "passwords" ? classes.path : "")}>
          <FcLock className={classes.navIcon} />
          Passwords
        </Link>
      </nav>
    </>
  );
};
export default DesktopMenu;
