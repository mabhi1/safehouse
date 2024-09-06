"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center mt-10">
      <SignUp
        appearance={{ baseTheme: theme === "dark" ? dark : undefined, elements: { formButtonPrimary: "bg-primary" } }}
      />
    </div>
  );
}
