import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
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
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <body className={cn(heebo.className, "min-h-screen flex flex-col")}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SearchProvider>
              {children}
              <Toaster closeButton richColors position="top-right" />
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
