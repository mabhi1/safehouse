import Toast from "@/components/ui/Toast";
import { AuthProvider } from "../components/auth/AuthProvider";
import Header from "./Header";
import "./globals.css";
import { Signika_Negative } from "next/font/google";
import Footer from "./Footer";
import MobileMenu from "@/components/ui/MobileMenu";
import DesktopMenu from "@/components/ui/DesktopMenu";
import MobileSearchForm from "@/components/ui/MobileSearchForm";
import ConfirmBox from "@/components/ui/ConfirmBox";

const signika = Signika_Negative({ subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Safe House",
  description: "Keep your information secure with us",
};

export default function RootLayout({ children }: { children: React.ReactNode | any }) {
  return (
    <html lang="en">
      <body className={signika.className + " text-base bg-slate-50 flex flex-col"}>
        <AuthProvider>
          <Header />
          <MobileSearchForm />
          <MobileMenu />
          <main className="flex-1 flex min-h-screen">
            <DesktopMenu />
            <div className="p-3 md:p-5 flex-1">{children}</div>
          </main>
          <Footer />
        </AuthProvider>
        <Toast />
        <ConfirmBox />
      </body>
    </html>
  );
}
