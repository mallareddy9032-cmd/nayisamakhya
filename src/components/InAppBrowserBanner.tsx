"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import {
  getTelegramWebApp,
  openCurrentPageExternally,
} from "@/lib/twa/printPetitionPdf";

const BANNER_TE =
  "పూర్తి ఫీచర్ల కొరకు క్రోమ్ లేదా సఫారీలో తెరవండి (Open in Browser)";

function detectInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const wa = getTelegramWebApp();
  if (wa && (wa.initData || (wa.platform && wa.platform !== "unknown"))) {
    return true;
  }
  const ua = navigator.userAgent || "";
  return /Telegram|Instagram|FBAN|FBAV|WhatsApp|Line\/|MicroMessenger|WV|WebView/i.test(
    ua,
  );
}

/**
 * Discreet top banner when the portal is opened inside Telegram / Instagram /
 * WhatsApp in-app browsers — prompts breakout to Chrome/Safari.
 */
export function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(detectInAppBrowser()), 0);
    const t2 = window.setTimeout(() => setVisible(detectInAppBrowser()), 500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="no-print sticky top-0 z-[60] border-b border-[#B45309]/30 bg-[#0F172A] text-white print:hidden"
      role="region"
      aria-label="Open in browser"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <p className="min-w-0 flex-1 font-telugu text-[11px] font-semibold leading-snug sm:text-xs">
          {BANNER_TE}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => openCurrentPageExternally()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#B45309] px-2.5 py-1.5 font-telugu text-[11px] font-bold text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Open
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
