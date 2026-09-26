"use client";

import { Contrast } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibilityStore } from "@/lib/store/accessibility";
import { cn } from "@/lib/utils";

export function AccessibilityBar() {
  const { language, setLanguage, t } = useLanguage();
  const bumpFont = useAccessibilityStore((s) => s.bumpFont);
  const setFontScale = useAccessibilityStore((s) => s.setFontScale);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const toggleContrast = useAccessibilityStore((s) => s.toggleContrast);

  return (
    <div
      data-accessibility-bar
      className="no-print border-b border-zinc-700 bg-[#27272a] text-[11px] text-zinc-200"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
        <div className="flex items-center gap-1" role="group" aria-label="Text size and contrast">
          <button
            type="button"
            className="tap rounded px-2 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={() => bumpFont(-0.1)}
            aria-label="Decrease text size"
          >
            A-
          </button>
          <button
            type="button"
            className="tap rounded px-2 text-sm font-semibold text-white hover:bg-zinc-700"
            onClick={() => setFontScale(1)}
            aria-label="Reset text size"
          >
            A
          </button>
          <button
            type="button"
            className="tap rounded px-2 text-base text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={() => bumpFont(0.1)}
            aria-label="Increase text size"
          >
            A+
          </button>
          <button
            type="button"
            onClick={toggleContrast}
            className={cn(
              "tap ml-1 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] hover:bg-zinc-700",
              highContrast ? "bg-brand text-white" : "text-zinc-300",
              language === "te" ? "font-telugu" : "",
            )}
            aria-pressed={highContrast}
          >
            <Contrast className="h-3.5 w-3.5" aria-hidden />
            {t("contrast")}
          </button>
        </div>

        <p
          className={`text-center text-[11px] leading-snug text-zinc-300 sm:flex-1 ${language === "te" ? "font-telugu" : ""}`}
        >
          {t("helpline")}
        </p>

        <div
          className="flex items-center justify-center gap-1 sm:justify-end"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => setLanguage("te")}
            className={cn(
              "tap rounded px-2.5 py-1 font-telugu text-[11px]",
              language === "te" ? "bg-brand text-white" : "text-zinc-300 hover:bg-zinc-700",
            )}
          >
            తెలుగు
          </button>
          <span className="text-zinc-600" aria-hidden>
            |
          </span>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={cn(
              "tap rounded px-2.5 py-1 text-[11px]",
              language === "en" ? "bg-brand text-white" : "text-zinc-300 hover:bg-zinc-700",
            )}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
