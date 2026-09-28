"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  IdCard,
  Layers,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PersonaId = "artisans" | "youth" | "leaders";

type SolutionCard = {
  title: string;
  blurb: string;
  href: string;
  icon: typeof FileText;
  cta: string;
};

const PERSONAS: {
  id: PersonaId;
  label: string;
  icon: typeof Scissors;
  summary: string;
  bullets: string[];
  cards: SolutionCard[];
}[] = [
  {
    id: "artisans",
    label: "సెలూన్ నిర్వాహకులు & కళాకారులు",
    icon: Scissors,
    summary:
      "వృత్తి హక్కులు, షాప్ రక్షణ, ఉపకరణాల సహాయం — కళాకారులకు నేరుగా ఉపయోగపడే సేవలు.",
    bullets: [
      "G.O. 23 ఉచిత విద్యుత్ (250 యూనిట్లు)",
      "మున్సిపల్ షాప్ రక్షణ",
      "ఉపకరణాల రాయితీ",
    ],
    cards: [
      {
        title: "జి.ఓ. 23 విద్యుత్ వినతి",
        blurb: "250 యూనిట్ల ఉచిత విద్యుత్ హక్కు కోసం అధికారిక డాకెట్.",
        href: "/representation?subject=go23_free_power",
        icon: FileText,
        cta: "వినతిపత్రం",
      },
      {
        title: "మున్సిపల్ షాప్ రక్షణ",
        blurb: "షాప్ కేటాయింపు / రక్షణ కోసం ప్రీఫిల్డ్ అధికారిక లేఖ.",
        href: "/representation?subject=modern_salon_space",
        icon: ShieldCheck,
        cta: "షాప్ వినతి",
      },
      {
        title: "ఉపకరణాల రాయితీ",
        blurb: "వృత్తి ఉపకరణాల సహాయం — క్షేత్ర ఫోటోలతో డాక్యుమెంట్.",
        href: "/feed",
        icon: Layers,
        cta: "ఫీడ్ చూడండి",
      },
    ],
  },
  {
    id: "youth",
    label: "విద్యార్థులు & యువత",
    icon: GraduationCap,
    summary:
      "విదేశీ విద్యా నిధి, గురుకుల ప్రవేశాలు, పోటీ పరీక్షల మార్గదర్శకం — యువతకు మూడు ప్రధాన మార్గాలు.",
    bullets: [
      "విదేశీ విద్యా నిధి (₹20 లక్షల గ్రాంట్)",
      "గురుకుల ప్రవేశాలు",
      "పోటీ పరీక్షల గైడెన్స్",
    ],
    cards: [
      {
        title: "విదేశీ విద్యా నిధి",
        blurb: "₹20 లక్షల గ్రాంట్ కోసం ప్రీఫిల్డ్ విద్యా సంక్షేమ వినతి.",
        href: "/representation?subject=community_welfare_funds",
        icon: FileText,
        cta: "వినతి ప్రారంభం",
      },
      {
        title: "గురుకుల ప్రవేశాలు",
        blurb: "గురుకుల / వసతి విద్యా అవకాశాల కోసం స్థానిక సమన్వయం.",
        href: "/coordinator-card",
        icon: IdCard,
        cta: "నెట్‌వర్క్‌లో చేరండి",
      },
      {
        title: "పోటీ పరీక్షల గైడెన్స్",
        blurb: "గైడెన్స్ / శిక్షణ సమావేశాల క్షేత్ర నివేదికలు.",
        href: "/feed",
        icon: Layers,
        cta: "ఫీడ్",
      },
    ],
  },
  {
    id: "leaders",
    label: "ఉద్యోగులు & ప్రముఖులు",
    icon: Briefcase,
    summary:
      "సమన్వయకర్త గుర్తింపు, న్యాయ సహకారం, జిల్లా నెట్‌వర్క్ — నాయకత్వ భాగస్వామ్యం.",
    bullets: [
      "సమన్వయకర్త ఐడీ కార్డు",
      "లీగల్ సెల్ మద్దతు",
      "జిల్లా నెట్‌వర్క్",
    ],
    cards: [
      {
        title: "సమన్వయకర్త ఐడీ కార్డు",
        blurb: "ప్రింట్-రెడీ సమన్వయకర్త ID — QRతో ధ్రువీకరణ.",
        href: "/coordinator-card",
        icon: IdCard,
        cta: "కార్డు",
      },
      {
        title: "లీగల్ సెల్ మద్దతు",
        blurb: "అధికారులకు చట్టబద్ధమైన ఆధారాలతో వినతిపత్రం.",
        href: "/representation",
        icon: ShieldCheck,
        cta: "లేఖ తయారు",
      },
      {
        title: "జిల్లా నెట్‌వర్క్",
        blurb: "33 జిల్లాల సమన్వయం — సేవా రుజువు ఫీడ్ ఆర్కైవ్.",
        href: "/feed",
        icon: Layers,
        cta: "ఫీడ్",
      },
    ],
  },
];

