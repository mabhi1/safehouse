"use client";
import { toggleMobileSearchForm } from "@/utils/toggleMobile";
import { BiSearchAlt } from "react-icons/bi";

type Props = {};
const MobileSearchButton = (props: Props) => {
  return <BiSearchAlt className="text-3xl text-slate-500" onClick={() => toggleMobileSearchForm()} />;
};
export default MobileSearchButton;
