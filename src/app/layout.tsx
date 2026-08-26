import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";

/** Editorial serif for hero display type; exposed as the CSS var --font-cormorant. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drishya — Explore Sudurpaschim",
  description:
    "An interactive tourism platform for Nepal's Sudurpaschim Province — hover the district map, discover destinations, guides, and an AI travel assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cormorant.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const t=localStorage.getItem("drishya-theme");if(t==="dark")document.documentElement.dataset.theme="dark"})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
