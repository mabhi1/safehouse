"use client";

import { expensesSubMenu } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";
import { ChartArea, Coins, Layers2, Monitor, WalletMinimal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ExpenseMenu = () => {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex md:flex-col md:gap-1">
      {expensesSubMenu.map((item) => (
        <Link href={item.href} key={item.title} className="flex-1 md:flex-none">
          <li
            className={cn(
              "flex gap-2 justify-center md:justify-start items-center bg-background hover:bg-muted p-3 lg:px-5 lg:pr-20 rounded-lg transition-all duration-500",
              (item.title === "Dashboard" ? pathname === item.href : pathname.includes(item.href)) && "bg-muted"
            )}
          >
            {item.icon("w-4 h-4")}
            <span className="hidden lg:inline">{item.title}</span>
          </li>
        </Link>
      ))}
    </ul>
  );
};
