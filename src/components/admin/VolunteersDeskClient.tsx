"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Download,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Scale,
  ClipboardList,
  Users,
  Award,
} from "lucide-react";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import { exportToCSV } from "@/lib/exportCsv";
import {
  CHANNEL_FILTERS,
  channelBadge,
  computeMetrics,
  districtLabel,
  formatCadreDate,
  legalAdvocatesForExport,
  LEGAL_CSV_LABELS,
  loadCadreBundle,
  mandalLabel,
  surveysForExport,
  SURVEY_CSV_LABELS,
  volunteersForExport,
  VOLUNTEER_CSV_LABELS,
  waMeHref,
  type CadreBundle,
  type CadreChannel,
  type CadreRow,
  type ChannelFilterId,
} from "@/lib/admin/volunteerCadre";

const EMERALD = "#047857";
const SLATE = "#1E293B";

type Props = {
  logoutError?: string;
};

export default function VolunteersDeskClient({ logoutError }: Props) {
  const [bundle, setBundle] = useState<CadreBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<ChannelFilterId>("all");
  const [district, setDistrict] = useState("");

  const hydrate = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    try {
      const next = await loadCadreBundle();
      setBundle(next);
    } catch {
      setLoadError(
        "డేటా లోడ్ కాలేదు — సీడ్ రోస్టర్ చూపిస్తున్నాం (Could not load live data).",
      );
      const { SEED_CADRE_ROSTER } = await import("@/lib/admin/volunteerCadre");
      setBundle({
        rows: SEED_CADRE_ROSTER.slice(),
        volunteers: [],
        quizRecords: [],
        surveys: [],
        reels: [],
        source: "seed",
        usedSeed: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void hydrate(false);
  }, [hydrate]);

  const rows = bundle?.rows ?? [];
  const surveyCount = bundle?.surveys.length ?? 0;

  const metrics = useMemo(
    () => computeMetrics(rows, surveyCount || rows.filter((r) => r.channel === "survey").length),
    [rows, surveyCount],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (channel !== "all" && row.channel !== channel) return false;
      if (district && row.districtSlug !== district) return false;
      if (!q) return true;
      const hay = [
        row.name,
        row.phone,
        row.mandalSlug,
        row.districtSlug,
        districtLabel(row.districtSlug, false),
        districtLabel(row.districtSlug, true),
        mandalLabel(row.districtSlug, row.mandalSlug, false),
        mandalLabel(row.districtSlug, row.mandalSlug, true),
        row.regId,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search, channel, district]);

  function exportSurveys() {
    if (!bundle) return;
    exportToCSV(
      surveysForExport(bundle.surveys),
      "nayisamakhya_surveys",
      SURVEY_CSV_LABELS,
    );
  }

  function exportLegal() {
    if (!bundle) return;
    exportToCSV(
      legalAdvocatesForExport(bundle.quizRecords),
      "nayisamakhya_legal_advocates",
      LEGAL_CSV_LABELS,
    );
  }

  function exportSprint() {
    if (!bundle) return;
    exportToCSV(
      volunteersForExport(bundle.volunteers),
      "nayisamakhya_volunteers",
      VOLUNTEER_CSV_LABELS,
    );
  }

  return (
    <div className="space-y-6">
      {logoutError ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
        >
          {logoutError}
        </div>
      ) : null}

      {loadError ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900"
        >
          {loadError}
        </div>
      ) : null}

      {/* Executive metric banner */}
      <section aria-label="Executive metrics">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="font-display-te text-2xl font-normal leading-telugu text-ink sm:text-3xl">
              సమన్వయకర్త డాష్‌బోర్డ్
            </h1>
            <p className="mt-1 text-sm text-muted">
              Unified Volunteer Dashboard · CSV Export Desk
              {bundle?.usedSeed ? (
                <span className="ml-2 rounded-full border border-line bg-warm px-2 py-0.5 text-[11px] text-ink">
                  Seed roster active
                </span>
              ) : bundle?.source === "supabase" ? (
                <span className="ml-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800">
                  Live Supabase
                </span>
              ) : bundle?.source === "local" ? (
                <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700">
                  Local store
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void hydrate(true)}
            disabled={refreshing || loading}
            className="tap inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-ink transition hover:border-[color:var(--emerald,#047857)] disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            <span className="font-telugu">రిఫ్రెష్</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            icon={<Users className="h-4 w-4" aria-hidden />}
            labelTe="మొత్తం సమన్వయకర్తలు"
            labelEn="Total Cadre"
            value={metrics.totalCadre}
            accent={SLATE}
          />
          <MetricCard
            icon={<Award className="h-4 w-4" aria-hidden />}
            labelTe="మండల సేవా సారథులు"
            labelEn="Sprint Leaders"
            value={metrics.sprintLeaders}
            accent={EMERALD}
          />
          <MetricCard
            icon={<Scale className="h-4 w-4" aria-hidden />}
            labelTe="లీగల్ అడ్వకేసీ సెల్"
            labelEn="Legal Advocates"
            value={metrics.legalAdvocates}
            accent={SLATE}
          />
          <MetricCard
            icon={<ClipboardList className="h-4 w-4" aria-hidden />}
            labelTe="నమోదు కాబడిన సర్వేలు"
            labelEn="Verified Surveys"
            value={metrics.verifiedSurveys}
            accent={EMERALD}
          />
        </div>
      </section>

      {/* 1-click export center */}
      <section
        aria-label="CSV export center"
        className="rounded-2xl border border-line bg-gradient-to-br from-[#FBFBFA] via-white to-emerald-50/40 p-4 sm:p-5"
      >
        <p className="font-display-te text-lg font-normal leading-telugu text-ink">
          1-క్లిక్ ఎగుమతి కేంద్రం
        </p>
        <p className="mt-0.5 text-xs text-muted">
          UTF-8 BOM · Excel-ready Telugu columns · Forest Emerald & Royal Slate
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ExportButton
            tone="emerald"
            onClick={exportSurveys}
            label="📥 సర్వేల డేటా ఎగుమతి (Export All Surveys CSV)"
          />
          <ExportButton
            tone="slate"
            onClick={exportLegal}
            label="⚖️ లీగల్ సెల్ జాబితా (Export Legal Advocates CSV)"
          />
          <ExportButton
            tone="emerald"
            onClick={exportSprint}
            label="🏃 సేవా సారథుల జాబితా (Export Sprint Volunteers CSV)"
          />
        </div>
      </section>

      {/* Filters */}
      <section
        aria-label="Filters"
        className="space-y-3 rounded-2xl border border-line bg-white p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search volunteers</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="పేరు / ఫోన్ / మండలం — Name, Phone, or Mandal"
              className="min-h-[44px] w-full rounded-xl border border-line bg-[#FBFBFA] py-2 pl-10 pr-3 text-sm text-ink outline-none ring-emerald-700/30 placeholder:text-muted focus:border-emerald-700 focus:ring-2"
            />
          </label>
          <label className="sm:w-56">
            <span className="sr-only">District filter</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-line bg-[#FBFBFA] px-3 text-sm text-ink outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/30"
            >
              <option value="">అన్ని జిల్లాలు (All 33 Districts)</option>
              {TELANGANA_DISTRICTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name_te} · {d.name_en}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          role="tablist"
          aria-label="Channel filters"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {CHANNEL_FILTERS.map((tab) => {
            const active = channel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setChannel(tab.id)}
                className={`tap whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  active
                    ? "border-transparent text-white"
                    : "border-line bg-white text-ink hover:border-slate-400"
                }`}
                style={
                  active
                    ? {
                        backgroundColor:
                          tab.id === "legal" || tab.id === "all"
                            ? SLATE
                            : EMERALD,
                      }
                    : undefined
                }
              >
                <span className="font-telugu">{tab.labelTe}</span>
                <span className="ml-1 hidden text-[10px] opacity-80 sm:inline">
                  ({tab.labelEn})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Data table */}
      <section
        aria-label="Volunteer cadre table"
        className="overflow-hidden rounded-2xl border border-line bg-white"
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          <p className="font-telugu text-sm font-medium text-ink">
            క్యాడర్ పట్టిక · {filtered.length} records
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
            <span className="font-telugu">లోడ్ అవుతోంది…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="font-telugu text-sm font-medium text-ink">
              మ్యాచ్ అయ్యే రికార్డులు లేవు
            </p>
            <p className="mt-1 text-xs text-muted">
              Adjust search or channel filters to see cadre rows.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="border-b border-line bg-[#FBFBFA] text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Date & Reg ID</th>
                  <th className="px-4 py-3 font-medium font-telugu">
                    పూర్తి పేరు
                  </th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium font-telugu">
                    జిల్లా & మండలం
                  </th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                  <th className="px-4 py-3 font-medium">Merit Metric</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((row) => (
                  <CadreTableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  labelTe,
  labelEn,
  value,
  accent,
}: {
  icon: ReactNode;
  labelTe: string;
  labelEn: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_0_rgb(15_23_42/0.04)]">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </span>
        <p className="min-w-0 font-telugu text-xs leading-telugu text-muted sm:text-[13px]">
          {labelTe}
        </p>
      </div>
      <p
        className="mt-3 font-display-te text-3xl font-normal tabular-nums leading-none"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-muted">{labelEn}</p>
    </div>
  );
}

function ExportButton({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: "emerald" | "slate";
}) {
  const bg = tone === "emerald" ? EMERALD : SLATE;
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-left text-sm font-medium text-white shadow-sm transition hover:brightness-110 sm:min-w-[240px] sm:flex-none"
      style={{ backgroundColor: bg }}
    >
      <Download className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span className="font-telugu leading-snug">{label}</span>
    </button>
  );
}

function CadreTableRow({ row }: { row: CadreRow }) {
  const badge = channelBadge(row.channel as CadreChannel);
  const dTe = districtLabel(row.districtSlug, true);
  const mTe = mandalLabel(row.districtSlug, row.mandalSlug, true);
  const dEn = districtLabel(row.districtSlug, false);
  const mEn = mandalLabel(row.districtSlug, row.mandalSlug, false);

  return (
    <tr className="align-top transition-colors hover:bg-[#FBFBFA]/70">
      <td className="px-4 py-3">
        <p className="text-xs text-muted">{formatCadreDate(row.dateIso)}</p>
        <p className="mt-0.5 font-mono text-[11px] font-medium text-ink">
          {row.regId}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="font-telugu font-medium leading-telugu text-ink">
          {row.name}
        </p>
      </td>
      <td className="px-4 py-3">
        {row.phone ? (
          <a
            href={waMeHref(row.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-800 underline-offset-2 hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            <span className="tabular-nums">{row.phone}</span>
          </a>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <p className="font-telugu text-sm leading-telugu text-ink">{dTe}</p>
        <p className="font-telugu text-xs leading-telugu text-muted">{mTe}</p>
        <p className="mt-0.5 text-[10px] text-muted">
          {dEn} · {mEn}
        </p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
        >
          <span className="font-telugu">{badge.te}</span>
          <span className="mx-1 opacity-40">/</span>
          {badge.en}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-ink">{row.merit}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            row.status === "certified"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {row.status === "certified" ? "Certified" : "Active"}
        </span>
      </td>
    </tr>
  );
}
