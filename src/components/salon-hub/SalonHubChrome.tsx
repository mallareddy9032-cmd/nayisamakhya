"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/salon-hub", label: "హబ్", exact: true },
  { href: "/salon-hub/procure", label: "ఇండెంట్" },
  { href: "/salon-hub/energy", label: "ఎనర్జీ" },
  { href: "/salon-hub/loans", label: "డీపీఆర్" },
];

export function SalonHubChrome({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname() || "";

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FBFBFA]/95 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="tap inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F4F4F2]"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
            <Scissors className="h-3 w-3" aria-hidden />
            Salon Studio Hub
          </p>
          <h1 className="truncate font-display-te text-base font-normal leading-snug text-[#0F172A] sm:text-lg">
            <span className="text-[#B45309]">{title}</span>
          </h1>
          {subtitle ? (
            <p className="truncate text-[11px] text-[#64748B]">{subtitle}</p>
          ) : null}
        </div>
        <Link
          href="/salon-hub"
          className="tap hidden shrink-0 rounded-full border border-[#B45309]/35 bg-[#B45309]/10 px-2.5 py-1 font-telugu text-[10px] font-bold text-[#B45309] sm:inline-flex"
        >
          సెలూన్ హబ్
        </Link>
      </div>
      <nav
        className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-2"
        aria-label="Salon hub sections"
      >
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "tap inline-flex min-h-9 shrink-0 items-center rounded-full px-3 font-telugu text-[11px] font-bold transition",
                active
                  ? "bg-[#0F172A] text-white"
                  : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#B45309]/40 hover:text-[#B45309]",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
