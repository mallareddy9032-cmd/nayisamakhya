"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gavel,
  Landmark,
  Music2,
  ScrollText,
  Stethoscope,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEra {
  id: string;
  period: string;
  badgeEra: string;
  titleTe: string;
  titleEn: string;
  summaryTe: string;
  bullets: string[];
  iconKey: "vaidya" | "bhakthi" | "survey" | "court" | "gazette" | "power";
  citations: string[];
  actionLink?: { labelTe: string; href: string };
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
    period: "ప్రాచీన కాలం",
    badgeEra: "Ancient Roots",
    titleTe: "వైద్య & శస్త్ర వారసత్వం",
    titleEn: "Vaidya & Surgical Heritage",
    summaryTe:
      "ధన్వంతరి, చరక, సుశ్రుత మహర్షుల మార్గంలో — ఆయుర్వేదం, శస్త్రచికిత్స సేవలు నాయీ వృత్తి గౌరవానికి మూలం.",
    bullets: [
      "ధన్వంతరి / వైద్య నారాయణ — అమృత కలశ ధారి, భారతీయ వైద్య మూలపురుషుడు.",
      "చరక సంహిత & సుశ్రుత శస్త్రవిద్య — క్లినికల్ · సర్జికల్ ధర్మ మార్గదర్శకం.",
      "కులవృత్తి వైద్య సేవ — సమాజ ఆరోగ్యం, ఆత్మగౌరవం యొక్క ప్రాథమిక స్తంభం.",
    ],
    iconKey: "vaidya",
    citations: ["చరక సంహిత", "సుశ్రుత సంహిత", "ఆయుర్వేద పారంపర్యం"],
  },
  {
    id: "bhakthi",
    period: "భక్తి · నాద యుగం",
    badgeEra: "Nada Brahma",
    titleTe: "నాదస్వర శాస్త్రీయ వైభవం",
    titleEn: "Shehnai & Artistic Glory",
    summaryTe:
      "నాదం బ్రహ్మం — బజంత్రి / నాదస్వర వారసత్వం ద్వారా కళ, భక్తి, సామాజిక సేవ ఏకమయ్యాయి.",
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
    period: "సర్వే · గణన యుగం",
    badgeEra: "Enumeration",
    titleTe: "కుల గుర్తింపు & సామాజిక గణన",
    titleEn: "Community Identity & Surveys",
    summaryTe:
      "సామాజిక సర్వేలు, కుల గణనలు — నాయీ బ్రాహ్మణ, మంగలి, బజంత్రి సమూహాల గణాంక ఆధారిత గుర్తింపు.",
    bullets: [
      "వృత్తి ఆధారిత సమూహాల గణన — సంక్షేమ ప్రణాళికకు ఆధారం.",
      "BC-A వర్గీకరణ పరిణామం — రాష్ట్ర సంక్షేమ నిబంధనల్లో స్థానం.",
      "సమగ్ర కులగణన (SEEEPC) — ఆధునిక హక్కుల డాక్యుమెంటేషన్ మార్గం.",
    ],
    iconKey: "survey",
    citations: ["సామాజిక సర్వే రికార్డులు", "SEEEPC / కులగణన"],
    actionLink: {
      labelTe: "సమాచార ఫీడ్ చూడండి",
      href: "/feed",
    },
  },
  {
    id: "court",
    period: "న్యాయ · సామాజిక న్యాయం",
    badgeEra: "Legal Justice",
    titleTe: "చట్టబద్ధ గుర్తింపు & సామాజిక న్యాయం",
    titleEn: "Legal Recognition & Social Justice",
    summaryTe:
      "వెనుకబడిన వర్గాల హక్కులు, న్యాయ సంస్కరణలు — కర్పూరి ఠాకూర్ నుండి న్యాయపాలనా మార్గదర్శకుల వరకు.",
    bullets: [
      "సామాజిక న్యాయ ఉద్యమాలు — వృత్తి సమాజాల ఆత్మగౌరవ పోరాటం.",
      "రాజ్యాంగ హక్కులు & BC సంక్షేమ నిబంధనలు — చట్టబద్ధ తోడ్పాటు.",
      "లీగల్ సెల్ మద్దతు — కలెక్టరేట్ / ఆర్డీవో ప్రజావాణిలో వినతులు.",
    ],
    iconKey: "court",
    citations: [
      "భారత రాజ్యాంగం — సామాజిక న్యాయ నిబంధనలు",
      "BC సంక్షేమ చట్టాలు",
    ],
    actionLink: {
      labelTe: "వినతిపత్రం తయారు చేయండి",
      href: "/representation",
    },
  },
  {
    id: "gazette",
    period: "గెజిట్ · సంక్షేమ ఉత్తర్వులు",
    badgeEra: "Gazette Era",
    titleTe: "ప్రభుత్వ ఉత్తర్వులు & సంక్షేమ గెజిట్",
    titleEn: "Welfare Gazette & Orders",
    summaryTe:
      "తెలంగాణ బీసీ సంక్షేమ శాఖ మార్గదర్శకాలు, మున్సిపల్ / పంచాయత్ నిబంధనలు — అధికారిక సంక్షేమ హక్కుల డాక్యుమెంట్.",
    bullets: [
      "మున్సిపల్ షాప్ కేటాయింపు & సంక్షేమ కోటా హక్కులు.",
      "ట్రేడ్ లైసెన్స్ మినహాయింపు — Telangana Municipalities Act, 2019.",
      "స్థల / కమ్యూనిటీ భవన కేటాయింపు — BC సంక్షేమ మార్గదర్శకాలు.",
    ],
    iconKey: "gazette",
    citations: [
      "తెలంగాణ మున్సిపాలిటీల చట్టం 2019",
      "బీసీ సంక్షేమ శాఖ మార్గదర్శకాలు",
    ],
    actionLink: {
      labelTe: "పాలసీలు & గెజిట్",
      href: "/newsletter",
    },
  },
  {
    id: "power",
    period: "నేడు · డిజిటల్ హక్కులు",
    badgeEra: "G.O. 23 · Now",
    titleTe: "జీ.ఓ. 23 ఉచిత విద్యుత్ & డిజిటల్ సేవా కేంద్రం",
    titleEn: "Free Power & Digital Civic Desk",
    summaryTe:
      "G.O. Ms. No. 23 — 250 యూనిట్ల ఉచిత విద్యుత్; సమగ్ర కులగణన (SEEEPC); రాష్ట్రవ్యాప్త డిజిటల్ వినతి వేదిక.",
    bullets: [
      "జీ.ఓ. 23 — అర్హతగల సెలూన్ / బజంత్రి వృత్తిదుకాణాలకు 250 యూనిట్ల ఉచిత విద్యుత్.",
      "Electricity Act 2003 సెక్షన్ 43, 50 — కుటీర వృత్తిదారుల సంరక్షణ.",
      "నాయి సమాఖ్య డిజిటల్ డెస్క్ — 33 జిల్లాలు · 589 మండలాల సేవా నెట్‌వర్క్.",
    ],
    iconKey: "power",
    citations: [
      "G.O. Ms. No. 23, ఇంధన (విద్యుత్) శాఖ",
      "Electricity Act 2003 — §§ 43, 50",
      "SEEEPC / సమగ్ర కులగణన",
    ],
    actionLink: {
      labelTe: "జీ.ఓ. 23 వినతిపత్రం",
      href: "/representation?subject=go23_free_power",
    },
  },
];

