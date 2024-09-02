"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function UserProfileButton() {
  const { theme } = useTheme();
  return (
    <UserButton
      appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" }, baseTheme: theme === "dark" ? dark : undefined }}
    />
  );
}
