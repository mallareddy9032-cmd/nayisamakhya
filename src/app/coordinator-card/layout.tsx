import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Coordinator Card | Nayi Samakhya",
  description:
    "Printable digital ID card for Nayi Samakhya mandal coordinators with Telegram desk QR.",
  robots: { index: false, follow: false },
};

export default function CoordinatorCardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
