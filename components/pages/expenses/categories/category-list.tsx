"use client";

import { Badge } from "@/components/ui/badge";
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
  Loader,
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
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-xl capitalize">Categories</span>
          <Badge variant="secondary" className="font-normal">
            {categories.length}
          </Badge>
        </div>
      </div>
      {categories.length === 0 ? (
        <div>No category found.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map(({ id, name, expenses }) => {
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
