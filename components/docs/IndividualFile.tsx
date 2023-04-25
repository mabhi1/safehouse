import { FileType } from "@/lib/types/dbTypes";
import Image from "next/image";

type Props = {
  file: FileType;
};
const IndividualFile = ({ file }: Props) => {
  return (
    <a href={file.url} target="_blank">
      <div className="flex flex-col items-center text-center rounded hover:bg-slate-200">
        <Image src="/file.png" width={70} height={70} alt={file.name} priority />
        <div className="w-24 break-words text-slate-900">{file.name}</div>
      </div>
    </a>
  );
};
export default IndividualFile;
