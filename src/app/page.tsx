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
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <div className="overflow-x-hidden bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200 sm:px-6 lg:px-8">
        <span className={cn(isTe ? "font-telugu" : "font-sans")}>
          {t("heroBanner")}
        </span>
      </div>

      <HomeMobileHeader />

      {/* Dignified artisanal hero — stacked on mobile, 2-col on desktop */}
      <section
        id="home-hero"
        className="relative scroll-mt-20 overflow-visible border-b border-civic-border bg-gradient-to-b from-white via-[#FBFBFA] to-[#FBFBFA] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgb(180_83_9_/0.08),_transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5 text-center lg:text-left">
            <span
              className={cn(
                "civic-eyebrow-pill mb-1 shadow-sm",
                isTe ? "font-telugu" : "font-sans",
              )}
            >
              {t("heroEyebrow")}
            </span>

            <div>
              <h1 className="tracking-tight text-center lg:text-left">
                <span
                  className={cn(
                    "block text-[1.75rem] font-normal leading-[1.75] text-slate-900 sm:text-4xl lg:text-5xl",
                    isTe ? "font-display-te" : "font-sans font-semibold tracking-tight",
                  )}
                >
                  {t("heroH1Primary")}
                </span>
                {isTe ? (
                  <span className="mt-2.5 block font-display-te text-[1.45rem] font-normal italic leading-[1.75] text-amber-600 sm:text-3xl lg:text-4xl">
                    {t("heroH1Secondary")}
                  </span>
                ) : (
                  <span className="mt-2.5 block font-sans text-lg font-medium tracking-wide text-amber-700 sm:text-xl lg:text-2xl">
                    {t("heroH1Secondary")}
                  </span>
                )}
              </h1>
            </div>

            <div className="mx-auto mt-3 max-w-2xl space-y-3 text-center lg:mx-0 lg:text-left">
              <p
                className={cn(
                  "text-base font-normal text-slate-600 sm:text-lg",
                  isTe ? "font-telugu leading-telugu" : "font-sans leading-relaxed",
                )}
              >
                {t("heroMissionLead")}
              </p>
              <p
                className={cn(
                  "text-base font-normal text-slate-600 sm:text-lg",
                  isTe ? "font-telugu leading-telugu" : "font-sans leading-relaxed",
                )}
              >
                {t("heroMissionPillars")}
              </p>
              <p
                className={cn(
                  "text-sm font-normal text-slate-500",
                  isTe ? "font-telugu leading-telugu" : "font-sans leading-relaxed",
                )}
              >
                {t("heroMissionSecondary")}
              </p>
            </div>

            <div className="flex flex-col items-stretch justify-center gap-2.5 pt-1 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/representation"
                className={cn(
                  "civic-focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgb(180_83_9_/0.3)] transition-all duration-300 hover:brightness-110",
                  isTe ? "font-telugu" : "font-sans",
                )}
              >
                <FileText className="h-4 w-4 shrink-0" aria-hidden />
                {t("navCtaPetition")}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <a
                href="https://wa.me/919032654111?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%A8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%B8%E0%B0%AE%E0%B0%BE%E0%B0%96%E0%B1%8D%E0%B0%AF%20%E0%B0%A1%E0%B1%86%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B1%8D"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "civic-focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#128C7E]/40 bg-white px-5 py-3 text-sm font-bold text-[#0E7A6E] shadow-xs transition hover:bg-emerald-50",
                  isTe ? "font-telugu" : "font-sans",
                )}
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                {t("navCtaWhatsapp")}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </a>
            </div>
          </div>

          {/* Artisan photo stacked below headline on mobile */}
          <div className="relative mx-auto w-full max-w-md overflow-visible pb-6 lg:max-w-none lg:pb-6">
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
