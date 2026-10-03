"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IdCard, MapPin, Phone, Zap } from "lucide-react";

type CommunityFigure = {
  id: string;
  src: string;
  alt: string;
  monogram: string;
};

const FIGURES: CommunityFigure[] = [
  {
    id: "salon",
    src: "/home/persona-artisan-salon.png",
    alt: "ఆధునిక సెలూన్ స్టైలిస్ట్ — Modern salon stylist",
    monogram: "సె",
  },
  {
    id: "nadaswaram",
    src: "/home/artisan-craftsman-portrait.png",
    alt: "సాంప్రదాయ నాదస్వరం కళాకారుడు — Traditional nadaswaram artist",
    monogram: "నా",
  },
  {
    id: "youth",
    src: "/home/persona-youth-scholarship.png",
    alt: "విద్యార్థి / యువ నిపుణుడు — Student and young professional",
    monogram: "యు",
  },
];

function PortraitRing({
  figure,
  size,
  priority = false,
  className = "",
}: {
  figure: CommunityFigure;
  size: "sm" | "lg";
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const dim = size === "lg" ? "h-40 w-40 sm:h-56 sm:w-56" : "h-16 w-16 sm:h-20 sm:w-20";
  const px = size === "lg" ? 640 : 160;

  return (
    <div className={`relative ${dim} ${className}`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            size === "lg"
              ? "0 0 0 3px #FBFBFA, 0 0 0 5px #B45309, 0 0 0 9px rgb(180 83 9 / 0.25), 0 18px 40px rgb(15 23 42 / 0.18)"
              : "0 0 0 2px #FBFBFA, 0 0 0 3px #B45309, 0 8px 18px rgb(15 23 42 / 0.14)",
        }}
        aria-hidden
      />
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1E293B]"
        style={{ border: size === "lg" ? "2px solid #B45309" : "1.5px solid #B45309" }}
      >
        {failed ? (
          <span
            className={`font-display-te font-normal text-[#FDE68A] ${
              size === "lg" ? "text-3xl sm:text-4xl" : "text-base sm:text-lg"
            }`}
            aria-hidden
          >
            {figure.monogram}
          </span>
        ) : (
          <Image
            src={figure.src}
            alt={figure.alt}
            width={px}
            height={px}
            priority={priority}
            className="h-full w-full max-w-full object-cover"
            sizes={
              size === "lg"
                ? "(max-width: 640px) 160px, 224px"
                : "(max-width: 640px) 64px, 80px"
            }
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}

export function HeroArtisanShowcase() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FIGURES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  const primary = FIGURES[active]!;
  const left = FIGURES[(active + FIGURES.length - 1) % FIGURES.length]!;
  const right = FIGURES[(active + 1) % FIGURES.length]!;

  return (
    <div className="relative mx-auto flex w-full max-w-full flex-col items-center justify-center overflow-visible px-2 lg:max-w-none">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 max-w-full rounded-full bg-[#B45309]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 max-w-full rounded-full bg-[#1E293B]/10 blur-2xl"
        aria-hidden
      />

      {/* Top-left G.O. 23 pill — only floating label kept */}
      <div className="absolute left-0 top-0 z-[3] sm:left-1 sm:top-1">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B45309]/35 bg-white/95 px-2.5 py-1 font-sans text-[10px] font-semibold tracking-wide text-[#92400E] shadow-md backdrop-blur-sm sm:text-[11px]">
          <Zap className="h-3 w-3 shrink-0 text-[#B45309]" aria-hidden />
          250 Units Free Power (G.O. 23)
        </span>
      </div>

      {/* Community figures — portraits only (no floating MT-prone labels) */}
      <div className="relative z-[1] flex w-full items-end justify-center gap-1 pt-8 sm:gap-2 sm:pt-6">
        <div className="mb-6 motion-safe:animate-float motion-safe:[animation-delay:-1.2s] sm:mb-8">
          <PortraitRing figure={left} size="sm" />
        </div>

        <div className="relative mx-1 motion-safe:animate-float sm:mx-2">
          <PortraitRing figure={primary} size="lg" priority />
        </div>

        <div className="mb-6 motion-safe:animate-float motion-safe:[animation-delay:-2.4s] sm:mb-8">
          <PortraitRing figure={right} size="sm" />
        </div>
      </div>

      {/* Figure dots */}
      <div
        className="relative z-[2] mt-4 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Community figures"
      >
        {FIGURES.map((fig, i) => (
          <button
            key={fig.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={fig.alt}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-5 bg-[#B45309]"
                : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Zone Coordinator card — green live pulse */}
      <div className="relative z-10 mx-auto mt-3 w-auto max-w-[280px] motion-safe:animate-float-card">
        <Link
          href="/coordinator-card"
          className="block rounded-xl border border-[#E2E8F0] bg-white p-3 text-xs ring-1 ring-[#B45309]/20 motion-safe:animate-shadow-bloom"
          aria-label="Zone Coordinator digital card preview"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-[#B45309]" aria-hidden />
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <IdCard className="h-3.5 w-3.5 shrink-0 text-[#B45309]" aria-hidden />
              <div className="min-w-0">
                <p className="font-telugu text-[10px] font-bold leading-telugu text-[#B45309]">
                  నాయీ సమాఖ్య
                </p>
                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                  Zone Coordinator
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#E2E8F0] bg-[#FBFBFA]">
              <div className="grid h-7 w-7 grid-cols-3 gap-px" aria-hidden>
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-[1px] ${i % 2 === 0 ? "bg-[#0F172A]" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2.5 font-telugu text-xs font-bold text-[#0F172A]">
            మండల సమన్వయకర్త
          </p>
          <p className="mt-0.5 flex items-center gap-1 font-telugu text-[10px] text-slate-600">
            <MapPin className="h-3 w-3 shrink-0 text-[#B45309]" aria-hidden />
            కోదాడ · సూర్యాపేట
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
            <span className="live-pulse-dot" aria-hidden />
            <span className="whitespace-nowrap font-sans text-[9px] font-bold tracking-wide text-emerald-800">
              589 Mandals Live
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-1.5 text-[9px] text-slate-500">
            <span className="inline-flex min-w-0 items-center gap-1 font-semibold text-[#0F172A]">
              <Phone className="h-2.5 w-2.5 shrink-0 text-[#B45309]" aria-hidden />
              <span className="truncate">+91 9032654111</span>
            </span>
            <span className="shrink-0">SECURE</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
