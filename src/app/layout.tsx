import type { ReactNode } from "react";
import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toxinfree.global";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ToxinFree — Global Toxic Substance Awareness",
    template: "%s | ToxinFree",
  },
  description:
    "The first citizen-powered early warning system for invisible toxic substances. Check your asbestos risk, explore global regulations, and protect your family.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "ToxinFree",
  },
  // ── Google Search Console verification ──────────────────────────────────────
  // Replace GOOGLE_SITE_VERIFICATION_CODE with the value from Search Console
  // → Settings → Ownership verification → HTML tag → content="..."
  // verification: {
  //   google: "GOOGLE_SITE_VERIFICATION_CODE",
  // },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} bg-bg-primary text-text-primary antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
