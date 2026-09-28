"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
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
    "నమస్కారం నాయి సమాఖ్య డెస్క్, నాకు వినతిపత్రం / సేవా సహాయం కావాలి.",
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
        <div className="mb-5 max-w-2xl">
          <p className="font-telugu text-xs font-bold tracking-wide text-[#B45309]">
            Instant Grievance Finder
          </p>
          <h2
            id="quick-grievance-heading"
            className="mt-1 font-display-te text-2xl leading-snug text-[#1E293B] md:text-3xl"
          >
            1-క్లిక్ తక్షణ వినతి
          </h2>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            జిల్లా + సమస్య ఎంచుకుని — ప్రీఫిల్డ్ వినతిపత్రం డాకెట్‌కు వెళ్లండి.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/0.05)] sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="block">
                <span className="mb-1.5 block font-telugu text-[11px] font-bold text-slate-600">
                  జిల్లా ఎంచుకోండి
                </span>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-3 py-2.5 font-telugu text-sm text-[#0F172A] outline-none transition focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20"
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
                  className="min-h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-3 py-2.5 font-telugu text-sm text-[#0F172A] outline-none transition focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20"
                >
                  {GRIEVANCES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={openDocket}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-3 font-telugu text-xs font-bold text-white shadow-xs transition hover:bg-[#92400e] sm:min-w-[11rem] sm:px-5"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                <span className="text-center leading-snug">
                  తక్షణ వినతిపత్రం డౌన్‌లోడ్ చేసుకోండి
                </span>
              </button>
            </div>
          </div>

          <a
            href={HELPLINE_WA}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between rounded-2xl border border-[#128C7E]/30 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-[0_12px_36px_rgb(15_23_42_/0.18)] transition hover:border-[#128C7E] sm:p-6"
          >
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-telugu text-[10px] font-bold text-emerald-300">
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
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-black tracking-tight sm:text-base">
                +91 9032654111
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#128C7E] px-3 py-2 font-telugu text-xs font-bold text-white">
                <MessageCircle className="h-4 w-4" aria-hidden />
                చాట్
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
