"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, isMatching } from "@/lib/utils";
import AddGroupForm from "./add-group-form";

interface Member {
  id: string;
  userId: string;
}

interface BillGroup {
  id: string;
  name: string;
  description: string | null;
  members: Member[];
}

interface SplitBillSidebarProps {
  groups: BillGroup[];
  userId: string;
}

export default function SplitBillSidebar({ groups, userId }: SplitBillSidebarProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = useMemo(
    () => (searchTerm ? groups.filter((group) => isMatching(group.name, searchTerm)) : groups),
    [searchTerm, groups]
  );

  return (
    <div className="space-y-2 lg:space-y-5 sticky top-4 w-full lg:w-72">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Link href="/split-bill" className="text-xl capitalize">
            Split Bill
          </Link>
          <Badge variant="secondary" className="font-normal">
            {filteredGroups.length}
          </Badge>
        </div>

        <AddGroupForm userId={userId} />
      </div>

      <Input
        className="h-9"
        placeholder="Search groups"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="flex flex-col divide-y">
        {filteredGroups.length === 0 && <li className="p-3 text-sm text-muted-foreground">No groups found</li>}

        {filteredGroups.map((group) => {
          const isActive = pathname.includes(`/split-bill/${group.id}`);
          return (
            <Link key={group.id} href={`/split-bill/${group.id}`}>
              <li
                className={cn(
                  "flex gap-2 justify-between items-center bg-background hover:bg-muted p-3 rounded-lg transition-all duration-500",
                  isActive ? "bg-muted" : "bg-muted/40"
                )}
              >
                <span className="truncate font-medium">{group.name}</span>
                <Badge variant="outline" className="font-normal">
                  {group.members.length}
                </Badge>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
