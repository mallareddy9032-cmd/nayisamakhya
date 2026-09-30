import type { Metadata } from "next";
import Link from "next/link";
import {
  Banknote,
  Package,
  Scissors,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";

export const metadata: Metadata = {
  title: "సెలూన్ స్టూడియో ఎంటర్‌ప్రైజ్ హబ్ | Salon Studio Enterprise Hub",
  description:
    "తెలంగాణలోని గ్రామీణ మరియు పట్టణ సెలూన్ యజమానులకు సామూహిక కొనుగోళ్లు, జీవో 23 ఉచిత విద్యుత్ పరిరక్షణ మరియు ముద్రా/బీసీ కార్పొరేషన్ రుణాల కోసం ఒకే అధికారిక వేదిక.",
  alternates: { canonical: "/salon-hub" },
};

const STATS = [
  "📦 30%–45% ఫ్యాక్టరీ డిస్కౌంట్",
  "⚡ 250 యూనిట్లు గ్రీన్-జోన్ రక్షణ (G.O. 23)",
  "🏦 ₹1L–₹3L అధికారిక బ్యాంక్ DPR",
] as const;

type HubCard = {
  href: string;
  icon: LucideIcon;
  badge: string;
  badgeClass: string;
  title: string;
  bullets: readonly string[];
  cta: string;
};

const CARDS: readonly HubCard[] = [
  {
    href: "/salon-hub/procure",
    icon: Package,
    badge: "నెలవారీ పూలింగ్ లైవ్ (1–5 తేదీలు)",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    title: "సామూహిక కొనుగోళ్లు (Group Indent)",
    bullets: [
      "మధ్యవర్తులు లేకుండా నేరుగా తయారీదారుల ధరలకే సరుకు",
      "బ్లేడ్లు, క్రీములు, శానిటైజర్లు, సెలూన్ కిట్లు",
      "మండల కోఆర్డినేటర్ వద్ద క్యాష్/యూపీఐ ఆన్ డెలివరీ",
    ],
    cta: "ఆర్డర్ ప్రారంభించండి ➔",
  },
  {
    href: "/salon-hub/energy",
    icon: Zap,
    badge: "250 యూనిట్ల రక్షణ",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    title: "జీవో 23 విద్యుత్ ప్లానర్ (Energy Planner)",
    bullets: [
      "ఇన్వర్టర్ ఏసీ వాడినా 250 యూనిట్ల పరిధిలోనే ఉండే లెక్క",
      "కమర్షియల్ విద్యుత్ పెనాల్టీలు పడకుండా సాంకేతిక రక్షణ",
      "అధికారిక 'గ్రీన్ సెలూన్ ఎనర్జీ సర్టిఫికెట్' డౌన్‌లోడ్",
    ],
    cta: "లోడ్ లెక్కించండి ➔",
  },
  {
    href: "/salon-hub/loans",
    icon: Banknote,
    badge: "ముద్రా & బీసీ కార్పొరేషన్",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-800",
    title: "బ్యాంక్ DPR జనరేటర్ (Loan DPR Engine)",
    bullets: [
      "ఆధునిక కుర్చీలు, ఏసీ పరికరాల కొనుగోలుకు ప్రాజెక్ట్ రిపోర్ట్",
      "3 సంవత్సరాల ఆదాయ-వ్యయాల గణాంకాలు & DSCR నిష్పత్తులు",
      "బ్యాంక్ మేనేజర్లు, BC కార్పొరేషన్ ఆమోదించే 2-పేజీల డాకెట్",
    ],
    cta: "DPR తయారుచేయండి ➔",
  },
];

export default function SalonHubPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome />

      <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 py-1.5 font-telugu text-xs font-semibold tracking-wide text-[#B45309] sm:text-sm">
            <Scissors className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ఆర్థిక స్వావలంబన • ఆధునిక సెలూన్ సాధికారత
          </p>

          <h1 className="mt-5 font-display-te text-3xl font-normal leading-snug text-[#0F172A] sm:text-4xl md:text-5xl">
            సెలూన్ స్టూడియో ఎంటర్‌ప్రైజ్ హబ్
            <span className="mt-1 block text-2xl font-normal text-slate-600 sm:text-3xl">
              Salon Studio Enterprise Hub
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-telugu text-base leading-relaxed text-[#475569] sm:text-lg">
            తెలంగాణలోని గ్రామీణ మరియు పట్టణ సెలూన్ యజమానులకు సామూహిక కొనుగోళ్లు,
            జీవో 23 ఉచిత విద్యుత్ పరిరక్షణ మరియు ముద్రా/బీసీ కార్పొరేషన్ రుణాల
            కోసం ఒకే అధికారిక వేదిక.
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {STATS.map((stat) => (
              <li
                key={stat}
                className="inline-flex min-h-12 items-center rounded-full border border-[#E2E8F0] bg-white px-3.5 py-2 font-telugu text-xs font-semibold text-[#0F172A] shadow-sm sm:text-sm"
              >
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.href} className="flex">
                <article className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-lg sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B45309]/20 bg-[#B45309]/10 text-[#B45309]">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span
                      className={`inline-flex max-w-[70%] items-center rounded-full border px-2.5 py-1 font-telugu text-[10px] font-semibold leading-snug sm:text-[11px] ${card.badgeClass}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display-te text-xl font-normal leading-snug text-[#0F172A] sm:text-2xl">
                    {card.title}
                  </h2>

                  <ul className="mt-3 flex-1 space-y-2.5 font-telugu text-sm leading-relaxed text-[#475569]">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]"
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={card.href}
                    className="tap mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white transition hover:bg-[#92400E]"
                  >
                    {card.cta}
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