function EraIcon({ iconKey }: { iconKey: TimelineEra["iconKey"] }) {
  const Icon = ICON_MAP[iconKey];
  return (
    <span
      className="relative z-[2] inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#B45309]"
      style={{
        boxShadow:
          "0 0 0 2px #FBFBFA, 0 0 0 3.5px #B45309, 0 0 0 5px rgb(180 83 9 / 0.25), 0 6px 16px rgb(15 23 42 / 0.12)",
      }}
      aria-hidden
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function EraCard({ era, index }: { era: TimelineEra; index: number }) {
  const contentOnLeft = index % 2 === 0;

  return (
    <article className="relative">
      {/* Mobile: icon + card stacked along left spine */}
      <div className="flex items-start gap-4 md:hidden">
        <EraIcon iconKey={era.iconKey} />
        <div className="min-w-0 flex-1">
          <EraBody era={era} align="left" />
        </div>
      </div>

      {/* Desktop: alternating left/right around center spine */}
      <div className="hidden items-start gap-6 md:grid md:grid-cols-[1fr_3rem_1fr]">
        <div className="min-w-0">
          {contentOnLeft ? <EraBody era={era} align="right" /> : null}
        </div>
        <div className="relative z-[1] flex justify-center">
          <EraIcon iconKey={era.iconKey} />
        </div>
        <div className="min-w-0">
          {!contentOnLeft ? <EraBody era={era} align="left" /> : null}
        </div>
      </div>
    </article>
  );
}

function EraBody({
  era,
  align,
}: {
  era: TimelineEra;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white via-[#FFFDF9] to-[#FBF7ED] p-4 shadow-[0_8px_28px_rgb(15_23_42_/0.06)] sm:p-5",
        align === "right" && "md:text-right",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          align === "right" && "md:justify-end",
        )}
      >
        <span className="inline-flex items-center rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-2.5 py-0.5 font-telugu text-[11px] font-bold text-[#B45309]">
          {era.period}
        </span>
        <span className="inline-flex items-center rounded-full border border-[#1E293B]/10 bg-white px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {era.badgeEra}
        </span>
      </div>

      <h3 className="mt-3 font-display-te text-lg font-bold leading-snug text-[#0F172A] sm:text-xl">
        {era.titleTe}
      </h3>
      <p className="mt-0.5 font-sans text-xs font-semibold tracking-wide text-[#B45309]">
        {era.titleEn}
      </p>

      <p
        className={cn(
          "mt-2 font-telugu text-sm leading-[1.75] text-slate-600",
          align === "right" && "md:ml-auto md:max-w-md",
        )}
      >
        {era.summaryTe}
      </p>

      <ul
        className={cn(
          "mt-3 space-y-2",
          align === "right" && "md:ml-auto md:max-w-md",
        )}
      >
        {era.bullets.map((bullet) => (
          <li
            key={bullet}
            className={cn(
              "flex items-start gap-2",
              align === "right" && "md:flex-row-reverse",
            )}
          >
            <Landmark
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B45309]"
              aria-hidden
            />
            <span className="font-telugu text-xs leading-relaxed text-[#1E293B]">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      {era.citations.length > 0 ? (
        <div
          className={cn(
            "mt-3 flex flex-wrap gap-1.5",
            align === "right" && "md:justify-end",
          )}
        >
          {era.citations.map((cite) => (
            <span
              key={cite}
              className="inline-flex max-w-full rounded-md border border-[#EAD7B5] bg-[#FFFDF9] px-2 py-1 font-telugu text-[10px] font-semibold leading-snug text-slate-600"
            >
              {cite}
            </span>
          ))}
        </div>
      ) : null}

      {era.actionLink ? (
        <div
          className={cn(
            "mt-4",
            align === "right" && "md:flex md:justify-end",
          )}
        >
          <Link
            href={era.actionLink.href}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-4 py-2 font-telugu text-xs font-bold text-white shadow-[0_6px_18px_rgb(180_83_9_/0.28)] transition-all duration-300 hover:brightness-110"
          >
            {era.actionLink.labelTe}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function CivicTimeline() {
  return (
    <section
      className="border-b border-civic-border bg-[#FBFBFA] px-4 py-12 sm:py-16"
      aria-labelledby="civic-timeline-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <span className="inline-flex rounded-full border border-[#FDE68A] bg-[#FEF3C7]/60 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#B45309]">
            చారిత్రక & చట్టబద్ధ పరిణామ క్రమం • CHRONOLOGICAL CIVIC TIMELINE
          </span>

          <h2
            id="civic-timeline-heading"
            className="mt-4 font-display-te text-2xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-3xl md:text-4xl"
          >
            ప్రాచీన మూలాల నుండి{" "}
            <span className="bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] bg-clip-text font-serif italic text-transparent">
              ఆధునిక చట్టబద్ధ హక్కుల వరకు
            </span>
          </h2>

          <p className="mt-3 max-w-3xl font-telugu text-sm leading-[1.8] text-slate-600 md:text-base">
            ఆయుర్వేద శస్త్రచికిత్స, నాదస్వర వారసత్వం నుండి నేటి జీ.ఓ. 23 ఉచిత
            విద్యుత్ మరియు సమగ్ర కులగణన (SEEEPC) వరకు మన ప్రస్థానం.
          </p>
        </header>

        <div className="relative">
          {/* Vertical spine */}
          <div
            className="pointer-events-none absolute bottom-6 left-6 top-6 w-[2px] bg-gradient-to-b from-[#B45309] via-[#EAD7B5] to-[#B45309] md:left-1/2 md:-translate-x-px"
            aria-hidden
          />

          <ol className="relative space-y-8 md:space-y-10">
            {TIMELINE_ERAS.map((era, index) => (
              <li key={era.id}>
                <EraCard era={era} index={index} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default CivicTimeline;
