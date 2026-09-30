"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { DistrictInfo } from "@/data/telanganaGeo";

type Props = {
  districts: DistrictInfo[];
};

export function DistrictsDirectoryClient({ districts }: Props) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const filtered = useMemo(() => {
    const sorted = [...districts].sort((a, b) =>
      a.nameTe.localeCompare(b.nameTe, "te"),
    );
    const raw = deferred.trim();
    if (!raw) return sorted;
    const q = raw.toLowerCase();
    return sorted.filter(
      (d) =>
        d.slug.includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.nameTe.includes(raw) ||
        d.headquarters.toLowerCase().includes(q) ||
        d.zone.toLowerCase().includes(q) ||
        d.mandals.some(
          (m) =>
            m.slug.includes(q) ||
            m.nameEn.toLowerCase().includes(q) ||
            m.nameTe.includes(raw),
        ),
    );
  }, [districts, deferred]);

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-2xl">
        <label htmlFor="district-search" className="sr-only">
          జిల్లా లేదా మండలం వెతకండి
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B45309]"
          aria-hidden
        />
        <input
          id="district-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="జిల్లా / మండలం / పట్టణం వెతకండి"
          className="civic-focus-ring w-full rounded-2xl border border-[#EAD7B5] bg-white py-3.5 pl-11 pr-4 font-telugu text-sm text-[#0F172A] shadow-sm placeholder:text-slate-400"
          autoComplete="off"
        />
        <p className="mt-2 text-center font-sans text-[11px] text-slate-500">
          {filtered.length} జిల్లాలు కనిపిస్తున్నాయి
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center font-telugu text-sm text-slate-500">
          సరిపోలిక లేదు — మరో పేరు ప్రయత్నించండి.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dist) => (
            <Link
              key={dist.slug}
              href={`/districts/${dist.slug}`}
              className="civic-focus-ring group block rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#B45309] hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="min-w-0 pr-3">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    {dist.zone}
                  </span>
                  <h2 className="font-display-te mt-2 text-xl font-normal leading-snug text-[#0F172A] transition-colors group-hover:text-[#B45309]">
                    {dist.nameTe}
                  </h2>
                  <p className="font-sans mt-0.5 text-sm text-slate-500">
                    {dist.nameEn}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FDE68A] bg-[#FEF3C7]/50 font-sans text-sm font-bold tabular-nums text-[#B45309]">
                  {dist.mandals.length}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 font-telugu text-xs text-slate-500">
                <span>కేంద్రం: {dist.headquarters}</span>
                <span className="flex items-center gap-1 font-medium text-[#B45309] transition-transform group-hover:translate-x-0.5">
                  మండలాలు చూడండి →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
