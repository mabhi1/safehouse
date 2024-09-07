"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SortNotes({ isSearching }: { isSearching?: boolean }) {
  const sortValue = useSearchParams().get("sort");
  const [value, setValue] = useState(sortValue || "lastUpdated");
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (newSortValue: string) => {
    setValue(newSortValue);
    router.push(`${pathname}?sort=${newSortValue}`);
  };

  return isSearching ? (
    <Link href="/notes" passHref legacyBehavior>
      <Button variant="secondary">Remove Search</Button>
    </Link>
  ) : (
    <Select defaultValue={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Sort Notes" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem value="lastUpdated">Last Updated</SelectItem>
          <SelectItem value="firstUpdated">First Updated</SelectItem>
          <SelectItem value="titleAsc">Title: A to Z</SelectItem>
          <SelectItem value="titleDesc">Title: Z to A</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
