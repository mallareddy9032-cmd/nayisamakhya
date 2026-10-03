"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  Contrast,
  FileText,
  MapPin,
  Menu,
  MessageCircle,
  Scissors,
  Send,
  Trophy,
  X,
} from "lucide-react";
import { BrandCrest } from "@/components/brand/BrandCrest";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibilityStore } from "@/lib/store/accessibility";
import { MandalSelector } from "@/components/MandalSelector";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/districts", label: "జిల్లాల సమాచారం", icon: MapPin },
  { href: "/survey", label: "సమగ్ర సర్వే" },
  {
    href: "/grievance",
    label: "జీవో 23 రక్షణ లేఖ",
    highlight: "go23" as const,
  },
  { href: "/representation", label: "వినతిపత్రం", icon: FileText },
  { href: "/feed", label: "గెజిట్ (Gazette)" },
] as const;

const COMPETITIONS = [
  { href: "/sprint", label: "🏆 సేవా సారథి ఛాలెంజ్" },
  { href: "/quiz", label: "⚖️ లీగల్ క్విజ్" },
  { href: "/grievance", label: "⚡ జీవో 23 దరఖాస్తు" },
  { href: "/reels", label: "🎬 మన కళ రీల్స్" },
] as const;

function CompetitionsMenu({
  className,
  compact = false,
  onNavigate,
}: {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
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
          "tap civic-focus-ring inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 font-telugu font-bold text-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.25)] transition hover:bg-amber-500/25",
          compact
            ? "max-w-[9.5rem] px-2 py-1 text-[10px]"
            : "min-h-11 px-2.5 text-[11px]",
        )}
      >
        <Trophy className="h-3 w-3 shrink-0" aria-hidden />
        <span className="truncate whitespace-nowrap">పోటీలు (Competitions)</span>
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
          className="absolute right-0 z-50 mt-1.5 min-w-[13.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
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

/**
 * Homepage sticky header — 52px mobile bar with slide-out sheet.
 * Desktop keeps full link row; district picker opens as bottom sheet on mobile.
 */
