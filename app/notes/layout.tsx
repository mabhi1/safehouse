import PageMenu from "@/components/ui/page-menu";

export const metadata = {
  title: "Notes",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { title: "browse notes", href: "/notes" },
    { title: "create a note", href: "/notes/create" },
  ];
  return (
    <div className="flex">
      <div className="space-y-5 w-48 h-fit sticky top-24 bg-background hidden lg:block">
        <span className="uppercase text-lg">Notes</span>
        <PageMenu menuItems={menuItems} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
