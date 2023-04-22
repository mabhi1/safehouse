import { AuthProvider } from "../components/AuthProvider";
import Header from "../components/Header";
import "./globals.css";
import { Signika_Negative } from "next/font/google";

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
      <body className={signika.className}>
        <AuthProvider>
          <main className="py-5 px-10 text-base bg-slate-50">
            <Header />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
