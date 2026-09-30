"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WA_HELP = "https://wa.me/919032654111";

const TABS = [
  {
    id: "representation",
    href: "/representation",
    label: "వినతిపత్రం",
    emoji: "📄",
    external: false,
  },
  {
    id: "card",
    href: "/coordinator-card",
    label: "నా కార్డు",
    emoji: "🪪",
    external: false,
  },
  {
    id: "help",
    href: WA_HELP,
    label: "సహాయం",
    emoji: "💬",
    external: true,
  },
] as const;

/**
 * Portal sticky mobile bottom bar — single coherent CTA strip.
 * Replaces home-only MobileStickyActions on small screens.
 */
export function MobileBottomNav() {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 block border-t border-slate-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md pb-safe md:hidden"
      aria-label="Mobile quick actions"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-3 gap-1">
        {TABS.map((tab) => {
          const active =
            !tab.external &&
            (pathname === tab.href || pathname.startsWith(`${tab.href}/`));
          const className = cn(
            "tap civic-focus-ring flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 font-telugu text-[11px] font-bold transition-colors",
            active
              ? "bg-[#B45309]/10 text-[#B45309]"
              : "text-[#0F172A] hover:bg-[#FBFBFA]",
          );

          if (tab.external) {
            return (
              <li key={tab.id}>
                <a
                  href={tab.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  <span aria-hidden className="text-base leading-none">
                    {tab.emoji}
                  </span>
                  <span>{tab.label}</span>
                </a>
              </li>
            );
          }

          return (
            <li key={tab.id}>
              <Link href={tab.href} className={className}>
                <span aria-hidden className="text-base leading-none">
                  {tab.emoji}
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
