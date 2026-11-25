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
      <body className="relative min-h-full text-foreground selection:bg-brand-red selection:text-white flex flex-col overflow-x-hidden">
        {/* Global subtle editorial gradient & paper texture canvas */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full bg-brand-red/[0.05] blur-[120px]" />
          <div className="absolute top-[28%] -right-32 w-[46rem] h-[46rem] rounded-full bg-brand-tan/[0.16] blur-[130px]" />
          <div className="absolute -bottom-36 left-[20%] w-[38rem] h-[38rem] rounded-full bg-amber-500/[0.045] blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.22] bg-[radial-gradient(rgba(28,27,24,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>
        <LanguageProvider>
          <Navigation />
          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}

