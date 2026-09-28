"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";
import {
  ANNOUNCE_PAGE_URL,
  COMMUNITY_BLASTS,
  COORDINATOR_BLASTS,
  getCommunityBlast,
  PUBLIC_BLASTS,
  TELEGRAM_BOT_URL,
  type CommunityBlast,
  type CommunityBlastId,
} from "@/lib/data/communityAnnounce";
import { LinkifiedText } from "@/components/LinkifiedText";

/** Low-spec Android WhatsApp intents truncate past ~1.2k chars. */
const SHARE_PAYLOAD_MAX = 1200;

function clampSharePayload(text: string, max = SHARE_PAYLOAD_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const breakAt = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
  const cut = breakAt > max * 0.6 ? slice.slice(0, breakAt) : slice;
  return `${cut.trimEnd()}…`;
}

function whatsappShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

function NoticeButton({
  blast,
  selected,
  onSelect,
}: {
  blast: CommunityBlast;
  selected: boolean;
  onSelect: (id: CommunityBlastId) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => onSelect(blast.id)}
      className={
        selected
          ? "tap flex min-h-14 w-full flex-col items-start gap-0.5 rounded-xl border-2 border-civic-bronze bg-civic-bronze/10 px-4 py-3 text-left transition"
          : "tap flex min-h-14 w-full flex-col items-start gap-0.5 rounded-xl border border-civic-border bg-white px-4 py-3 text-left transition hover:border-civic-bronze/50"
      }
    >
      <span className="font-telugu text-sm font-bold text-civic-ink">
        {blast.title_te}
      </span>
      <span className="font-sans text-[11px] text-slate-500">
        {blast.title_en}
      </span>
    </button>
  );
}

