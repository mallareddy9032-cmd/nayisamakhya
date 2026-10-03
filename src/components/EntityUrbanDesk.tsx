"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Landmark, Search, Zap } from "lucide-react";
import type { AdminEntity } from "@/data/telanganaGeo";
import type { UrbanPortal } from "@/lib/data/urbanRepository";
import { toEstablishmentListings } from "@/lib/data/establishments";
import { EstablishmentDirectory } from "@/components/EstablishmentDirectory";
import { RepresentativeCard } from "@/components/RepresentativeCard";
import { TelegramQRCard } from "@/components/TelegramQRCard";
import { useLanguageStore } from "@/lib/store/preferences";

type Props = {
  entity: AdminEntity;
  portal?: UrbanPortal | null;
};

function representationHref(
  type: "municipal_trade" | "municipal_lease" | "power_subsidy_urban",
  entity: AdminEntity,
): string {
  const q = new URLSearchParams({
    type,
    district: entity.districtSlug,
    dist: entity.districtSlug,
    town: entity.nameTe,
    townSlug: entity.slug,
    townEn: entity.nameEn,
  });
  return `/representation?${q.toString()}`;
}

export function EntityUrbanDesk({ entity, portal }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const areaName = te ? entity.nameTe : entity.nameEn;
  const representatives = portal?.representatives ?? [];
  const establishments = portal?.establishments ?? [];
  const establishmentListings = toEstablishmentListings(establishments, {
    en: entity.nameEn,
    te: entity.nameTe,
  });
  const [wardQuery, setWardQuery] = useState("");

  const filteredWards = useMemo(() => {
    const q = wardQuery.trim().toLowerCase();
    if (!q) return entity.subUnitsList;
    const raw = wardQuery.trim();
    return entity.subUnitsList.filter(
      (ward) =>
        ward.nameEn.toLowerCase().includes(q) ||
        ward.nameTe.includes(raw) ||
        String(ward.id).toLowerCase().includes(q),
    );
  }, [entity.subUnitsList, wardQuery]);

  const dockets = [
    {
      id: "municipal_trade" as const,
      icon: FileText,
      titleTe: "ట్రేడ్ లైసెన్స్ / వృత్తి అనుమతి",
      titleEn: "Trade licence / professional permit",
      citeTe: "తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 — సెక్షన్లు 118 & 120",
      citeEn: "Telangana Municipalities Act 2019 — Sections 118 & 120",
    },
    {
      id: "municipal_lease" as const,
      icon: Landmark,
      titleTe: "మున్సిపల్ లీజు / స్థల కేటాయింపు",
      titleEn: "Municipal lease / site allotment",
      citeTe: "తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 — సెక్షన్ 54",
      citeEn: "Telangana Municipalities Act 2019 — Section 54",
    },
    {
      id: "power_subsidy_urban" as const,
      icon: Zap,
      titleTe: "విద్యుత్ సబ్సిడీ (పట్టణ)",
      titleEn: "Urban power subsidy",
      citeTe: "జి.ఓ. Ms. No. 23 — ఉచిత 250 యూనిట్లు",
      citeEn: "G.O. Ms. No. 23 — Free 250 units",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBFBFA] pb-nav-clear text-[#0F172A]">
      <section className="border-b border-[#E8E4DC] bg-gradient-to-b from-[#FFF8EF] to-[#FBFBFA]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/${entity.districtSlug}`}
            className={`inline-flex min-h-12 items-center text-xs text-slate-500 hover:text-[#B45309] ${te ? "font-telugu" : ""}`}
          >
            {te
              ? `← ${entity.districtNameTe} డైరెక్టరీ`
              : `← ${entity.districtNameEn} directory`}
          </Link>

          <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-[#EAD7B5] bg-[#FEF3C7] px-3 py-1 text-[11px] font-semibold text-[#B45309]">
            <span className="font-telugu">పురపాలక సంఘం</span>
            <span aria-hidden>•</span>
            <span className="font-sans uppercase tracking-wide">
              URBAN CIVIC & STATUTORY DESK
            </span>
          </div>

          <h1
            className={`mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl ${te ? "font-telugu" : ""}`}
          >
            {entity.nameTe} ({entity.nameEn})
          </h1>
          <p
            className={`mt-2 max-w-3xl text-sm text-slate-600 ${te ? "font-telugu" : ""}`}
          >
            తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 &amp; జీ.ఓ. 23 చట్టబద్ధ సేవా వేదిక
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            {entity.districtSlug}/{entity.slug} · {entity.headOfficeTe}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <div className="space-y-8">
          <section>
            <h2 className="font-telugu text-xl font-bold text-[#0F172A]">
              చట్టబద్ధ వినతి డాకెట్లు
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Three statutory action dockets → Municipal Commissioner desk
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dockets.map((d) => (
                <Link
                  key={d.id}
                  href={representationHref(d.id, entity)}
                  className="civic-focus-ring flex min-h-12 flex-col gap-2 rounded-2xl border border-[#EAD7B5] bg-white p-4 shadow-sm transition hover:border-[#B45309]/40 hover:shadow-md"
                >
                  <d.icon className="h-5 w-5 text-[#B45309]" aria-hidden />
                  <span className="font-telugu text-sm font-bold text-[#0F172A]">
                    {te ? d.titleTe : d.titleEn}
                  </span>
                  <span className="font-telugu text-[11px] leading-snug text-slate-500">
                    {te ? d.citeTe : d.citeEn}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="sticky top-[52px] z-20 -mx-4 border-b border-[#E8E4DC] bg-[#FBFBFA]/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-telugu text-xl font-bold text-[#0F172A]">
                    వార్డ్ ఎక్స్‌ప్లోరర్
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    WARD EXPLORER · {entity.subUnitsCount}{" "}
                    {entity.subUnitsLabelTe}
                  </p>
                </div>
                <label className="relative w-full sm:w-80">
                  <span className="sr-only">
                    {te ? "వార్డు పేరును వెతకండి" : "Search ward name"}
                  </span>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={wardQuery}
                    onChange={(e) => setWardQuery(e.target.value)}
                    placeholder={
                      te ? "వార్డు పేరును వెతకండి..." : "Search ward name..."
                    }
                    className={`tap min-h-12 w-full rounded-xl border border-[#E8E4DC] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#B45309]/40 focus:outline-none ${te ? "font-telugu" : ""}`}
                  />
                </label>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWards.length === 0 ? (
                <li
                  className={`col-span-full rounded-2xl border border-dashed border-[#E8E4DC] bg-white p-6 text-center text-sm text-slate-500 ${te ? "font-telugu" : ""}`}
                >
                  {te ? "సరిపోలిన వార్డులు లేవు." : "No matching wards."}
                </li>
              ) : (
                filteredWards.map((ward) => (
                  <li
                    key={ward.id}
                    className="flex min-h-12 flex-col justify-center rounded-xl border border-[#E8E4DC] bg-white px-3 py-3"
                  >
                    <p className="font-telugu text-sm font-semibold text-[#0F172A]">
                      {ward.nameTe}
                    </p>
                    <p className="text-[11px] text-slate-500">{ward.nameEn}</p>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section>
            <h2
              className={`text-xl font-bold text-[#0F172A] ${te ? "font-telugu" : ""}`}
            >
              {te
                ? "సమన్వయకర్తలు & సేవా ప్రతినిధులు"
                : "Coordinators & Seva Representatives"}
            </h2>
            <div className="mt-4 space-y-3">
              {representatives.length === 0 ? (
                <p
                  className={`rounded-2xl border border-dashed border-[#E8E4DC] bg-white p-6 text-sm text-slate-500 ${te ? "font-telugu" : ""}`}
                >
                  {te
                    ? "ఇంకా సమన్వయకర్తలు నమోదు కాలేదు."
                    : "No coordinators registered yet."}
                </p>
              ) : (
                representatives.map((rep, idx) => (
                  <RepresentativeCard
                    key={`${rep.phone}-${idx}`}
                    name_en={rep.name_en}
                    name_te={rep.name_te}
                    designation_en={rep.designation_en}
                    designation_te={rep.designation_te}
                    phone={rep.phone}
                    photo_url={rep.photo_url}
                    area_name={areaName}
                  />
                ))
              )}
            </div>
          </section>

          {establishmentListings.length > 0 ? (
            <section>
              <h2
                className={`text-xl font-bold text-[#0F172A] ${te ? "font-telugu" : ""}`}
              >
                {te ? "నమోదైన సంస్థలు" : "Registered establishments"}
              </h2>
              <div className="mt-4">
                <EstablishmentDirectory establishments={establishmentListings} />
              </div>
            </section>
          ) : null}
        </div>

        <TelegramQRCard contextLabel={areaName} sticky />
      </div>
    </div>
  );
}
