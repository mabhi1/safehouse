import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "../components/auth/LogoutBtn";

type Props = {};
const classes = {
  navlinks: "hover:bg-slate-200 py-1 px-2 rounded transition-all duration-200",
};
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between shadow sticky z-50 bg-slate-50/10 backdrop-blur top-0 py-3 md:py-5 px-3 md:px-10">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href={"/"}>Safe House</Link>
      </div>
      <nav className="hidden lg:flex gap-8">
        <Link href={"/docs"} className={classes.navlinks}>
          Docs
        </Link>
        <Link href={"/notes"} className={classes.navlinks}>
          Notes
        </Link>
        <Link href={"/calendar"} className={classes.navlinks}>
          Calendar
        </Link>
        <Link href={"/banks"} className={classes.navlinks}>
          Banks
        </Link>
        <Link href={"/passwords"} className={classes.navlinks}>
          Passwords
        </Link>
      </nav>
      <LogoutBtn />
    </header>
  );
};
export default Header;
