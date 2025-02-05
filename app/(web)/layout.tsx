import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-7xl mx-auto pt-1 px-5 pb-5 text-sm flex-1">{children}</main>
      <Footer />
    </>
  );
}
