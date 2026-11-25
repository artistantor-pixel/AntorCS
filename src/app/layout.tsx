import type { Metadata } from "next";
import { Inter, Playfair_Display, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { CONTACT_INFO } from "@/config/contact";
import { getSiteUrl } from "@/lib/seo";

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

const siteUrl = getSiteUrl();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Antor Kumar Biswas | Creative Designer, Animator & Brand Strategist",
    template: "%s | Antor Kumar Biswas",
  },
  description:
    "Official portfolio & CV of Antor Kumar Biswas — Creative Designer, 2D/3D Animator, Brand Identity Specialist, and Visual Communicator (BFA Graphic Design, University of Dhaka).",
  keywords: [
    "Antor Kumar Biswas",
    "Antor Biswas",
    "Creative Designer Bangladesh",
    "Graphic Designer Dhaka",
    "2D Animator Bangladesh",
    "3D Motion Designer Dhaka",
    "University of Dhaka Fine Arts",
    "Brand Identity Designer",
    "UI/UX Designer Dhaka",
    "DIKKHA ICT Division Animator",
    "Deepto TV Animator",
  ],
  authors: [{ name: CONTACT_INFO.name, url: siteUrl }],
  creator: CONTACT_INFO.name,
  publisher: CONTACT_INFO.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    url: "/",
    siteName: "Antor Kumar Biswas Portfolio",
    title: "Antor Kumar Biswas | Creative Designer, Animator & Brand Strategist",
    description:
      "Portfolio & Resume of Antor Kumar Biswas — Creative Designer, 2D/3D Animator, and Visual Communicator (BFA Graphic Design, University of Dhaka).",
    images: [
      {
        url: "/antor-portrait.jpg",
        width: 591,
        height: 709,
        alt: "Antor Kumar Biswas — Creative Designer & Animator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antor Kumar Biswas | Creative Designer, Animator & Brand Strategist",
    description:
      "Portfolio & Resume of Antor Kumar Biswas — Brand Identity, 2D/3D Motion & UI Design (Dhaka, Bangladesh).",
    images: ["/antor-portrait.jpg"],
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: CONTACT_INFO.name,
        jobTitle: "Creative Designer, Brand Strategist & 2D/3D Animator",
        email: CONTACT_INFO.email,
        url: siteUrl,
        image: `${siteUrl}/antor-portrait.jpg`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "University of Dhaka — Faculty of Fine Arts",
        },
        knowsAbout: [
          "Graphic Design",
          "Brand Identity",
          "Motion Graphics",
          "2D Animation",
          "3D Animation",
          "Illustration",
          "UI/UX Design",
        ],
      },
      {
        "@type": "WebSite",
        name: "Antor Kumar Biswas Portfolio",
        url: siteUrl,
        inLanguage: ["en", "bn"],
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${hindSiliguri.variable} antialiased h-full`} suppressHydrationWarning>
      <body className="relative min-h-full text-foreground selection:bg-brand-red selection:text-white flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
        </LanguageProvider>
      </body>
    </html>
  );
}

