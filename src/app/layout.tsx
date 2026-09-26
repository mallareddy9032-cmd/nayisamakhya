import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Telugu, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 | \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d",
  description: "\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c3e\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c24, \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c23 \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02.",
  applicationName: "Nayi Samakhya",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#B45309",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="te"
      suppressHydrationWarning
      className={`${sans.variable} ${telugu.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col bg-[#FBFBFA] font-sans text-[#0F172A] antialiased selection:bg-[#B45309] selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
