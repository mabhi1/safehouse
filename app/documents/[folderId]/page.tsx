import { DisplayDocumets } from "@/components/pages/documents/display-documents";

export const dynamic = "force-dynamic";

type Props = {
  params: { folderId: string };
};
const Folder = async ({ params: { folderId } }: Props) => {
  return <DisplayDocumets folderId={folderId} />;
};
export default Folder;
