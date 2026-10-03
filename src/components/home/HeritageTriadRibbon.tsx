"use client";

import { Crown, Music2, Stethoscope } from "lucide-react";
import { SECTION_EYEBROWS } from "@/components/home/SectionHeading";

const PILLARS = [
  {
    id: "vaidya",
    icon: Stethoscope,
    title: "వైద్య మూలాలు",
    titleEn: "Vaidya Heritage",
    bodyTe: "ధన్వంతరి & చరక మహర్షులు",
    bodyEn: "Pioneers of Surgery & Ayurveda",
  },
  {
    id: "empire",
    icon: Crown,
    title: "సామ్రాజ్య పాలన",
    titleEn: "Imperial Lineage",
    bodyTe: "సమ్రాట్ మహాపద్మనంద",
    bodyEn: "Nanda Dynasty & Imperial Governance",
  },
  {
    id: "nada",
    icon: Music2,
    title: "నాద బ్రహ్మ",
    titleEn: "Sacred Sound Tradition",
    bodyTe: "నాదస్వర శాస్త్రీయ వైభవం & ఉస్తాద్ బిస్మిల్లా ఖాన్ వారసత్వం",
    bodyEn: "Classical shehnai lineage & artistic glory",
  },
] as const;

export function HeritageTriadRibbon() {
  return (
    <section
      className="px-4 pb-2 pt-2 sm:pb-3"
      aria-labelledby="heritage-triad-heading"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#EAD7B5] bg-gradient-to-r from-[#FFFDF9] via-[#FBF7ED] to-[#F5EFE0] shadow-[0_8px_28px_rgb(180_83_9_/0.08)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        <div className="relative border-b border-[#EAD7B5] px-4 py-4 text-center sm:px-6 sm:py-5">
          <span className="civic-eyebrow-pill">
            {SECTION_EYEBROWS.heritageTriad}
          </span>
          <h2
            id="heritage-triad-heading"
            className="mt-3 font-display-te text-lg font-normal leading-telugu sm:text-xl md:text-2xl"
          >
            <span className="bg-gradient-to-r from-[#92400e] via-[#B45309] to-[#C2410C] bg-clip-text text-transparent">
              వైద్యం మన మూలం • కళ మన శ్వాస • ఆత్మగౌరవం మన వారసత్వం
            </span>
          </h2>
          <p className="mt-2 font-sans text-sm font-medium leading-snug text-slate-500 sm:text-base">
            Three civic pillars of community dignity
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-3 md:items-stretch">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="flex h-full flex-col gap-2.5 rounded-xl border border-[#EAD7B5] bg-gradient-to-b from-white/90 to-[#FFFDF9]/80 px-4 py-4 shadow-[inset_0_1px_0_rgb(255_255_255_/0.8),0_4px_14px_rgb(180_83_9_/0.06)]"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B45309]"
                    style={{
                      boxShadow:
                        "0 0 0 1.5px #FBFBFA, 0 0 0 3px #B45309, 0 0 0 4.5px rgb(180 83 9 / 0.25)",
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-telugu text-sm font-bold text-[#1E293B]">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[10px] font-semibold tracking-wide text-[#B45309]">
                      {pillar.titleEn}
                    </p>
                  </div>
                </div>
                <p className="font-telugu text-xs font-semibold leading-relaxed text-[#0F172A]">
                  {pillar.bodyTe}
                </p>
                <p className="font-sans text-[11px] leading-relaxed text-slate-600">
                  {pillar.bodyEn}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
