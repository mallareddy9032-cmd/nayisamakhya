"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useMandalPrefStore } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

type District = {
  id: string;
  slug: string;
  name_en: string;
  name_te: string;
};

type MandalRow = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
};

type Props = {
  variant?: "compact" | "hero";
  /** Where Go navigates — portal hub or survey wizard */
  target?: "portal" | "survey";
  className?: string;
};

const selectBase =
  "min-h-[44px] rounded-full border border-[#EBE8E0] bg-white text-[#18181B] focus:border-[#C2410C]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export function MandalSelector({
  variant = "compact",
  target = "portal",
  className,
}: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const te = language === "te";
  const setMandalPref = useMandalPrefStore((s) => s.setMandal);
  const prefDistrict = useMandalPrefStore((s) => s.districtSlug);
  const prefMandal = useMandalPrefStore((s) => s.mandalSlug);

  const [districts, setDistricts] = useState<District[]>([]);
  const [mandals, setMandals] = useState<MandalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtId, setDistrictId] = useState("");
  const [mandalSlug, setMandalSlug] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/locations", { signal: ac.signal });
        if (!res.ok) throw new Error(`locations ${res.status}`);
        const data = (await res.json()) as {
          districts?: District[];
          mandals?: MandalRow[];
        };
        if (ac.signal.aborted) return;
        const d = data.districts || [];
        const m = data.mandals || [];
        setDistricts(d);
        setMandals(m);

        // Restore persisted preference when it still exists in the payload
        const prefD = d.find((x) => x.slug === prefDistrict);
        if (prefD) {
          setDistrictId(prefD.id);
          const inDistrict = m.filter((x) => x.district_id === prefD.id);
          const prefM = inDistrict.find((x) => x.slug === prefMandal);
          setMandalSlug(prefM?.slug || "");
        }
      } catch {
        if (ac.signal.aborted) return;
        // leave empty — UI stays disabled
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [prefDistrict, prefMandal]);

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.id === districtId),
    [districts, districtId],
  );

  const filteredMandals = useMemo(() => {
    if (!districtId) return [];
    return mandals.filter((m) => m.district_id === districtId);
  }, [mandals, districtId]);

  function onDistrictChange(nextId: string) {
    setDistrictId(nextId);
    const first = mandals.find((m) => m.district_id === nextId);
    setMandalSlug(first?.slug || "");
  }

  function go() {
    if (!selectedDistrict || !mandalSlug) return;
    setMandalPref(selectedDistrict.slug, mandalSlug);
    const path =
      target === "survey"
        ? `/${selectedDistrict.slug}/${mandalSlug}/survey`
        : `/${selectedDistrict.slug}/${mandalSlug}`;
    router.push(path);
  }

  const canGo = Boolean(selectedDistrict && mandalSlug) && !loading;

  const label = (row: { name_te: string; name_en: string }) =>
    te ? `${row.name_te}` : row.name_en;

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#EBE8E0] bg-[#FBFBF9] p-4",
          className,
        )}
      >
        <p className={`mb-3 text-sm font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}>
          {te
            ? "మీ మండల సర్వేకు వెళ్లండి"
            : "Jump to your mandal survey"}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <select
            aria-label={te ? "జిల్లా" : "District"}
            value={districtId}
            disabled={loading || districts.length === 0}
            onChange={(e) => onDistrictChange(e.target.value)}
            className={cn(selectBase, "flex-1 px-4 py-2.5 text-sm", te && "font-telugu")}
          >
            <option value="">జిల్లాను ఎంచుకోండి / Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {label(d)}
              </option>
            ))}
          </select>

          <select
            aria-label={te ? "మండలం" : "Mandal"}
            value={mandalSlug}
            disabled={!districtId || filteredMandals.length === 0}
            onChange={(e) => setMandalSlug(e.target.value)}
            className={cn(selectBase, "flex-1 px-4 py-2.5 text-sm", te && "font-telugu")}
          >
            <option value="">మండలాన్ని ఎంచుకోండి / Select Mandal</option>
            {filteredMandals.map((m) => (
              <option key={m.id} value={m.slug}>
                {label(m)}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!canGo}
            onClick={go}
            className="tap inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C2410C] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-40"
          >
            వెళ్లు / Go →
          </button>
        </div>
      </div>
    );
  }

  // compact — navbar
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <select
        aria-label={te ? "జిల్లా" : "District"}
        value={districtId}
        disabled={loading || districts.length === 0}
        onChange={(e) => onDistrictChange(e.target.value)}
        className={cn(
          selectBase,
          "h-9 max-w-[8.5rem] rounded-lg px-2 text-[11px]",
          te && "font-telugu",
        )}
      >
        <option value="">జిల్లాను ఎంచుకోండి / Select District</option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {label(d)}
          </option>
        ))}
      </select>

      <select
        aria-label={te ? "మండలం" : "Mandal"}
        value={mandalSlug}
        disabled={!districtId || filteredMandals.length === 0}
        onChange={(e) => setMandalSlug(e.target.value)}
        className={cn(
          selectBase,
          "h-9 max-w-[8.5rem] rounded-lg px-2 text-[11px]",
          te && "font-telugu",
        )}
      >
        <option value="">మండలాన్ని ఎంచుకోండి / Select Mandal</option>
        {filteredMandals.map((m) => (
          <option key={m.id} value={m.slug}>
            {label(m)}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!canGo}
        onClick={go}
        className="tap inline-flex h-9 items-center justify-center rounded-full bg-[#C2410C] px-3 text-[11px] font-semibold text-white hover:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-40"
      >
        వెళ్లు / Go →
      </button>
    </div>
  );
}
