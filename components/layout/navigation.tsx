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
import {
  CalendarCog,
  ChartArea,
  Coins,
  FolderOpen,
  GlobeLock,
  HandCoins,
  KeySquare,
  Layers2,
  Monitor,
  NotebookPen,
  ShieldCheck,
  WalletMinimal,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";

export const expensesSubMenu = [
  {
    title: "Dashboard",
    icon: (className: string) => <Monitor className={className} />,
    href: "/expenses",
  },
  {
    title: "Expenses",
    icon: (className: string) => <Coins className={className} />,
    href: "/expenses/expense-list",
  },
  {
    title: "Reports/Analytics",
    icon: (className: string) => <ChartArea className={className} />,
    href: "/expenses/reports",
  },
  {
    title: "Categories",
    icon: (className: string) => <Layers2 className={className} />,
    href: "/expenses/categories",
  },
  {
    title: "Payment Methods",
    icon: (className: string) => <WalletMinimal className={className} />,
    href: "/expenses/payments",
  },
];

export const storageLinks: {
  title: string;
  href: string;
  description: string;
  icon: (className: string) => React.JSX.Element;
  isNew?: boolean;
  subMenu?: {
    title: string;
    href: string;
    icon: (className: string) => React.JSX.Element;
  }[];
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
    title: "Passwords",
    href: "/passwords",
    description: "Store encrypted login credentials for any website.",
    icon: (className: string) => <ShieldCheck className={className} />,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    description: "Save and organize your favorite websites with custom notes.",
    icon: (className: string) => <Bookmark className={className} />,
    isNew: true,
  },
  {
    title: "Expenses",
    href: "/expenses",
    description: "Track and manage your expenses effortlessly with a modern UI.",
    icon: (className: string) => <HandCoins className={className} />,
    isNew: true,
    subMenu: expensesSubMenu,
  },
];

export const platformLinks: {
  title: string;
  href: string;
  description: string;
  icon: (className: string) => React.JSX.Element;
  auth?: boolean;
  isNew?: boolean;
}[] = [
  {
    title: "Encryption Strategy",
    description: "End-to-end encryption used to encrypt your sensitive data.",
    href: "/encryption-strategy",
    icon: (className: string) => <GlobeLock className={className} />,
  },
  {
    title: "Master Password",
    description: "Manage your master password required to encrypt/decrypt your sensitive data.",
    href: "/master-password",
    auth: true,
    icon: (className: string) => <KeySquare className={className} />,
  },
];

export function Navigation({ className }: { className?: string }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Platform</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <Image
                      src="/icon.png"
                      alt="Safe House"
                      width={1182}
                      height={1280}
                      priority
                      className="w-[3.6rem] h-auto"
                    />
                    <div className="mb-2 mt-4 text-base font-medium">About safehouse</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manage your data with end-to-end encryption. Simple, safe, and accessible across devices.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {platformLinks.map((link) => {
                if (link.auth)
                  return (
                    <SignedIn key={link.title}>
                      <ListItem href={link.href} title={link.title}>
                        {link.description}
                      </ListItem>
                    </SignedIn>
                  );
                return (
                  <ListItem href={link.href} title={link.title} key={link.title}>
                    {link.description}
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <SignedIn>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Storage</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {storageLinks.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href} isNew={component.isNew}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </SignedIn>
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  isNew?: boolean;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, isNew = false, ...props }, ref) => {
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
            <div className="text-sm font-medium leading-none flex gap-2 items-end">
              {title}
              {isNew && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 animate-pulse">New</span>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
