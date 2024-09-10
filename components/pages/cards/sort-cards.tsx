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
import { SearchX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SortCards({ isSearching }: { isSearching: boolean }) {
  const sortValue = useSearchParams().get("sort");
  const [value, setValue] = useState(sortValue || "lastUpdated");
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (newSortValue: string) => {
    setValue(newSortValue);
    router.push(`${pathname}?sort=${newSortValue}`);
  };

  return isSearching ? (
    <>
      <Link href="/cards" passHref legacyBehavior>
        <Button variant="outline" size="icon" className="md:hidden">
          <SearchX className="w-[1.2rem] h-[1.2rem]" />
        </Button>
      </Link>
      <Link href="/cards" passHref legacyBehavior>
        <Button variant="secondary" className="hidden md:block">
          Remove Search
        </Button>
      </Link>
    </>
  ) : (
    <Select defaultValue={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Sort Cards" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem value="lastUpdated">Last Updated</SelectItem>
          <SelectItem value="firstUpdated">First Updated</SelectItem>
          <SelectItem value="bankAsc">Bank: A to Z</SelectItem>
          <SelectItem value="bankDesc">Bank: Z to A</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
