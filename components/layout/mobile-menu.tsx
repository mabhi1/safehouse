"use client";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BookCopy, GlobeLock, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { storageLinks } from "./navigation";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="w-[1.2rem] h-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="space-y-5">
        <SheetHeader className="flex-row gap-4 items-center space-y-0">
          <SheetClose asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-[1.2rem] h-[1.2rem]" />
            </Button>
          </SheetClose>
          <SheetTitle className="uppercase font-normal">
            <SheetClose asChild>
              <Link href="/">Safehouse</Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="ml-2 font-medium">
          <SheetClose asChild>
            <Link href="/contact">Contact</Link>
          </SheetClose>
        </div>
        <SignedIn>
          <ul className="space-y-5 ml-2">
            <div className="font-medium">Storage</div>
            {storageLinks.map((storage) => (
              <li key={storage.title}>
                <SheetClose asChild>
                  <Link href={storage.href} className="flex gap-3 items-center ml-2">
                    {storage.icon("w-4 h-4")}
                    <span className="text-sm">{storage.title}</span>
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </SignedIn>
        <ul className="space-y-5 ml-2">
          <div className="font-medium">Platform</div>
          <li>
            <SheetClose asChild>
              <Link href="/" className="flex gap-3 items-center ml-2">
                <BookCopy className="w-4 h-4" />
                <span className="text-sm">About</span>
              </Link>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Link href="/" className="flex gap-3 items-center ml-2">
                <GlobeLock className="w-4 h-4" />
                <span className="text-sm">Encryption</span>
              </Link>
            </SheetClose>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
