"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ExpenseCategoryType } from "@/lib/db-types";
import {
  Banknote,
  BookText,
  Bus,
  Coffee,
  Dumbbell,
  Hotel,
  HousePlug,
  ShoppingCart,
  SquareActivity,
  TvMinimalPlay,
} from "lucide-react";

interface CategoryListProps {
  categories: ExpenseCategoryType[];
}

const icons: Record<string, React.ElementType> = {
  "Food & Dining": Coffee,
  Transportation: Bus,
  Housing: HousePlug,
  Entertainment: TvMinimalPlay,
  Shopping: ShoppingCart,
  "Health & Fitness": Dumbbell,
  "Subscriptions & Memberships": SquareActivity,
  Travel: Hotel,
  Education: BookText,
  Miscellaneous: Banknote,
};

export default function CategoryList({ categories }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(
    () =>
      searchTerm
        ? categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : categories,
    [searchTerm, categories]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Categories</span>
          <Badge variant="secondary" className="font-normal">
            {filteredCategories.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground" />
          <Input
            placeholder="Search Category"
            className="h-9 w-48 md:w-56 pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim().toLowerCase())}
          />
        </div>
      </div>
      {filteredCategories.length === 0 ? (
        <div>No category found.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredCategories.map(({ id, name, expenses }) => {
            const Icon = icons[name] ?? Loader;
            return (
              <li key={id} className="flex items-center gap-2 border rounded p-5">
                <Icon className="w-4 h-4" />
                <div>{name}</div>
                {expenses?.length > 0 && (
                  <div className="bg-primary text-muted ml-auto px-2 rounded-full">{expenses.length}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
