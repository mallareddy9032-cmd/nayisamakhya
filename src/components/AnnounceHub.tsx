"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Copy,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  ANNOUNCE_PAGE_URL,
  COMMUNITY_BLASTS,
  COORDINATOR_BLASTS,
  getCommunityBlast,
  PUBLIC_BLASTS,
  type CommunityBlastId,
} from "@/lib/data/communityAnnounce";
import {
  MOBILIZATION_FOCUSES,
  SHARE_PAYLOAD_MAX,
  buildMobilizationMessage,
  getMobilizationFocus,
  whatsappShareUrl,
  type MobilizationFocusId,
} from "@/lib/data/mobilizationDispatcher";
import {
  TELANGANA_GEO,
  getGeoDistrict,
  listDistrictEntities,
  type AdminEntity,
} from "@/data/telanganaGeo";
import { LinkifiedText } from "@/components/LinkifiedText";

function entityLabel(entity: AdminEntity): string {
  const tag =
    entity.type === "corporation"
      ? "కార్పొరేషన్"
      : entity.type === "municipality"
        ? "మున్సిపాలిటీ"
        : "మండలం";
  return `${entity.nameTe} · ${entity.nameEn} (${tag})`;
}

function WhatsAppPreview({
  text,
  districtNameTe,
  entityNameTe,
}: {
  text: string;
  districtNameTe: string;
  entityNameTe: string | null;
}) {
  const now = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch {
      return "";
    }
  }, []);

  const subtitle = entityNameTe
    ? `${districtNameTe} · ${entityNameTe}`
    : `${districtNameTe} జిల్లా`;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#0F172A]/10 shadow-sm"
      aria-label="WhatsApp broadcast preview"
    >
      <div className="flex items-center gap-3 bg-[#075E54] px-3 py-2.5 text-white">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#128C7E] font-sans text-xs font-bold"
          aria-hidden
        >
          NS
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-telugu text-sm font-semibold leading-tight">
            నాయి సమాఖ్య · మొబిలైజేషన్
          </p>
          <p className="truncate font-sans text-[10px] text-white/75">
            {subtitle}
          </p>
        </div>
      </div>

      <div
        className="relative min-h-[280px] px-3 py-4 sm:min-h-[320px] sm:px-4"
        style={{
          backgroundColor: "#E5DDD5",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0,0,0,0.04) 0 1px, transparent 1px)",
          backgroundSize: "18px 18px, 22px 22px",
        }}
      >
        <div className="ml-auto max-w-[92%] sm:max-w-[88%]">
          <div className="relative rounded-xl rounded-tr-sm bg-[#DCF8C6] px-3 py-2.5 shadow-sm">
            <div lang="te">
              <LinkifiedText text={text} />
            </div>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="font-sans text-[10px] text-slate-500">{now}</span>
              <svg
                viewBox="0 0 16 11"
                className="h-2.5 w-4 text-[#53BDEB]"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M11.07 0.35 5.4 6.55 2.93 4.2 1.8 5.4l3.6 3.4L12.2 1.55z"
                />
                <path
                  fill="currentColor"
                  d="M14.07 0.35 8.4 6.55 7.55 5.75 6.42 6.95l2 1.85L15.2 1.55z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyBlastKit({ initialBlast }: { initialBlast?: string | null }) {
  const startingId = useMemo(() => {
    if (initialBlast && COMMUNITY_BLASTS.some((b) => b.id === initialBlast)) {
      return initialBlast as CommunityBlastId;
    }
    return null;
  }, [initialBlast]);

  const [open, setOpen] = useState(Boolean(startingId));
  const [activeId, setActiveId] = useState<CommunityBlastId>(
    startingId ?? "desk",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (startingId) {
      setActiveId(startingId);
      setOpen(true);
    }
  }, [startingId]);

  const blast = getCommunityBlast(activeId);
  const shareText = useMemo(
    () =>
      blast.text.trim().length > SHARE_PAYLOAD_MAX
        ? `${blast.text.trim().slice(0, SHARE_PAYLOAD_MAX - 1).trimEnd()}…`
        : blast.text.trim(),
    [blast.text],
  );
  const whatsappHref = whatsappShareUrl(shareText);

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

  return (
    <section
      className="mt-8 rounded-2xl border border-civic-border bg-white/80"
      aria-labelledby="legacy-kit-heading"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="tap flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div>
          <h2
            id="legacy-kit-heading"
            className="font-telugu text-sm font-bold text-civic-navy"
          >
            పాత సందేశ కిట్ / SOP
          </h2>
          <p className="font-sans text-[11px] text-slate-500">
            Legacy blast kits — desk, representation, feed, coordinator SOP
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-civic-border px-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {[...PUBLIC_BLASTS, ...COORDINATOR_BLASTS].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => selectBlast(b.id)}
                className={
                  b.id === activeId
                    ? "tap rounded-xl border-2 border-civic-bronze bg-civic-bronze/10 px-3 py-2.5 text-left"
                    : "tap rounded-xl border border-civic-border bg-white px-3 py-2.5 text-left hover:border-civic-bronze/40"
                }
              >
                <span className="block font-telugu text-sm font-semibold text-civic-ink">
                  {b.title_te}
                </span>
                <span className="block font-sans text-[11px] text-slate-500">
                  {b.title_en}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="tap inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => void copyText()}
              className="tap inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 text-sm font-semibold text-civic-navy"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <article
            className="rounded-xl border border-civic-border bg-civic-subtle/60 p-4"
            lang="te"
          >
            <LinkifiedText text={shareText} />
          </article>

          <p className="font-sans text-[11px] text-slate-500">
            Deep link:{" "}
            <Link
              href={`/announce?blast=${activeId}`}
              className="break-all text-civic-bronze hover:underline"
            >
              {ANNOUNCE_PAGE_URL}?blast={activeId}
            </Link>
          </p>
        </div>
      ) : null}
    </section>
  );
}

