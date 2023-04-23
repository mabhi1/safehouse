import { BiCopyright } from "react-icons/bi";

type Props = {};
const Footer = (props: Props) => {
  return (
    <footer className="bg-slate-900 text-slate-50 flex justify-center gap-1 items-center">
      <BiCopyright /> 2023. All Rights Reserved
    </footer>
  );
};
export default Footer;
