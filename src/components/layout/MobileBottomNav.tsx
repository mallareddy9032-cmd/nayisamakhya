"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "districts",
    href: "/districts",
    label: "\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32\u0c41",
    emoji: "\u{1F5FA}\uFE0F",
  },
  {
    id: "survey",
    href: "/survey",
    label: "\u0c38\u0c2e\u0c17\u0c4d\u0c30 \u0c38\u0c30\u0c4d\u0c35\u0c47",
    emoji: "\u{1F4CB}",
    badge: true as const,
  },
  {
    id: "grievance",
    href: "/grievance",
    label: "\u0c1c\u0c40\u0c35\u0c4b 23",
    emoji: "\u26A1",
    go23: true as const,
  },
  {
    id: "feed",
    href: "/feed",
    label: "\u0c17\u0c46\u0c1c\u0c3f\u0c1f\u0c4d (Gazette)",
    emoji: "\u{1F4F0}",
  },
] as const;

/**
 * Portal sticky mobile bottom bar — mirrors primary civic nav.
 */
export function MobileBottomNav() {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 block border-t border-slate-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md pb-safe md:hidden"
      aria-label="Mobile quick actions"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const isGo23 = "go23" in tab && tab.go23;
          const className = cn(
            "tap civic-focus-ring relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 font-telugu text-[11px] font-bold transition-colors",
            active
              ? isGo23
                ? "bg-amber-500/15 text-amber-900"
                : "bg-[#B45309]/10 text-[#B45309]"
              : isGo23
                ? "text-amber-900 hover:bg-amber-500/10"
                : "text-[#0F172A] hover:bg-[#FBFBFA]",
          );

          return (
            <li key={tab.id}>
              <Link href={tab.href} className={className}>
                <span aria-hidden className="text-base leading-none">
                  {tab.emoji}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  {tab.label}
                  {"badge" in tab && tab.badge ? (
                    <span className="rounded border border-[#B45309]/35 bg-[#B45309]/10 px-1 font-telugu text-[8px] font-bold tracking-wide text-[#B45309] shadow-[0_0_8px_rgba(180,83,9,0.35)]">
                      {"\u0c38\u0c30\u0c4d\u0c35\u0c47"} (New)
                    </span>
                  ) : null}
                  {isGo23 ? (
                    <span className="rounded border border-amber-500/45 bg-amber-500/15 px-1 font-telugu text-[8px] font-bold tracking-wide text-amber-800">
                      {"\u0c26\u0c30\u0c16\u0c3e\u0c38\u0c4d\u0c24\u0c41"}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
