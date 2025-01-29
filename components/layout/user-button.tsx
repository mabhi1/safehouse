"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

export default function UserProfileButton() {
  const { theme } = useTheme();
  return (
    <div className="ml-auto flex items-center justify-center">
      <SignedIn>
        <UserButton
          appearance={{
            elements: { userButtonAvatarBox: "w-8 h-8", userButtonPopoverCard: "ml-4" },
            baseTheme:
              theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? dark
                : undefined,
          }}
        />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Image
            src="/profile.png"
            height={10}
            width={10}
            alt="Sign In"
            className="w-8 h-8 border border-muted-foreground rounded-full cursor-pointer bg-muted-foreground"
          />
        </Link>
      </SignedOut>
    </div>
  );
}
