"use client";

import Link from "next/link";
import { Building2, Landmark, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminEntity } from "@/data/telanganaGeo";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";
import { useLanguageStore } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

type DistrictSummary = {
  slug: string;
  name_en: string;
  name_te: string;
};

type Props = {
  district: DistrictSummary;
  urban: AdminEntity[];
  rural: AdminEntity[];
};

function entityMetaTe(entity: AdminEntity): string {
  if (entity.type === "corporation") return "మున్సిపల్ కార్పొరేషన్";
  if (entity.type === "municipality") return "పురపాలక సంఘం";
  return "మండలం";
}

function entityMetaEn(entity: AdminEntity): string {
  if (entity.type === "corporation") return "Municipal Corporation";
  if (entity.type === "municipality") return "Municipality";
  return "Rural Mandal";
}

export function DistrictDirectoryClient({ district, urban, rural }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const cleanUrban = useMemo(
    () => urban.filter((item) => isUsablePlaceSlug(item.slug)),
    [urban],
  );
  const cleanRural = useMemo(
    () => rural.filter((item) => isUsablePlaceSlug(item.slug)),
    [rural],
  );
  const [tab, setTab] = useState<"urban" | "rural">(
    cleanUrban.length > 0 ? "urban" : "rural",
  );
  const [query, setQuery] = useState("");

  const items = tab === "urban" ? cleanUrban : cleanRural;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const raw = query.trim();
    return items.filter(
      (item) =>
        item.nameEn.toLowerCase().includes(q) ||
        item.nameTe.includes(raw) ||
        item.slug.includes(q),
    );
  }, [items, query]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A]">
      <section className="border-b border-[#E8E4DC] bg-gradient-to-b from-[#FFF8EF] to-[#FBFBFA]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B45309]">
            {te ? "జిల్లా డైరెక్టరీ" : "District directory"}
          </p>
          <h1
            className={`mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl ${te ? "font-telugu" : ""}`}
          >
            {te ? district.name_te : district.name_en}
          </h1>
          <p
            className={`mt-2 max-w-2xl text-sm text-slate-600 ${te ? "font-telugu" : ""}`}
          >
            {te
              ? "పట్టణ కేంద్రాలు & గ్రామీణ మండలాలు — ఒకే డైరెక్టరీలో."
              : "Urban centers and rural mandals in one civic directory."}
          </p>

          <div
            role="tablist"
            aria-label={te ? "డైరెక్టరీ ట్యాబ్‌లు" : "Directory tabs"}
            className="mt-5 inline-flex max-w-full flex-wrap rounded-xl border border-[#E8E4DC] bg-white p-1 shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "urban"}
              onClick={() => setTab("urban")}
              className={cn(
                "tap inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                tab === "urban"
                  ? "bg-[#B45309] text-white"
                  : "bg-transparent text-[#0F172A] hover:bg-[#FFF8EF]",
              )}
            >
              <Building2 className="h-4 w-4" aria-hidden />
              <span className={te ? "font-telugu" : ""}>
                {te
                  ? "పట్టణ కేంద్రాలు (Towns & Municipalities)"
                  : "పట్టణ కేంద్రాలు (Towns & Municipalities)"}{" "}
                ({cleanUrban.length})
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "rural"}
              onClick={() => setTab("rural")}
              className={cn(
                "tap inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                tab === "rural"
                  ? "bg-[#B45309] text-white"
                  : "bg-transparent text-[#0F172A] hover:bg-[#FFF8EF]",
              )}
            >
              <Landmark className="h-4 w-4" aria-hidden />
              <span className={te ? "font-telugu" : ""}>
                {te
                  ? "గ్రామీణ మండలాలు (Rural Mandals)"
                  : "గ్రామీణ మండలాలు (Rural Mandals)"}{" "}
                ({cleanRural.length})
              </span>
            </button>
          </div>

          <label className="relative mt-4 block max-w-md">
            <span className="sr-only">{te ? "వెతకండి" : "Search"}</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
              className={`tap w-full rounded-xl border border-[#E8E4DC] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#B45309]/50 focus:outline-none ${te ? "font-telugu" : ""}`}
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {filtered.length === 0 ? (
          <p
            className={`rounded-2xl border border-dashed border-[#E8E4DC] bg-white p-8 text-center text-sm text-slate-500 ${te ? "font-telugu" : ""}`}
          >
            {te ? "ఫలితాలు లేవు." : "No matching results."}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entity) => {
              const href = `/${district.slug}/${entity.slug}`;
              return (
                <li key={`${entity.type}-${entity.slug}`}>
                  <Link
                    href={href}
                    className="tap block h-full rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm transition-colors hover:border-[#B45309]/40 hover:bg-[#FFF8EF]"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      {entity.type === "rural-mandal" ? "rural" : "urban"} ·{" "}
                      {entity.slug}
                    </p>
                    <h2
                      className={`mt-2 text-lg font-semibold text-[#0F172A] ${te ? "font-telugu" : ""}`}
                    >
                      {entity.nameTe && entity.nameEn && entity.nameTe !== entity.nameEn
                        ? `${entity.nameTe} (${entity.nameEn})`
                        : entity.nameTe || entity.nameEn}
                    </h2>
                    <p
                      className={`mt-1 text-xs text-slate-500 ${te ? "font-telugu" : ""}`}
                    >
                      {te ? entityMetaTe(entity) : entityMetaEn(entity)}
                      {" · "}
                      {entity.subUnitsCount}{" "}
                      {te
                        ? entity.subUnitsLabelTe
                        : entity.type === "rural-mandal"
                          ? "Panchayats"
                          : "Wards"}
                    </p>
                    <span
                      className={`mt-4 inline-flex text-sm font-semibold text-[#B45309] ${te ? "font-telugu" : ""}`}
                    >
                      {te ? "తెరవండి →" : "Open →"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
