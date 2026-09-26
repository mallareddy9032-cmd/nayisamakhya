"use client";

import Image from "next/image";
import { BadgeCheck, Phone, X } from "lucide-react";
import { useState } from "react";
import type { EstablishmentListing } from "@/lib/data/establishments";
import { useLanguageStore } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

type Props = {
  establishments: EstablishmentListing[];
  className?: string;
  telegramHandle?: string;
};

function digitsOnly(phone: string) {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.startsWith("91") && d.length >= 12) return d.slice(0, 12);
  return d;
}

const EMPTY_TE =
  "ఈ ప్రాంతంలో షాపుల నమోదు ప్రక్రియ కొనసాగుతోంది. మీ షాపును నమోదు చేయడానికి టెలిగ్రామ్ ద్వారా ఫోటో పంపండి";

export function EstablishmentDirectory({
  establishments,
  className,
  telegramHandle = "NayiSamakhyaDeskBot",
}: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const [lightbox, setLightbox] = useState<EstablishmentListing | null>(null);

  if (establishments.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-[#EBE8E0] bg-white p-6 text-sm leading-relaxed text-[#71717A]",
          te ? "font-telugu" : "",
          className,
        )}
      >
        <p>
          {EMPTY_TE}{" "}
          <span className="text-[#18181B]">
            (Registration in progress. Send photos via Telegram to get listed.)
          </span>
        </p>
        <a
          href={`https://t.me/${telegramHandle}`}
          target="_blank"
          rel="noreferrer"
          className="tap mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#229ED9] px-4 text-sm font-semibold text-white hover:bg-[#1B8BC0]"
        >
          @{telegramHandle}
        </a>
      </div>
    );
  }

  return (
    <>
      <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
        {establishments.map((est) => {
          const name = te ? est.name_te || est.name_en : est.name_en || est.name_te;
          const owner = te
            ? est.owner_te || est.owner_en
            : est.owner_en || est.owner_te;
          const area = te ? est.area_te || est.area_en : est.area_en || est.area_te;
          const phoneDigits = est.phone ? digitsOnly(est.phone) : "";

          return (
            <li
              key={est.id}
              className="overflow-hidden rounded-2xl border border-[#EBE8E0] bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => est.photo_url && setLightbox(est)}
                className="relative block h-40 w-full bg-[#F4F2EB] text-left"
                aria-label={
                  te
                    ? `${name} ఫోటో`
                    : `${name} photo`
                }
              >
                {est.photo_url ? (
                  <Image
                    src={est.photo_url}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                    unoptimized={/supabase\.co\//i.test(est.photo_url)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#A1A1AA]">
                    {te
                      ? "ఫోటో లేదు"
                      : "No photo"}
                  </div>
                )}
              </button>

              <div className="space-y-2 p-4">
                {est.verified !== false ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    <BadgeCheck
                      className="h-3.5 w-3.5 text-emerald-600"
                      aria-hidden
                    />
                    <span className="font-telugu">
                      {"ధృవీకృత కమ్యూనిటీ సంస్థ"}
                    </span>
                    <span>/</span>
                    <span>Verified Community Establishment</span>
                  </div>
                ) : null}

                <h3
                  className={`text-base font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}
                >
                  {name}
                </h3>
                {owner ? (
                  <p
                    className={`text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
                  >
                    {te
                      ? `యజమాని: ${owner}`
                      : `Owner: ${owner}`}
                  </p>
                ) : null}
                <p
                  className={`text-xs text-[#71717A] ${te ? "font-telugu" : ""}`}
                >
                  {area}
                </p>

                {phoneDigits ? (
                  <a
                    href={`tel:+${phoneDigits}`}
                    className={`tap inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#C2410C] px-3.5 text-sm font-semibold text-white hover:bg-[#9A3412] ${te ? "font-telugu" : ""}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {te
                      ? "ఇప్పుడే కాల్"
                      : "Call"}
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {lightbox?.photo_url ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={
            te
              ? "ఫోటో ప్రివ్యూ"
              : "Photo preview"
          }
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#18181B]"
            onClick={() => setLightbox(null)}
            aria-label={
              te ? "మూసివేయి" : "Close"
            }
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative h-[70vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.photo_url}
              alt={te ? lightbox.name_te : lightbox.name_en}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={/supabase\.co\//i.test(lightbox.photo_url)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
