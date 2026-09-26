import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Broadcast & SOP | Nayi Samakhya",
  description:
    "WhatsApp-ready Telugu blasts and mandal coordinator SOP — Digital Desk, representation letters, field photos, and coordinator guide.",
};

export default function AnnounceLayout({ children }: { children: ReactNode }) {
  return children;
}
