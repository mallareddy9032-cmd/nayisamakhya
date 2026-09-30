"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Gavel,
  Music2,
  ScrollText,
  Stethoscope,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const TRAJECTORY_INFOGRAPHIC_HREF =
  "/images/heritage/nayee-brahmin-trajectory.png";

export interface TimelineEra {
  id: string;
  period: string;
  badgeEra: string;
  scrubLabel: string;
  titleTe: string;
  titleEn: string;
  summaryTe: string;
  bullets: string[];
  iconKey: "vaidya" | "bhakthi" | "survey" | "court" | "gazette" | "power";
  citations: string[];
  actionLink?: { labelTe: string; href: string };
  /** Era 6 contemporary rights extras — kept off homepage clutter for other eras. */
  cbiMetric?: {
    value: number;
    label: string;
    source: string;
    populationTe: string;
  };
}

const ICON_MAP = {
  vaidya: Stethoscope,
  bhakthi: Music2,
  survey: BookOpen,
  court: Gavel,
  gazette: ScrollText,
  power: Zap,
} as const;

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: "vaidya",
    period: "క్రీ.పూ. 4వ శ.",
    badgeEra: "Ancient Roots",
    scrubLabel: "క్రీ.పూ. 4వ శ.",
    titleTe: "వైద్య & శస్త్ర వారసత్వం",
    titleEn: "Vaidya & Surgical Heritage",
    summaryTe:
      "ధన్వంతరి, చరక, సుశ్రుత మహర్షుల మార్గంలో ఆయుర్వేదం, శస్త్రచికిత్స సేవలు నాయీ వృత్తి గౌరవానికి మూలం. కులవృత్తి వైద్య సేవ సమాజ ఆరోగ్యం, ఆత్మగౌరవం యొక్క ప్రాథమిక స్తంభంగా నిలిచింది.",
    bullets: [
      "ధన్వంతరి / వైద్య నారాయణ — అమృత కలశ ధారి, భారతీయ వైద్య మూలపురుషుడు.",
      "చరక సంహిత & సుశ్రుత శస్త్రవిద్య — క్లినికల్ · సర్జికల్ ధర్మ మార్గదర్శకం.",
      "కులవృత్తి వైద్య సేవ — సమాజ ఆరోగ్యం యొక్క ప్రాథమిక స్తంభం.",
    ],
    iconKey: "vaidya",
    citations: ["చరక సంహిత", "సుశ్రుత సంహిత", "ఆయుర్వేద పారంపర్యం"],
  },
  {
    id: "bhakthi",
    period: "12వ-18వ శ.",
    badgeEra: "Bhakti & Nada",
    scrubLabel: "12వ-18వ శ.",
    titleTe: "నాదస్వర శాస్త్రీయ వైభవం",
    titleEn: "Shehnai & Artistic Glory",
    summaryTe:
      "నాదం బ్రహ్మం — బజంత్రి / నాదస్వర వారసత్వం ద్వారా కళ, భక్తి, సామాజిక సేవ ఏకమయ్యాయి. ఉస్తాద్ బిస్మిల్లా ఖాన్ వారసత్వం జాతీయ గౌరవం పొందిన నాదసేవకు నిదర్శనం.",
    bullets: [
      "నాదస్వర శాస్త్రీయ పరంపర — ఆలయ · సామూహిక ఉత్సవాల సాంస్కృతిక శ్వాస.",
      "ఉస్తాద్ బిస్మిల్లా ఖాన్ వారసత్వం — జాతీయ గౌరవం పొందిన నాదసేవ.",
      "కళ మన శ్వాస — వృత్తి గౌరవంతో కూడిన సాంస్కృతిక గుర్తింపు.",
    ],
    iconKey: "bhakthi",
    citations: ["నాద బ్రహ్మ పరంపర", "బజంత్రి కళా వారసత్వం"],
  },
  {
    id: "survey",
    period: "1909-1931",
    badgeEra: "Surveys",
    scrubLabel: "1909-1931",
    titleTe: "కుల గుర్తింపు & సామాజిక గణన",
    titleEn: "Community Identity & Surveys",
    summaryTe:
      "సామాజిక సర్వేలు, కుల గణనలు — నాయీ బ్రాహ్మణ, మంగలి, బజంత్రి సమూహాల గణాంక ఆధారిత గుర్తింపు. వృత్తి ఆధారిత సమూహాల గణన సంక్షేమ ప్రణాళికకు ఆధారమైంది.",
    bullets: [
      "వృత్తి ఆధారిత సమూహాల గణన — సంక్షేమ ప్రణాళికకు ఆధారం.",
      "BC-A వర్గీకరణ పరిణామం — రాష్ట్ర సంక్షేమ నిబంధనల్లో స్థానం.",
      "గణన రికార్డులు — ఆధునిక హక్కుల డాక్యుమెంటేషన్ మార్గం.",
    ],
    iconKey: "survey",
    citations: ["సామాజిక సర్వే రికార్డులు", "1909–1931 గణన"],
    actionLink: {
      labelTe: "సమాచార ఫీడ్",
      href: "/feed",
    },
  },
  {
    id: "court",
    period: "1953-1992",
    badgeEra: "Affirmative Action",
    scrubLabel: "1953-1992",
    titleTe: "చట్టబద్ధ గుర్తింపు & సామాజిక న్యాయం",
    titleEn: "Legal Recognition & Social Justice",
    summaryTe:
      "వెనుకబడిన వర్గాల హక్కులు, న్యాయ సంస్కరణలు — కర్పూరి ఠాకూర్ నుండి న్యాయపాలనా మార్గదర్శకుల వరకు. రాజ్యాంగ హక్కులు & BC సంక్షేమ నిబంధనలు చట్టబద్ధ తోడ్పాటును స్థిరపరిచాయి.",
    bullets: [
      "సామాజిక న్యాయ ఉద్యమాలు — వృత్తి సమాజాల ఆత్మగౌరవ పోరాటం.",
      "రాజ్యాంగ హక్కులు & BC సంక్షేమ నిబంధనలు — చట్టబద్ధ తోడ్పాటు.",
      "లీగల్ సెల్ మద్దతు — కలెక్టరేట్ / ఆర్డీవో ప్రజావాణిలో వినతులు.",
    ],
    iconKey: "court",
    citations: [
      "భారత రాజ్యాంగం — సామాజిక న్యాయం",
      "BC సంక్షేమ చట్టాలు",
    ],
    actionLink: {
      labelTe: "వినతిపత్రం",
      href: "/representation",
    },
  },
  {
    id: "gazette",
    period: "1996-2016",
    badgeEra: "G.O. 1 & Gazette",
    scrubLabel: "1996-2016",
    titleTe: "ప్రభుత్వ ఉత్తర్వులు & సంక్షేమ గెజిట్",
    titleEn: "Welfare Gazette & Orders",
    summaryTe:
      "తెలంగాణ / ఆంధ్రప్రదేశ్ సంక్షేమ ఉత్తర్వులు, మున్సిపల్ నిబంధనలు — అధికారిక సంక్షేమ హక్కుల డాక్యుమెంట్. G.O. Ms. No. 1 మరియు కేంద్ర గెజిట్ నోటిఫికేషన్లు వృత్తి సమూహాలకు చట్టబద్ధ ఆధారం.",
    bullets: [
      "మున్సిపల్ షాప్ కేటాయింపు & సంక్షేమ కోటా హక్కులు.",
      "ట్రేడ్ లైసెన్స్ మినహాయింపు — Municipalities Act నిబంధనలు.",
      "స్థల / కమ్యూనిటీ భవన కేటాయింపు — BC సంక్షేమ మార్గదర్శకాలు.",
    ],
    iconKey: "gazette",
    citations: [
      "G.O. Ms. No. 1",
      "Central Gazette 33044/99",
      "బీసీ సంక్షేమ మార్గదర్శకాలు",
    ],
    actionLink: {
      labelTe: "గెజిట్ / న్యూస్",
      href: "/newsletter",
    },
  },
  {
    id: "power",
    period: "2020-2026",
    badgeEra: "Contemporary Rights",
    scrubLabel: "2020-2026",
    titleTe: "సమకాలీన హక్కులు & సమగ్ర కులగణన",
    titleEn: "Contemporary Rights & SEEEPC Evidence",
    summaryTe:
      "G.O. 23 ఉచిత విద్యుత్ నుండి CBI 94 / SEEEPC Vol-II వరకు — సంక్షేమ హక్కులు గణన ఆధారంతో స్థిరపడ్డాయి. నాయి సమాఖ్య 33 జిల్లాలు · 589 మండలాల డిజిటల్ సేవా నెట్‌వర్క్.",
    bullets: [
      "జీ.ఓ. 23 — అర్హతగల సెలూన్ / బజంత్రి వృత్తిదుకాణాలకు 250 యూనిట్ల ఉచిత విద్యుత్.",
      "CBI 94 — Composite Backwardness Index (Telangana SEEEPC Survey Vol-II).",
      "SEEEPC Vol-II — సమగ్ర కులగణన & డిజిటల్ హక్కుల డాక్యుమెంటేషన్.",
    ],
    iconKey: "power",
    citations: [
      "G.O. Ms. No. 23",
      "CBI 94 · SEEEPC Vol-II",
      "Electricity Act 2003",
    ],
    actionLink: {
      labelTe: "జీ.ఓ. 23 వినతి",
      href: "/representation?subject=go23_free_power",
    },
    cbiMetric: {
      value: 94,
      label: "CBI 94",
      source: "Telangana SEEEPC Survey Vol-II",
      populationTe: "4,33,785 జనాభా (రాష్ట్ర జనాభాలో 1.2%)",
    },
  },
];

