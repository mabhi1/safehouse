"use client";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BookCopy, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { platformLinks, storageLinks } from "./navigation";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="h-dvh overflow-y-auto p-0">
        <SheetHeader className="flex-row gap-4 items-center space-y-0 top-0 sticky bg-background/50 backdrop-blur-md px-6 py-4">
          <SheetClose asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetClose>
          <SheetTitle className="uppercase font-normal">
            <SheetClose asChild>
              <Link href="/">Safehouse</Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="ml-2 font-medium px-6 mt-2">
          <SheetClose asChild>
            <Link href="/contact">Contact</Link>
          </SheetClose>
        </div>
        <SignedIn>
          <ul className="space-y-5 ml-2 overflow-y-auto px-6 mt-5">
            <div className="font-medium">Storage</div>
            {storageLinks.map((storage) => (
              <li key={storage.title}>
                <div className="space-y-5">
                  <SheetClose asChild>
                    <Link href={storage.href} className="flex gap-3 items-center ml-2">
                      {storage.icon("w-4 h-4")}
                      <div className="text-sm">
                        {storage.title}
                        {storage.isNew && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full p-1 px-2 animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                    </Link>
                  </SheetClose>
                  {storage.subMenu && storage.subMenu.length && (
                    <ul className="space-y-5 ml-8">
                      {storage.subMenu.map((item) => (
                        <li key={item.title}>
                          <SheetClose asChild>
                            <Link href={item.href} className="flex gap-3 items-center ml-2">
                              {item.icon("w-4 h-4")}
                              <div className="text-sm">{item.title}</div>
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </SignedIn>
        <ul className="space-y-5 ml-2 px-6 pb-20 mt-5">
          <div className="font-medium">Platform</div>
          <li>
            <SheetClose asChild>
              <Link href="/about" className="flex gap-3 items-center ml-2">
                <BookCopy className="w-4 h-4" />
                <span className="text-sm">About</span>
              </Link>
            </SheetClose>
          </li>
          {platformLinks.map((link) => {
            if (link.auth)
              return (
                <SignedIn key={link.title}>
                  <li>
                    <SheetClose asChild>
                      <Link href={link.href} className="flex gap-3 items-center ml-2">
                        {link.icon("w-4 h-4")}
                        <div className="text-sm">{link.title}</div>
                      </Link>
                    </SheetClose>
                  </li>
                </SignedIn>
              );
            return (
              <li key={link.title}>
                <SheetClose asChild>
                  <Link href={link.href} className="flex gap-3 items-center ml-2">
                    {link.icon("w-4 h-4")}
                    <div className="text-sm">{link.title}</div>
                  </Link>
                </SheetClose>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
