import type { Metadata, Viewport } from "next";
import { Noto_Sans_Telugu, Plus_Jakarta_Sans } from "next/font/google";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { CivicChatbot } from "@/components/CivicChatbot";
import { CivicFooter } from "@/components/CivicFooter";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { NewsMarquee } from "@/components/NewsMarquee";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-noto-telugu",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "నాయీ సమాఖ్య | Nayi Samakhya",
  description:
    "Authoritative civic portal for Telangana & Andhra Pradesh — welfare, education, livelihood, and mandal services.",
  applicationName: "Nayi Samakhya",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#C2410C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="te"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${notoTelugu.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col bg-[#FBFBF9] font-sans text-[#18181B] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <div className="no-print">
            <AccessibilityBar />
          </div>
          <div className="no-print">
            <FloatingNavbar />
          </div>
          <div className="no-print">
            <NewsMarquee />
          </div>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <div className="no-print">
            <CivicFooter />
          </div>
          <div className="no-print">
            <CivicChatbot />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
