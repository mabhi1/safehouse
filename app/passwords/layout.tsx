import PageMenu from "@/components/ui/page-menu";

export const metadata = {
  title: "Passwords",
};

const menuItems = [
  { title: "browse passwords", href: "/passwords" },
  { title: "create a password", href: "/passwords/create" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="space-y-5 w-48 h-fit sticky top-24 bg-background hidden lg:block">
        <span className="uppercase text-lg">Passwords</span>
        <PageMenu menuItems={menuItems} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
