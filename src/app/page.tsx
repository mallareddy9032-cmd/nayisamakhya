"use client";

import Link from "next/link";
import {
  FileText,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CivicStalwarts } from "@/components/CivicStalwarts";
import { CivicTimeline } from "@/components/CivicTimeline";
import { CivicMetricsTicker } from "@/components/home/CivicMetricsTicker";
import { HeritageTriadRibbon } from "@/components/home/HeritageTriadRibbon";
import { HeroArtisanShowcase } from "@/components/home/HeroArtisanShowcase";
import { PersonaSwitcher } from "@/components/home/PersonaSwitcher";
import { QuickGrievanceWidget } from "@/components/home/QuickGrievanceWidget";
import { ServiceActionCards } from "@/components/home/ServiceActionCards";

export default function HomePage() {
  return (
    <div className="bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200">
        <span className="font-telugu">
          {
            "తెలంగాణ నాయి సమాఖ్య అధికారిక డిజిటల్ నెట్‌వర్క్ — 33 జిల్లాలు & 589 మండలాల సేవా వేదిక"
          }
        </span>
      </div>

      <header className="sticky top-0 z-30 border-b border-civic-border bg-white/95 shadow-xs backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl border border-civic-bronze/20 bg-civic-bronze/10 p-2 text-civic-bronze">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <span className="font-telugu text-base font-black tracking-tight text-civic-ink md:text-lg">
                {"నాయి సమాఖ్య తెలంగాణ"}
              </span>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Official Civic Welfare Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/newsletter"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-telugu text-xs font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle sm:inline-flex"
            >
              సమాచార పత్రిక
            </Link>
            <Link
              href="/representation"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-telugu text-xs font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle md:inline-flex"
            >
              <FileText className="h-3.5 w-3.5 text-civic-bronze" />
              {"వినతిపత్రం"}
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-civic-bronze px-3.5 py-1.5 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              <Send className="h-3.5 w-3.5" />
              {"సేవా డెస్క్ బాట్"}
            </a>
          </div>
        </div>
      </header>

      {/* Dignified artisanal hero — 2-col on desktop */}
      <section className="relative overflow-hidden border-b border-civic-border bg-gradient-to-b from-white via-[#FBFBFA] to-[#FBFBFA] px-4 pb-14 pt-10 sm:pb-16 sm:pt-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgb(180_83_9_/0.08),_transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 py-1 font-telugu text-xs font-bold text-[#B45309]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                రాష్ట్రవ్యాప్త కమ్యూనిటీ సాధికారత
              </span>
              <span className="inline-flex items-center rounded-full border border-[#1E293B]/15 bg-white px-3 py-1 font-telugu text-[11px] font-bold text-[#1E293B]">
                BC-A సంక్షేమ హక్కులు
              </span>
              <span className="inline-flex items-center rounded-full border border-[#1E293B]/15 bg-white px-3 py-1 font-telugu text-[11px] font-bold text-[#1E293B]">
                జి.ఓ. 23
              </span>
            </div>

            <h1 className="font-display-te text-[2rem] leading-[1.25] tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl md:leading-[1.2]">
              నాయి బ్రాహ్మణ, మంగలి &amp; బజంత్రి
              <br />
              <span className="text-[#B45309]">డిజిటల్ సేవా కేంద్రం</span>
            </h1>

            <p className="mx-auto max-w-xl font-telugu text-sm leading-relaxed text-slate-600 md:text-base lg:mx-0">
              అధికారులకు అధికారిక వినతిపత్రాల సమర్పణ, క్షేత్రస్థాయి సమస్యల
              పరిష్కారం, మరియు మండల సమన్వయకర్తల అనుసంధానం కొరకు రూపొందించబడిన
              అధీకృత వేదిక.
            </p>

            <div className="flex flex-col items-stretch justify-center gap-2.5 pt-1 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/representation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-5 py-3 font-telugu text-sm font-bold text-white shadow-xs transition hover:bg-[#92400e]"
              >
                <FileText className="h-4 w-4" aria-hidden />
                వినతిపత్రం తయారు చేయండి
              </Link>
              <a
                href="https://wa.me/919032654111?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%A8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%B8%E0%B0%AE%E0%B0%BE%E0%B0%96%E0%B1%8D%E0%B0%AF%20%E0%B0%A1%E0%B1%86%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B1%8D"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#128C7E]/40 bg-white px-5 py-3 font-telugu text-sm font-bold text-[#0E7A6E] shadow-xs transition hover:bg-emerald-50"
              >
                WhatsApp సహాయవాణి
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md pb-10 lg:max-w-none lg:pb-6">
            <HeroArtisanShowcase />
          </div>
        </div>
      </section>

      <CivicMetricsTicker />

      <div className="h-5 sm:h-6" aria-hidden />

      <HeritageTriadRibbon />

      <PersonaSwitcher />

      <CivicTimeline />

      <ServiceActionCards />

      <QuickGrievanceWidget />

      <CivicStalwarts />
    </div>
  );
}
