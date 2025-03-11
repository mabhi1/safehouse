"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BillTabsProps {
  billId: string;
}

export default function BillTabs({ billId }: BillTabsProps) {
  const pathname = usePathname();

  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (pathname.includes("/members")) return "members";
    if (pathname.includes("/summary")) return "summary";
    return "expenses"; // Default to expenses tab
  };

  return (
    <Tabs value={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="members" asChild>
          <Link href={`/split-bill/${billId}/members`}>Members</Link>
        </TabsTrigger>
        <TabsTrigger value="expenses" asChild>
          <Link href={`/split-bill/${billId}/expenses`}>Expenses</Link>
        </TabsTrigger>
        <TabsTrigger value="summary" asChild>
          <Link href={`/split-bill/${billId}/summary`}>Summary</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
