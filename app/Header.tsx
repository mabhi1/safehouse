import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "../components/auth/LogoutBtn";
import MobileMenuButton from "@/components/ui/MobileMenuButton";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Props = {};
const classes = {
  navlinks: "py-1 px-4 rounded transition-all duration-200",
};
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between sticky z-50 bg-slate-50 border-b border-slate-200 top-0 py-3 px-3 md:px-10">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href={"/"}>Safe House</Link>
      </div>
      <div className="hidden lg:flex gap-2">
        <Input type="text" placeholder="Search" wide={"lg"} />
        <Button>Search</Button>
      </div>
      <span className="hidden lg:inline">
        <LogoutBtn />
      </span>
      <MobileMenuButton />
    </header>
  );
};
export default Header;
