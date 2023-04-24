import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { BiCopyright } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";

type Props = {};
const Footer = (props: Props) => {
  return (
    <footer>
      <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x lg:grid-cols-3 gap-5 lg:gap-10 text-slate-400 bg-cyan-800 py-3 md:py-8 px-3 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="text-2xl text-slate-50">Safe House</div>
          <div>
            A secure place to keey your confidential and personal data like passwords, bank details, documents and more. All your saved data is in
            encrypted form.
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:px-10 pt-1 lg:pt-0">
          <div className="text-slate-50">Navigation Links</div>
          <div className="flex flex-row gap-x-6 lg:flex-col">
            <Link href={"/notes"}>Docs</Link>
            <Link href={"/notes"}>Notes</Link>
            <Link href={"/notes"}>Calendar</Link>
            <Link href={"/notes"}>Banks</Link>
            <Link href={"/notes"}>Passwords</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:px-10 pt-1 lg:pt-0">
          <div className="text-slate-50">Newsletter</div>
          <div>Enter your email to join our newsletter</div>
          <div className="flex wrap gap-5">
            <span className="flex items-center relative text-slate-900">
              <MdOutlineMail className="absolute top-1/2 -translate-y-1/2 left-2" />
              <Input type="text" variant={"iconSmall"} wide={"md"} className="border-slate-900" />
            </span>
            <Button variant={"outline"} size={"sm"} className="min-w-auto">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-cyan-950 text-sm text-slate-50 flex justify-center gap-1 items-center py-1 md:py-3">
        <BiCopyright /> 2023. All Rights Reserved
      </div>
    </footer>
  );
};
export default Footer;