export function AnnounceHub({
  initialBlast,
}: {
  initialBlast?: string | null;
}) {
  const startingId = useMemo(() => {
    if (
      initialBlast &&
      COMMUNITY_BLASTS.some((b) => b.id === initialBlast)
    ) {
      return initialBlast as CommunityBlastId;
    }
    return "desk" as CommunityBlastId;
  }, [initialBlast]);

  const [activeId, setActiveId] = useState<CommunityBlastId>(startingId);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const blast = getCommunityBlast(activeId);
  const shareText = useMemo(
    () => clampSharePayload(blast.text),
    [blast.text],
  );
  const whatsappHref = whatsappShareUrl(shareText);
  const isCoordinator = blast.audience === "coordinator";
  const wasClamped = blast.text.trim().length > SHARE_PAYLOAD_MAX;

  const selectBlast = (id: CommunityBlastId) => {
    setActiveId(id);
    setCopied(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("blast", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title: blast.title_te,
          text: shareText,
          url: `${ANNOUNCE_PAGE_URL}?blast=${activeId}`,
        });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    } finally {
      setSharing(false);
    }
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-dvh bg-civic-paper text-civic-ink">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 15% 0%, rgba(180,83,9,0.12), transparent 55%), radial-gradient(ellipse 50% 60% at 90% 10%, rgba(30,41,59,0.06), transparent 50%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6">
          <p className="font-telugu text-xs font-semibold tracking-wide text-civic-bronze">
            {"నాయి సమాఖ్య తెలంగాణ"}
          </p>
          <h1 className="mt-2 font-telugu text-2xl font-bold leading-snug text-civic-navy sm:text-3xl">
            {"వాట్సాప్ సందేశ కిట్"}
          </h1>
          <p className="mt-1 font-sans text-sm font-medium text-slate-600">
            WhatsApp message kit — native share + safe payload
          </p>
          <p className="mt-3 max-w-lg font-telugu text-sm leading-relaxed text-slate-600">
            {
              "ఒక నోటీస్ ఎంచుకోండి → Share నొక్కండి → WhatsApp/మొబైల్ షేర్. ఆటో మాస్ సందేశం లేదు."
            }
          </p>
        </header>

        <div
          className="no-print mb-5 space-y-5"
          role="tablist"
          aria-label="Message kit notices"
        >
          <section aria-labelledby="public-notices-heading">
            <h2
              id="public-notices-heading"
              className="mb-2 font-telugu text-xs font-bold uppercase tracking-wider text-civic-navy"
            >
              {"ప్రజా షేర్ నోటీసులు"}
              <span className="ml-2 font-sans font-medium normal-case tracking-normal text-slate-500">
                / Public share
              </span>
            </h2>
            <div className="flex flex-col gap-2">
              {PUBLIC_BLASTS.map((b) => (
                <NoticeButton
                  key={b.id}
                  blast={b}
                  selected={b.id === activeId}
                  onSelect={selectBlast}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="coordinator-notices-heading">
            <h2
              id="coordinator-notices-heading"
              className="mb-2 font-telugu text-xs font-bold uppercase tracking-wider text-civic-bronze"
            >
              {"సమన్వయకర్తలకు మాత్రమే"}
              <span className="ml-2 font-sans font-medium normal-case tracking-normal text-slate-500">
                / Coordinators only
              </span>
            </h2>
            <div className="flex flex-col gap-2">
              {COORDINATOR_BLASTS.map((b) => (
                <NoticeButton
                  key={b.id}
                  blast={b}
                  selected={b.id === activeId}
                  onSelect={selectBlast}
                />
              ))}
            </div>
          </section>
        </div>

        {isCoordinator ? (
          <p className="no-print mb-3 rounded-lg border border-civic-bronze/30 bg-civic-bronze/5 px-3 py-2 font-telugu text-xs text-civic-bronze">
            {
              "ఈ సందేశం మండల సమన్వయకర్తల SOP — సాధారణ వాట్సాప్ గ్రూపులకు కాదు."
            }
          </p>
        ) : null}

        {wasClamped ? (
          <p className="no-print mb-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-telugu text-[11px] text-slate-600">
            {
              "షేర్ పేలోడ్ 1,200 అక్షరాలకు క్లాంప్ చేయబడింది — Android truncation నివారణ."
            }
          </p>
        ) : null}

        <div className="no-print mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={sharing}
            onClick={() => void nativeShare()}
            className="tap inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0E7A6E] disabled:opacity-70 sm:flex-none sm:px-5"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            <span className="font-telugu">{"షేర్ చేయండి"}</span>
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#128C7E]/40 bg-white px-4 py-3 text-sm font-semibold text-[#0E7A6E] transition hover:bg-emerald-50 sm:flex-none sm:px-5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => void copyText()}
            className="tap inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-3 text-sm font-semibold text-civic-navy transition hover:border-civic-bronze/40 hover:bg-civic-subtle sm:flex-none sm:px-5"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
            {copied ? "Copied" : "Copy message"}
          </button>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 underline-offset-2 transition hover:text-civic-navy hover:underline sm:px-4"
          >
            <Send className="h-3.5 w-3.5" aria-hidden />
            Open Telegram bot
          </a>
        </div>

        <article
          className="flex-1 rounded-2xl border border-civic-border bg-white p-5 shadow-sm sm:p-7"
          lang="te"
          aria-label="Message preview"
        >
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Preview
            {wasClamped
              ? ` (clamped ${shareText.length}/${SHARE_PAYLOAD_MAX})`
              : ""}
          </p>
          <LinkifiedText text={shareText} />
        </article>

        <footer className="no-print mt-6 flex flex-col items-start gap-2 text-xs text-slate-500">
          <p>
            Deep link:{" "}
            <Link
              href={`/announce?blast=${activeId}`}
              className="break-all text-civic-bronze hover:underline"
            >
              {ANNOUNCE_PAGE_URL}?blast={activeId}
            </Link>
          </p>
          <Link
            href="/"
            className="font-telugu text-slate-500 hover:text-civic-navy"
          >
            ← {"పోర్టల్‌కు తిరిగి"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
