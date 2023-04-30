import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "../components/auth/LogoutBtn";
import MobileMenuButton from "@/components/ui/MobileMenuButton";
import SearchBar from "@/components/ui/SearchBar";
import MobileSearchButton from "@/components/ui/MobileSearchButton";

type Props = {};
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between sticky z-50 bg-slate-50 border-b border-slate-200 top-0 py-3 px-3 md:px-10">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href={"/"}>Safe House</Link>
      </div>
      <SearchBar />
      <span className="hidden md:inline">
        <LogoutBtn />
      </span>
      <div className="flex gap-3 items-center">
        <MobileSearchButton />
        <MobileMenuButton />
      </div>
    </header>
  );
};
export default Header;
