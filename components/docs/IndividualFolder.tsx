import { FolderType } from "@/lib/types/dbTypes";
import Image from "next/image";
import Link from "next/link";

type Props = {
  folder: FolderType;
};
const IndividualFolder = ({ folder }: Props) => {
  return (
    <Link href={`/docs/${folder.id}`}>
      <div className="flex flex-col items-center text-center rounded hover:bg-slate-200">
        <Image src="/folder.png" width={70} height={70} alt={folder.name} priority />
        <div className="w-24 break-words text-slate-900">{folder.name}</div>
      </div>
    </Link>
  );
};
export default IndividualFolder;