export function PersonaSwitcher() {
  const [active, setActive] = useState<PersonaId>("artisans");
  const current = PERSONAS.find((p) => p.id === active) ?? PERSONAS[0];

  return (
    <section
      className="border-b border-civic-border bg-white px-4 py-10 sm:py-12"
      aria-labelledby="persona-switcher-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 max-w-3xl">
          <p className="font-telugu text-xs font-bold tracking-wide text-[#B45309]">
            ప్రజా వ్యక్తిత్వ మార్గాలు
          </p>
          <h2
            id="persona-switcher-heading"
            className="mt-1 font-display-te text-2xl leading-snug text-[#1E293B] md:text-3xl"
          >
            ఈ వేదిక ఎవరి కోసం?{" "}
            <span className="text-[#B45309]">•</span>{" "}
            <span className="font-sans text-[0.85em] font-semibold tracking-tight text-slate-600 md:text-[0.72em]">
              Who is this platform for?
            </span>
          </h2>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            మీ పాత్రను ఎంచుకుంటే — అనుకూల సేవలు వెంటనే కనిపిస్తాయి.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Persona segments"
          className="flex flex-col gap-2 rounded-2xl border border-[#EAD7B5] bg-gradient-to-r from-[#FFFDF9] via-[#FBF7ED] to-[#F5EFE0] p-1.5 sm:flex-row"
        >
          {PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const selected = persona.id === active;
            return (
              <button
                key={persona.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(persona.id)}
                className={cn(
                  "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-left transition sm:justify-start",
                  selected
                    ? "bg-[#1E293B] text-white shadow-xs"
                    : "text-[#1E293B] hover:bg-white/80",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selected ? "text-[#FBBF24]" : "text-[#B45309]",
                  )}
                  aria-hidden
                />
                <span className="font-telugu text-xs font-bold leading-snug sm:text-[13px]">
                  {persona.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-[#EAD7B5]/80 bg-[#FFFDF9] px-4 py-3">
          <p className="font-telugu text-sm leading-relaxed text-slate-600">
            {current.summary}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {current.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 rounded-lg border border-[#EAD7B5]/60 bg-white/70 px-3 py-2"
              >
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B45309]"
                  aria-hidden
                />
                <span className="font-telugu text-xs font-bold leading-snug text-[#1E293B]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          role="tabpanel"
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {current.cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={`${current.id}-${card.href}-${card.title}`}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-[#EAD7B5] bg-[#FBFBFA] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#B45309]/50 hover:bg-white hover:shadow-[0_12px_32px_rgb(15_23_42_/0.08)]"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#B45309]/20 bg-[#B45309]/10 text-[#B45309]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="font-telugu text-sm font-bold text-[#1E293B]">
                  {card.title}
                </h3>
                <p className="mt-1 flex-1 font-telugu text-xs leading-relaxed text-slate-600">
                  {card.blurb}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 font-telugu text-xs font-bold text-[#B45309]">
                  {card.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
