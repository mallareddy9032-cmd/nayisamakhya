"use client";

import { useState } from "react";

type Stalwart = {
  id: string;
  name: string;
  domain: string;
  blurb: string;
  imageSrc: string;
};

const STALWARTS: Stalwart[] = [
  {
    id: "bismillah-khan",
    name: "ఉస్తాద్ బిస్మిల్లా ఖాన్",
    domain: "శాస్త్రీయ సంగీతం (షెహనాయి)",
    blurb:
      "భారతరత్న గ్రహీత, సన్నాయి వాయిద్యానికి ప్రపంచ ఖ్యాతి తెచ్చిన కళారత్నం.",
    imageSrc: "/stalwarts/bismillah-khan.jpg",
  },
  {
    id: "dakuri-narayanadasu",
    name: "సంత శ్రీ డాకూరి నారాయణదాసు",
    domain: "భక్తి & ఆధ్యాత్మిక చైతన్యం",
    blurb:
      "తెలంగాణ ప్రాంతంలో ఆత్మగౌరవం, ధర్మం మరియు విద్యా చైతన్యాన్ని రగిలించిన పూజ్య గురువు.",
    imageSrc: "/stalwarts/dakuri-narayanadasu.jpg",
  },
  {
    id: "dhanvantari",
    name: "ధన్వంతరి",
    domain: "ప్రాచీన ఆయుర్వేదం & శస్త్రచికిత్స",
    blurb:
      "వృత్తిపరమైన సంప్రదాయ వైద్యం, ఆయుర్వేద ఆరోగ్య విజ్ఞాన మూలపురుషుడు.",
    imageSrc: "/stalwarts/dhanvantari.jpg",
  },
  {
    id: "gone-perumallu",
    name: "సర్దార్ గోనె పెరుమాళ్ళు",
    domain: "ప్రజా పోరాటాలు & స్వాతంత్ర్యం",
    blurb:
      "తెలంగాణ సాయుధ పోరాటంలో వెట్టిచాకిరీ వ్యతిరేకంగా గ్రామీణ వృత్తిదారులను నడిపించిన యోధుడు.",
    imageSrc: "/stalwarts/gone-perumallu.jpg",
  },
  {
    id: "nayi-seshagirirao",
    name: "ఆచార్య నాయి శేషగిరిరావు",
    domain: "విద్యా సంస్కరణలు & BC హక్కులు",
    blurb:
      "ఆధునిక విద్యా వికాసం మరియు BC-A హక్కులకై ప్రభుత్వ కమిషన్లలో ప్రాతినిధ్యం వహించిన మార్గదర్శి.",
    imageSrc: "/stalwarts/nayi-seshagirirao.jpg",
  },
];

function teluguInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "న";
  // First Unicode code point — correct for Telugu base letters.
  return Array.from(trimmed)[0] ?? "న";
}

function StalwartPortrait({ name, imageSrc }: { name: string; imageSrc: string }) {
  // Show Navy monogram until a real portrait loads; never flash a broken-image icon.
  const [status, setStatus] = useState<"pending" | "loaded" | "failed">("pending");
  const initial = teluguInitial(name);
  const showMonogram = status !== "loaded";

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-civic-bronze bg-civic-navy">
      {showMonogram ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="font-telugu text-2xl font-bold leading-none text-[#FBFBFA]">
            {initial}
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
          className={`h-full w-full object-cover transition-opacity ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
        />
      ) : null}
    </div>
  );
}

export function CivicStalwarts() {
  return (
    <section
      className="border-t border-civic-border bg-civic-paper px-4 py-12"
      aria-labelledby="civic-stalwarts-heading"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-civic-border bg-white p-5 shadow-xs sm:p-7">
        <header className="mb-6 border-b border-civic-border pb-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-civic-bronze">
            Civic Heritage
          </p>
          <h2
            id="civic-stalwarts-heading"
            className="mt-1.5 font-telugu text-xl font-black tracking-tight text-civic-ink sm:text-2xl"
          >
            సమాజ మార్గదర్శకులు & విశిష్ట ప్రముఖులు
          </h2>
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
                />

                <h3 className="font-telugu text-sm font-bold leading-snug text-civic-ink">
                  {stalwart.name}
                </h3>

                <span className="inline-flex max-w-full items-center justify-center rounded-md border border-x-civic-bronze/40 border-y-civic-border bg-[#F8FAFC] px-2.5 py-1 font-telugu text-[11px] font-semibold leading-snug text-civic-ink">
                  {stalwart.domain}
                </span>

                <p className="font-telugu text-[12px] leading-relaxed text-civic-navy/85">
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
