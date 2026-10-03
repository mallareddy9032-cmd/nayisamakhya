import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Telugu, Plus_Jakarta_Sans, Suranna } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import CivicFooter from "@/components/CivicFooter";
import { InAppBrowserBanner } from "@/components/InAppBrowserBanner";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonLd";
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

const titleDefault =
  "నాయీ సమాఖ్య తెలంగాణ • Nayi Samakhya 2.0";
const description =
  "తెలంగాణ నాయీబ్రాహ్మణుల హక్కుల సాధికారత, జీవో నం. 23 ఉచిత విద్యుత్ రక్షణ, సెలూన్ ఎంటర్‌ప్రైజ్ హబ్ మరియు కమ్యూనిటీ పోర్టల్.";
const ogTitle =
  "నాయీ సమాఖ్య 2.0 • రాష్ట్ర స్థాయి సాధికారత & సేవా వేదిక";
const ogDescription =
  "జీవో నం. 23 ఉచిత విద్యుత్ అమలు, సెలూన్ సమూహ సేకరణ మరియు యువత నైపుణ్య వేదిక.";
const twitterDescription =
  "సెలూన్ ఎంటర్‌ప్రైజ్ హబ్, జీవో 23 చట్టబద్ధ రక్షణ & కమ్యూనిటీ వేదిక.";
const ogImage = {
  url: "/og-banner.png",
  width: 1200,
  height: 630,
  alt: "నాయీ సమాఖ్య తెలంగాణ 2.0",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nayisamakhya.org"),
  title: {
    default: titleDefault,
    template: "%s | నాయీ సమాఖ్య తెలంగాణ",
  },
  description,
  keywords: [
    "నాయీ సమాఖ్య",
    "Nayi Samakhya",
    "Telangana Barbers",
    "G.O. 23",
    "Salon Hub",
    "BC Welfare",
    "Free Electricity 250 Units",
    "Mandal Sprint",
  ],
  applicationName: "Nayi Samakhya",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "te_IN",
    url: "https://nayisamakhya.org",
    siteName: "నాయీ సమాఖ్య తెలంగాణ",
    title: ogTitle,
    description: ogDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: twitterDescription,
    images: ["/og-banner.png"],
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
      className={`${sans.variable} ${telugu.variable} ${displayTe.variable} h-full overflow-x-hidden`}
    >
      <body className="flex min-h-[100dvh] flex-col justify-between overflow-x-hidden bg-civic-paper font-sans text-civic-ink antialiased selection:bg-civic-bronze selection:text-white pt-[env(safe-area-inset-top,0px)]">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <InAppBrowserBanner />
          <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden">
            <AppShell>{children}</AppShell>
          </div>
          <CivicFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
