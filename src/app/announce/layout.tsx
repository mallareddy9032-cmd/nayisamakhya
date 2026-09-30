import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WhatsApp Mobilization Dispatcher | Nayi Samakhya",
  description:
    "Official tool for State, District, and Mandal coordinators to copy and broadcast localized WhatsApp mobilization messages — G.O. 23 welfare, urban trade defence, and coordinator ID card drive. One-tap share; no mass auto-send.",
};

export default function AnnounceLayout({ children }: { children: ReactNode }) {
  return children;
}