export function AnnounceHub({
  initialBlast,
}: {
  initialBlast?: string | null;
}) {
  const districts = TELANGANA_GEO;
  const [districtSlug, setDistrictSlug] = useState(
    () => districts[0]?.slug ?? "khammam",
  );
  const [entitySlug, setEntitySlug] = useState<string>("");
  const [focusId, setFocusId] = useState<MobilizationFocusId>("go23");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const district = getGeoDistrict(districtSlug) ?? districts[0];
  const { urban, rural } = useMemo(
    () => listDistrictEntities(districtSlug),
    [districtSlug],
  );
  const entities = useMemo(() => [...urban, ...rural], [urban, rural]);

  useEffect(() => {
    if (!entities.length) {
      setEntitySlug("");
      return;
    }
    if (!entities.some((e) => e.slug === entitySlug)) {
      setEntitySlug(entities[0].slug);
    }
  }, [entities, entitySlug]);

  const entity = entities.find((e) => e.slug === entitySlug) ?? null;
  const focus = getMobilizationFocus(focusId);

  const generatedMessage = useMemo(
    () =>
      buildMobilizationMessage(focusId, {
        districtSlug: district.slug,
        districtNameTe: district.nameTe,
        districtNameEn: district.nameEn,
        entity,
      }),
    [focusId, district, entity],
  );

  const wasClamped = generatedMessage.endsWith("…");
  const whatsappHref = whatsappShareUrl(generatedMessage);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      showToast("సందేశం కాపీ అయింది");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      showToast("కాపీ కాలేదు — మాన్యువల్‌గా సెలెక్ట్ చేయండి");
    }
  };

  const shareWhatsApp = () => {
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
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
          title: focus.title_te,
          text: generatedMessage,
          url: ANNOUNCE_PAGE_URL,
        });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    } finally {
      setSharing(false);
    }
    shareWhatsApp();
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

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-civic-bronze/30 bg-civic-ink px-4 py-2 font-telugu text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6">
          <p className="font-telugu text-xs font-semibold tracking-wide text-civic-bronze">
            నాయి సమాఖ్య తెలంగాణ
          </p>
          <h1 className="mt-2 font-display-te text-2xl font-normal leading-snug text-civic-ink sm:text-3xl">
            వాట్సాప్ మొబిలైజేషన్ డిస్పాచర్
          </h1>
          <p className="mt-1 font-sans text-sm font-medium text-slate-600">
            WhatsApp Mobilization Dispatcher — one-tap localized blast
          </p>
          <p className="mt-3 max-w-lg font-telugu text-sm leading-relaxed text-slate-600">
            జిల్లా + మండలం/పట్టణం ఎంచుకోండి → ఫోకస్ ఎంచుకోండి → WhatsApp లో షేర్.
            ఆటో మాస్ సందేశం లేదు.
          </p>
        </header>

        <div className="no-print mb-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-telugu text-xs font-bold text-civic-navy">
                జిల్లా / District
              </span>
              <select
                value={districtSlug}
                onChange={(e) => setDistrictSlug(e.target.value)}
                className="tap w-full rounded-xl border border-civic-border bg-white px-3 py-3 font-telugu text-sm text-civic-ink outline-none ring-civic-bronze focus:ring-2"
              >
                {districts.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.nameTe} · {d.nameEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-telugu text-xs font-bold text-civic-navy">
                మండలం / పట్టణం · Entity
              </span>
              <select
                value={entitySlug}
                onChange={(e) => setEntitySlug(e.target.value)}
                disabled={!entities.length}
                className="tap w-full rounded-xl border border-civic-border bg-white px-3 py-3 font-telugu text-sm text-civic-ink outline-none ring-civic-bronze focus:ring-2 disabled:opacity-60"
              >
                {urban.length ? (
                  <optgroup label="పట్టణాలు / Towns & ULBs">
                    {urban.map((e) => (
                      <option key={`u-${e.slug}`} value={e.slug}>
                        {entityLabel(e)}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                {rural.length ? (
                  <optgroup label="గ్రామీణ మండలాలు / Rural mandals">
                    {rural.map((e) => (
                      <option key={`r-${e.slug}`} value={e.slug}>
                        {entityLabel(e)}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 font-telugu text-xs font-bold text-civic-navy">
              భాష / ఫోకస్ · Language / Focus
            </legend>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label="Mobilization focus"
            >
              {MOBILIZATION_FOCUSES.map((f) => {
                const selected = f.id === focusId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setFocusId(f.id)}
                    className={
                      selected
                        ? "tap flex min-h-14 w-full flex-col items-start gap-0.5 rounded-xl border-2 border-civic-bronze bg-civic-bronze/10 px-4 py-3 text-left transition"
                        : "tap flex min-h-14 w-full flex-col items-start gap-0.5 rounded-xl border border-civic-border bg-white px-4 py-3 text-left transition hover:border-civic-bronze/50"
                    }
                  >
                    <span className="font-telugu text-sm font-bold text-civic-ink">
                      {f.title_te}
                    </span>
                    <span className="font-sans text-[11px] text-slate-500">
                      {f.title_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {wasClamped ? (
          <p className="no-print mb-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-telugu text-[11px] text-slate-600">
            షేర్ పేలోడ్ 1,200 అక్షరాలకు క్లాంప్ చేయబడింది — Android truncation
            నివారణ.
          </p>
        ) : null}

        <div className="no-print mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="tap inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0E7A6E] sm:flex-none sm:px-5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span className="font-telugu">
              WhatsApp లో షేర్ చేయండి (Share to WhatsApp)
            </span>
          </button>
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
            <span className="font-telugu">
              {copied
                ? "కాపీ అయింది"
                : "సందేశం కాపీ చేయండి (Copy Text)"}
            </span>
          </button>
          <button
            type="button"
            disabled={sharing}
            onClick={() => void nativeShare()}
            className="tap inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 underline-offset-2 transition hover:text-civic-navy hover:underline disabled:opacity-70 sm:px-4"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            <span className="font-telugu">సిస్టమ్ షేర్</span>
          </button>
        </div>

        <p className="no-print mb-3 font-sans text-[11px] text-slate-500">
          {generatedMessage.length}/{SHARE_PAYLOAD_MAX} chars · {focus.blurb_te}
        </p>

        <WhatsAppPreview
          text={generatedMessage}
          districtNameTe={district.nameTe}
          entityNameTe={entity?.nameTe ?? null}
        />

        <LegacyBlastKit initialBlast={initialBlast} />

        <footer className="no-print mt-6 flex flex-col items-start gap-2 text-xs text-slate-500">
          <Link
            href="/"
            className="font-telugu text-slate-500 hover:text-civic-navy"
          >
            ← పోర్టల్‌కు తిరిగి
          </Link>
        </footer>
      </div>
    </div>
  );
}
