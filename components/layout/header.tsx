import { ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ui/theme-toggle";
import Image from "next/image";
import { Navigation } from "./navigation";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="flex items-center gap-5 p-5 max-w-7xl mx-auto w-full h-fit top-0 sticky bg-background shadow-md shadow-background">
      <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
      <h1 className="uppercase text-xl">Safehouse</h1>
      <SignedIn>
        <Navigation />
      </SignedIn>
      <div className="ml-auto flex items-center gap-5">
        <SignedIn>
          <Button variant="secondary" className="w-80 text-muted-foreground">
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
