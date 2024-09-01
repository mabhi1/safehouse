"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  href: string;
}
export default function PageMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const isActive = (item: MenuItem) => {
    return pathname === item.href;
  };

  return (
    <ul className="space-y-1">
      {menuItems.map((item) => (
        <li
          key={item.title}
          className={cn(
            "hover:text-foreground capitalize w-fit cursor-pointer",
            isActive(item) ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Link href={item.href}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}
