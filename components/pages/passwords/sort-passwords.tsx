"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SortNotes() {
  const sortValue = useSearchParams().get("sort");
  const [value, setValue] = useState(sortValue || "lastUpdated");
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (newSortValue: string) => {
    setValue(newSortValue);
    router.push(`${pathname}?sort=${newSortValue}`);
  };

  return (
    <Select defaultValue={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Sort Notes" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem value="lastUpdated">Last Updated</SelectItem>
          <SelectItem value="firstUpdated">First Updated</SelectItem>
          <SelectItem value="siteAsc">Site: A to Z</SelectItem>
          <SelectItem value="siteDesc">Site: Z to A</SelectItem>
          <SelectItem value="usernameAsc">Username: A to Z</SelectItem>
          <SelectItem value="usernameDesc">Username: Z to A</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
