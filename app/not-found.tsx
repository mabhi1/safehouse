"use client";

import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center gap-5">
        <Image src="/not-found.svg" width={300} height={300} alt="Page not found" priority />
        <div className="text-2xl">OOPS! Page not found.</div>
        <Link href="/" passHref legacyBehavior>
          <Button>Back to home</Button>
        </Link>
      </div>
      <Footer />
    </>
  );
}
