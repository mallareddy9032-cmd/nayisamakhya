"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  Contrast,
  MapPin,
  Menu,
  Scissors,
  Send,
  Trophy,
  X,
} from "lucide-react";
import { BrandCrest } from "@/components/brand/BrandCrest";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibilityStore } from "@/lib/store/accessibility";
import { MandalSelector } from "@/components/MandalSelector";
import { TELEGRAM_BOT_URL } from "@/lib/data/communityAnnounce";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/districts", key: "navDistricts" as const, style: "plain" as const },
  { href: "/survey", key: "navSurvey" as const, style: "survey" as const },
  { href: "/grievance", key: "navGrievance" as const, style: "go23" as const },
  {
    href: "/representation",
    key: "navRepresentation" as const,
    style: "plain" as const,
  },
  { href: "/feed", key: "navGazette" as const, style: "plain" as const },
];

const COMPETITIONS = [
  { href: "/sprint", label: "🏆 సేవా సారథి ఛాలెంజ్" },
  { href: "/quiz", label: "⚖️ లీగల్ క్విజ్" },
  { href: "/grievance", label: "⚡ జీవో 23 దరఖాస్తు" },
  { href: "/reels", label: "🎬 మన కళ రీల్స్" },
] as const;

function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ml-1 inline-flex items-center rounded-md border border-[#B45309]/35 bg-[#B45309]/10 px-1.5 py-0.5 font-telugu text-[9px] font-bold tracking-wide text-[#B45309]",
        className,
      )}
    >
      New
    </span>
  );
}

function Go23Badge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ml-1 inline-flex items-center rounded-md border border-amber-500/45 bg-amber-500/15 px-1.5 py-0.5 font-telugu text-[9px] font-bold tracking-wide text-amber-800",
        className,
      )}
    >
      ⚡
    </span>
  );
}

