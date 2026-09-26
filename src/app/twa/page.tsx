"use client";

import React, { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import {
  FileText,
  Layers,
  Zap,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        /** Untrusted client payload — display-only; never authorize on this alone. */
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        HapticFeedback?: {
          impactOccurred: (
            style: "light" | "medium" | "heavy" | "rigid" | "soft",
          ) => void;
        };
      };
    };
  }
}

const DEFAULT_NAME = "\u0C2E\u0C3F\u0C24\u0C4D\u0C30\u0C2E\u0C3E";

function initTelegramWebApp(
  setUserName: (name: string) => void,
) {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
  // initDataUnsafe is spoofable outside Telegram; greeting only.
  const first = tg.initDataUnsafe?.user?.first_name?.trim();
  if (first) setUserName(first);
}

export default function TelegramMiniAppPage() {
  const [userName, setUserName] = useState(DEFAULT_NAME);

  const triggerHaptic = () => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
    } catch {
      // Outside Telegram webview
    }
  };

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onReady={() => initTelegramWebApp(setUserName)}
        onLoad={() => initTelegramWebApp(setUserName)}
      />

      <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-white">
        <header className="border-b border-slate-800/80 bg-slate-900/60 px-5 pb-4 pt-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C38\u0C47\u0C35\u0C3E \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D"}
              </div>
              <h1 className="mt-0.5 text-lg font-bold text-white">
                {"\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02"}, {userName}{" "}
                {"\u0C17\u0C3E\u0C30\u0C41"}!
              </h1>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live TWA
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {"\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23 \u0C28\u0C3E\u0C2F\u0C3F \u0C2C\u0C4D\u0C30\u0C3E\u0C39\u0C4D\u0C2E\u0C23, \u0C2E\u0C02\u0C17\u0C32\u0C3F & \u0C2C\u0C1C\u0C02\u0C24\u0C4D\u0C30\u0C3F \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C38\u0C3E\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C24\u0C3E \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02"}
          </p>
        </header>

        <main className="flex-1 space-y-3 px-4 py-5">
          <Link
            href="/representation"
            onClick={triggerHaptic}
            className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 p-4 transition-all hover:border-amber-500/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/20 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {"\u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C24\u0C2F\u0C3E\u0C30\u0C40"} (Petition
                  Maker)
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  MRO / DISCOM /{" "}
                  {"\u0C2E\u0C41\u0C28\u0C4D\u0C38\u0C3F\u0C2A\u0C32\u0C4D \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C41\u0C32\u0C15\u0C41 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C32\u0C47\u0C16\u0C32\u0C41"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/feed"
            onClick={triggerHaptic}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {"\u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37 \u0C2B\u0C40\u0C21\u0C4D"} (Field Feed)
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {"\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C24 \u0C38\u0C46\u0C32\u0C42\u0C28\u0C4D \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C32\u0C41 & \u0C28\u0C2E\u0C4B\u0C26\u0C48\u0C28 \u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C41"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/representation?subject=free_power&authority=discom_ae"
            onClick={triggerHaptic}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    G.O. 23 {"\u0C09\u0C1A\u0C3F\u0C24 \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C41\u0C24\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C15\u0C3E\u0C32\u0C41"}
                  </h3>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400">
                    250 {"\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C4D\u0C32\u0C41"}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {"\u0C38\u0C46\u0C32\u0C42\u0C28\u0C4D \u0C37\u0C3E\u0C2A\u0C41\u0C32\u0C15\u0C41 \u0C09\u0C1A\u0C3F\u0C24 \u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C05\u0C30\u0C4D\u0C39\u0C24 \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/coordinator-card"
            onClick={triggerHaptic}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {"\u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41"}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {"\u0C2A\u0C4D\u0C30\u0C3F\u0C02\u0C1F\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C3E\u0C1F\u0C4D\u0C38\u0C3E\u0C2A\u0C4D \u0C37\u0C47\u0C30\u0C3F\u0C02\u0C17\u0C4D \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-950 p-4 text-center">
          <p className="text-[11px] text-slate-500">
            {"\u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C35\u0C46\u0C2C\u0C4D\u200C\u0C38\u0C3E\u0C1F\u0C4D"}:{" "}
            <span className="font-medium text-slate-300">nayisamakhya.org</span>
          </p>
          <div className="mt-1 text-[10px] text-slate-600">
            {"\u0C2C\u0C3E\u0C1F\u0C4D \u0C1A\u0C3E\u0C1F\u0C4D\u200C\u0C32\u0C4B\u0C15\u0C3F \u0C24\u0C3F\u0C30\u0C3F\u0C17\u0C3F \u0C30\u0C3E\u0C35\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2A\u0C48\u0C28\u0C41\u0C28\u0C4D\u0C28 'Close' \u0C2C\u0C1F\u0C28\u0C4D \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C02\u0C21\u0C3F."}
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            <Link href="/announce" className="text-amber-400/90 hover:underline">
              {"\u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C17\u0C2E\u0C28\u0C3F\u0C15 \u0C37\u0C47\u0C30\u0C4D"}
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
