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
import {
  CATEGORY_FILTER_TABS,
  NEWSLETTER_CANONICAL,
  NEWSLETTER_TITLE,
  NEWSLETTER_TITLE_SHORT,
  buildWhatsAppShareText,
  categoryBadgeStyle,
  matchesFilter,
  type CategoryFilterId,
  type DigestBulletin,
  type FortnightEdition,
} from "@/lib/newsletter/digest";
import type { NewsletterDigestPayload } from "@/lib/newsletter/loadEditions";

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

function BulletinCard({ b }: { b: DigestBulletin }) {
  const badge = categoryBadgeStyle(b.category);
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs print:break-inside-avoid print:rounded-none print:border print:border-slate-300 print:shadow-none">
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
      {(b.source_url || b.pdf_url) && (
        <a
          href={b.pdf_url || b.source_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="no-print mt-3 inline-flex items-center gap-1 font-telugu text-xs font-semibold text-[#B45309] hover:underline print:hidden"
        >
          మూల పత్రం <ExternalLink className="h-3 w-3" />
        </a>
      )}
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
    <section className="space-y-4">
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

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const filteredCurrentCount = currentEdition.bulletins.filter((b) =>
    matchesFilter(b, filter),
  ).length;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] antialiased selection:bg-[#B45309] selection:text-white">
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
                Civic Fortnightly Digest · zero-maintenance
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 font-telugu text-xs font-bold text-[#1E293B] shadow-xs transition hover:bg-[#F8FAFC]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#B45309]" />
              Print / Noticeboard
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 font-telugu text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
            >
              <Share2 className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main
        id="newsletter-print-root"
        className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:px-0 print:py-0"
      >
        <div className="mb-6 hidden print:block">
          <p className="font-telugu text-2xl font-bold text-[#0F172A]">
            {NEWSLETTER_TITLE}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Nayi Samakhya Telangana · {NEWSLETTER_CANONICAL.replace("https://", "")}
          </p>
        </div>

        {/* Executive Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-7 print:border-0 print:p-0 print:shadow-none">
          <header className="mb-5 border-b border-[#E2E8F0] pb-4 print:border-slate-300">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              Civic Fortnightly Digest
            </p>
            <h2 className="mt-1 font-telugu text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">
              {NEWSLETTER_TITLE}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Auto-curated from <code className="rounded bg-slate-100 px-1">civic_bulletins</code>{" "}
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

          <div className="no-print mb-6 flex flex-wrap gap-2 print:hidden">
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
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4; margin: 12mm; }
          html, body { background: white !important; color: #0F172A !important; }
          .no-print { display: none !important; }
          #newsletter-print-root {
            max-width: none !important;
            padding: 0 !important;
          }
          a { color: inherit !important; text-decoration: none !important; }
        }
      `,
        }}
      />
    </div>
  );
}
