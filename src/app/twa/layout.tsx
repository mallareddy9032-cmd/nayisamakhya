import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Nayi Samakhya Desk | Telegram Mini App",
  description:
    "Telegram Web App hub for petitions, field feed, free-power guidance, and coordinator cards.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TwaLayout({ children }: { children: ReactNode }) {
  return children;
}
