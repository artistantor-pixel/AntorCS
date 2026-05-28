import type { Metadata } from "next";
import { Inter, Playfair_Display, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "Antor | Motion & Visual Experiences",
  description: "Crafting Motion, Identity & Visual Experiences. A digital creative portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${hindSiliguri.variable} antialiased h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground selection:bg-foreground selection:text-background flex flex-col overflow-x-hidden">
        <LanguageProvider>
          <Navigation />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
