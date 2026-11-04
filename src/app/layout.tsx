import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageTransition } from "@/components/site/PageTransition";
import { SITE_URL } from "@/lib/site";

/** Editorial serif for hero display type; exposed as the CSS var --font-cormorant. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drishya — Explore Sudurpaschim",
    template: "%s | Drishya",
  },
  description:
    "Explore destinations, hidden gems, and local travel guides across Nepal's Sudurpaschim Province with Drishya.",
  applicationName: "Drishya",
  keywords: [
    "Sudurpaschim",
    "Nepal tourism",
    "travel guide",
    "destination discovery",
    "hidden gems",
    "local guide",
    "Kailali",
    "Darchula",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Drishya — Explore Sudurpaschim",
    description:
      "Discover the districts, paths, and unforgettable places of western Nepal through an immersive travel experience.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Drishya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drishya — Explore Sudurpaschim",
    description:
      "Discover the districts, hidden gems, and travel stories of Nepal's Sudurpaschim Province.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cormorant.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const t=localStorage.getItem("drishya-theme");if(t==="dark")document.documentElement.dataset.theme="dark"}catch{}})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