function MilestoneScrubber({
  eras,
  activeId,
  onSelect,
}: {
  eras: TimelineEra[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIndex = eras.findIndex((e) => e.id === activeId);

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-1 pt-2 pb-1 sm:px-2">
        <div
          className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
          role="presentation"
        >
          <div className="relative min-w-[36rem] px-2 sm:min-w-0 sm:px-0">
            <div
              className="absolute left-6 right-6 top-[22px] h-[2px] overflow-hidden rounded-full bg-[#EAD7B5] sm:left-8 sm:right-8"
              aria-hidden
            >
              <div
                className="h-full bg-gradient-to-r from-[#B45309] to-[#D97706] transition-all duration-300"
                style={{
                  width:
                    eras.length <= 1
                      ? "0%"
                      : `${(activeIndex / (eras.length - 1)) * 100}%`,
                }}
              />
            </div>
            <ol
              className="relative z-[1] flex items-start justify-between gap-2 sm:gap-0"
              role="tablist"
              aria-label="Chronological civic milestones"
            >
              {eras.map((era) => {
                const selected = era.id === activeId;
                return (
                  <li
                    key={era.id}
                    className="flex w-[5.25rem] shrink-0 flex-col items-center gap-2 sm:w-24"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="civic-epoch-panel"
                      id={`epoch-tab-${era.id}`}
                      onClick={() => onSelect(era.id)}
                      className={cn(
                        "civic-focus-ring relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
                        selected
                          ? "bg-[#B45309] text-white"
                          : "bg-white text-slate-400 hover:border-[#B45309]/40 hover:text-[#B45309]",
                      )}
                      style={
                        selected
                          ? {
                              boxShadow:
                                "0 0 0 3px #FBFBFA, 0 0 0 5px #B45309, 0 0 12px rgb(180 83 9 / 0.45)",
                            }
                          : {
                              boxShadow: "0 0 0 1.5px #CBD5E1",
                            }
                      }
                    >
                      {selected ? (
                        <span
                          className="motion-safe-ping absolute inset-0 animate-ping rounded-full bg-[#B45309]/35 motion-reduce:hidden"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative h-2 w-2 rounded-full bg-current" />
                    </button>
                    <span
                      className={cn(
                        "max-w-[5.25rem] text-center font-telugu text-[10px] font-bold leading-snug transition-colors duration-300 sm:max-w-none sm:text-[11px]",
                        selected ? "text-[#B45309]" : "text-slate-500",
                      )}
                    >
                      {era.scrubLabel}
                    </span>
                    <span
                      className={cn(
                        "hidden max-w-[5.5rem] text-center font-sans text-[9px] font-semibold uppercase tracking-wide transition-colors duration-300 sm:block",
                        selected ? "text-[#92400e]" : "text-slate-400",
                      )}
                    >
                      {era.badgeEra}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function CbiDialBadge({
  value,
  label,
  source,
}: {
  value: number;
  label: string;
  source: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100) / 100;
  const offset = circumference * (1 - progress);

  return (
    <div
      className="flex w-full max-w-[13rem] flex-col items-center gap-1.5 rounded-2xl border border-[#B45309]/35 bg-[#0F172A] px-3 py-3 text-center shadow-[0_8px_20px_rgb(15_23_42_/0.22)]"
      aria-label={`${label}: Composite Backwardness Index ${value}. ${source}`}
    >
      <div className="relative flex h-[5.25rem] w-[5.25rem] items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 80 80"
          aria-hidden
        >
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#B45309"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="relative flex flex-col items-center leading-none">
          <span className="font-sans text-[1.65rem] font-black tracking-tight text-white">
            {value}
          </span>
          <span className="mt-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#FBBF24]">
            CBI
          </span>
        </div>
      </div>
      <p className="font-sans text-[11px] font-bold tracking-wide text-[#FBBF24]">
        {label}
      </p>
      <p className="font-sans text-[9px] leading-snug text-slate-300">
        Composite Backwardness Index
      </p>
      <p className="font-sans text-[9px] leading-snug text-slate-400">
        {source}
      </p>
    </div>
  );
}

function EpochCard({ era }: { era: TimelineEra }) {
  const Icon = ICON_MAP[era.iconKey];
  const isContemporary = Boolean(era.cbiMetric);

  return (
    <div
      key={era.id}
      id="civic-epoch-panel"
      role="tabpanel"
      aria-labelledby={`epoch-tab-${era.id}`}
      className="overflow-hidden rounded-2xl border border-[#EAD7B5] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] shadow-[0_8px_28px_rgb(180_83_9_/0.08)] transition-all duration-300"
    >
      <div className="grid gap-0 md:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col items-center justify-center gap-3 border-b border-[#EAD7B5] px-4 py-5 md:border-b-0 md:border-r md:px-5 md:py-6">
          {era.cbiMetric ? (
            <CbiDialBadge
              value={era.cbiMetric.value}
              label={era.cbiMetric.label}
              source={era.cbiMetric.source}
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#B45309]"
              style={{
                boxShadow:
                  "0 0 0 2px #FBFBFA, 0 0 0 4px #B45309, 0 0 0 6px rgb(180 83 9 / 0.25)",
              }}
              aria-hidden
            >
              <Icon className="h-7 w-7" />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-2.5 py-0.5 font-telugu text-[11px] font-bold text-[#B45309]">
              {era.period}
            </span>
            <span className="inline-flex rounded-full border border-[#1E293B]/10 bg-white px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {era.badgeEra}
            </span>
          </div>

          {era.actionLink ? (
            <Link
              href={era.actionLink.href}
              className="mt-1 inline-flex min-h-10 w-full max-w-[12rem] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-3 py-2 font-telugu text-xs font-bold text-white shadow-[0_6px_16px_rgb(180_83_9_/0.28)] transition-all duration-300 hover:brightness-110"
            >
              {era.actionLink.labelTe}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : (
            <span className="mt-1 inline-flex min-h-10 w-full max-w-[12rem] items-center justify-center rounded-xl border border-[#EAD7B5] bg-white/70 px-3 py-2 font-telugu text-[11px] font-bold text-slate-500">
              వారసత్వ ఘట్టం
            </span>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center px-4 py-5 md:col-span-2 md:px-6 md:py-5">
          <h3 className="font-telugu text-base font-bold leading-snug text-[#0F172A] sm:text-lg">
            {era.titleTe}
          </h3>
          <p className="mt-0.5 font-sans text-xs font-semibold tracking-wide text-[#B45309]">
            {era.titleEn}
          </p>

          {era.cbiMetric ? (
            <p className="mt-2 font-telugu text-sm font-bold leading-snug text-[#0F172A]">
              {era.cbiMetric.populationTe}
            </p>
          ) : null}

          <p
            className={cn(
              "font-telugu text-sm leading-[1.8] text-slate-600",
              isContemporary ? "mt-1.5 line-clamp-2" : "mt-2.5 line-clamp-3",
            )}
          >
            {era.summaryTe}
          </p>

          <ul className="mt-3 space-y-1.5">
            {era.bullets.slice(0, isContemporary ? 2 : 3).map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]"
                  aria-hidden
                />
                <span className="font-telugu text-xs leading-relaxed text-[#1E293B]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          {era.citations.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {era.citations.map((cite) => (
                <span
                  key={cite}
                  className="inline-flex max-w-full rounded-md border border-[#EAD7B5] bg-white/80 px-2 py-0.5 font-telugu text-[10px] font-semibold leading-snug text-slate-600"
                >
                  [{cite}]
                </span>
              ))}
            </div>
          ) : null}

          {era.cbiMetric ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-[#EAD7B5]/80 pt-3">
              <a
                href={TRAJECTORY_INFOGRAPHIC_HREF}
                download="nayee-brahmin-trajectory.png"
                className="civic-focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#B45309]/40 bg-white px-3 py-2.5 text-center font-telugu text-[12px] font-bold leading-snug text-[#B45309] shadow-sm transition hover:border-[#B45309] hover:bg-[#FFF7ED] sm:text-[13px]"
              >
                <ArrowDownToLine className="h-4 w-4 shrink-0" aria-hidden />
                <span>
                  పూర్తి చారిత్రక &amp; చట్టబద్ధ ఇన్ఫోగ్రాఫిక్ (HD Image)
                  డౌన్‌లోడ్ చేసుకోండి ➔
                </span>
              </a>
              <Link
                href="/history"
                className="civic-focus-ring inline-flex min-h-9 items-center justify-center gap-1 font-telugu text-[12px] font-semibold text-[#0F172A] underline-offset-4 hover:text-[#B45309] hover:underline"
              >
                పూర్తి ఆర్కైవల్ వీక్షణ · Full archival view
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CivicTimeline() {
  const [activeId, setActiveId] = useState(TIMELINE_ERAS[0].id);
  const active = TIMELINE_ERAS.find((e) => e.id === activeId) ?? TIMELINE_ERAS[0];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      setActiveId((current) => {
        const idx = TIMELINE_ERAS.findIndex((era) => era.id === current);
        const next =
          TIMELINE_ERAS[
            (idx + delta + TIMELINE_ERAS.length) % TIMELINE_ERAS.length
          ];
        return next?.id ?? current;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectEra = (id: string) => {
    setActiveId(id);
  };

  return (
    <section
      className="overflow-x-hidden border-b border-civic-border bg-[#FBFBFA] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="civic-timeline-heading"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 max-w-3xl">
          <span className="civic-eyebrow-pill">
            చారిత్రక & చట్టబద్ధ ప్రస్థానం • HISTORICAL TIMELINE
          </span>

          <h2
            id="civic-timeline-heading"
            className="mt-3 font-display-te text-2xl font-normal leading-tight tracking-tight text-[#0F172A] sm:text-3xl"
          >
            ప్రాచీన మూలాల నుండి{" "}
            <span className="bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] bg-clip-text font-display-te not-italic text-transparent">
              ఆధునిక చట్టబద్ధ హక్కుల వరకు
            </span>
          </h2>

          <p className="mt-2 max-w-3xl font-telugu text-sm leading-[1.8] text-slate-600">
            ఆయుర్వేద శస్త్రచికిత్స, నాదస్వర వారసత్వం నుండి నేటి జీ.ఓ. 23 ఉచిత
            విద్యుత్ మరియు సమగ్ర కులగణన (SEEEPC) వరకు మన ప్రస్థానం.
          </p>
        </header>

        <div className="flex flex-col gap-4 lg:max-h-[560px]">
          <MilestoneScrubber
            eras={TIMELINE_ERAS}
            activeId={activeId}
            onSelect={selectEra}
          />
          <EpochCard era={active} />
        </div>
      </div>
    </section>
  );
}

export default CivicTimeline;
