"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { CivicChatbot } from "@/components/CivicChatbot";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { NewsMarquee } from "@/components/NewsMarquee";

/** Public marketing chrome — omitted on /admin/* so desks stay full-bleed tools. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  // Full-bleed tool / feed surfaces — skip public marketing chrome.
  const isChromeFree =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/representation") ||
    pathname.startsWith("/coordinator-card") ||
    pathname.startsWith("/coordinators") ||
    pathname.startsWith("/announce") ||
    pathname.startsWith("/poster") ||
    pathname.startsWith("/twa");

  if (isChromeFree) {
    // Light civic tools (/feed, /poster, …) sit on paper; dark desks keep slate.
    const shellBg = pathname.startsWith("/admin") || pathname.startsWith("/announce")
      ? "bg-slate-950"
      : "bg-civic-paper";
    return (
      <main id="main-content" className={`flex-1 ${shellBg}`}>
        {children}
      </main>
    );
  }

  return (
    <>
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
        <CivicChatbot />
      </div>
    </>
  );
}
