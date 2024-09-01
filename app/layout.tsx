import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";

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
    <ClerkProvider appearance={{ baseTheme: shadesOfPurple }}>
      <html lang="en" suppressHydrationWarning>
        <body className={heebo.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <main className="w-full max-w-7xl mx-auto p-5 text-sm">{children}</main>
            <Toaster closeButton richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
