import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowLeft, ArrowRight } from "lucide-react";
import { TRAJECTORY_INFOGRAPHIC_HREF } from "@/components/CivicTimeline";

export const metadata: Metadata = {
  title: "చారిత్రక & చట్టబద్ధ పరిణామ క్రమం | Historical Trajectory | Nayi Samakhya",
  description:
    "Nayee Brahmin Historical & Administrative Trajectory — six civic pillars from ancient medical heritage to CBI 94 / SEEEPC Vol-II.",
  alternates: { canonical: "https://www.nayisamakhya.org/history" },
};

const PILLARS = [
  {
    id: "ancient",
    n: "01",
    periodEn: "6th–4th C. BCE",
    periodTe: "క్రీ.పూ. 6వ–4వ శ.",
    titleEn: "Ancient Medical & Royal Heritage",
    titleTe: "ప్రాచీన వైద్య & రాజసేవ వారసత్వం",
    bodyEn:
      "The community’s occupational dignity traces to Ayurvedic and surgical service in the lineage of Dhanvantari, Charaka, and Sushruta — care as a civic duty, not merely a trade.",
    bodyTe:
      "ధన్వంతరి, చరక, సుశ్రుత మార్గంలో ఆయుర్వేదం, శస్త్రచికిత్స సేవ — కులవృత్తి వైద్యం సమాజ ఆరోగ్యం యొక్క ప్రాథమిక స్తంభంగా నిలిచింది.",
  },
  {
    id: "medieval",
    n: "02",
    periodEn: "12th–18th C.",
    periodTe: "12వ–18వ శ.",
    titleEn: "Medieval Temple Music & Devotional Agency",
    titleTe: "మధ్యయుగ ఆలయ సంగీతం & భక్తి సేవ",
    bodyEn:
      "Nadaswara and Bajantari service at temples and collective rites bound craft, devotion, and public ceremony — cultural agency as social capital.",
    bodyTe:
      "నాదస్వర / బజంత్రి వారసత్వం ఆలయ · సామూహిక ఉత్సవాల్లో కళ, భక్తి, సామాజిక సేవను ఏకం చేసింది — సాంస్కృతిక గుర్తింపు వృత్తి గౌరవంతో మమేకమైంది.",
  },
  {
    id: "colonial",
    n: "03",
    periodEn: "1909–1931",
    periodTe: "1909–1931",
    titleEn: "Colonial Ethnographic Mapping",
    titleTe: "వలస కాల జాత్యాంశ గణన & మ్యాపింగ్",
    bodyEn:
      "Census and ethnographic surveys recorded occupational castes including Nayee Brahmin / Mangali / Bajantari clusters — statistical identity that later informed welfare planning.",
    bodyTe:
      "సామాజిక సర్వేలు, కుల గణనలు నాయీ బ్రాహ్మణ, మంగలి, బజంత్రి సమూహాల గణాంక ఆధారిత గుర్తింపును నమోదు చేశాయి — సంక్షేమ ప్రణాళికకు ఆధారం.",
  },
  {
    id: "nomenclature",
    n: "04",
    periodEn: "1996–2000",
    periodTe: "1996–2000",
    titleEn: "Official Nomenclature Standardization",
    titleTe: "అధికారిక నామకరణ ప్రామాణీకరణ",
    bodyEn:
      "Government orders and gazette notifications standardized community nomenclature and welfare eligibility language — clarity required for scheme delivery.",
    bodyTe:
      "ప్రభుత్వ ఉత్తర్వులు, గెజిట్ నోటిఫికేషన్లు సంఘ నామకరణం, సంక్షేమ అర్హత భాషను ప్రామాణీకరించాయి — పథక అమలుకు అవసరమైన స్పష్టత.",
  },
  {
    id: "subsidies",
    n: "05",
    periodEn: "2020–2021",
    periodTe: "2020–2021",
    titleEn: "Targeted Subsidies & Utility Relief",
    titleTe: "లక్ష్యిత సబ్సిడీలు & యుటిలిటీ ఉపశమనం",
    bodyEn:
      "G.O. Ms. No. 23 operationalized free power relief (250 units) for eligible salon / Bajantari establishments — utility policy as livelihood protection.",
    bodyTe:
      "జీ.ఓ. Ms. No. 23 — అర్హతగల సెలూన్ / బజంత్రి వృత్తిదుకాణాలకు 250 యూనిట్ల ఉచిత విద్యుత్ — జీవనోపాధి రక్షణగా యుటిలిటీ విధానం.",
  },
  {
    id: "cbi",
    n: "06",
    periodEn: "2024–2025",
    periodTe: "2024–2025",
    titleEn: "Composite Backwardness Index (94) & SEEEPC Census",
    titleTe: "సమ్మిళిత వెనుకబాటు సూచిక (94) & SEEEPC గణన",
    bodyEn:
      "Telangana SEEEPC Survey Vol-II records a Composite Backwardness Index of 94 and a community population of 4,33,785 (1.2% of state population) — evidence for contemporary rights advocacy.",
    bodyTe:
      "తెలంగాణ SEEEPC Survey Vol-II — Composite Backwardness Index 94; జనాభా 4,33,785 (రాష్ట్ర జనాభాలో 1.2%) — సమకాలీన హక్కుల వాదనకు గణన ఆధారం.",
  },
] as const;

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] text-[#0F172A]">
      <div className="border-b border-[#EAD7B5] bg-[#0F172A] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="civic-focus-ring inline-flex min-h-10 items-center gap-1.5 font-telugu text-xs font-semibold text-[#FBBF24] underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            హోమ్ పేజీకి తిరిగి · Back to home
          </Link>
          <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#B45309]">
            Archival · Historical &amp; Administrative Trajectory
          </p>
          <h1 className="mt-2 max-w-3xl font-display-te text-2xl font-normal leading-tight text-white sm:text-3xl md:text-4xl">
            చారిత్రక &amp; చట్టబద్ధ పరిణామ క్రమం
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-slate-300 sm:text-base">
            Six civic pillars of the Nayee Brahmin community — from ancient
            medical heritage to CBI 94 and the SEEEPC census evidence base.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={TRAJECTORY_INFOGRAPHIC_HREF}
              download="nayee-brahmin-trajectory.png"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B45309] px-4 py-2.5 font-telugu text-sm font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.35)] transition hover:brightness-110"
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden />
              HD ఇన్ఫోగ్రాఫిక్ డౌన్‌లోడ్
            </a>
            <Link
              href="/#civic-timeline-heading"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-600 px-4 py-2.5 font-telugu text-sm font-semibold text-slate-200 transition hover:border-[#B45309] hover:text-white"
            >
              హోమ్ టైమ్‌లైన్
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <section
        className="border-b border-[#EAD7B5] px-4 py-8 sm:py-10"
        aria-labelledby="trajectory-infographic-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="trajectory-infographic-heading"
            className="font-telugu text-lg font-bold text-[#0F172A] sm:text-xl"
          >
            పూర్తి ఇన్ఫోగ్రాఫిక్ · Full trajectory graphic
          </h2>
          <p className="mt-1 font-sans text-sm text-slate-600">
            Warm Paper institutional chart — CBI 94 callout with six-pillar
            spine. Replace placeholder art when final user asset is supplied.
          </p>
          <figure className="mt-5 overflow-hidden rounded-2xl border border-[#EAD7B5] bg-white shadow-[0_12px_32px_rgb(15_23_42_/0.06)]">
            <Image
              src={TRAJECTORY_INFOGRAPHIC_HREF}
              alt="Nayee Brahmin Historical and Administrative Trajectory — six pillars with CBI 94 callout"
              width={1440}
              height={900}
              className="h-auto w-full"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <figcaption className="border-t border-[#EAD7B5] bg-[#FFFDF9] px-4 py-3 font-telugu text-xs text-slate-600 sm:px-5">
              Composite Backwardness Index 94 · Telangana SEEEPC Survey Vol-II ·
              జనాభా 4,33,785 (రాష్ట్ర జనాభాలో 1.2%)
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="px-4 py-10 sm:py-12"
        aria-labelledby="six-pillars-heading"
      >
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 max-w-3xl">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#B45309]">
              Six pillars · ఆరు స్తంభాలు
            </p>
            <h2
              id="six-pillars-heading"
              className="mt-2 font-display-te text-2xl leading-tight text-[#0F172A] sm:text-3xl"
            >
              Structured archival narrative
            </h2>
            <p className="mt-2 font-telugu text-sm leading-[1.8] text-slate-600">
              ప్రతి స్తంభం — కాలం, ఇంగ్లీష్ వివరణ, తెలుగు సారాంశం. హోమ్ పేజీలో
              క్లుప్తంగా; ఇక్కడ పూర్తి ఆర్కైవ్.
            </p>
          </header>

          <ol className="space-y-5">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.id}
                id={pillar.id}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#EAD7B5] bg-white shadow-[0_6px_20px_rgb(180_83_9_/0.05)]"
              >
                <div className="flex flex-col gap-0 md:flex-row">
                  <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-[#EAD7B5] bg-[#FFF7ED] px-5 py-5 md:w-52 md:border-b-0 md:border-r">
                    <div>
                      <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#B45309]">
                        Pillar {pillar.n}
                      </span>
                      <p className="mt-2 font-sans text-sm font-bold text-[#0F172A]">
                        {pillar.periodEn}
                      </p>
                      <p className="mt-0.5 font-telugu text-xs font-semibold text-slate-600">
                        {pillar.periodTe}
                      </p>
                    </div>
                    {pillar.id === "cbi" ? (
                      <div
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0F172A] px-3 py-1.5"
                        aria-label="CBI 94"
                      >
                        <span className="font-sans text-lg font-black text-[#FBBF24]">
                          94
                        </span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                          CBI
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1 px-5 py-5 sm:px-6">
                    <h3 className="font-sans text-base font-bold leading-snug text-[#0F172A] sm:text-lg">
                      {pillar.titleEn}
                    </h3>
                    <p className="mt-1 font-telugu text-sm font-bold text-[#B45309]">
                      {pillar.titleTe}
                    </p>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          English
                        </p>
                        <p className="mt-1.5 font-sans text-sm leading-relaxed text-slate-700">
                          {pillar.bodyEn}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          తెలుగు
                        </p>
                        <p className="mt-1.5 font-telugu text-sm leading-[1.8] text-slate-700">
                          {pillar.bodyTe}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#EAD7B5] bg-[#FFF7ED] px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-telugu text-sm font-bold text-[#0F172A]">
                సమకాలీన హక్కుల కోసం వినతి సిద్ధం చేయండి
              </p>
              <p className="mt-1 font-sans text-xs text-slate-600">
                G.O. 23 free-power petition · representation desk
              </p>
            </div>
            <Link
              href="/representation?subject=go23_free_power"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B45309] px-4 py-2.5 font-telugu text-sm font-bold text-white transition hover:brightness-110"
            >
              వినతిపత్రం
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
