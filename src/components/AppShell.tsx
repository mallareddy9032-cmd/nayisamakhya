"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { CivicChatbot } from "@/components/CivicChatbot";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { NewsMarquee } from "@/components/NewsMarquee";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

/** Public marketing chrome — omitted on /admin/* so desks stay full-bleed tools. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  // Full-bleed tool / feed surfaces — skip public marketing chrome.
  const isChromeFree =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/representation") ||
    pathname.startsWith("/grievance") ||
    pathname.startsWith("/coordinator-card") ||
    pathname.startsWith("/coordinators") ||
    pathname.startsWith("/announce") ||
    pathname.startsWith("/poster") ||
    pathname.startsWith("/newsletter") ||
    pathname.startsWith("/survey") ||
    pathname.startsWith("/sprint") ||
    pathname.startsWith("/reels") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/salon-hub") ||
    pathname.startsWith("/twa");

  const showBottomNav = !pathname.startsWith("/admin");

  if (isChromeFree) {
    // Light civic tools (/feed, /poster, /announce, …) sit on paper; admin desks keep slate.
    // Use <div> — tool pages own their own <main> landmark.
    const shellBg = pathname.startsWith("/admin")
      ? pathname.startsWith("/admin/login") ||
        pathname.startsWith("/admin/volunteers")
        ? "bg-[#FBFBFA]"
        : "bg-slate-950"
      : "bg-civic-paper";
    return (
      <div
        id="main-content"
        className={`flex-1 overflow-x-hidden ${shellBg} ${showBottomNav ? "pb-24 md:pb-0" : ""}`}
      >
        {children}
        {showBottomNav ? <MobileBottomNav /> : null}
      </div>
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
      <main
        id="main-content"
        className="flex-1 overflow-x-hidden pb-24 md:pb-0"
      >
        {children}
      </main>
      <div className="no-print">
        <CivicChatbot />
      </div>
      <div className="no-print">
        <MobileBottomNav />
      </div>
    </>
  );
}
