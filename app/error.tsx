"use client";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type Props = {
  error: Error;
  reset: () => void;
};
const Error = ({ error, reset }: Props) => {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col items-center gap-5 pt-10">
        <h1 className="text-5xl text-red-900">OOPS!</h1>
        <div className="w-56">
          <Image src="/error.png" alt="Error" width={300} height={300} priority />
        </div>
        <span>
          <div className="text-center">You got an error. Please try again and contact us if still exists.</div>
          <div className="text-center">{error.message}</div>
        </span>
        <div className="flex gap-5">
          <Button onClick={reset}>Retry</Button>
          <Link href="/" passHref legacyBehavior>
            <Button>Home</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Error;
