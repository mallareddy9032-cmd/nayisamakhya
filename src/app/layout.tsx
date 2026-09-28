import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Telugu, Plus_Jakarta_Sans, Suranna } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import CivicFooter from "@/components/CivicFooter";
import { InAppBrowserBanner } from "@/components/InAppBrowserBanner";
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

const displayTe = Suranna({
  subsets: ["telugu", "latin"],
  weight: "400",
  variable: "--font-display-te",
  display: "swap",
});

const title =
  "\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 | \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d";
const description =
  "\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c3e\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c24, \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c23 \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02.";
const ogImageUrl = "https://www.nayisamakhya.org/api/og";
const ogImageAlt =
  "\u0c28\u0c3e\u0c2f\u0c40 \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02";
const ogImage = {
  url: ogImageUrl,
  type: "image/png" as const,
  width: 1200,
  height: 630,
  alt: ogImageAlt,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nayisamakhya.org"),
  title,
  description,
  applicationName: "Nayi Samakhya",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Nayi Samakhya",
    locale: "te_IN",
    url: "/",
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl],
  },
};

export const viewport: Viewport = {
  themeColor: "#B45309",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      className={`${sans.variable} ${telugu.variable} ${displayTe.variable} h-full`}
    >
      <body className="flex min-h-[100dvh] flex-col justify-between bg-civic-paper font-sans text-civic-ink antialiased selection:bg-civic-bronze selection:text-white pb-[env(safe-area-inset-bottom,1rem)] pt-[env(safe-area-inset-top,0px)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <InAppBrowserBanner />
          <div className="flex min-h-0 flex-1 flex-col">
            <AppShell>{children}</AppShell>
          </div>
          <CivicFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
