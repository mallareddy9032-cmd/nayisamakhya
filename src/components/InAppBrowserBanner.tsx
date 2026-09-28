"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import {
  IN_APP_PRINT_BANNER_TE,
  OPEN_IN_BROWSER_BTN_TE,
  isInAppWebView,
  openCurrentPageExternally,
} from "@/lib/twa/printPetitionPdf";

/**
 * Sticky top banner for Telegram / Instagram / WhatsApp / FB webviews.
 * Skipped on `/representation` — that route owns a print-specific banner.
 */
export function InAppBrowserBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(isInAppWebView()), 0);
    const t2 = window.setTimeout(() => setVisible(isInAppWebView()), 500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;
  if (pathname?.startsWith("/representation")) return null;

  return (
    <div
      className="no-print sticky top-0 z-[60] border-b border-[#B45309]/40 bg-[#1E293B] text-white print:hidden"
      role="region"
      aria-label="Open in browser"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <p className="min-w-0 flex-1 font-telugu text-[11px] font-semibold leading-snug sm:text-xs">
          {IN_APP_PRINT_BANNER_TE}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => openCurrentPageExternally()}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#B45309] px-3 py-2 font-telugu text-[11px] font-bold text-[#FBFBFA]"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {OPEN_IN_BROWSER_BTN_TE}
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InAppBrowserBanner;
