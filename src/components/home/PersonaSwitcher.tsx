"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SECTION_EYEBROWS } from "@/components/home/SectionHeading";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  IdCard,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PersonaId = "artisans" | "youth" | "leaders";

type PersonaContent = {
  id: PersonaId;
  label: string;
  icon: typeof Scissors;
  highlight: string;
  bullets: string[];
  cta: string;
  href: string;
  spotlightTag: string;
  imageSrc?: string;
  imageAlt?: string;
};

const PERSONAS: PersonaContent[] = [
  {
    id: "artisans",
    label: "సెలూన్ నిర్వాహకులు & శ్రామిక కళాకారులు",
    icon: Scissors,
    highlight:
      "జీ.ఓ. 23 రక్షణ: 250 యూనిట్ల ఉచిత విద్యుత్ & కేటగిరీ మార్పు హక్కు",
    bullets: [
      "మున్సిపల్ & పంచాయతీ షాపుల కేటాయింపులో సంక్షేమ కోటా హక్కులు.",
      "ట్రేడ్ లైసెన్స్ ఫీజుల వేధింపుల నుండి చట్టబద్ధమైన రక్షణ.",
      "బ్యాంక్ లోన్లు మరియు ఆధునిక పరికరాల సబ్సిడీ ప్రాజెక్ట్ రిపోర్ట్స్.",
    ],
    cta: "తక్షణ వినతిపత్రం డౌన్‌లోడ్ చేసుకోండి",
    href: "/representation",
    spotlightTag: "Verified Docket · జి.ఓ. 23",
    imageSrc: "/home/persona-artisan-salon.png",
    imageAlt: "ఆధునిక సెలూన్‌లో వృత్తి నిపుణుడు — Artisan in modern salon",
  },
  {
    id: "youth",
    label: "యువత, విద్యార్థులు & మహిళలు",
    icon: GraduationCap,
    highlight:
      "మహాత్మా జ్యోతిబా ఫూలే విదేశీ విద్యా నిధి: ₹20 లక్షల స్కాలర్‌షిప్ గైడెన్స్",
    bullets: [
      "BC గురుకుల పాఠశాలలు & రెసిడెన్షియల్ కాలేజీల ప్రవేశ పరీక్షల సమాచారం.",
      "TSPSC గ్రూప్స్, పోలీస్ రిక్రూట్‌మెంట్ సిలబస్ & గైడెన్స్ మెటీరియల్.",
      "మహిళలకు స్వయం ఉపాధి, బ్యూటీషియన్ & బ్రైడల్ స్టూడియో ఫండింగ్.",
    ],
    cta: "విద్యా & స్కాలర్‌షిప్ సమాచారం",
    href: "/feed",
    spotlightTag: "Scholarship Success · ₹20 లక్షలు",
    imageSrc: "/home/persona-youth-scholarship.png",
    imageAlt: "విద్యా విజయం సాధించిన యువత — Graduating youth with scholarship pride",
  },
  {
    id: "leaders",
    label: "ఉద్యోగులు & నాయీ ప్రముఖులు",
    icon: Briefcase,
    highlight: "రాష్ట్రవ్యాప్త సమన్వయకర్తల నెట్‌వర్క్ & అధికారిక గుర్తింపు",
    bullets: [
      "డిజిటల్ వెరిఫైడ్ ఐడీ కార్డుతో మండల స్థాయిలో అధికారిక ప్రాతినిధ్యం.",
      "లీగల్ సెల్ మద్దతుతో కలెక్టరేట్, ఆర్డీవో ప్రజావాణిలో వినతుల దాఖలు.",
      "సమాజ సంక్షేమం కోసం పాలసీ పరిశోధన మరియు బీసీ కమిషన్ డాక్యుమెంటేషన్.",
    ],
    cta: "సమన్వయకర్త కార్డు పొందండి",
    href: "/coordinator-card",
    spotlightTag: "Official ID · QR Verified",
  },
];

