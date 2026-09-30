"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessageCircle,
} from "lucide-react";
import { CivicEngineMap } from "@/components/CivicEngineMap";
import { CivicStalwarts } from "@/components/CivicStalwarts";
import { CivicTimeline } from "@/components/CivicTimeline";
import { CivicMetricsTicker } from "@/components/home/CivicMetricsTicker";
import { HeritageTriadRibbon } from "@/components/home/HeritageTriadRibbon";
import { HeroArtisanShowcase } from "@/components/home/HeroArtisanShowcase";
import { HomeJumpNav } from "@/components/home/HomeJumpNav";
import { HomeMobileHeader } from "@/components/home/HomeMobileHeader";
import { PersonaSwitcher } from "@/components/home/PersonaSwitcher";
import { QuickGrievanceWidget } from "@/components/home/QuickGrievanceWidget";
import { ServiceActionCards } from "@/components/home/ServiceActionCards";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200 sm:px-6 lg:px-8">
        <span className="font-telugu">
          {
            "తెలంగాణ నాయి సమాఖ్య అధికారిక డిజిటల్ నెట్‌వర్క్ — 33 జిల్లాలు & 589 మండలాల సేవా వేదిక"
          }
        </span>
      </div>

      <HomeMobileHeader />

      {/* Dignified artisanal hero — stacked on mobile, 2-col on desktop */}
      <section
        id="home-hero"
        className="relative scroll-mt-20 overflow-x-hidden border-b border-civic-border bg-gradient-to-b from-white via-[#FBFBFA] to-[#FBFBFA] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgb(180_83_9_/0.08),_transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5 text-center lg:text-left">
            <span className="civic-eyebrow-pill mb-1 shadow-sm">
              చారిత్రక వారసత్వం • చట్టబద్ధ రక్షణ • సమగ్ర సాధికారత
            </span>

            <div>
              <h1 className="font-display-te text-2xl font-normal leading-[1.35] tracking-tight text-[#0F172A] sm:text-4xl sm:leading-[1.3] lg:text-5xl lg:leading-[1.28]">
                ఆత్మగౌరవం • చట్టబద్ధ రక్షణ •
                <br />
                <span className="bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] bg-clip-text font-display-te not-italic text-transparent">
                  ఆధునిక ప్రగతి
                </span>
              </h1>
              <p className="mt-2 font-sans text-sm font-medium uppercase tracking-widest text-slate-500 lg:text-base">
                Statewide Civic Protection &amp; Empowerment Network
              </p>
            </div>

            <p className="mx-auto mt-3 max-w-2xl font-telugu text-base font-normal leading-[1.8] text-slate-600 lg:mx-0 lg:text-lg">
              శతాబ్దాల కళా-వైద్య వైభవాన్ని పునరుద్ధరిస్తూ.. 250 యూనిట్ల ఉచిత
              విద్యుత్ (జీ.ఓ. 23), మున్సిపల్ షాపుల రక్షణ, విద్యా-స్కాలర్‌షిప్‌లు
              మరియు క్షేత్రస్థాయి సమస్యల పరిష్కారం కొరకు తెలంగాణలోని నాయీ
              బ్రాహ్మణ, మంగలి, బజంత్రి సమాజాల ఏకైక ఆధీకృత వేదిక.
            </p>

            <div className="flex flex-col items-stretch justify-center gap-2.5 pt-1 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/representation"
                className="civic-focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-5 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_24px_rgb(180_83_9_/0.3)] transition-all duration-300 hover:brightness-110"
              >
                <FileText className="h-4 w-4" aria-hidden />
                వినతిపత్రం తయారు చేయండి
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="https://wa.me/919032654111?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%A8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%B8%E0%B0%AE%E0%B0%BE%E0%B0%96%E0%B1%8D%E0%B0%AF%20%E0%B0%A1%E0%B1%86%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B1%8D"
                target="_blank"
                rel="noreferrer"
                className="civic-focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#128C7E]/40 bg-white px-5 py-3 font-telugu text-sm font-bold text-[#0E7A6E] shadow-xs transition hover:bg-emerald-50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp సహాయవాణి
              </a>
            </div>
          </div>

          {/* Artisan photo stacked below headline on mobile */}
          <div className="relative mx-auto w-full max-w-md overflow-x-hidden pb-10 lg:max-w-none lg:pb-6">
            <HeroArtisanShowcase />
          </div>
        </div>
      </section>

      <CivicMetricsTicker />

      <CivicEngineMap />

      <HomeJumpNav />

      <div id="heritage-triad" className="scroll-mt-24">
        <HeritageTriadRibbon />
      </div>

      <div id="persona-section" className="scroll-mt-24">
        <PersonaSwitcher />
      </div>

      <div id="civic-timeline" className="scroll-mt-24">
        <CivicTimeline />
      </div>

      <div id="three-click" className="scroll-mt-24">
        <ServiceActionCards />
      </div>

      <div id="grievance-desk" className="scroll-mt-24">
        <QuickGrievanceWidget />
      </div>

      <div id="stalwarts" className="scroll-mt-24">
        <CivicStalwarts />
      </div>
    </div>
  );
}
