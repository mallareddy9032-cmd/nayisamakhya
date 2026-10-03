"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "districts",
    href: "/districts",
    label: "జిల్లాలు",
    emoji: "🗺️",
  },
  {
    id: "survey",
    href: "/survey",
    label: "సర్వే",
    emoji: "📋",
    badge: "నూతన" as const,
  },
  {
    id: "grievance",
    href: "/grievance",
    label: "జీవో 23",
    emoji: "⚡",
    go23: true as const,
  },
  {
    id: "feed",
    href: "/feed",
    label: "గెజిట్",
    emoji: "📰",
  },
] as const;

/**
 * Portal sticky mobile bottom bar — mirrors primary civic nav.
 * Uses .pb-safe for home-indicator inset; labels stay above system chrome.
 */
export function MobileBottomNav() {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 block border-t border-slate-200 bg-white/95 px-2 pt-1.5 shadow-[0_-6px_20px_rgb(15_23_42/0.08)] backdrop-blur-md pb-safe md:hidden"
      aria-label="Mobile quick actions"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-0.5">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const isGo23 = "go23" in tab && tab.go23;
          const className = cn(
            "tap civic-focus-ring relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 font-telugu text-[10px] font-bold leading-telugu transition-colors sm:text-[11px]",
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
                <span className="inline-flex max-w-full items-center justify-center gap-0.5 px-0.5 text-center leading-telugu">
                  <span className="truncate">{tab.label}</span>
                  {"badge" in tab && tab.badge ? (
                    <span className="shrink-0 rounded border border-[#B45309]/35 bg-[#B45309]/10 px-0.5 font-telugu text-[7px] font-bold tracking-wide text-[#B45309]">
                      {tab.badge}
                    </span>
                  ) : null}
                  {isGo23 ? (
                    <span className="shrink-0 rounded border border-amber-500/45 bg-amber-500/15 px-0.5 font-telugu text-[7px] font-bold tracking-wide text-amber-800">
                      హాట్
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
