"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
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
  cards: SolutionCard[];
}[] = [
  {
    id: "artisans",
    label: "సెలూన్ నిర్వాహకులు & కళాకారులు",
    icon: Scissors,
    summary:
      "G.O. 23 ఉచిత విద్యుత్, షాప్ రక్షణ, ఉపకరణాల రాయితీ — వృత్తి హక్కుల కోసం.",
    cards: [
      {
        title: "జి.ఓ. 23 విద్యుత్ వినతి",
        blurb: "250 యూనిట్ల ఉచిత విద్యుత్ హక్కు కోసం అధికారిక డాకెట్.",
        href: "/representation?subject=go23_free_power",
        icon: FileText,
        cta: "వినతిపత్రం",
      },
      {
        title: "సమన్వయకర్త గుర్తింపు",
        blurb: "మండల స్థాయి డిజిటల్ కార్డు — QRతో ధ్రువీకరణ.",
        href: "/coordinator-card",
        icon: IdCard,
        cta: "కార్డు",
      },
      {
        title: "క్షేత్ర సమాచార ఫీడ్",
        blurb: "షాపు / సమావేశ రికార్డులు — ధ్రువీకరించబడిన ఫీల్డ్ ఫోటోలు.",
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
      "విదేశీ విద్యా స్కాలర్‌షిప్ ₹20 లక్షలు, పోటీ పరీక్షల గైడెన్స్, ఆధునిక స్కిల్స్.",
    cards: [
      {
        title: "విద్యా / స్కాలర్‌షిప్ వినతి",
        blurb: "BC-A విద్యా సంక్షేమం కోసం ప్రీఫిల్డ్ అధికారిక లేఖ.",
        href: "/representation?subject=community_welfare_funds",
        icon: FileText,
        cta: "వినతి ప్రారంభం",
      },
      {
        title: "యువ సమన్వయ నెట్‌వర్క్",
        blurb: "మండల సమన్వయకర్త కార్డుతో స్థానిక నాయకత్వం.",
        href: "/coordinator-card",
        icon: IdCard,
        cta: "నెట్‌వర్క్‌లో చేరండి",
      },
      {
        title: "యువ చైతన్య ఫీడ్",
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
      "సమన్వయకర్త నెట్‌వర్క్, న్యాయ సహకారం, సమాజ సేవా భాగస్వామ్యం.",
    cards: [
      {
        title: "న్యాయ / ప్రాతినిధ్య లేఖ",
        blurb: "అధికారులకు చట్టబద్ధమైన ఆధారాలతో వినతిపత్రం.",
        href: "/representation",
        icon: ShieldCheck,
        cta: "లేఖ తయారు",
      },
      {
        title: "అధికారిక క్రెడెన్షియల్",
        blurb: "ప్రింట్-రెడీ సమన్వయకర్త ID — లామినేషన్ సిద్ధం.",
        href: "/coordinator-card",
        icon: IdCard,
        cta: "కార్డు",
      },
      {
        title: "సేవా రుజువు ఫీడ్",
        blurb: "సంఘ కార్యక్రమాల ధ్రువీకృత ఫోటో ఆర్కైవ్.",
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
        <header className="mb-6 max-w-2xl">
          <p className="font-telugu text-xs font-bold tracking-wide text-[#B45309]">
            ప్రజా వ్యక్తిత్వ మార్గాలు
          </p>
          <h2
            id="persona-switcher-heading"
            className="mt-1 font-display-te text-2xl leading-snug text-[#1E293B] md:text-3xl"
          >
            ఎవరి కోసం ఈ వేదిక?
          </h2>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            మీ పాత్రను ఎంచుకుంటే — అనుకూల సేవలు వెంటనే కనిపిస్తాయి.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Persona segments"
          className="flex flex-col gap-2 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA] p-1.5 sm:flex-row"
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
                    : "text-[#1E293B] hover:bg-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selected ? "text-[#B45309]" : "text-[#B45309]",
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

        <p className="mt-4 font-telugu text-sm leading-relaxed text-slate-600">
          {current.summary}
        </p>

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
                className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#B45309]/40 hover:bg-white hover:shadow-[0_12px_32px_rgb(15_23_42_/0.08)]"
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