export function HomeMobileHeader() {
  const { language, setLanguage } = useLanguage();
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
      <header className="sticky top-0 z-40 border-b border-civic-border bg-white/95 shadow-xs backdrop-blur-sm">
        {/* Mobile <768px — 52px bar */}
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 md:hidden lg:px-8">
          <Link
            href="/"
            className="tap flex min-w-0 flex-1 items-center gap-2"
            aria-label="నాయీ సమాఖ్య తెలంగాణ — Nayi Samakhya"
          >
            <BrandCrest size="sm" priority className="h-9 w-9" />
            <span className="min-w-0">
              <span className="block whitespace-nowrap font-display-te text-[13px] font-normal leading-telugu tracking-tight text-[#0F172A] sm:text-sm">
                నాయీ సమాఖ్య
              </span>
              <span className="block truncate font-sans text-[10px] font-semibold tracking-wide text-slate-500">
                Nayi Samakhya · TG
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <div
              className="flex items-center rounded-lg border border-slate-200 bg-[#FBFBFA] p-0.5"
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
              className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0F172A]"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="home-mobile-sheet"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop / tablet ≥768px — brand | scroll rail | pinned CTAs (never clip) */}
        <div className="mx-auto hidden h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 md:flex lg:px-8">
          <Link
            href="/"
            className="tap flex shrink-0 items-center gap-2.5 self-center"
            aria-label="Nayi Samakhya Telangana"
          >
            <BrandCrest size="md" priority className="h-10 w-10" />
            <span className="whitespace-nowrap font-display-te text-base font-normal leading-none tracking-tight text-civic-ink md:text-lg">
              నాయీ సమాఖ్య
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="no-scrollbar flex min-w-0 flex-1 items-center justify-end gap-1.5 overflow-x-auto overscroll-x-contain touch-pan-x"
          >
            <Link
              href="/districts"
              className="civic-focus-ring hidden shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 font-telugu text-xs font-semibold text-slate-600 transition hover:bg-[#F4F2EB] hover:text-[#B45309] xl:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              జిల్లాలు
            </Link>
            <Link
              href="/survey"
              className="civic-focus-ring hidden shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 font-telugu text-xs font-semibold text-slate-600 transition hover:bg-[#F4F2EB] hover:text-[#B45309] lg:inline-flex"
            >
              సర్వే
              <span className="rounded border border-[#B45309]/35 bg-[#B45309]/10 px-1 font-telugu text-[8px] font-bold tracking-wide text-[#B45309]">
                New
              </span>
            </Link>
            <Link
              href="/representation"
              className="civic-focus-ring inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 font-telugu text-xs font-semibold text-slate-600 transition hover:bg-[#F4F2EB] hover:text-[#B45309]"
            >
              <FileText className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              వినతిపత్రం
            </Link>
            <Link
              href="/grievance"
              className="civic-focus-ring inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 font-telugu text-xs font-bold text-amber-900 transition hover:bg-amber-500/25"
            >
              ⚡ జీవో 23
            </Link>
            <Link
              href="/feed"
              className="civic-focus-ring hidden shrink-0 items-center rounded-lg px-2.5 py-2 font-telugu text-xs font-semibold text-slate-600 transition hover:bg-[#F4F2EB] hover:text-[#B45309] xl:inline-flex"
            >
              గెజిట్
            </Link>
            <CompetitionsMenu className="hidden shrink-0 2xl:block" />
            <Link
              href="/salon-hub"
              className="civic-focus-ring hidden shrink-0 items-center gap-1.5 rounded-full border border-[#B45309]/35 bg-[#B45309]/10 px-2.5 py-1.5 font-telugu text-[11px] font-bold text-[#B45309] transition hover:bg-[#B45309]/15 lg:inline-flex"
            >
              <Scissors className="h-3 w-3 shrink-0" aria-hidden />
              సెలూన్ హబ్
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 self-center">
            <Link
              href="/survey"
              className="civic-focus-ring inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-civic-bronze px-3.5 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              సర్వే ప్రారంభించండి ➔
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="civic-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-civic-border bg-white text-civic-ink transition hover:bg-civic-subtle"
              aria-label="Telegram desk bot"
              title="@NayiSamakhyaDeskBot"
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Hamburger slide-out — z above MobileBottomNav; own scroll + pb clears fixed bar */}
      {open ? (
        <div
          className="fixed inset-0 z-[70] md:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F172A]/45" aria-hidden />
          <aside
            id="home-mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl pt-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200 px-4">
              <span className="font-telugu text-sm font-bold text-[#0F172A]">
                మెనూ
              </span>
              <button
                type="button"
                className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200"
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
                <span className="inline-flex min-w-0 flex-col leading-telugu">
                  <span>జీవో 23 రక్షణ లేఖ</span>
                  <span className="text-[10px] font-semibold text-amber-800/80">
                    Grievance Docket
                  </span>
                </span>
                <span className="shrink-0 rounded-md border border-amber-500/45 bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
                  ⚡ జీవో 23 దరఖాస్తు
                </span>
              </Link>
              <div className="mb-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-2.5">
                <p className="mb-2 flex items-center gap-1.5 px-1 font-telugu text-[11px] font-bold text-amber-900">
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                  పోటీలు (Competitions)
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
                    className="tap flex min-h-12 items-center gap-2.5 rounded-xl border border-[#B45309]/25 bg-[#B45309]/10 px-3 font-telugu text-sm font-bold text-[#B45309]"
                  >
                    <Scissors className="h-4 w-4" aria-hidden />
                    సెలూన్ హబ్
                  </Link>
                </li>
                {PRIMARY_LINKS.map((link) => {
                  const Icon = "icon" in link ? link.icon : null;
                  const isGo23 =
                    "highlight" in link && link.highlight === "go23";
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "tap flex min-h-12 items-center gap-2.5 rounded-xl px-3 font-telugu text-sm font-semibold hover:bg-[#FBFBFA]",
                          isGo23
                            ? "border border-amber-500/35 bg-amber-500/10 text-amber-900"
                            : "text-[#0F172A]",
                        )}
                      >
                        {Icon ? (
                          <Icon
                            className="h-4 w-4 text-[#B45309]"
                            aria-hidden
                          />
                        ) : null}
                        {link.label}
                        {isGo23 ? (
                          <span className="ml-auto rounded-md border border-amber-500/45 bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
                            ⚡ జీవో 23
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a
                    href="https://wa.me/919032654111"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="tap flex min-h-12 items-center gap-2.5 rounded-xl px-3 font-telugu text-sm font-semibold text-[#0E7A6E] hover:bg-emerald-50"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    WhatsApp సహాయం
                  </a>
                </li>
              </ul>

              <Link
                href="/survey"
                onClick={() => setOpen(false)}
                className="tap mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white"
              >
                సర్వే ప్రారంభించండి ➔
              </Link>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-[#FBFBFA] p-3">
                <p className="mb-2 font-telugu text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  అందుబాటు · Accessibility
                </p>
                <div
                  className="flex flex-wrap items-center gap-1"
                  role="group"
                  aria-label="Text size and contrast"
                >
                  <button
                    type="button"
                    className="tap rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0F172A]"
                    onClick={() => bumpFont(-0.1)}
                    aria-label="Decrease text size"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    className="tap rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-[#0F172A]"
                    onClick={() => setFontScale(1)}
                    aria-label="Reset text size"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    className="tap rounded-lg border border-slate-200 bg-white px-3 text-base font-semibold text-[#0F172A]"
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
                        : "border-slate-200 bg-white text-[#0F172A]",
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
                className="tap mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#B45309]/30 bg-[#B45309]/10 px-3 font-telugu text-sm font-bold text-[#B45309]"
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

      {/* District/Mandal bottom sheet */}
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
