import Link from "next/link";
import { FcHome, FcDocument, FcCalendar, FcLock, FcNews, FcLibrary, FcIpad } from "react-icons/fc";
import Button from "./Button";

type Props = {
  path: string;
};
const classes = {
  navLink: "flex gap-2 items-center w-full pl-10 py-2.5 hover:bg-slate-200",
  subNavLink: "w-fit ml-16 my-2.5",
  navIcon: "text-lg",
  path: " bg-slate-200",
};
const DesktopMenu = ({ path }: Props) => {
  return (
    <>
      <nav className="w-52 border-r border-r-slate-200 hidden md:flex flex-col">
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
        <Link href={"/notes/create"} className={classes.subNavLink + (path === "notes" ? "" : " hidden")}>
          <Button variant="link">Add Note</Button>
        </Link>
        <Link href={"/calendar"} className={classes.navLink + (path === "calendar" ? classes.path : "")}>
          <FcCalendar className={classes.navIcon} />
          Calendar
        </Link>
        <Link href={"/calendar/create"} className={classes.subNavLink + (path === "calendar" ? "" : " hidden")}>
          <Button variant="link">Add Event</Button>
        </Link>
        {/* <Link href={"/accounts"} className={classes.navLink + (path === "accounts" ? classes.path : "")}>
          <FcLibrary className={classes.navIcon} />
          Accounts
        </Link>
        <Link href={"/accounts/create"} className={classes.subNavLink + (path === "accounts" ? "" : " hidden")}>
          <Button variant="link">Add Account</Button>
        </Link> */}
        <Link href={"/cards"} className={classes.navLink + (path === "cards" ? classes.path : "")}>
          <FcIpad className={classes.navIcon} />
          Cards
        </Link>
        <Link href={"/cards/create"} className={classes.subNavLink + (path === "cards" ? "" : " hidden")}>
          <Button variant="link">Add Card</Button>
        </Link>
        <Link href={"/passwords"} className={classes.navLink + (path === "passwords" ? classes.path : "")}>
          <FcLock className={classes.navIcon} />
          Passwords
        </Link>
        <Link href={"/passwords/create"} className={classes.subNavLink + (path === "passwords" ? "" : " hidden")}>
          <Button variant="link">Add Password</Button>
        </Link>
      </nav>
    </>
  );
};
export default DesktopMenu;
