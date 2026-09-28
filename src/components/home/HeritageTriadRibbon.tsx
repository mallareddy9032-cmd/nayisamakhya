"use client";

import { Crown, Music2, Stethoscope } from "lucide-react";

const PILLARS = [
  {
    id: "vaidya",
    icon: Stethoscope,
    title: "వైద్య మూలాలు",
    titleEn: "Vaidya Heritage",
    body: "ధన్వంతరి, చరక, సుశ్రుత మహర్షులు — భారతీయ వైద్య & శస్త్రచికిత్స ప్రదాతలు.",
  },
  {
    id: "empire",
    icon: Crown,
    title: "సామ్రాజ్య పాలన",
    titleEn: "Imperial Lineage",
    body: "సమ్రాట్ మహాపద్మనంద & మౌర్య వంశ ప్రాభవం — నంద రాజవంశం.",
  },
  {
    id: "nada",
    icon: Music2,
    title: "నాద బ్రహ్మ",
    titleEn: "Classical Artistry",
    body: "నాదస్వర సంగీత కళా వైభవం & ఉస్తాద్ బిస్మిల్లా ఖాన్ వారసత్వం.",
  },
] as const;

export function HeritageTriadRibbon() {
  return (
    <section
      className="px-4 pb-2 pt-2 sm:pb-3"
      aria-labelledby="heritage-triad-heading"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFCF5_0%,#FBFBFA_55%,#F7F3EA_100%)] shadow-[0_6px_24px_rgb(15_23_42_/0.05)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="relative border-b border-[#B45309]/20 px-4 py-3 text-center sm:px-6">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B45309]">
            Heritage Triad
          </p>
          <h2
            id="heritage-triad-heading"
            className="mt-1 font-display-te text-base leading-snug text-[#1E293B] sm:text-lg"
          >
            వైద్యం మన మూలం • కళ మన శ్వాస • ఆత్మగౌరవం మన వారసత్వం
          </h2>
        </div>

        <div className="relative grid grid-cols-1 divide-y divide-[#E2E8F0]/90 md:grid-cols-3 md:divide-x md:divide-y-0">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="flex flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#B45309]/35 bg-white text-[#B45309] shadow-xs">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-telugu text-sm font-bold text-[#1E293B]">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[10px] font-medium tracking-wide text-slate-500">
                      {pillar.titleEn}
                    </p>
                  </div>
                </div>
                <p className="font-telugu text-xs leading-relaxed text-slate-600">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
