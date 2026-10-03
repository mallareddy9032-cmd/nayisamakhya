"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, MessageCircle, Phone } from "lucide-react";
import { SECTION_EYEBROWS } from "@/components/home/SectionHeading";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";

const GRIEVANCES = [
  { id: "go23_free_power", label: "G.O. 23 విద్యుత్ బిల్లు" },
  { id: "modern_salon_space", label: "మున్సిపల్ షాప్ కేటాయింపు" },
  { id: "trade_license_fee", label: "లైసెన్స్ ఫీజు మినహాయింపు" },
  { id: "community_welfare_funds", label: "కార్పొరేషన్ లోన్ / సంక్షేమ నిధులు" },
] as const;

const HELPLINE_WA =
  "https://wa.me/919032654111?text=" +
  encodeURIComponent(
    "నమస్కారం నాయీ సమాఖ్య డెస్క్, నాకు వినతిపత్రం / సేవా సహాయం కావాలి.",
  );

export function QuickGrievanceWidget() {
  const router = useRouter();
  const [district, setDistrict] = useState("suryapet");
  const [subject, setSubject] = useState<string>(GRIEVANCES[0].id);

  const districts = useMemo(
    () =>
      [...TELANGANA_DISTRICTS].sort((a, b) =>
        a.name_te.localeCompare(b.name_te, "te"),
      ),
    [],
  );

  const openDocket = () => {
    const params = new URLSearchParams({
      dist: district,
      subject,
    });
    router.push(`/representation?${params.toString()}`);
  };

  return (
    <section
      className="border-b border-civic-border bg-[#FBFBFA] px-4 py-10 sm:py-12"
      aria-labelledby="quick-grievance-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 max-w-3xl">
          <span className="civic-eyebrow-pill">
            {SECTION_EYEBROWS.oneClickDesk}
          </span>
          <h2
            id="quick-grievance-heading"
            className="mt-3 font-display-te text-2xl font-normal leading-telugu text-[#1E293B] md:text-3xl"
          >
            తక్షణ ప్రజా వినతి డెస్క్
          </h2>
          <p className="mt-1.5 font-sans text-sm font-medium tracking-wide text-slate-500">
            District + issue → prefilled petition docket
          </p>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            జిల్లా + సమస్య ఎంచుకుని — ప్రీఫిల్డ్ వినతిపత్రం డాకెట్‌కు వెళ్లండి, లేదా
            WhatsApp హెల్ప్‌లైన్‌కు నేరుగా చాట్ చేయండి.
          </p>
        </div>

        {/* Unified citizen redressal card */}
        <div className="overflow-hidden rounded-2xl border border-[#EAD7B5] bg-gradient-to-br from-[#FFFDF9] via-white to-[#FBF7ED] shadow-[0_12px_40px_rgb(15_23_42_/0.06)]">
          <div className="grid lg:grid-cols-[1.55fr_1fr]">
            <div className="border-b border-[#EAD7B5] p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B45309] to-[#92400e] text-white">
                  <Download className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div>
                  <p className="font-telugu text-sm font-bold text-[#1E293B]">
                    వినతి ఫారం
                  </p>
                  <p className="font-sans text-[10px] font-medium text-slate-500">
                    Prefill & open docket
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-telugu text-[11px] font-bold text-slate-600">
                    జిల్లా ఎంచుకోండి
                  </span>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="min-h-12 w-full rounded-xl border border-[#EAD7B5] bg-white px-3 py-2.5 font-telugu text-sm text-[#0F172A] outline-none transition focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20"
                  >
                    {districts.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name_te}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block font-telugu text-[11px] font-bold text-slate-600">
                    సమస్య / పథకం
                  </span>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="min-h-12 w-full rounded-xl border border-[#EAD7B5] bg-white px-3 py-2.5 font-telugu text-sm text-[#0F172A] outline-none transition focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20"
                  >
                    {GRIEVANCES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="button"
                onClick={openDocket}
                className="civic-focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#92400e] px-5 py-3 font-telugu text-xs font-bold text-white shadow-[0_6px_18px_rgb(180_83_9_/0.28)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_28px_rgb(180_83_9_/0.4)] active:scale-[0.99]"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                <span className="text-center leading-snug">
                  తక్షణ వినతిపత్రం డౌన్‌లోడ్ చేసుకోండి
                </span>
              </button>
            </div>

            <a
              href={HELPLINE_WA}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-5 text-white transition-all duration-300 hover:from-[#243044] hover:to-[#152033] sm:p-6"
            >
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-telugu text-[10px] font-bold text-[#FBBF24]">
                  <span className="live-pulse-dot scale-90" aria-hidden />
                  24/7 సహాయవాణి
                </p>
                <h3 className="mt-3 font-telugu text-base font-bold leading-snug">
                  WhatsApp హెల్ప్‌లైన్
                </h3>
                <p className="mt-1.5 font-telugu text-xs leading-relaxed text-slate-300">
                  డెస్క్‌కు నేరుగా చాట్ — వినతి / కార్డు / ఫీల్డ్ ఫోటో సహాయం.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 font-sans text-sm font-black tracking-tight sm:text-base">
                  <Phone className="h-3.5 w-3.5 text-[#FBBF24]" aria-hidden />
                  +91 9032654111
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#92400e] px-3 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all group-hover:brightness-110">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  చాట్
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
