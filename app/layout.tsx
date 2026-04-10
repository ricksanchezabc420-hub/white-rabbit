import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import CartDrawer from "@/components/CartDrawer";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WHITE RABBIT | Psilocybin Reimagined",
  description: "Fast-acting, flavourful, and formulated for the modern mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${serif.variable} antialiased bg-[#000000] text-white selection:bg-neon-pink/30`}
      >
        <div className="fixed inset-0 pointer-events-none z-[100] neon-border-glow animate-slow-pulse" />
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
