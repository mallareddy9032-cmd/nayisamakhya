"use client";

import { Trash2 } from "lucide-react";
import { formatDraftSavedTime } from "@/hooks/useFormAutoSave";
import { cn } from "@/lib/utils";

type Props = {
  isHydrated: boolean;
  hasDraft: boolean;
  lastSaved: Date | null;
  onClear: () => void;
  lang?: "te" | "en";
  className?: string;
};

/**
 * Compact bilingual draft status — “saved offline” + clear control.
 */
export function DraftSavedBanner({
  isHydrated,
  hasDraft,
  lastSaved,
  onClear,
  lang = "te",
  className,
}: Props) {
  if (!isHydrated || (!hasDraft && !lastSaved)) return null;

  const time = formatDraftSavedTime(lastSaved, lang);
  const te = lang === "te";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "no-print flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 font-telugu text-xs text-emerald-900 print:hidden",
        className,
      )}
    >
      <p className="min-w-0 leading-snug">
        {te ? (
          <>
            💾 డ్రాఫ్ట్ సేవ్ అయింది (Offline)
            {time ? (
              <span className="text-emerald-700/80"> · {time}</span>
            ) : null}
          </>
        ) : (
          <>
            💾 Draft saved offline
            {time ? (
              <span className="text-emerald-700/80"> · {time}</span>
            ) : null}
          </>
        )}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="tap inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg border border-emerald-300/80 bg-white px-2.5 py-1 font-telugu text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100"
      >
        <Trash2 className="h-3 w-3" aria-hidden />
        {te ? "డ్రాఫ్ట్ తొలగించు" : "Clear draft"}
      </button>
    </div>
  );
}
