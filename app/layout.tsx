import Toast from "@/components/ui/Toast";
import { AuthProvider } from "../components/auth/AuthProvider";
import Header from "./Header";
import "./globals.css";
import { Signika_Negative } from "next/font/google";
import Footer from "./Footer";

const signika = Signika_Negative({ subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "My Safe House",
  description: "Keep your information secure with us",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={signika.className + " text-base bg-slate-50 flex flex-col min-h-screen h-screen relative"}>
        <AuthProvider>
          <Header />
          <main className="flex-1 px-3 md:px-10 pt-5 pb-10 flex">{children}</main>
          <Footer />
        </AuthProvider>
        <Toast />
      </body>
    </html>
  );
}
