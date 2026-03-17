import type { ReactNode } from "react";
import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} bg-bg-primary text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
