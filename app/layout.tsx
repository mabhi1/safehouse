import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/components/providers/search-provider";

const heebo = Heebo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safe House",
  description: "Keep your information secure with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(heebo.className, "min-h-screen flex flex-col")}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SearchProvider>
              <Header />
              <main className="w-full max-w-7xl mx-auto pt-1 px-5 pb-5 text-sm flex-1">{children}</main>
              <Footer />
              <Toaster closeButton richColors position="top-right" />
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
