"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Contrast,
  FileText,
  Landmark,
  MapPin,
  Menu,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibilityStore } from "@/lib/store/accessibility";
import { MandalSelector } from "@/components/MandalSelector";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/districts", label: "జిల్లాల సమాచారం", icon: MapPin },
  { href: "/survey", label: "సమగ్ర సర్వే" },
  { href: "/representation", label: "వినతిపత్రం", icon: FileText },
  { href: "/feed", label: "గెజిట్ & జీవోలు" },
] as const;

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
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, pickerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-civic-border bg-white/95 shadow-xs backdrop-blur-sm">
        {/* Mobile <768px — 52px bar */}
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 md:hidden lg:px-8">
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

        {/* Desktop / tablet ≥768px */}
        <div className="mx-auto hidden h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:flex lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="rounded-xl border border-civic-bronze/20 bg-civic-bronze/10 p-2 text-civic-bronze">
              <Landmark className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <span className="font-telugu text-base font-black tracking-tight text-civic-ink md:text-lg">
                నాయీ సమాఖ్య తెలంగాణ
              </span>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Official Civic Welfare Portal
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/districts"
              className="civic-focus-ring hidden min-h-11 items-center gap-1 px-2.5 font-telugu text-xs font-semibold text-slate-600 underline-offset-4 transition hover:text-[#B45309] hover:underline lg:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              జిల్లాల సమాచారం
            </Link>
            <Link
              href="/survey"
              className="civic-focus-ring hidden min-h-11 items-center gap-1 px-2.5 font-telugu text-xs font-semibold text-slate-600 underline-offset-4 transition hover:text-[#B45309] hover:underline lg:inline-flex"
            >
              సమగ్ర సర్వే
              <span className="rounded border border-[#B45309]/35 bg-[#B45309]/10 px-1 text-[8px] font-bold uppercase tracking-wide text-[#B45309] shadow-[0_0_8px_rgba(180,83,9,0.35)]">
                New
              </span>
            </Link>
            <Link
              href="/representation"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-1 px-2.5 font-telugu text-xs font-semibold text-slate-600 underline-offset-4 transition hover:text-[#B45309] hover:underline"
            >
              <FileText className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              వినతిపత్రం
            </Link>
            <Link
              href="/feed"
              className="civic-focus-ring hidden min-h-11 items-center px-2.5 font-telugu text-xs font-semibold text-slate-600 underline-offset-4 transition hover:text-[#B45309] hover:underline xl:inline-flex"
            >
              గెజిట్ &amp; జీవోలు
            </Link>
            <Link
              href="/survey"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-civic-bronze px-3.5 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              సర్వే ప్రారంభించండి ➔
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="civic-focus-ring inline-flex min-h-11 w-11 items-center justify-center rounded-xl border border-civic-border bg-white text-civic-ink transition hover:bg-civic-subtle"
              aria-label="Telegram desk bot"
              title="@NayiSamakhyaDeskBot"
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Hamburger slide-out */}
      {open ? (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F172A]/45" aria-hidden />
          <aside
            id="home-mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] items-center justify-between border-b border-slate-200 px-4">
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

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const Icon = "icon" in link ? link.icon : null;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="tap flex min-h-12 items-center gap-2.5 rounded-xl px-3 font-telugu text-sm font-semibold text-[#0F172A] hover:bg-[#FBFBFA]"
                      >
                        {Icon ? (
                          <Icon
                            className="h-4 w-4 text-[#B45309]"
                            aria-hidden
                          />
                        ) : null}
                        {link.label}
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
