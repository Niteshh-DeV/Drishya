import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Intro } from "@/components/site/Intro";
import { PageTransition } from "@/components/site/PageTransition";
import { SessionProvider } from "@/components/site/SessionProvider";
import { SmoothScroll } from "@/components/site/SmoothScroll";
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

/** Phone browser chrome matches the page in either theme. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#142019" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cormorant.variable}>
      <head>
        {/* Runs before first paint: applies the saved theme, and plays the
            intro only on the first page of a browser session ("playing"
            holds title reveals until the intro lifts). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const d=document.documentElement;try{const t=localStorage.getItem("drishya-theme");if(t==="dark")d.dataset.theme="dark"}catch{}try{if(sessionStorage.getItem("drishya-intro"))d.dataset.intro="seen";else{sessionStorage.setItem("drishya-intro","1");d.dataset.intro="playing";setTimeout(()=>{d.dataset.intro="seen"},3200)}}catch{d.dataset.intro="seen"}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <Intro />
        <SmoothScroll />
        <SessionProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
