"use client";

import Image from "next/image";
import Link from "next/link";
import { IdCard, MapPin, Phone, ShieldCheck } from "lucide-react";

export function HeroArtisanShowcase() {
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

      {/* Ceremonial double-gold bezel portrait */}
      <div className="relative z-[1] mx-auto h-40 w-40 sm:h-56 sm:w-56">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 0 3px #FBFBFA, 0 0 0 5px #B45309, 0 0 0 9px rgb(180 83 9 / 0.25), 0 18px 40px rgb(15 23 42 / 0.18)",
          }}
          aria-hidden
        />
        <div
          className="relative h-full w-full overflow-hidden rounded-full bg-[#1E293B]"
          style={{ border: "2px solid #B45309" }}
        >
          <Image
            src="/home/artisan-craftsman-portrait.png"
            alt="నాయి వృత్తిదారుని గౌరవ చిత్రం — Traditional artisan craftsman"
            width={640}
            height={640}
            priority
            className="h-full w-full max-w-full object-cover"
            sizes="(max-width: 640px) 160px, 224px"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B45309]/30 bg-white px-3 py-1 shadow-md">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#B45309]" aria-hidden />
          <span className="font-telugu text-[10px] font-bold text-[#1E293B]">
            BC-A · వృత్తి గౌరవం
          </span>
        </div>
      </div>

      {/* Coordinator card — overlaps portrait, no phone clip */}
      <div className="relative z-10 mx-auto mt-[-24px] w-auto max-w-[280px]">
        <Link
          href="/coordinator-card"
          className="block rounded-xl border border-[#E2E8F0] bg-white p-3 text-xs shadow-lg ring-1 ring-[#B45309]/20"
          aria-label="సమన్వయకర్త డిజిటల్ కార్డు ప్రివ్యూ"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-[#B45309]" aria-hidden />
          <div className="flex items-start justify-between gap-2 pt-0.5">
            <div className="min-w-0">
              <p className="flex items-center gap-1 font-telugu text-[10px] font-bold text-[#B45309]">
                <IdCard className="h-3 w-3 shrink-0" aria-hidden />
                నాయి సమాఖ్య
              </p>
              <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                Coordinator Desk
              </p>
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
