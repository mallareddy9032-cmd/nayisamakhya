"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Contrast,
  Landmark,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibilityStore } from "@/lib/store/accessibility";
import { MandalSelector } from "@/components/MandalSelector";
import { cn } from "@/lib/utils";

const navKeys = [
  { href: "/verticals/welfare", key: "navWelfare" as const },
  { href: "/verticals/education", key: "navEducation" as const },
  { href: "/verticals/livelihood", key: "navLivelihood" as const },
  { href: "/verticals/bajantri", key: "navBajantri" as const },
  { href: "/representation", key: "navRepresentation" as const },
  { href: "/survey", key: "navSurvey" as const },
  { href: "/newsletter", key: "navNewsletter" as const },
  { href: "/verticals/matrimonial", key: "navMatrimonial" as const },
  { href: "/verticals/gallery", key: "navGallery" as const },
  { href: "/verticals/go-library", key: "navGoLibrary" as const },
];

export function FloatingNavbar() {
  const { language, setLanguage, t } = useLanguage();
  const bumpFont = useAccessibilityStore((s) => s.bumpFont);
  const setFontScale = useAccessibilityStore((s) => s.setFontScale);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const toggleContrast = useAccessibilityStore((s) => s.toggleContrast);
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!open && !pickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPickerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, pickerOpen]);

  return (
    <>
      <header className="no-print sticky top-0 z-50 border-b border-[#EBE8E0] bg-[#FBFBFA]/95 backdrop-blur-md">
        {/* Mobile <768px — 52px sticky */}
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 md:hidden lg:px-8">
          <Link href="/" className="tap flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#B45309]/25 bg-[#B45309]/10 text-[#B45309]">
              <Landmark className="h-4 w-4" aria-hidden />
            </span>
            <span className="truncate font-telugu text-sm font-bold tracking-tight text-[#0F172A]">
              నాయీ సమాఖ్య
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            <div
              className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={cn(
                  "tap inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 font-telugu text-[11px] font-bold",
                  language === "te"
                    ? "bg-[#B45309] text-white"
                    : "text-slate-600",
                )}
              >
                తె
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "tap inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-[11px] font-bold",
                  language === "en"
                    ? "bg-[#B45309] text-white"
                    : "text-slate-600",
                )}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-ink"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="floating-mobile-sheet"
              aria-label={t("menu")}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ≥768px bar */}
        <div className="mx-auto hidden max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 md:flex lg:px-8">
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

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
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
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label={t("menu")}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F172A]/45" aria-hidden />
          <aside
            id="floating-mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] items-center justify-between border-b border-line px-4">
              <span
                className={`text-sm font-bold text-ink ${language === "te" ? "font-telugu" : ""}`}
              >
                {t("menu")}
              </span>
              <button
                type="button"
                className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {navKeys.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "tap flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-medium text-ink hover:bg-warm",
                        language === "te" ? "font-telugu" : "",
                      )}
                    >
                      {t(link.key)}
                      <ChevronDown
                        className="h-4 w-4 -rotate-90 text-muted"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-2xl border border-line bg-[#FBFBFA] p-3">
                <p className="mb-2 font-telugu text-[11px] font-bold uppercase tracking-wide text-muted">
                  అందుబాటు · Accessibility
                </p>
                <div
                  className="flex flex-wrap items-center gap-1"
                  role="group"
                  aria-label="Text size and contrast"
                >
                  <button
                    type="button"
                    className="tap rounded-lg border border-line bg-white px-3 text-xs font-semibold"
                    onClick={() => bumpFont(-0.1)}
                    aria-label="Decrease text size"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    className="tap rounded-lg border border-line bg-white px-3 text-sm font-bold"
                    onClick={() => setFontScale(1)}
                    aria-label="Reset text size"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    className="tap rounded-lg border border-line bg-white px-3 text-base font-semibold"
                    onClick={() => bumpFont(0.1)}
                    aria-label="Increase text size"
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={toggleContrast}
                    className={cn(
                      "tap ml-1 inline-flex min-h-11 items-center gap-1 rounded-lg border px-3 text-[11px] font-semibold",
                      highContrast
                        ? "border-[#B45309] bg-[#B45309] text-white"
                        : "border-line bg-white text-ink",
                    )}
                    aria-pressed={highContrast}
                  >
                    <Contrast className="h-3.5 w-3.5" aria-hidden />
                    Contrast
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPickerOpen(true);
                }}
                className="tap mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#B45309]/30 bg-[#B45309]/10 px-3 font-telugu text-sm font-bold text-[#B45309] md:hidden"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                జిల్లా / మండలం ఎంపిక
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {pickerOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center md:hidden"
          role="presentation"
          onClick={() => setPickerOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F172A]/45" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="District and mandal picker"
            className="relative z-[1] w-full max-w-lg rounded-t-3xl border border-slate-200 bg-white px-4 pb-safe pt-3 shadow-2xl sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-telugu text-base font-bold text-[#0F172A]">
                జిల్లా &amp; మండలం
              </h2>
              <button
                type="button"
                className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200"
                onClick={() => setPickerOpen(false)}
                aria-label="Close picker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <MandalSelector
              variant="sheet"
              target="portal"
              className="w-full pb-4"
              onNavigated={() => setPickerOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Alias for callers expecting `Navbar` naming. */
export { FloatingNavbar as Navbar };
