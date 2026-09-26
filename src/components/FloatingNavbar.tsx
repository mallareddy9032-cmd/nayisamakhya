"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, Landmark } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MandalSelector } from "@/components/MandalSelector";
import { cn } from "@/lib/utils";

const navKeys = [
  { href: "/verticals/welfare", key: "navWelfare" as const },
  { href: "/verticals/education", key: "navEducation" as const },
  { href: "/verticals/livelihood", key: "navLivelihood" as const },
  { href: "/verticals/bajantri", key: "navBajantri" as const },
  { href: "/representation", key: "navRepresentation" as const },
  { href: "/verticals/matrimonial", key: "navMatrimonial" as const },
  { href: "/verticals/gallery", key: "navGallery" as const },
  { href: "/verticals/go-library", key: "navGoLibrary" as const },
];

export function FloatingNavbar() {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-[#EBE8E0] bg-[#FBFBF9]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
        <Link href="/" className="tap flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-warm text-brand">
            <Landmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate text-sm font-bold tracking-tight text-ink sm:text-base ${language === "te" ? "font-telugu" : ""}`}
            >
              {t("brandName")}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
              {t("brandSub")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {navKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-[12px] font-medium text-ink transition-colors hover:bg-[#F4F2EB]",
                language === "te" ? "font-telugu" : "",
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <MandalSelector variant="compact" target="portal" />
          </div>

          <button
            type="button"
            className="tap inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink hover:bg-warm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white/95 px-3 py-3 backdrop-blur-md lg:hidden">
          <ul className="space-y-1">
            {navKeys.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "tap flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-warm",
                    language === "te" ? "font-telugu" : "",
                  )}
                >
                  {t(link.key)}
                  <ChevronDown className="h-4 w-4 -rotate-90 text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 md:hidden">
            <MandalSelector variant="compact" target="portal" className="w-full [&_select]:max-w-none [&_select]:flex-1" />
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Alias for callers expecting `Navbar` naming. */
export { FloatingNavbar as Navbar };
