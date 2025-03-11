import { getBillGroupsByUser } from "@/prisma/db/billGroups";
import { auth } from "@clerk/nextjs/server";
import SplitBillSidebar from "@/components/pages/split-bill/split-bill-sidebar";

export const metadata = {
  title: "Split Bill",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  // If no user, we'll just render the children (which will handle redirection)
  if (!userId) {
    return <>{children}</>;
  }

  const { data: groups } = await getBillGroupsByUser(userId);

  return (
    <div className="md:pt-4">
      <div className="flex flex-col md:flex-row gap-5 md:gap-14">
        <div className="hidden lg:block top-28 sticky h-fit">
          <SplitBillSidebar groups={groups || []} userId={userId} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
