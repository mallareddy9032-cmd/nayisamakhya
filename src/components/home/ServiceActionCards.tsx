"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  IdCard,
  Printer,
  QrCode,
  Stamp,
} from "lucide-react";

const SERVICES = [
  {
    id: "representation",
    href: "/representation",
    icon: FileText,
    badgeIcon: Stamp,
    badge: "అధికారిక సీల్",
    title: "వినతిపత్రం తయారీ",
    blurb: "MRO / కలెక్టర్‌కు స్టాంప్‌డ్ A4 డాకెట్ — 3 స్టెప్‌ల్లో ప్రింట్.",
    cta: "ఇప్పుడే తయారు చేయండి",
  },
  {
    id: "card",
    href: "/coordinator-card",
    icon: IdCard,
    badgeIcon: BadgeCheck,
    badge: "VERIFIED + QR",
    title: "సమన్వయకర్త గుర్తింపు కార్డు",
    blurb: "లామినేషన్-రెడీ డిజిటల్ క్రెడెన్షియల్ — QR డాకెట్‌తో.",
    cta: "కార్డు తెరవండి",
  },
  {
    id: "poster",
    href: "/poster",
    icon: Printer,
    badgeIcon: QrCode,
    badge: "A4 వాల్ ప్రింట్",
    title: "వాల్ పోస్టర్ & గెజిట్",
    blurb: "షాపు నోటీస్ బోర్డు / WhatsApp స్టేటస్ — హై-DPI డౌన్‌లోడ్.",
    cta: "పోస్టర్ తీసుకోండి",
  },
] as const;

export function ServiceActionCards() {
  return (
    <section
      className="border-b border-civic-border bg-white px-4 py-12 sm:py-14"
      aria-labelledby="three-click-services"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 max-w-3xl">
          <span className="civic-eyebrow-pill">
            ప్రజా సేవలు • 3-CLICK DESK
          </span>
          <h2
            id="three-click-services"
            className="mt-3 font-display-te text-2xl leading-snug text-[#1E293B] md:text-3xl"
          >
            3-దశల ప్రజా సేవలు
          </h2>
          <p className="mt-1 font-sans text-sm font-medium tracking-wide text-slate-500">
            3-Click Public Services
          </p>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            వృత్తి గౌరవం కోసం అవసరమైన మూడు అధికారిక సాధనాలు — ఎంచుకుని ముందుకు
            సాగండి.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const BadgeIcon = svc.badgeIcon;
            return (
              <Link
                key={svc.id}
                href={svc.href}
                className="civic-focus-ring group flex flex-col rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] p-5 shadow-[0_1px_2px_rgb(15_23_42_/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B45309]/50 hover:bg-white hover:shadow-[0_16px_40px_rgb(15_23_42_/0.1)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#B45309]/20 bg-[#B45309]/10 text-[#B45309]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#1E293B]/10 bg-white px-2.5 py-1 font-telugu text-[10px] font-bold text-[#1E293B]">
                    <BadgeIcon className="h-3 w-3 text-[#B45309]" aria-hidden />
                    {svc.badge}
                  </span>
                </div>

                <h3 className="font-telugu text-base font-bold leading-snug text-[#1E293B]">
                  {svc.title}
                </h3>
                <p className="mt-1.5 flex-1 font-telugu text-xs leading-relaxed text-slate-600">
                  {svc.blurb}
                </p>

                <span className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#92400e] px-4 py-2.5 font-telugu text-xs font-bold text-white shadow-xs transition-all group-hover:brightness-110 group-hover:shadow-[0_8px_20px_rgb(180_83_9_/0.35)]">
                  {svc.cta}
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
