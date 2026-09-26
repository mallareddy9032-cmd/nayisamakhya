import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Digital Desk Poster | Nayi Samakhya",
  description:
    "Printable A4 poster with Telegram Digital Service Desk QR code for Nayi Samakhya Telangana.",
};

export default function PosterLayout({ children }: { children: ReactNode }) {
  return children;
}
