"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Landmark,
  MapPin,
  Search,
} from "lucide-react";
import {
  searchTelanganaGeo,
  type DistrictInfo,
  type GeoSearchHit,
} from "@/data/telanganaGeo";

type Props = {
  districts: DistrictInfo[];
  totalMandals: number;
  totalTowns: number;
};

function HitRow({ hit }: { hit: GeoSearchHit }) {
  const kindLabel =
    hit.kind === "district"
      ? "జిల్లా"
      : hit.kind === "mandal"
        ? "మండలం"
        : "పట్టణం";

  return (
    <Link
      href={hit.href}
      className="civic-focus-ring flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[#EAD7B5]/80 bg-white px-3 py-2.5 transition hover:border-[#B45309]/50 hover:bg-[#FFFDF9]"
    >
      <span className="min-w-0">
        <span className="font-telugu block truncate text-sm font-semibold text-[#0F172A]">
          {hit.labelTe}
        </span>
        <span className="font-sans block truncate text-[11px] text-slate-500">
          {hit.labelEn}
        </span>
      </span>
      <span className="shrink-0 rounded-full border border-[#FDE68A] bg-[#FEF3C7]/70 px-2 py-0.5 font-telugu text-[10px] font-semibold text-[#B45309]">
        {kindLabel}
      </span>
    </Link>
  );
}

export function DistrictsSearchHub({
  districts,
  totalMandals,
  totalTowns,
}: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const sorted = useMemo(
    () =>
      [...districts].sort((a, b) => a.nameTe.localeCompare(b.nameTe, "te")),
    [districts],
  );

  const hits = useMemo(
    () => searchTelanganaGeo(deferredQuery, 36),
    [deferredQuery],
  );

  const searching = deferredQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      <div className="relative">
        <label htmlFor="geo-search" className="sr-only">
          జిల్లా, మండలం లేదా పట్టణం వెతకండి
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B45309]"
          aria-hidden
        />
        <input
          id="geo-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="జిల్లా / మండలం / పట్టణం వెతకండి — Search district, mandal, or town"
          className="civic-focus-ring w-full rounded-2xl border border-[#EAD7B5] bg-white py-3.5 pl-11 pr-4 font-telugu text-sm text-[#0F172A] shadow-sm placeholder:text-slate-400"
          autoComplete="off"
        />
        <p className="mt-2 font-sans text-[11px] text-slate-500">
          {districts.length} districts · {totalMandals} mandals · {totalTowns}{" "}
          urban desks indexed
        </p>
      </div>

      {searching ? (
        <section aria-live="polite">
          <h2 className="font-telugu mb-3 text-sm font-bold text-[#1E293B]">
            ఫలితాలు ({hits.length})
          </h2>
          {hits.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center font-telugu text-sm text-slate-500">
              సరిపోలిక లేదు — మరో పేరు ప్రయత్నించండి.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {hits.map((hit) => (
                <li key={`${hit.kind}-${hit.href}-${hit.labelEn}`}>
                  <HitRow hit={hit} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section aria-labelledby="district-grid-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <h2
              id="district-grid-heading"
              className="font-display-te text-xl font-normal text-[#0F172A] md:text-2xl"
            >
              33 జిల్లా సేవా కార్డులు
            </h2>
            <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-500">
              Statewide district desks
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((d) => {
              const urbanCount = d.mandals.filter(
                (m) => m.type !== "mandal",
              ).length;
              return (
                <li key={d.slug}>
                  <Link
                    href={`/districts/${d.slug}`}
                    className="civic-focus-ring group flex h-full flex-col rounded-2xl border border-[#EAD7B5]/90 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] p-4 shadow-sm transition hover:border-[#B45309]/45 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-lg border border-[#B45309]/20 bg-white/80 p-2 text-[#B45309]">
                        <Landmark className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="rounded-full border border-[#FDE68A] bg-[#FEF3C7]/80 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                        {d.mandals.length} mandals
                      </span>
                    </div>
                    <h3 className="font-display-te mt-3 text-lg font-normal leading-snug text-[#0F172A]">
                      {d.nameTe}
                    </h3>
                    <p className="font-sans mt-0.5 text-xs font-medium text-slate-500">
                      {d.nameEn} · {d.zone}
                    </p>
                    <p className="font-telugu mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
                      <MapPin
                        className="h-3.5 w-3.5 text-[#B45309]"
                        aria-hidden
                      />
                      HQ: {d.headquarters}
                    </p>
                    <p className="font-telugu mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Building2
                        className="h-3.5 w-3.5 text-slate-400"
                        aria-hidden
                      />
                      {urbanCount} పట్టణ / మున్సిపాలిటీ
                    </p>
                    <span className="font-telugu mt-4 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#B45309] group-hover:gap-2">
                      జిల్లా డెస్క్ తెరవండి
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
