import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Package,
  Zap,
} from "lucide-react";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";

export const metadata: Metadata = {
  title: "సెలూన్ స్టూడియో హబ్ | Salon Studio Enterprise Hub",
  description:
    "Nayi Samakhya Salon Studio Hub — group procure indent, G.O. 23 energy planner, and bank DPR generator for traditional salon enterprises across Telangana.",
  alternates: { canonical: "/salon-hub" },
};

const CARDS = [
  {
    href: "/salon-hub/procure",
    icon: Package,
    title: "సమూహ ఇండెంట్",
    subtitle: "మండల హబ్ ద్వారా కలిసి కొనుగోలు — COD / UPI",
    cta: "ఇండెంట్ ఇవ్వండి",
  },
  {
    href: "/salon-hub/energy",
    icon: Zap,
    title: "జీ.ఓ. 23 ఎనర్జీ ప్లానర్",
    subtitle: "250 యూనిట్ల ఉచిత విద్యుత్ లోపలే ఉండండి",
    cta: "ఎనర్జీ లెక్కించండి",
  },
  {
    href: "/salon-hub/loans",
    icon: Banknote,
    title: "బ్యాంక్ డీపీఆర్ జనరేటర్",
    subtitle: "ముద్రా + బీసీ కార్ప్ సబ్సిడీ దస్తావేజు",
    cta: "డీపీఆర్ తయారు చేయండి",
  },
] as const;

export default function SalonHubPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome
        title="సెలూన్ స్టూడియో హబ్"
        subtitle="Salon Studio Enterprise Hub"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B45309]">
          సామూహిక వ్యాపార సేవలు · Enterprise Suite
        </p>
        <h2 className="mt-2 font-display-te text-3xl font-normal leading-snug text-[#0F172A] sm:text-4xl">
          సెలూన్ స్టూడియో హబ్
        </h2>
        <p className="mt-3 max-w-xl font-telugu text-base leading-relaxed text-[#475569]">
          సమూహ కొనుగోలు, జీ.ఓ. 23 విద్యుత్ ప్లానింగ్, బ్యాంక్ డీపీఆర్ — మీ
          స్టూడియోను ఎంటర్‌ప్రైజ్‌గా నిర్మించండి.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-1">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.href}>
                <Link
                  href={card.href}
                  className="tap group flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-white to-[#FFFDF9] p-5 shadow-sm transition hover:border-[#B45309]/40 hover:shadow-[0_8px_24px_rgba(180,83,9,0.12)] sm:flex-row sm:items-center"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#B45309]/25 bg-[#B45309]/10 text-[#B45309]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display-te text-xl font-normal text-[#0F172A]">
                      {card.title}
                    </h3>
                    <p className="mt-1 font-telugu text-sm text-[#64748B]">
                      {card.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-telugu text-sm font-bold text-[#B45309]">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
