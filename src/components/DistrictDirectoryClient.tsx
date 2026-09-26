"use client";

import Link from "next/link";
import { Building2, Landmark, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { DirectoryLink, DistrictSummary } from "@/lib/data/urbanRepository";
import { useLanguageStore } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

type Props = {
  district: DistrictSummary;
  urban: DirectoryLink[];
  rural: DirectoryLink[];
};

export function DistrictDirectoryClient({ district, urban, rural }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const [tab, setTab] = useState<"urban" | "rural">(
    urban.length > 0 ? "urban" : "rural",
  );
  const [query, setQuery] = useState("");

  const items = tab === "urban" ? urban : rural;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const raw = query.trim();
    return items.filter(
      (item) =>
        item.name_en.toLowerCase().includes(q) ||
        item.name_te.includes(raw) ||
        item.slug.includes(q),
    );
  }, [items, query]);

  return (
    <div className="min-h-screen bg-[#FBFBF9]">
      <section className="border-b border-[#EBE8E0] bg-gradient-to-b from-[#FFF7ED] to-[#FBFBF9]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
            {te ? "జిల్లా డైరెక్టరీ" : "District directory"}
          </p>
          <h1
            className={`mt-2 text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl ${te ? "font-telugu" : ""}`}
          >
            {te ? district.name_te : district.name_en}
          </h1>
          <p
            className={`mt-2 max-w-2xl text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
          >
            {te
              ? "పట్టణ కేంద్రాలు & గ్రామీణ మండలాలు — ఒకే డైరెక్టరీలో."
              : "Urban centers and rural mandals in one high-contrast civic directory."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("urban")}
              className={cn(
                "tap inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold",
                tab === "urban"
                  ? "border-[#C2410C] bg-[#C2410C] text-white"
                  : "border-[#EBE8E0] bg-white text-[#18181B]",
              )}
            >
              <Building2 className="h-4 w-4" aria-hidden />
              {te ? "పట్టణ కేంద్రాలు" : "Urban Centers"} ({urban.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("rural")}
              className={cn(
                "tap inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold",
                tab === "rural"
                  ? "border-[#C2410C] bg-[#C2410C] text-white"
                  : "border-[#EBE8E0] bg-white text-[#18181B]",
              )}
            >
              <Landmark className="h-4 w-4" aria-hidden />
              {te ? "గ్రామీణ మండలాలు" : "Rural Mandals"} ({rural.length})
            </button>
          </div>

          <label className="relative mt-4 block max-w-md">
            <span className="sr-only">{te ? "వెతకండి" : "Search"}</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                te
                  ? tab === "urban"
                    ? "మున్సిపాలిటీ / కార్పొరేషన్ వెతకండి…"
                    : "మండలం వెతకండి…"
                  : tab === "urban"
                    ? "Search municipality / corporation…"
                    : "Search mandal…"
              }
              className={`tap w-full rounded-full border border-[#EBE8E0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#C2410C]/40 focus:outline-none ${te ? "font-telugu" : ""}`}
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {filtered.length === 0 ? (
          <p
            className={`rounded-2xl border border-dashed border-[#EBE8E0] bg-white p-8 text-center text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
          >
            {te ? "ఫలితాలు లేవు." : "No matching results."}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <li key={`${item.kind}-${item.slug}`}>
                <Link
                  href={item.href}
                  className="tap block h-full rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm transition-colors hover:border-[#C2410C]/35 hover:bg-[#FFF7ED]"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#A1A1AA]">
                    {item.kind === "urban" ? "urban" : "mandal"} · {item.slug}
                  </p>
                  <h2
                    className={`mt-2 text-lg font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}
                  >
                    {te ? item.name_te : item.name_en}
                  </h2>
                  <p className={`mt-1 text-xs text-[#71717A] ${te ? "font-telugu" : ""}`}>
                    {te ? item.meta_te : item.meta_en}
                  </p>
                  <span
                    className={`mt-4 inline-flex text-sm font-semibold text-[#C2410C] ${te ? "font-telugu" : ""}`}
                  >
                    {te ? "తెరవండి →" : "Open →"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
