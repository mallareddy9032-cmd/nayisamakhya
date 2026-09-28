"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Share2,
  Newspaper,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  CATEGORY_FILTER_TABS,
  NEWSLETTER_CANONICAL,
  NEWSLETTER_TITLE,
  NEWSLETTER_TITLE_SHORT,
  buildBulletinWhatsAppText,
  buildWhatsAppShareText,
  categoryBadgeStyle,
  gazettePosterItems,
  matchesFilter,
  type CategoryFilterId,
  type DigestBulletin,
  type FortnightEdition,
} from "@/lib/newsletter/digest";
import type { NewsletterDigestPayload } from "@/lib/newsletter/loadEditions";

const HELPLINE = "+91 9032654111";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("te-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatLongDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("te-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function whatsappHrefFor(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function BulletinCard({ b }: { b: DigestBulletin }) {
  const badge = categoryBadgeStyle(b.category);
  const wa = whatsappHrefFor(buildBulletinWhatsAppText(b));
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full ${badge.className}`}
          style={badge.style}
        >
          {b.category}
        </span>
        {b.is_fallback ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
            institutional notice
          </span>
        ) : null}
        <span className="text-[11px] text-slate-400">
          {formatDate(b.published_at)}
        </span>
      </div>
      <h3 className="mt-2 font-telugu text-base font-bold leading-snug text-[#0F172A] md:text-lg">
        {b.title}
      </h3>
      <p className="mt-2 font-telugu text-sm leading-relaxed text-[#1E293B]">
        {b.summary_te}
      </p>
      {b.target_districts?.length > 0 ? (
        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#B45309]" />
          <span>{b.target_districts.join(" · ")}</span>
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(b.source_url || b.pdf_url) && (
          <a
            href={b.pdf_url || b.source_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-telugu text-xs font-semibold text-[#B45309] hover:underline"
          >
            మూల పత్రం <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 font-telugu text-[11px] font-bold text-white shadow-xs transition hover:bg-emerald-800"
        >
          <Share2 className="h-3 w-3" aria-hidden />
          వాట్సాప్ గ్రూపులకు ఫార్వర్డ్ చేయండి
        </a>
      </div>
    </article>
  );
}

function EditionBlock({
  edition,
  filter,
  archived,
}: {
  edition: FortnightEdition;
  filter: CategoryFilterId | string;
  archived?: boolean;
}) {
  const items = edition.bulletins.filter((b) => matchesFilter(b, filter));
  if (items.length === 0) return null;

  return (
    <section className="space-y-4 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        {archived ? (
          <Archive className="h-4 w-4 text-slate-400" aria-hidden />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden />
        )}
        <h2 className="font-telugu text-sm font-bold text-[#0F172A]">
          {edition.label_te}
        </h2>
        <span className="text-[11px] text-slate-500">
          {formatDate(edition.start)} — {formatDate(edition.end)}
        </span>
        <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
          {items.length} notices
        </span>
      </div>
      <div className="space-y-3">
        {items.map((b) => (
          <BulletinCard key={b.id} b={b} />
        ))}
      </div>
    </section>
  );
}

/** A4 wall-poster gazette — visible only in print. */
function GazetteWallPoster({
  edition,
  volume,
}: {
  edition: FortnightEdition;
  volume: string;
}) {
  const items = gazettePosterItems(edition);
  const issued = formatLongDate(edition.end || new Date().toISOString());

  const deadlines = [
    "మండల స్థాయి ధృవీకరణ: 7 రోజులలోపు",
    "జిల్లా డెస్క్ నివేదిక: 14 రోజులలోపు",
    "నోటీస్ బోర్డు ప్రదర్శన: వెంటనే",
  ];

  return (
    <div
      id="gazette-wall-poster"
      className="hidden print:block"
      lang="te"
      translate="no"
    >
      <header className="gazette-masthead border-b-4 border-double border-[#1E293B] pb-2">
        <div className="border-b-2 border-[#B45309] pb-1.5">
          <p className="text-center font-telugu text-[11px] font-bold tracking-wide text-[#B45309]">
            NAYI SAMAKHYA TELANGANA · OFFICIAL GAZETTE
          </p>
          <h1 className="mt-1 text-center font-telugu text-base font-black leading-snug text-[#0F172A]">
            తెలంగాణ నాయీ బ్రాహ్మణ సమైక్య - అధికారిక పక్షిక గెజిట్ బులెటిన్
          </h1>
        </div>
        <div className="mt-1.5 flex items-center justify-between font-telugu text-[9px] text-slate-700">
          <span>సంపుటి / Vol. {volume}</span>
          <span>తేదీ: {issued}</span>
          <span>www.nayisamakhya.org</span>
        </div>
      </header>

      <div className="gazette-body mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        {items.map((b, i) => {
          const goMatch = b.title.match(/G\.?O\.?\s*[\d.]+/i);
          const circular =
            goMatch?.[0] ||
            (b.category.includes("G.O") ? "G.O. Ms. No. 23" : b.category);
          return (
            <article
              key={b.id}
              className="break-inside-avoid border border-slate-300 p-2"
            >
              <p className="font-mono text-[8px] font-bold uppercase tracking-wide text-[#B45309]">
                #{i + 1} · {circular}
              </p>
              <h2 className="mt-0.5 font-telugu text-[11px] font-black leading-snug text-[#0F172A]">
                {b.title}
              </h2>
              <p className="mt-1 font-telugu text-[9px] leading-snug text-slate-800">
                {b.summary_te}
              </p>
              <p className="mt-1.5 font-telugu text-[8px] font-bold text-[#1E293B]">
                మండల చర్యా గడువు: {deadlines[i] || deadlines[0]}
              </p>
            </article>
          );
        })}
      </div>

      <footer className="gazette-footer mt-3 flex break-inside-avoid items-center justify-between gap-3 border-t-2 border-[#1E293B] pt-2">
        <div className="min-w-0 flex-1">
          <p className="font-telugu text-[10px] font-bold leading-snug text-[#0F172A]">
            ప్రతి సెలూన్ మరియు కమ్యూనిటీ భవనం నోటీస్ బోర్డుపై ఉంచవలసినది
          </p>
          <p className="mt-1 font-telugu text-[9px] text-slate-700">
            సహాయవాణి: {HELPLINE} · Verify: {NEWSLETTER_CANONICAL}
          </p>
        </div>
        <div className="shrink-0 rounded border border-slate-400 bg-white p-0.5">
          <QRCodeSVG
            value={NEWSLETTER_CANONICAL}
            size={56}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0f172a"
            title="Newsletter verification"
          />
        </div>
      </footer>
    </div>
  );
}

export default function NewsletterClient({
  payload,
}: {
  payload: NewsletterDigestPayload;
}) {
  const [filter, setFilter] = useState<CategoryFilterId | string>("all");
  const { currentEdition, archives, source, error } = payload;

  const shareText = useMemo(() => {
    const top = currentEdition.bulletins
      .filter((b) => matchesFilter(b, filter))
      .slice(0, 3);
    const sourceRows =
      top.length > 0 ? top : currentEdition.bulletins.slice(0, 3);
    return buildWhatsAppShareText(currentEdition, sourceRows);
  }, [currentEdition, filter]);

  const whatsappHref = whatsappHrefFor(shareText);

  const volume = useMemo(() => {
    const d = new Date(currentEdition.end || Date.now());
    const y = d.getFullYear();
    const week = Math.ceil(
      (d.getTime() - new Date(y, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    return `${y}-${String(week).padStart(2, "0")}`;
  }, [currentEdition.end]);

  const filteredCurrentCount = currentEdition.bulletins.filter((b) =>
    matchesFilter(b, filter),
  ).length;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] antialiased selection:bg-[#B45309] selection:text-white print:min-h-0 print:bg-white">
      <header className="no-print sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-[#E2E8F0] p-1.5 text-slate-500 transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              aria-label="Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4 shrink-0 text-[#B45309]" />
                <h1 className="truncate font-telugu text-base font-bold text-[#0F172A] md:text-lg">
                  {NEWSLETTER_TITLE_SHORT}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                Civic Fortnightly Digest · wall poster ready
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E293B] px-3 py-2 font-telugu text-xs font-bold text-white shadow-xs transition hover:bg-[#0F172A]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#B45309]" />
              వాల్ పోస్టర్ / A4 గెజిట్ ప్రింట్
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 font-telugu text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
            >
              <Share2 className="h-3.5 w-3.5" />
              వాట్సాప్ గ్రూపులకు ఫార్వర్డ్ చేయండి
            </a>
          </div>
        </div>
      </header>

      <main
        id="newsletter-print-root"
        className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:px-0 print:py-0"
      >
        <GazetteWallPoster edition={currentEdition} volume={volume} />

        <div className="mb-6 print:hidden">
          {/* Executive Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-7">
            <header className="mb-5 border-b border-[#E2E8F0] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
                Civic Fortnightly Digest
              </p>
              <h2 className="mt-1 font-telugu text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">
                {NEWSLETTER_TITLE}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Auto-curated from{" "}
                <code className="rounded bg-slate-100 px-1">civic_bulletins</code>{" "}
                · current fortnight + archives · salon noticeboard ready
              </p>
              {source === "fallback" ? (
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
                  Live bulletin window empty or unavailable — showing institutional
                  notices (G.O. 23, BC-A scholarships, corridor progress).
                  {error ? ` (${error})` : ""}
                </p>
              ) : null}
            </header>

            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORY_FILTER_TABS.map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-full border px-3 py-1.5 font-telugu text-xs font-semibold transition ${
                      active
                        ? "border-[#B45309] bg-[#B45309] text-white"
                        : "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] hover:border-[#B45309]/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {filteredCurrentCount === 0 &&
            archives.every(
              (ed) =>
                ed.bulletins.filter((b) => matchesFilter(b, filter)).length === 0,
            ) ? (
              <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#FBFBFA] px-6 py-14 text-center">
                <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 font-telugu text-base font-bold text-[#0F172A]">
                  ఈ వర్గంలో నోటీసులు లేవు
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try another category filter or check back after cron sync.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                <EditionBlock edition={currentEdition} filter={filter} />
                {archives.length > 0 ? (
                  <div className="space-y-8 border-t border-[#E2E8F0] pt-8">
                    <p className="font-telugu text-xs font-bold uppercase tracking-wider text-slate-500">
                      గత సంకలనాలు (Archives)
                    </p>
                    {archives.map((ed) => (
                      <EditionBlock
                        key={ed.id}
                        edition={ed}
                        filter={filter}
                        archived
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 8mm 10mm; }
          html, body {
            background: white !important;
            color: #0F172A !important;
            height: auto !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print, .no-print * { display: none !important; visibility: hidden !important; }
          body * { visibility: hidden !important; }
          #newsletter-print-root,
          #newsletter-print-root #gazette-wall-poster,
          #newsletter-print-root #gazette-wall-poster * {
            visibility: visible !important;
          }
          #newsletter-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #gazette-wall-poster {
            display: block !important;
            max-height: 277mm !important;
            overflow: hidden !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .gazette-footer, .gazette-masthead, .gazette-body article {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          a { color: inherit !important; text-decoration: none !important; }
        }
      `,
        }}
      />
    </div>
  );
}
