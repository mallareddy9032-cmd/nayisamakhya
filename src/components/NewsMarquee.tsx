"use client";

import { useLanguage } from "@/context/LanguageContext";

export function NewsMarquee() {
  const { language, t } = useLanguage();
  const ticker = t("marquee");

  return (
    <div
      className="no-print overflow-hidden border-b border-[#EBE8E0] bg-[#C2410C]/10 text-[#C2410C]"
      role="region"
      aria-label="Breaking updates"
    >
      <div
        className={`marquee-track flex w-max whitespace-nowrap py-2 text-sm font-medium ${language === "te" ? "font-telugu" : ""}`}
      >
        <span className="px-4">{ticker}</span>
        <span className="px-4" aria-hidden>
          {ticker}
        </span>
      </div>
    </div>
  );
}
