import { FolderType } from "@/lib/types/dbTypes";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  folder: FolderType;
  setSelected: Dispatch<SetStateAction<FolderType | null>>;
};
const IndividualFolder = ({ folder, setSelected }: Props) => {
  return (
    <>
      <div className="relative">
        <Link href={`/docs/${folder.id}`}>
          <div className="flex flex-col items-center text-center rounded hover:bg-slate-200">
            <Image src="/folder.png" width={70} height={70} alt={folder.name} priority />
            <div className="w-24 break-words text-slate-900">{folder.name}</div>
          </div>
        </Link>
        <BsThreeDotsVertical onClick={() => setSelected(folder)} className="cursor-pointer absolute right-0 top-0" />
      </div>
    </>
  );
};
export default IndividualFolder;
