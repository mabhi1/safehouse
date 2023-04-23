import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "../components/auth/LogoutBtn";
import MobileMenu from "@/components/ui/MobileMenu";
import MobileMenuButton from "@/components/ui/MobileMenuButton";

type Props = {};
const classes = {
  navlinks: "py-1 px-4 rounded transition-all duration-200",
};
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between shadow sticky z-50 bg-slate-50/80 lg:bg-slate-50/10 backdrop-blur top-0 py-3 md:py-5 px-3 md:px-10">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href={"/"}>Safe House</Link>
      </div>
      <nav className="hidden relative lg:flex">
        <Link id="docs-menu" href={"/docs"} className={classes.navlinks}>
          Docs
        </Link>
        <Link id="notes-menu" href={"/notes"} className={classes.navlinks}>
          Notes
        </Link>
        <Link id="calendar-menu" href={"/calendar"} className={classes.navlinks}>
          Calendar
        </Link>
        <Link id="banks-menu" href={"/banks"} className={classes.navlinks}>
          Banks
        </Link>
        <Link id="passwords-menu" href={"/passwords"} className={classes.navlinks}>
          Passwords
        </Link>
        <div id="menu-hover" className="absolute bg-slate-200 -z-10 h-8 rounded transition-all duration-300"></div>
      </nav>
      <span className="hidden lg:inline">
        <LogoutBtn />
      </span>
      <MobileMenuButton />
    </header>
  );
};
export default Header;