function CompetitionsMenu({
  className,
  compact = false,
  onNavigate,
}: {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "tap inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 font-telugu font-bold text-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.25)] transition hover:bg-amber-500/25",
          compact
            ? "px-2 py-1 text-[10px]"
            : "px-2.5 py-1.5 text-[11px]",
        )}
      >
        <Trophy className="h-3 w-3 shrink-0" aria-hidden />
        <span className="whitespace-nowrap">{t("navCompetitions")}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform",
            open ? "rotate-180" : "",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-1.5 min-w-[13.5rem] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-lg"
        >
          {COMPETITIONS.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="tap flex min-h-10 items-center px-3 font-telugu text-[12px] font-semibold text-[#0F172A] transition hover:bg-amber-50 hover:text-[#B45309]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function FloatingNavbar() {
  const { language, setLanguage, t } = useLanguage();
  const isTe = language === "te";
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
    document.body.dataset.sheetOpen = "1";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.body.dataset.sheetOpen;
    };
  }, [open, pickerOpen]);

  return (
    <>
      <header className="no-print sticky top-0 z-50 border-b border-[#EBE8E0] bg-[#FBFBFA]/95 backdrop-blur-md">
        {/* Mobile <768px — 52px sticky */}
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 md:hidden lg:px-8">
          <Link
            href="/"
            className="tap flex min-w-0 flex-1 items-center gap-2"
            aria-label={t("brandSub")}
          >
            <BrandCrest size="sm" priority className="h-9 w-9" />
            <span className="min-w-0">
              <span
                className={`block whitespace-nowrap text-[13px] font-normal tracking-tight text-[#0F172A] sm:text-sm ${
                  isTe ? "font-display-te leading-telugu" : "font-sans font-semibold"
                }`}
              >
                {t("brandName")}
              </span>
              <span
                className={`block truncate text-[10px] font-semibold tracking-wide text-slate-500 ${
                  isTe ? "font-telugu" : "font-sans"
                }`}
              >
                {t("brandSub")}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setLanguage(language === "te" ? "en" : "te")}
              className="tap inline-flex h-9 items-center rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-2.5 font-telugu text-[11px] font-bold text-[#B45309]"
              aria-label="Language"
            >
              {language === "te" ? "తె" : "EN"}
            </button>
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

        {/* ≥768px bar — brand | equal-gap nav rail | pinned actions */}
        <div className="mx-auto hidden max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 md:flex lg:px-8">
          <Link
            href="/"
            className="tap flex shrink-0 items-center gap-2.5 self-center"
            aria-label={t("brandSub")}
          >
            <BrandCrest size="md" priority className="h-10 w-10" />
            <span
              className={`whitespace-nowrap text-sm font-normal leading-none tracking-tight text-ink sm:text-base ${
                isTe ? "font-display-te" : "font-sans font-semibold"
              }`}
            >
              {t("brandName")}
            </span>
          </Link>

          <nav
            className="no-scrollbar hidden min-w-0 flex-1 items-center justify-end gap-1.5 overflow-x-auto overscroll-x-contain touch-pan-x lg:flex"
            aria-label="Primary"
          >
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors hover:bg-[#F4F2EB]",
                  language === "te" ? "font-telugu" : "",
                  link.style === "go23"
                    ? "border border-amber-500/35 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20"
                    : "text-ink",
                )}
              >
                {t(link.key)}
                {link.style === "survey" ? <NewBadge /> : null}
                {link.style === "go23" ? <Go23Badge /> : null}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 self-center">
            <Link
              href="/salon-hub"
              className={`tap hidden items-center gap-1.5 rounded-full border border-[#B45309]/35 bg-[#B45309]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#B45309] transition hover:bg-[#B45309]/15 xl:inline-flex ${isTe ? "font-telugu" : "font-sans"}`}
            >
              <Scissors className="h-3 w-3 shrink-0" aria-hidden />
              {t("navSalonHub")}
            </Link>
            <CompetitionsMenu className="hidden shrink-0 xl:block" />
            <button
              type="button"
              onClick={() => setLanguage(language === "te" ? "en" : "te")}
              className="tap hidden h-9 items-center rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 font-telugu text-[11px] font-bold text-[#B45309] md:inline-flex"
              aria-label="Language"
            >
              {language === "te" ? "తె" : "EN"}
            </button>

            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="tap hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-[#0F172A] hover:bg-warm xl:inline-flex"
              aria-label="Telegram desk bot"
              title="@NayiSamakhyaDeskBot"
            >
              <Send className="h-4 w-4" aria-hidden />
            </a>

            <Link
              href="/survey"
              className={`tap hidden items-center gap-1 rounded-xl bg-[#B45309] px-3.5 py-2.5 text-[12px] font-bold text-white shadow-[0_0_14px_rgba(180,83,9,0.28)] transition hover:bg-[#92400E] lg:inline-flex ${isTe ? "font-telugu" : "font-sans"}`}
            >
              {t("navCtaSurvey")}
            </Link>

            <div className="hidden md:block lg:hidden">
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
          className="fixed inset-0 z-[70] lg:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F172A]/45" aria-hidden />
          <aside
            id="floating-mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl pt-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-line px-4">
              <span
                className={`text-sm font-bold leading-telugu text-ink ${language === "te" ? "font-telugu" : ""}`}
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

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-drawer-safe">
              <Link
                href="/grievance"
                onClick={() => setOpen(false)}
                className="tap mb-3 flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 font-telugu text-sm font-bold text-amber-900 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              >
                <span className={`inline-flex min-w-0 flex-col ${isTe ? "leading-telugu" : ""}`}>
                  <span>{t("navGrievance")}</span>
                </span>
                <span className="shrink-0 rounded-md border border-amber-500/45 bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
                  {t("navGrievanceShort")}
                </span>
              </Link>
              <div className="mb-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-2.5">
                <p className="mb-2 flex items-center gap-1.5 px-1 font-telugu text-[11px] font-bold text-amber-900">
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                  {t("navCompetitions")}
                </p>
                <ul className="space-y-1">
                  {COMPETITIONS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="tap flex min-h-11 items-center rounded-xl bg-white px-3 font-telugu text-sm font-semibold text-[#0F172A] hover:bg-amber-50"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/salon-hub"
                    onClick={() => setOpen(false)}
                    className="tap flex min-h-12 items-center gap-2 rounded-xl border border-[#B45309]/25 bg-[#B45309]/10 px-3 font-telugu text-sm font-bold text-[#B45309]"
                  >
                    <Scissors className="h-4 w-4" aria-hidden />
                    {t("navSalonHub")}
                  </Link>
                </li>
                {primaryNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "tap flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-medium hover:bg-warm",
                        language === "te" ? "font-telugu" : "",
                        link.style === "go23"
                          ? "border border-amber-500/35 bg-amber-500/10 text-amber-900"
                          : "text-ink",
                      )}
                    >
                      <span className="inline-flex items-center">
                        {t(link.key)}
                        {link.style === "survey" ? <NewBadge /> : null}
                        {link.style === "go23" ? <Go23Badge /> : null}
                      </span>
                      <ChevronDown
                        className="h-4 w-4 -rotate-90 text-muted"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/survey"
                onClick={() => setOpen(false)}
                className={`tap mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 text-sm font-bold text-white ${isTe ? "font-telugu" : "font-sans"}`}
              >
                {t("navCtaSurvey")}
              </Link>

              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="tap mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 font-telugu text-sm font-semibold text-ink"
              >
                <Send className="h-4 w-4 text-[#B45309]" aria-hidden />
                Telegram Desk
              </a>

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
              <nav
                className="mt-4 border-t border-slate-200 pt-3 pb-2"
                aria-label="Legal and admin"
              >
                <ul className="space-y-1 font-telugu text-sm text-slate-600">
                  <li>
                    <Link
                      href="/policies/privacy"
                      onClick={() => setOpen(false)}
                      className="tap flex min-h-11 items-center rounded-xl px-3 hover:bg-[#FBFBFA]"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policies/terms"
                      onClick={() => setOpen(false)}
                      className="tap flex min-h-11 items-center rounded-xl px-3 hover:bg-[#FBFBFA]"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/grievance"
                      onClick={() => setOpen(false)}
                      className="tap flex min-h-11 items-center rounded-xl px-3 hover:bg-[#FBFBFA]"
                    >
                      G.O. 23 Grievance
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/desk"
                      onClick={() => setOpen(false)}
                      className="tap flex min-h-11 items-center rounded-xl px-3 hover:bg-[#FBFBFA]"
                    >
                      Admin Login
                    </Link>
                  </li>
                </ul>
              </nav>

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
