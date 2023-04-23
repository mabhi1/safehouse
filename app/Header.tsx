import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "../components/LogoutBtn";

type Props = {};
const classes = {
  navlinks: "hover:bg-slate-200 py-1 px-2 rounded transition-all duration-200",
};
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between pt-5 px-10">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href={"/home"}>Safe House</Link>
      </div>
      <nav className="flex gap-8">
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
