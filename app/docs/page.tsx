import Files from "@/components/docs/Files";
import Folders from "@/components/docs/Folders";
import Location from "@/components/docs/Location";
import Button from "@/components/ui/Button";

type Props = {};
const Docs = (props: Props) => {
  return (
    <>
      <div className="flex flex-col gap-5 flex-1">
        <div className="flex justify-between gap-5 items-center">
          <div className="flex gap-5 items-center">
            <h1>Docs</h1>
            <span className="hidden md:flex">
              <Location folderId="root" />
            </span>
          </div>
          <div className="flex gap-5">
            <Button variant={"outline"}>Add Files</Button>
            <Button variant={"outline2"}>Add Folder</Button>
          </div>
        </div>
        <span className="md:hidden">
          <Location folderId="root" />
        </span>
        <Folders folderId="root" />
        <Files folderId="root" />
      </div>
    </>
  );
};
export default Docs;
