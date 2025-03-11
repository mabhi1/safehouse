import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SplitBillEmptyState from "@/components/pages/split-bill/split-bill-empty-state";
import { getBillGroupsByUser } from "@/prisma/db/billGroups";
import SplitBillSidebar from "@/components/pages/split-bill/split-bill-sidebar";
export const metadata = {
  title: "Split Bill - My Groups",
};

export default async function SplitBillPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: groups } = await getBillGroupsByUser(userId);

  return (
    <div>
      <div className="lg:hidden">
        <SplitBillSidebar groups={groups || []} userId={userId} />
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <SplitBillEmptyState userId={userId} />
      </div>
    </div>
  );
}
