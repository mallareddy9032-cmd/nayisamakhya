"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/salon-hub", label: "🏠 హబ్ హోమ్", exact: true },
  { href: "/salon-hub/procure", label: "📦 సమూహ కొనుగోళ్లు" },
  { href: "/salon-hub/energy", label: "⚡ జీవో 23 విద్యుత్" },
  { href: "/salon-hub/loans", label: "🏦 బ్యాంక్ DPR" },
];

/** Shared salon-hub chrome: home + breadcrumb + status + segment tabs. No page titles. */
export function SalonHubChrome() {
  const pathname = usePathname() || "";

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FBFBFA]/95 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <Link
          href="/"
          className="tap inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 font-telugu text-sm font-semibold text-[#0F172A] hover:border-[#B45309]/40 hover:text-[#B45309]"
        >
          ← హోమ్ (Home)
        </Link>

        <nav
          className="min-w-0 flex-1 font-telugu text-sm text-[#64748B]"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#B45309]">
                హోమ్
              </Link>
            </li>
            <li aria-hidden className="text-[#CBD5E1]">
              /
            </li>
            <li className="font-semibold text-[#0F172A]">
              <Link href="/salon-hub" className="hover:text-[#B45309]">
                సెలూన్ స్టూడియో హబ్
              </Link>
            </li>
          </ol>
        </nav>

        <p className="inline-flex min-h-12 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 font-telugu text-xs font-semibold text-emerald-800 sm:text-sm">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500"
            aria-hidden
          />
          <span>🟢 589 మండలాలు కవర్ చేయబడ్డాయి</span>
        </p>
      </div>

      <nav
        className="mx-auto flex max-w-6xl justify-center gap-1.5 overflow-x-auto px-4 pb-3"
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
                "tap inline-flex min-h-12 shrink-0 items-center rounded-full px-4 font-telugu text-xs font-semibold transition sm:text-sm",
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
