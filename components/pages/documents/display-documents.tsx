import IndividualFolder from "./individual-folder";
import IndividualFile from "./individual-file";
import { auth } from "@clerk/nextjs/server";
import { getCurrentFolder, getFiles, getFolders } from "@/firebase/store-functions";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { AddFolderForm } from "./add-folder-form";
import { Badge } from "@/components/ui/badge";
import { AddFileForm } from "./add-file-form";

interface Node {
  children: React.ReactNode;
}
const SectionHeader = ({ children }: Node) => {
  return <div className="flex justify-between items-center gap-5">{children}</div>;
};
const SectionBody = ({ children }: Node) => {
  return <div className="flex flex-wrap gap-5">{children}</div>;
};
const Section = ({ children }: Node) => {
  return <div className="flex flex-col gap-1 w-full">{children}</div>;
};

const DisplayDocumets = async ({ folderId }: { folderId: string }) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const folders = await getFolders({ currentUser: userId, folderId });
  const files = await getFiles({ currentUser: userId, folderId });
  const currentFolderPath = await getCurrentFolder({ folderId, currentUser: userId });

  return (
    <div className="flex flex-col gap-8 flex-1">
      <Breadcrumb>
        <BreadcrumbList>
          {currentFolderPath ? (
            <>
              {currentFolderPath.path.map(({ id, name }: { id: string; name: string }) => (
                <>
                  <BreadcrumbItem key={id}>
                    <BreadcrumbLink asChild>
                      <Link href={`/documents/${id === "root" ? "" : id}`}>{id === "root" ? "Home" : name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>{currentFolderPath.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Folder Section */}
      <Section>
        <SectionHeader>
          <span>
            Folders
            <Badge variant="secondary" className="font-normal ml-1">
              {folders.length}
            </Badge>
          </span>
          <AddFolderForm
            folderId={folderId}
            folders={folders.map((folder) => {
              return { id: folder.id, name: folder.name, path: folder.path };
            })}
            currentFolderPath={currentFolderPath}
            userId={userId}
          />
        </SectionHeader>
        <SectionBody>
          {folders.map((folder) => (
            <IndividualFolder folder={folder} key={folder.id} userId={userId} />
          ))}
        </SectionBody>
      </Section>

      <Separator />

      {/* File Section */}
      <Section>
        <SectionHeader>
          <span>
            Files
            <Badge variant="secondary" className="font-normal ml-1">
              {files.length}
            </Badge>
          </span>
          <AddFileForm
            folderId={folderId}
            allFiles={files.map((file) => {
              return { dbId: file.dbId, id: file.id, name: file.name, uid: file.uid, url: file.url };
            })}
            currentFilePath={currentFolderPath}
            userId={userId}
          />
        </SectionHeader>
        <SectionBody>
          {files.map((file) => (
            <IndividualFile file={file} key={file.id} />
          ))}
        </SectionBody>
      </Section>
    </div>
  );
};

export { DisplayDocumets };
