import { ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ui/theme-toggle";
import Image from "next/image";
import { Navigation } from "./navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center gap-1 md:gap-3 lg:gap-5 p-5 max-w-7xl mx-auto w-full h-fit top-0 sticky bg-background shadow-md shadow-background">
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
          <Button variant="secondary" className="flex-1 w-48 lg:w-80 text-muted-foreground cursor-pointer">
            <div className="w-full flex justify-between">
              <span>Search</span>
              <span>&#8984;K</span>
            </div>
          </Button>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
        </SignedIn>
        <ClerkLoading>
          <Image src="/profile.png" width={35} height={35} priority alt="Sign-in" className="w-8 h-8" />
        </ClerkLoading>
        <ModeToggle />
      </div>
    </header>
  );
};
export { Header };
