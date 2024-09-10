import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CalendarCog, CreditCard, FolderOpen, NotebookPen, ShieldCheck } from "lucide-react";

export const storageLinks: {
  title: string;
  href: string;
  description: string;
  icon: (className: string) => React.JSX.Element;
}[] = [
  {
    title: "Documents",
    href: "/documents",
    description: "Upload your documents and securely access from anywhere.",
    icon: (className: string) => <FolderOpen className={className} />,
  },
  {
    title: "Notes",
    href: "/notes",
    description: "Create important notes from anywhere. Edit and Delete them.",
    icon: (className: string) => <NotebookPen className={className} />,
  },
  {
    title: "Events",
    href: "/events",
    description: "Go through the calendar. Add or Remove daily events.",
    icon: (className: string) => <CalendarCog className={className} />,
  },
  {
    title: "Cards",
    href: "/cards",
    description: "Add Debit or Credit Cards. All the data is encrypted and stored.",
    icon: (className: string) => <CreditCard className={className} />,
  },
  {
    title: "Passwords",
    href: "/passwords",
    description: "Store encrypted login credentials for any website.",
    icon: (className: string) => <ShieldCheck className={className} />,
  },
];

export function Navigation({ className }: { className?: string }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Storage</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {storageLinks.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href!}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
