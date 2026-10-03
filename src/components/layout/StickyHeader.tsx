"use client";

import Link from "next/link";
import { BrandCrest } from "@/components/brand/BrandCrest";
import { SosButton } from "@/components/layout/SosButton";
import { t } from "@/lib/i18n/dictionary";
import { useLanguageStore } from "@/lib/store/preferences";

export function StickyHeader() {
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md"
      style={{ minHeight: "var(--header-h)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="tap flex min-w-0 items-center gap-2 rounded-xl px-1 py-1"
          aria-label={t("brandSub", lang)}
        >
          <BrandCrest size="sm" />
          <span className="min-w-0">
            <p
              className={`truncate text-sm font-bold tracking-tight text-brand ${
                lang === "te" ? "font-telugu" : ""
              }`}
            >
              {t("brand", lang)}
            </p>
            <p
              className={`truncate text-xs text-slate-600 ${
                lang === "te" ? "font-telugu" : "font-sans"
              }`}
            >
              {t("brandSub", lang)}
            </p>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLang("te")}
              className={`tap rounded-full px-3 text-xs font-medium font-telugu ${
                lang === "te"
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`tap rounded-full px-3 text-xs font-medium ${
                lang === "en"
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </button>
          </div>
          <SosButton />
        </div>
      </div>
    </header>
  );
}
