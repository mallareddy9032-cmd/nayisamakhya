"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPinned, ClipboardList, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Phone, X } from "lucide-react";
import { t } from "@/lib/i18n/dictionary";
import { useLanguageStore } from "@/lib/store/preferences";

export function BottomNav() {
  const pathname = usePathname();
  const lang = useLanguageStore((s) => s.lang);
  const [sosOpen, setSosOpen] = useState(false);

  const tabs = [
    { id: "home", href: "/", icon: Home, labelKey: "home" as const },
    { id: "mandal", href: "/mandals", icon: MapPinned, labelKey: "mandal" as const },
    {
      id: "survey",
      href: "/survey",
      icon: ClipboardList,
      labelKey: "survey" as const,
    },
  ];

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const active =
              tab.id === "home"
                ? pathname === "/"
                : tab.id === "mandal"
                  ? pathname === "/mandals" ||
                    (/^\/[^/]+\/[^/]+$/.test(pathname) &&
                      !pathname.endsWith("/survey"))
                  : tab.id === "survey"
                    ? pathname === "/survey" || pathname.endsWith("/survey")
                    : false;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <Link
                  href={tab.href}
                  className={`tap flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] ${
                    active ? "text-brand" : "text-slate-500"
                  } ${lang === "te" ? "font-telugu" : ""}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span>{t(tab.labelKey, lang)}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setSosOpen(true)}
              className={`tap flex w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] text-slate-500 ${lang === "te" ? "font-telugu" : ""}`}
            >
              <ShieldAlert className="h-5 w-5" aria-hidden />
              <span>{t("legalSos", lang)}</span>
            </button>
          </li>
        </ul>
      </nav>

      {sosOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center md:hidden"
          role="presentation"
          onClick={() => setSosOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("sosTitle", lang)}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  className={`text-lg font-semibold text-slate-900 ${lang === "te" ? "font-telugu" : ""}`}
                >
                  {t("sosTitle", lang)}
                </h2>
                <p
                  className={`mt-2 text-sm leading-relaxed text-slate-600 ${lang === "te" ? "font-telugu" : ""}`}
                >
                  {t("sosBody", lang)}
                </p>
              </div>
              <button
                type="button"
                className="tap inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                onClick={() => setSosOpen(false)}
                aria-label={t("sosClose", lang)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <a
              href="tel:112"
              className={`tap mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sos px-5 text-sm font-semibold text-white ${lang === "te" ? "font-telugu" : ""}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {t("sosCall", lang)} · 112
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
