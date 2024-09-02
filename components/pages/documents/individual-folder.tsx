import { FolderType } from "@/lib/db-types";
import Image from "next/image";
import Link from "next/link";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DeleteFolderButton } from "./delete-folder-button";
import { RenameFolderButton } from "./rename-folder-button";

type Props = {
  folder: FolderType;
  userId: string;
};
const IndividualFolder = ({ folder, userId }: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={`/documents/${folder.id}`}
          className="flex flex-col items-center text-center rounded hover:bg-accent p-1"
        >
          <Image src="/folder.png" width={70} height={70} alt={folder.name} priority />
          <div className="w-24 break-words">{folder.name}</div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <RenameFolderButton userId={userId} folderId={folder.id} folderName={folder.name} />
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <DeleteFolderButton userId={userId} folderId={folder.id} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default IndividualFolder;
