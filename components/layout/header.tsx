import { ClerkLoading, SignedIn } from "@clerk/nextjs";
import { ModeToggle } from "../ui/theme-toggle";
import Image from "next/image";
import { Navigation } from "./navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import UserProfileButton from "./user-button";
import SearchButton from "./search-button";

const Header = () => {
  return (
    <header className="flex items-center gap-1 md:gap-3 lg:gap-5 p-5 max-w-7xl mx-auto w-full h-fit top-0 sticky bg-background z-10">
      <Menu className="lg:hidden" />
      <Image src="/logo.png" alt="Safe House" width={50} height={50} priority className="hidden lg:block" />
      <Link href="/">
        <h1 className="uppercase text-xl hidden md:block">Safehouse</h1>
      </Link>
      <SignedIn>
        <Navigation />
      </SignedIn>
      <div className="flex-1 lg:flex-none ml-auto flex items-center lg:gap-5 gap-3">
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
