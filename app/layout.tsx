import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-family-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-body",
});

export const metadata: Metadata = {
  title: "MindCalc",
  description: "Desbloqueie sua mente para os números",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