function SpotlightPanel({ persona }: { persona: PersonaContent }) {
  if (persona.id === "leaders") {
    return (
      <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 sm:min-h-[320px] sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B45309]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#B45309]/15 blur-2xl"
          aria-hidden
        />

        <div
          className="relative z-[1] w-full max-w-[240px] rotate-[6deg] transition-transform duration-500 hover:rotate-[2deg]"
          style={{
            filter: "drop-shadow(0 24px 32px rgb(0 0 0 / 0.45))",
          }}
        >
          <div className="overflow-hidden rounded-xl border border-[#EAD7B5] bg-white p-4 ring-1 ring-[#B45309]/30">
            <div
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#B45309]"
              aria-hidden
            />
            <div className="flex items-start justify-between gap-2 pt-1">
              <div>
                <p className="flex items-center gap-1 font-telugu text-[11px] font-bold text-[#B45309]">
                  <IdCard className="h-3.5 w-3.5" aria-hidden />
                  నాయి సమాఖ్య
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Digital Coordinator ID
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#EAD7B5] bg-[#FBFBFA]">
                <div className="grid h-8 w-8 grid-cols-3 gap-px" aria-hidden>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-[1px] ${i % 2 === 0 ? "bg-[#0F172A]" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 font-telugu text-sm font-bold text-[#0F172A]">
              మండల సమన్వయకర్త
            </p>
            <p className="mt-1 flex items-center gap-1 font-telugu text-[11px] text-slate-600">
              <MapPin className="h-3 w-3 text-[#B45309]" aria-hidden />
              కోదాడ · సూర్యాపేట
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-[#EAD7B5] pt-2 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-[#0F172A]">
                <Phone className="h-3 w-3 text-[#B45309]" aria-hidden />
                +91 90326…
              </span>
              <span className="font-bold tracking-wide text-[#B45309]">
                SECURE
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B45309]/40 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-[#B45309]" aria-hidden />
          <span className="font-telugu text-[10px] font-bold text-[#1E293B]">
            {persona.spotlightTag}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl bg-[#1E293B] sm:min-h-[320px]">
      {persona.imageSrc ? (
        <Image
          key={persona.imageSrc}
          src={persona.imageSrc}
          alt={persona.imageAlt ?? persona.label}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority={persona.id === "artisans"}
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent"
        aria-hidden
      />
      <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B45309]/40 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <ShieldCheck className="h-3.5 w-3.5 text-[#B45309]" aria-hidden />
        <span className="font-telugu text-[10px] font-bold text-[#1E293B]">
          {persona.spotlightTag}
        </span>
      </div>
    </div>
  );
}

export function PersonaSwitcher() {
  const [active, setActive] = useState<PersonaId>("artisans");
  const current = PERSONAS.find((p) => p.id === active) ?? PERSONAS[0];

  return (
    <section
      className="border-b border-civic-border bg-[#FBFBFA] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="persona-switcher-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 max-w-3xl">
          <span className="civic-eyebrow-pill">
            {SECTION_EYEBROWS.empowermentPillars}
          </span>
          <h2
            id="persona-switcher-heading"
            className="mt-3 font-display-te text-2xl font-normal leading-telugu tracking-tight text-[#0F172A] sm:text-3xl md:text-4xl"
          >
            ఎవరి కోసం ఈ వేదిక?
          </h2>
          <p className="mt-2 font-sans text-sm font-medium tracking-wide text-slate-500 sm:text-base">
            Legal support for every community segment
          </p>
          <p className="mt-3 max-w-2xl font-telugu text-sm leading-relaxed text-slate-600 md:text-base">
            కులవృత్తి గౌరవం నుండి యువత భవిష్యత్ సాధికారత వరకు — ప్రతి వర్గానికి
            చట్టబద్ధమైన తోడ్పాటు.
          </p>
        </header>

        {/* Persona selector pills — horizontal scroll on mobile */}
        <div
          role="tablist"
          aria-label="Persona segments"
          className="flex gap-2 overflow-x-auto overscroll-x-contain rounded-2xl border border-[#EAD7B5] bg-[#FBFBFA] p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255_/0.8)] [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x sm:gap-1.5 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
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
                aria-controls={`persona-panel-${persona.id}`}
                id={`persona-tab-${persona.id}`}
                onClick={() => setActive(persona.id)}
                className={cn(
                  "civic-focus-ring flex min-h-11 min-w-[11rem] shrink-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-300 sm:min-w-0 sm:justify-start",
                  selected
                    ? "bg-[#1E293B] text-white shadow-[0_4px_14px_rgb(15_23_42_/0.2)]"
                    : "text-[#0F172A] hover:bg-white",
                )}
                style={
                  selected
                    ? { boxShadow: "inset 0 0 0 1.5px #B45309, 0 4px 14px rgb(15 23 42 / 0.2)" }
                    : undefined
                }
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

        {/* Asymmetric 2-column showcase */}
        <div
          role="tabpanel"
          id={`persona-panel-${current.id}`}
          aria-labelledby={`persona-tab-${current.id}`}
          className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8"
        >
          <div
            key={`copy-${current.id}`}
            className="transition-all duration-300 lg:col-span-7"
          >
            <div className="rounded-2xl border border-[#EAD7B5] bg-gradient-to-r from-[#FFFDF9] via-[#FBF7ED] to-[#F5EFE0] px-4 py-3.5 shadow-[0_4px_16px_rgb(180_83_9_/0.06)] sm:px-5">
              <p className="font-telugu text-sm font-bold leading-snug text-[#0F172A] sm:text-base">
                {current.highlight}
              </p>
            </div>

            <ul className="mt-5 space-y-3">
              {current.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#B45309]/30 bg-[#B45309]/10">
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-[#B45309]"
                      aria-hidden
                    />
                  </span>
                  <span className="font-telugu text-sm leading-relaxed text-slate-600">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={current.href}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-5 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_24px_rgb(180_83_9_/0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_12px_32px_rgb(180_83_9_/0.4)] active:scale-[0.99] sm:w-auto"
            >
              {current.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div
            key={`spot-${current.id}`}
            className="transition-all duration-300 lg:col-span-5"
          >
            <div
              className="rounded-2xl p-[3px]"
              style={{
                background:
                  "linear-gradient(145deg, #B45309 0%, #EAD7B5 45%, #B45309 100%)",
                boxShadow:
                  "0 0 0 1.5px #B45309, 0 16px 40px rgb(15 23 42 / 0.12)",
              }}
            >
              <div className="overflow-hidden rounded-[13px] bg-[#FBFBFA]">
                <SpotlightPanel persona={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
