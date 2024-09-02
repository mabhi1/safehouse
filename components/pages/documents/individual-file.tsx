import { FileType } from "@/lib/db-types";
import Image from "next/image";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

type Props = {
  file: FileType;
};
const IndividualFile = ({ file }: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <a
          href={file.url}
          target="_blank"
          className="flex flex-col items-center text-center rounded hover:bg-accent p-1 gap-1"
        >
          <Image src="/file.png" width={70} height={70} alt={file.name} priority />
          <div className="w-24 break-words">{file.name}</div>
        </a>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem className="text-destructive focus:text-destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default IndividualFile;
