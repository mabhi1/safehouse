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
import { CalendarCog, CreditCard, FolderOpen, GlobeLock, IdCard, NotebookPen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";

export const storageLinks: {
  title: string;
  href: string;
  description: string;
  icon: (className: string) => React.JSX.Element;
  new?: boolean;
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
  {
    title: "Identity",
    href: "/identity",
    description: "Store passports, driver's licenses, health insurance cards, and other identity documents.",
    icon: (className: string) => <IdCard className={className} />,
    new: true,
  },
];

export const platformLinks: {
  title: string;
  href: string;
  description: string;
  icon: (className: string) => React.JSX.Element;
  new?: boolean;
}[] = [
  {
    title: "Encryption Strategy",
    description: "End-to-end encryption used to encrypt your sensitive data.",
    href: "/encryption-strategy",
    icon: (className: string) => <GlobeLock className={className} />,
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
                      src="/logo.png"
                      alt="Safe House"
                      width={50}
                      height={50}
                      priority
                      className="hidden lg:block"
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">Safehouse</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manage your data with end-to-end encryption. Simple, safe, and accessible across devices.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {platformLinks.map((link) => (
                <ListItem href={link.href} title={link.title} key={link.title}>
                  {link.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <SignedIn>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Storage</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {storageLinks.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href} new={component.new}>
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
  new?: boolean;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
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
            <div className="text-sm font-medium leading-none flex gap-2 items-end">
              {title}
              {props.new && <span className="text-primary animate-bounce">New</span>}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
