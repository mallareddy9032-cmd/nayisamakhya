"use client";

import Image from "next/image";
import { BadgeCheck, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/store/preferences";

export type RepresentativeCardProps = {
  name_en: string;
  name_te: string;
  designation_en: string;
  designation_te: string;
  phone: string;
  photo_url?: string | null;
  area_name: string;
  className?: string;
};

function digitsOnly(phone: string) {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.startsWith("91") && d.length >= 12) return d.slice(0, 12);
  return d || "919032654111";
}

/** Normalize designation language to Coordinator / Seva Representative only. */
export function normalizeDesignation(
  en: string,
  te: string,
): { en: string; te: string } {
  const raw = `${en} ${te}`.toLowerCase();
  if (/seva|సేవ/.test(raw) && /rep|ప్రతినిధ/.test(raw)) {
    return { en: "Seva Representative", te: "సేవా ప్రతినిధి" };
  }
  if (/seva|సేవ/.test(raw)) {
    return { en: "Seva Representative", te: "సేవా ప్రతినిధి" };
  }
  return { en: "Coordinator", te: "సమన్వయకర్త" };
}

export function RepresentativeCard({
  name_en,
  name_te,
  designation_en,
  designation_te,
  phone,
  photo_url,
  area_name,
  className,
}: RepresentativeCardProps) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const designation = normalizeDesignation(designation_en, designation_te);
  const name = te ? name_te || name_en : name_en || name_te;
  const phoneDigits = digitsOnly(phone);
  const telHref = `tel:+${phoneDigits}`;
  const waHref = `https://wa.me/${phoneDigits}`;
  const initials = (name_te || name_en || "N").trim().charAt(0);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5",
        className,
      )}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F4F2EB]">
        {photo_url ? (
          <Image
            src={photo_url}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized={/supabase\.co\//i.test(photo_url)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-telugu text-2xl font-bold text-[#C2410C]">
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
          <span className="font-telugu">అధికారిక సమన్వయకర్త</span>
          <span className="text-emerald-700/80">/</span>
          <span>Verified Coordinator</span>
        </div>

        <h3
          className={`mt-2 text-lg font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
        >
          {name}
        </h3>
        <p className={`text-sm font-medium text-[#C2410C] ${te ? "font-telugu" : ""}`}>
          {te ? designation.te : designation.en}
        </p>
        <p className={`mt-0.5 text-xs text-[#71717A] ${te ? "font-telugu" : ""}`}>
          {area_name}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={telHref}
            className={`tap inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#C2410C] px-3.5 text-sm font-semibold text-white hover:bg-[#9A3412] ${te ? "font-telugu" : ""}`}
          >
            <Phone className="h-4 w-4" aria-hidden />
            {te ? "ఇప్పుడే కాల్" : "Call Now"}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className={`tap inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-[#EBE8E0] bg-white px-3.5 text-sm font-semibold text-[#18181B] hover:border-emerald-300 hover:bg-emerald-50 ${te ? "font-telugu" : ""}`}
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" aria-hidden />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
