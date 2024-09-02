export const metadata = {
  title: "Documents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <span className="uppercase text-lg">Documents</span>
      {children}
    </div>
  );
}
