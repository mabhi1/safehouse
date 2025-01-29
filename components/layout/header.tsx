import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ModeToggle } from "../ui/theme-toggle";
import Image from "next/image";
import { Navigation } from "./navigation";
import Link from "next/link";
import UserProfileButton from "./user-button";
import SearchButton from "./search-button";
import MobileMenu from "./mobile-menu";

const Header = () => {
  return (
    <header className="flex items-center gap-[0.4rem] md:gap-4 p-5 max-w-7xl mx-auto w-full h-fit top-0 sticky bg-background/50 backdrop-blur-md z-10">
      <MobileMenu />
      <Image src="/logo.png" alt="Safe House" width={50} height={50} priority className="hidden lg:block" />
      <Link href="/">
        <h1 className="uppercase text-xl hidden md:block">Safehouse</h1>
      </Link>
      <SignedOut>
        <Image src="/logo.png" alt="Safe House" width={40} height={40} priority className="lg:hidden" />
        <Link href="/">
          <h1 className="uppercase text-lg md:hidden">Safehouse</h1>
        </Link>
      </SignedOut>
      <Navigation className="hidden lg:block" />
      <div className="flex-1 lg:flex-none ml-auto flex items-center gap-3 md:gap-5">
        <SignedIn>
          <SearchButton />
        </SignedIn>
        <UserProfileButton />
        <ModeToggle />
      </div>
    </header>
  );
};
export { Header };
