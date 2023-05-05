import ContactForm from "@/components/footer/ContactForm";
import Link from "next/link";
import { BiCopyright } from "react-icons/bi";

type Props = {};
const classes = {
  link: "hover:text-slate-50",
};
const Footer = (props: Props) => {
  return (
    <footer>
      <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x lg:grid-cols-3 gap-3 lg:gap-10 text-slate-400 bg-cyan-800 py-3 md:py-8 px-3 md:px-10">
        <div className="flex flex-col md:gap-2">
          <div className="md:text-2xl text-slate-50">Safe House</div>
          <div>
            A secure place to keey your confidential and personal data like passwords, bank details, documents and more. All your saved data is in
            encrypted form.
          </div>
        </div>
        <div className="flex flex-col md:gap-2 lg:px-10 pt-1 lg:pt-0">
          <div className="text-slate-50">Navigation Links</div>
          <div className="flex flex-row gap-x-6 lg:flex-col">
            <Link href={"/notes"} className={classes.link}>
              Docs
            </Link>
            <Link href={"/notes"} className={classes.link}>
              Notes
            </Link>
            <Link href={"/notes"} className={classes.link}>
              Calendar
            </Link>
            <Link href={"/notes"} className={classes.link}>
              Banks
            </Link>
            <Link href={"/notes"} className={classes.link}>
              Passwords
            </Link>
          </div>
        </div>
        <ContactForm />
      </div>
      <div className="bg-cyan-950 text-sm text-slate-50 flex justify-center gap-1 items-center py-1 md:py-3">
        <BiCopyright /> 2023. All Rights Reserved
      </div>
    </footer>
  );
};
export default Footer;
