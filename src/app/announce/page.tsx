"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, MessageCircle, Send } from "lucide-react";
import {
  ANNOUNCE_PAGE_URL,
  COMMUNITY_ANNOUNCE_WHATSAPP,
  PORTAL_URL,
  TELEGRAM_BOT_URL,
} from "@/lib/data/communityAnnounce";

export default function CommunityAnnouncePage() {
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(COMMUNITY_ANNOUNCE_WHATSAPP)}`;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(COMMUNITY_ANNOUNCE_WHATSAPP);
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
        <header className="mb-6 text-center sm:mb-8">
          <p className="font-telugu text-xs font-semibold uppercase tracking-[0.2em] text-[#F0A070]">
            నాయి సమాఖ్య తెలంగాణ
          </p>
          <h1 className="mt-2 font-telugu text-2xl font-bold leading-snug text-white sm:text-3xl">
            డిజిటల్ సేవా డెస్క్ — కమ్యూనిటీ గమనిక
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Copy or WhatsApp-share this notice to mandal groups. Bot:{" "}
            <a
              href={TELEGRAM_BOT_URL}
              className="font-medium text-[#F0A070] underline-offset-2 hover:underline"
            >
              @NayiSamakhyaDeskBot
            </a>
          </p>
        </header>

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
          <pre className="font-telugu whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#F7F4EE] sm:text-base">
            {COMMUNITY_ANNOUNCE_WHATSAPP}
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
            Page link for coordinators:{" "}
            <Link href="/announce" className="text-[#F0A070] hover:underline">
              {ANNOUNCE_PAGE_URL}
            </Link>
          </p>
          <Link href="/" className="text-slate-500 hover:text-slate-300">
            ← Back to portal
          </Link>
        </footer>
      </div>
    </div>
  );
}
