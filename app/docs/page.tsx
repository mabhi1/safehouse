import Files from "@/components/docs/Files";
import Folders from "@/components/docs/Folders";
import Location from "@/components/docs/Location";

type Props = {};
const Docs = (props: Props) => {
  return (
    <>
      <div className="flex flex-col gap-5 flex-1">
        <Location folderId="root" />
        <Folders folderId="root" />
        <Files folderId="root" />
      </div>
    </>
  );
};
export default Docs;
