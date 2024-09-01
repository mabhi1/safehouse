import Link from "next/link";

export const metadata = {
  title: "Notes",
};

const menuItems = [
  { title: "browse", href: "/notes" },
  { title: "add new", href: "/notes/create" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="space-y-5 w-52 h-fit sticky top-24 bg-background">
        <span className="uppercase text-lg">Notes</span>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li
              key={item.title}
              className="text-muted-foreground hover:text-foreground capitalize w-fit cursor-pointer"
            >
              <Link href={item.href}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}
