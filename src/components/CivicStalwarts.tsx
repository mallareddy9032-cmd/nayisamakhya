"use client";

import { useState } from "react";

type Stalwart = {
  id: string;
  name: string;
  domain: string;
  blurb: string;
  imageSrc: string;
  /** High-contrast gold glyph for Navy monogram fallback. */
  monogram: string;
};

/** Historical civic icons — ceremonial double-gold bezel portraits. */
const STALWARTS: Stalwart[] = [
  {
    id: "dhanvantari",
    name: "ధన్వంతరి",
    domain: "ప్రాచీన ఆయుర్వేదం & శస్త్రచికిత్స",
    blurb:
      "వైద్య మూలపురుషుడు — సంప్రదాయ వైద్యం, ఆయుర్వేద ఆరోగ్య విజ్ఞాన ప్రదాత.",
    imageSrc: "/stalwarts/dhanvantari.jpg",
    monogram: "ధ",
  },
  {
    id: "charaka",
    name: "చరక మహర్షి",
    domain: "ఆయుర్వేద సంహిత & చికిత్సా శాస్త్రం",
    blurb:
      "చరక సంహిత కర్త — రోగ నిర్ధారణ, ఔషధ విజ్ఞానానికి శాశ్వత మార్గదర్శి.",
    imageSrc: "/stalwarts/charaka.jpg",
    monogram: "చ",
  },
  {
    id: "mahapadmananda",
    name: "సమ్రాట్ మహాపద్మనంద",
    domain: "నంద రాజవంశం & సామ్రాజ్య పాలన",
    blurb:
      "నంద సామ్రాజ్య ప్రాభవం — జనసంక్షేమం, వ్యవసాయం, పరిపాలనా వైభవం.",
    imageSrc: "/stalwarts/mahapadmananda.jpg",
    monogram: "మ",
  },
  {
    id: "karpoori-thakur",
    name: "కర్పూరి ఠాకూర్",
    domain: "సామాజిక న్యాయం & వెనుకబడిన వర్గాలు",
    blurb:
      "భారతరత్న — వృత్తి సమాజాలు, విద్యా & సంక్షేమ హక్కుల పోరాట యోధుడు.",
    imageSrc: "/stalwarts/karpoori-thakur.jpg",
    monogram: "క",
  },
  {
    id: "veerappa-moily",
    name: "ఎం. వీరప్ప మొయిలి",
    domain: "న్యాయ సంస్కరణలు & పౌర హక్కులు",
    blurb:
      "న్యాయ / పాలనా సంస్కరణలు — పౌర సేవలు, రాజ్యాంగ హక్కుల రక్షణకు తోడ్పాటు.",
    imageSrc: "/stalwarts/veerappa-moily.jpg",
    monogram: "వ",
  },
];

function StalwartPortrait({
  name,
  imageSrc,
  monogram,
}: {
  name: string;
  imageSrc: string;
  monogram: string;
}) {
  // Show Navy monogram until a real portrait loads; never flash a broken-image icon.
  const [status, setStatus] = useState<"pending" | "loaded" | "failed">(
    "pending",
  );
  const showMonogram = status !== "loaded";

  return (
    <div
      className="stalwart-bezel relative h-20 w-20 shrink-0"
      aria-label={name}
    >
      {/* Outer soft ring + ceremonial gold double-bezel */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 1.5px #FBFBFA, 0 0 0 3px #B45309, 0 0 0 5px rgb(180 83 9 / 0.28), 0 2px 10px rgb(15 23 42 / 0.14)",
        }}
        aria-hidden
      />
      {/* Inner ceremonial gold bezel + navy fallback canvas */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full bg-[#1E293B]"
        style={{
          border: "1.5px solid #B45309",
          boxShadow: "inset 0 0 0 1px rgb(251 251 250 / 0.35)",
        }}
      >
        {showMonogram ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#1E293B]"
            aria-hidden
          >
            <span className="font-telugu text-2xl font-bold leading-none text-[#B45309]">
              {monogram}
            </span>
          </div>
        ) : null}
        {status !== "failed" ? (
          // eslint-disable-next-line @next/next/no-img-element -- onError monogram fallback requires native img
          <img
            src={imageSrc}
            alt=""
            width={80}
            height={80}
            className={`h-full w-full object-cover transition-opacity duration-200 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("failed")}
          />
        ) : null}
      </div>
    </div>
  );
}

export function CivicStalwarts() {
  return (
    <section
      className="civic-watermark border-t border-civic-border bg-civic-paper px-4 py-12"
      aria-labelledby="civic-stalwarts-heading"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-civic-border bg-white/95 p-5 shadow-xs sm:p-7">
        <header className="mb-6 border-b border-civic-border pb-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-civic-bronze">
            Civic Heritage
          </p>
          <h2
            id="civic-stalwarts-heading"
            className="mt-1.5 font-telugu text-xl font-black tracking-tight text-civic-ink leading-[1.8] sm:text-2xl"
          >
            సమాజ మార్గదర్శకులు & విశిష్ట ప్రముఖులు
          </h2>
          <p className="mt-1.5 font-telugu text-xs leading-relaxed text-slate-600">
            ధన్వంతరి · చరక · మహాపద్మనంద · కర్పూరి ఠాకూర్ · వీరప్ప మొయిలి —
            ఆత్మగౌరవ వారసత్వం.
          </p>
        </header>

        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {STALWARTS.map((stalwart) => (
            <li
              key={stalwart.id}
              className="w-[min(78vw,17.5rem)] shrink-0 snap-start lg:w-auto"
            >
              <article className="flex h-full flex-col items-center gap-3 rounded-xl border border-civic-border bg-civic-paper/60 px-3.5 py-5 text-center sm:px-4">
                <StalwartPortrait
                  name={stalwart.name}
                  imageSrc={stalwart.imageSrc}
                  monogram={stalwart.monogram}
                />

                <h3 className="font-telugu text-sm font-bold leading-[1.8] text-civic-ink">
                  {stalwart.name}
                </h3>

                <span className="inline-flex max-w-full items-center justify-center rounded-md border border-x-civic-bronze/40 border-y-civic-border bg-[#F8FAFC] px-2.5 py-1 font-telugu text-[11px] font-semibold leading-[1.8] text-civic-ink">
                  {stalwart.domain}
                </span>

                <p className="font-telugu text-[12px] leading-[1.8] text-civic-navy/85 tabular-nums">
                  {stalwart.blurb}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CivicStalwarts;
