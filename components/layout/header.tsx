import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
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
      <SignedIn>
        <MobileMenu />
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority className="hidden lg:block" />
        <Link href="/">
          <h1 className="uppercase text-xl hidden md:block">Safehouse</h1>
        </Link>
      </SignedIn>
      <SignedOut>
        <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
        <Link href="/">
          <h1 className="uppercase text-xl">Safehouse</h1>
        </Link>
      </SignedOut>
      <SignedIn>
        <Navigation className="hidden lg:block" />
      </SignedIn>
      <div className="flex-1 lg:flex-none ml-auto flex items-center gap-3 md:gap-5">
        <SignedIn>
          <SearchButton />
          <UserProfileButton />
          <ClerkLoading>
            <Image src="/profile.png" width={35} height={35} priority alt="Sign-in" className="w-8 h-8" />
          </ClerkLoading>
        </SignedIn>
        <ModeToggle />
      </div>
    </header>
  );
};
export { Header };
