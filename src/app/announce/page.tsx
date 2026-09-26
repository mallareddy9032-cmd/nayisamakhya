"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy, ExternalLink, MessageCircle, Send } from "lucide-react";
import {
  ANNOUNCE_PAGE_URL,
  COMMUNITY_BLASTS,
  getCommunityBlast,
  PORTAL_URL,
  TELEGRAM_BOT_URL,
  type CommunityBlastId,
} from "@/lib/data/communityAnnounce";

function AnnounceInner() {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<CommunityBlastId>("desk");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("blast");
    if (fromQuery && COMMUNITY_BLASTS.some((b) => b.id === fromQuery)) {
      setActiveId(fromQuery as CommunityBlastId);
    }
  }, [searchParams]);

  const blast = getCommunityBlast(activeId);
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(blast.text)}`;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(blast.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0B1F33] text-[#F7F4EE]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(194,65,12,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(14,116,144,0.25), transparent 50%), linear-gradient(180deg, #0B1F33 0%, #12263a 45%, #0B1F33 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-5 text-center sm:mb-6">
          <p className="font-telugu text-xs font-semibold uppercase tracking-[0.2em] text-[#F0A070]">
            {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F \u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"}
          </p>
          <h1 className="mt-2 font-telugu text-2xl font-bold leading-snug text-white sm:text-3xl">
            {"\u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C2C\u0C4D\u0C30\u0C3E\u0C21\u0C4D\u200C\u0C15\u0C3E\u0C38\u0C4D\u0C1F\u0C4D & SOP"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Pick a notice, copy or WhatsApp-share to mandal groups.
          </p>
        </header>

        <div
          className="mb-4 grid grid-cols-2 gap-2 no-print sm:grid-cols-4"
          role="tablist"
          aria-label="Blast templates"
        >
          {COMMUNITY_BLASTS.map((b) => {
            const selected = b.id === activeId;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActiveId(b.id);
                  setCopied(false);
                  const url = new URL(window.location.href);
                  url.searchParams.set("blast", b.id);
                  window.history.replaceState({}, "", url.toString());
                }}
                className={
                  selected
                    ? "rounded-xl border border-[#C2410C]/60 bg-[#C2410C]/25 px-2 py-2.5 text-left transition"
                    : "rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-left transition hover:border-white/25"
                }
              >
                <div className="font-telugu text-xs font-bold text-white">
                  {b.title_te}
                </div>
                <div className="mt-0.5 font-telugu text-[10px] text-slate-400">
                  {b.blurb_te}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap justify-center gap-2 no-print">
          <button
            type="button"
            onClick={() => void copyText()}
            className="tap inline-flex items-center gap-2 rounded-lg bg-[#C2410C] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C2410C]/25 transition hover:bg-[#A3380A]"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
            {copied ? "Copied" : "Copy message"}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Share on WhatsApp
          </a>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/25"
          >
            <Send className="h-4 w-4" aria-hidden />
            Open Telegram bot
          </a>
        </div>

        <article
          className="flex-1 rounded-2xl border border-white/10 bg-[#0F2740]/80 p-5 shadow-2xl backdrop-blur-sm sm:p-7"
          lang="te"
        >
          <pre className="font-telugu whitespace-pre-wrap break-words text-[14px] leading-relaxed text-[#F7F4EE] sm:text-[15px]">
            {blast.text}
          </pre>
        </article>

        <footer className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-slate-400 no-print">
          <a
            href={PORTAL_URL}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
          >
            {PORTAL_URL.replace(/^https:\/\//, "")}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
          <p className="max-w-md">
            Deep link:{" "}
            <Link
              href={`/announce?blast=${activeId}`}
              className="text-[#F0A070] hover:underline"
            >
              {ANNOUNCE_PAGE_URL}?blast={activeId}
            </Link>
          </p>
          <Link href="/" className="text-slate-500 hover:text-slate-300">
            {"\u2190"} Back to portal
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default function CommunityAnnouncePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#0B1F33] text-sm text-slate-400">
          Loading notices…
        </div>
      }
    >
      <AnnounceInner />
    </Suspense>
  );
}
