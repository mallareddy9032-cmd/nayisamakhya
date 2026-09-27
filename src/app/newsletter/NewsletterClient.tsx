"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Share2,
  Newspaper,
  Loader2,
  AlertCircle,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  NEWSLETTER_TITLE,
  NEWSLETTER_FILTERS,
  categoryBadgeClass,
} from "@/lib/bulletins/categories";
import type { BulletinCategory, CivicBulletin } from "@/lib/bulletins/types";

type FieldReport = {
  id: string;
  title: string;
  summary_te: string;
  published_at: string;
  district_te?: string | null;
  mandal_te?: string | null;
  photo_url?: string | null;
};

type NewsletterPayload = {
  title: string;
  edition: { start: string; end: string; label_te: string };
  filters: { id: string; label: string }[];
  active_filter: string;
  source: string;
  error?: string | null;
  bulletins: CivicBulletin[];
  field_reports: FieldReport[];
  counts: { bulletins: number; field_reports: number };
};

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

export default function NewsletterClient() {
  const [filter, setFilter] = useState<string>("all");
  const [reloadToken, setReloadToken] = useState(0);
  const [data, setData] = useState<NewsletterPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const qs =
          filter && filter !== "all" ? `?filter=${encodeURIComponent(filter)}` : "";
        const res = await fetch(`/api/newsletter${qs}`, { cache: "no-store" });
        const json = (await res.json()) as NewsletterPayload & {
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error || `HTTP ${res.status}`);
          setData(null);
          return;
        }
        setError("");
        setData(json);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load newsletter",
        );
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [filter, reloadToken]);

  const selectFilter = (next: string) => {
    setLoading(true);
    setError("");
    if (next === filter) setReloadToken((n) => n + 1);
    else setFilter(next);
  };

  const shareText = useMemo(() => {
    if (!data) return NEWSLETTER_TITLE;
    const lines = [
      `📰 ${NEWSLETTER_TITLE}`,
      data.edition.label_te,
      "",
      ...data.bulletins.slice(0, 5).map(
        (b, i) => `${i + 1}. ${b.title}\n${b.summary_te.slice(0, 120)}…`,
      ),
      "",
      `👉 https://www.nayisamakhya.org/newsletter`,
    ];
    return lines.join("\n");
  }, [data]);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const onExportPdf = () => {
    window.print();
  };

  const total =
    (data?.counts.bulletins || 0) + (data?.counts.field_reports || 0);

  return (
    <div className="min-h-screen bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <header className="no-print sticky top-0 z-30 border-b border-civic-border bg-white/95 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4 shrink-0 text-civic-bronze" />
                <h1 className="truncate font-telugu text-base font-bold text-civic-ink md:text-lg">
                  {NEWSLETTER_TITLE}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                Bi-weekly civic digest · auto from approved bulletins
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onExportPdf}
              className="inline-flex items-center gap-1.5 rounded-xl border border-civic-border bg-white px-3 py-2 font-telugu text-xs font-bold text-civic-navy shadow-xs transition hover:bg-civic-subtle"
            >
              <FileDown className="h-3.5 w-3.5 text-civic-bronze" />
              A4 PDF
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
        {/* Print masthead */}
        <div className="mb-6 hidden print:block">
          <p className="font-telugu text-2xl font-bold text-civic-ink">
            {NEWSLETTER_TITLE}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Nayi Samakhya Telangana · nayisamakhya.org/newsletter
          </p>
        </div>

        {data?.edition && (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-telugu font-semibold text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              {data.edition.label_te}
            </span>
            <span>
              {formatDate(data.edition.start)} — {formatDate(data.edition.end)}
            </span>
            {data.source === "seed_fallback" && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-900">
                seed preview
              </span>
            )}
          </div>
        )}

        <div className="no-print mb-6 flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => selectFilter("all")}
            className={`rounded-full border px-3 py-1.5 font-telugu text-xs font-semibold transition ${
              filter === "all"
                ? "border-civic-bronze bg-civic-bronze text-white"
                : "border-civic-border bg-white text-civic-navy hover:bg-civic-subtle"
            }`}
          >
            అన్నీ
          </button>
          {(data?.filters || NEWSLETTER_FILTERS).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => selectFilter(f.id)}
              className={`rounded-full border px-3 py-1.5 font-telugu text-xs font-semibold transition ${
                filter === f.id
                  ? "border-civic-bronze bg-civic-bronze text-white"
                  : "border-civic-border bg-white text-civic-navy hover:bg-civic-subtle"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-civic-bronze" />
            <p className="font-telugu text-sm">సంకలనం లోడ్ అవుతోంది…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-telugu font-bold">సంకలనం లోడ్ కాలేదు</p>
                <p className="mt-1 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => selectFilter(filter)}
                  className="mt-3 rounded-lg bg-red-800 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && total === 0 && (
          <div className="rounded-2xl border border-dashed border-civic-border bg-white px-6 py-16 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-telugu text-base font-bold text-civic-ink">
              ఈ పాక్షిక విండోలో నోటీసులు లేవు
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Cron sync will populate approved bulletins automatically.
            </p>
          </div>
        )}

        {!loading && !error && total > 0 && (
          <div className="space-y-4">
            {data?.bulletins.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs print:break-inside-avoid print:rounded-none print:border print:border-slate-300 print:shadow-none"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${categoryBadgeClass(b.category as BulletinCategory)}`}
                  >
                    {b.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(b.published_at)}
                  </span>
                </div>
                <h2 className="mt-2 font-telugu text-base font-bold leading-snug text-civic-ink md:text-lg">
                  {b.title}
                </h2>
                <p className="mt-2 font-telugu text-sm leading-relaxed text-civic-navy">
                  {b.summary_te}
                </p>
                {b.target_districts?.length > 0 && (
                  <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-civic-bronze" />
                    <span>{b.target_districts.join(" · ")}</span>
                  </p>
                )}
                {(b.source_url || b.pdf_url) && (
                  <a
                    href={b.pdf_url || b.source_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="no-print mt-3 inline-flex items-center gap-1 font-telugu text-xs font-semibold text-civic-bronze hover:underline print:hidden"
                  >
                    మూల పత్రం <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </article>
            ))}

            {data?.field_reports.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs print:break-inside-avoid"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    క్షేత్రస్థాయి నివేదికలు
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(r.published_at)}
                  </span>
                </div>
                <h2 className="mt-2 font-telugu text-base font-bold text-civic-ink">
                  {r.title}
                </h2>
                <p className="mt-2 font-telugu text-sm leading-relaxed text-civic-navy">
                  {r.summary_te}
                </p>
                {(r.district_te || r.mandal_te) && (
                  <p className="mt-3 flex items-center gap-1.5 font-telugu text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 text-emerald-700" />
                    {[r.mandal_te, r.district_te].filter(Boolean).join(", ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4; margin: 14mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          #newsletter-print-root {
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
