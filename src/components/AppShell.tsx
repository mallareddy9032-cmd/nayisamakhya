"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { CivicChatbot } from "@/components/CivicChatbot";
import { CivicFooter } from "@/components/CivicFooter";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { NewsMarquee } from "@/components/NewsMarquee";

/** Public marketing chrome — omitted on /admin/* so desks stay full-bleed tools. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <main id="main-content" className="min-h-dvh flex-1 bg-slate-950">
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
        <CivicFooter />
      </div>
      <div className="no-print">
        <CivicChatbot />
      </div>
    </>
  );
}
