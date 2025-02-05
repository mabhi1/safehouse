import { DisplayDocumets } from "@/components/pages/documents/display-documents";

export const dynamic = "force-dynamic";

const Documents = async () => {
  return <DisplayDocumets folderId="root" />;
};
export default Documents;
