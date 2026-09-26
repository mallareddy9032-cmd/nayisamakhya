import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Community notice | Nayi Samakhya Digital Desk",
  description:
    "WhatsApp-ready Telugu announcement for the Nayi Samakhya Digital Service Desk — copy and share with mandal groups.",
};

export default function AnnounceLayout({ children }: { children: ReactNode }) {
  return children;
}
