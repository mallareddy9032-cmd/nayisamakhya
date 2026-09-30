"use client";

import { useState } from "react";
import Image from "next/image";

type Stalwart = {
  id: string;
  nameTe: string;
  nameEn: string;
  domainTe: string;
  domainEn: string;
  blurbTe: string;
  blurbEn: string;
  imageSrc: string;
};

const STALWARTS: Stalwart[] = [
  {
    id: "dhanvantari",
    nameTe: "ధన్వంతరి / వైద్య నారాయణ",
    nameEn: "Lord Dhanvantari",
    domainTe: "ప్రాచీన ఆయుర్వేదం & శస్త్రచికిత్స",
    domainEn: "Divine Ayurveda & surgery",
    blurbTe: "అమృత కలశ ధారి — భారతీయ వైద్య విజ్ఞాన మూలపురుషుడు.",
    blurbEn: "Bearer of amrita — fountainhead of Indian healing sciences.",
    imageSrc: "/stalwarts/dhanvantari.png",
  },
  {
    id: "charaka",
    nameTe: "ఆచార్య చరక & సుశ్రుత",
    nameEn: "Acharya Charaka & Sushruta",
    domainTe: "సంహిత & శస్త్ర వైద్య శాస్త్రం",
    domainEn: "Samhita & surgical science",
    blurbTe: "చరక సంహిత · సుశ్రుత శస్త్రవిద్య — వైద్య ధర్మ మార్గదర్శకులు.",
    blurbEn: "Foundational texts that shaped clinical and surgical tradition.",
    imageSrc: "/stalwarts/charaka.png",
  },
  {
    id: "mahapadmananda",
    nameTe: "సమ్రాట్ మహాపద్మనంద",
    nameEn: "Emperor Mahapadmananda",
    domainTe: "నంద రాజవంశం · సామ్రాజ్య వంశం",
    domainEn: "Nanda dynasty · Imperial Lineage",
    blurbTe: "నంద సామ్రాజ్య ప్రాభవం — జనసంక్షేమం, పరిపాలనా వైభవం.",
    blurbEn: "Imperial governance rooted in public welfare and strength.",
    imageSrc: "/stalwarts/mahapadmananda.png",
  },
  {
    id: "karpoori-thakur",
    nameTe: "భారతరత్న కర్పూరి ఠాకూర్",
    nameEn: "Bharat Ratna Karpoori Thakur",
    domainTe: "సామాజిక న్యాయం & వెనుకబడిన వర్గాలు",
    domainEn: "Social justice & backward classes",
    blurbTe: "వృత్తి సమాజాలు, విద్యా & సంక్షేమ హక్కుల అహింసా యోధుడు.",
    blurbEn: "Champion of dignity for working and marginalized communities.",
    imageSrc: "/stalwarts/karpoori-thakur.png",
  },
  {
    id: "veerappa-moily",
    nameTe: "డా. ఎం. వీరప్ప మొయిలి",
    nameEn: "Dr. M. Veerappa Moily",
    domainTe: "న్యాయ సంస్కరణలు & పౌర హక్కులు",
    domainEn: "Legal reform & civil rights",
    blurbTe: "న్యాయ / పాలనా సంస్కరణలు — రాజ్యాంగ హక్కుల రక్షణ.",
    blurbEn: "Statesman advancing justice reform and constitutional access.",
    imageSrc: "/stalwarts/veerappa-moily.png",
  },
];

function StalwartPortrait({
  name,
  imageSrc,
  priority = false,
}: {
  name: string;
  imageSrc: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="stalwart-bezel relative h-[5.5rem] w-[5.5rem] shrink-0 sm:h-24 sm:w-24"
      aria-label={name}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 2px #FBFBFA, 0 0 0 4px #B45309, 0 0 0 6px rgb(180 83 9 / 0.3), 0 4px 14px rgb(15 23 42 / 0.16)",
        }}
        aria-hidden
      />
      <div
        className="relative h-full w-full overflow-hidden rounded-full bg-[#1E293B]"
        style={{
          border: "2px solid #B45309",
          boxShadow: "inset 0 0 0 1px rgb(251 251 250 / 0.35)",
        }}
      >
        {!failed ? (
          <Image
            src={imageSrc}
            alt={name}
            width={192}
            height={192}
            priority={priority}
            className="h-full w-full object-cover"
            sizes="96px"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A]"
            aria-hidden
          >
            <span className="h-8 w-8 rounded-full border-2 border-[#B45309]/60 bg-[#B45309]/20" />
          </div>
        )}
      </div>
    </div>
  );
}

export function CivicStalwarts() {
  return (
    <section
      className="civic-watermark border-t border-civic-border bg-civic-paper px-4 py-10 sm:py-12"
      aria-labelledby="civic-stalwarts-heading"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white via-[#FFFDF9] to-[#FBF7ED] p-5 shadow-xs sm:p-6">
        <header className="mb-5 border-b border-[#EAD7B5] pb-3">
          <span className="civic-eyebrow-pill">
            సమాజ మార్గదర్శకులు • LUMINARIES
          </span>
          <h2
            id="civic-stalwarts-heading"
            className="mt-2.5 font-display-te text-xl font-normal leading-snug tracking-tight text-civic-ink sm:text-2xl"
          >
            సమాజ మార్గదర్శకులు & విశిష్ట ప్రముఖులు
          </h2>
          <p className="mt-1 font-sans text-xs font-medium text-slate-500">
            Heritage guides across medicine, lineage & justice
          </p>
        </header>

        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x lg:grid lg:grid-cols-5 lg:items-stretch lg:gap-3 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {STALWARTS.map((stalwart, index) => (
            <li
              key={stalwart.id}
              className="flex w-[min(72vw,15.5rem)] shrink-0 snap-start lg:w-auto"
            >
              <article className="flex h-full w-full flex-col justify-between gap-2.5 rounded-xl border border-[#EAD7B5] bg-white/80 px-3 py-4 text-center shadow-[0_4px_16px_rgb(180_83_9_/0.05)] sm:px-3.5">
                <div className="flex flex-col items-center gap-2">
                  <StalwartPortrait
                    name={`${stalwart.nameTe} — ${stalwart.nameEn}`}
                    imageSrc={stalwart.imageSrc}
                    priority={index < 2}
                  />

                  <div className="space-y-0.5 px-0.5">
                    <h3 className="font-telugu text-sm font-bold leading-[1.55] text-civic-ink">
                      {stalwart.nameTe}
                    </h3>
                    <p className="font-sans text-[10px] font-medium tracking-wide text-[#B45309]">
                      {stalwart.nameEn}
                    </p>
                  </div>

                  <span className="inline-flex max-w-full flex-col items-center gap-0.5 rounded-md border border-x-[#B45309]/35 border-y-[#EAD7B5] bg-[#FFFDF9] px-2 py-1.5">
                    <span className="font-telugu text-[11px] font-semibold leading-snug text-civic-ink">
                      {stalwart.domainTe}
                    </span>
                    <span className="font-sans text-[10px] leading-snug text-slate-500">
                      {stalwart.domainEn}
                    </span>
                  </span>
                </div>

                <div className="mt-auto space-y-1 border-t border-[#EAD7B5]/70 pt-2.5">
                  <p className="font-telugu text-[12px] leading-[1.65] text-civic-navy/90">
                    {stalwart.blurbTe}
                  </p>
                  <p className="font-sans text-[11px] leading-relaxed text-slate-500">
                    {stalwart.blurbEn}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CivicStalwarts;
