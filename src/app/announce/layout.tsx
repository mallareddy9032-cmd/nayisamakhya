import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WhatsApp message kit | Nayi Samakhya",
  description:
    "Manual WhatsApp message kit — pick a Telugu notice, preview it, then share or copy yourself. No mass auto-send. Public desk / representation / feed notices plus coordinator SOP.",
};

export default function AnnounceLayout({ children }: { children: ReactNode }) {
  return children;
}
