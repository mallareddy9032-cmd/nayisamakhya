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
    label: "సమగ్ర సర్వే",
    emoji: "📋",
    badge: true,
  },
  {
    id: "representation",
    href: "/representation",
    label: "వినతిపత్రం",
    emoji: "📄",
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
          const className = cn(
            "tap civic-focus-ring relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 font-telugu text-[11px] font-bold transition-colors",
            active
              ? "bg-[#B45309]/10 text-[#B45309]"
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
                    <span className="rounded border border-[#B45309]/35 bg-[#B45309]/10 px-1 text-[8px] font-bold uppercase tracking-wide text-[#B45309] shadow-[0_0_8px_rgba(180,83,9,0.35)]">
                      New
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
