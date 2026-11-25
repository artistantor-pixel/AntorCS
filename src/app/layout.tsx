import type { Metadata } from "next";
import { Inter, Playfair_Display, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { ChatWidget } from "@/components/chat/ChatWidget";

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
  title: "Antor Kumar Biswas | Creative Designer, Animator & Brand Strategist",
  description:
    "Portfolio & Resume of Antor Kumar Biswas — Creative Designer, 2D/3D Animator, and Visual Communicator (BFA Graphic Design, University of Dhaka).",
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
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}

