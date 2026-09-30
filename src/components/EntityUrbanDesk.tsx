"use client";

import Link from "next/link";
import { FileText, Landmark, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A]">
      <section className="border-b border-[#E8E4DC] bg-gradient-to-b from-[#FFF8EF] to-[#FBFBFA]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href={`/${entity.districtSlug}`}
            className={`text-xs text-slate-500 hover:text-[#B45309] ${te ? "font-telugu" : ""}`}
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

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-telugu text-xl font-bold text-[#0F172A]">
              చట్టబద్ధ వినతి డాకెట్లు
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Three statutory action dockets → Municipal Commissioner desk
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {dockets.map((d) => (
                <Link
                  key={d.id}
                  href={representationHref(d.id, entity)}
                  className="tap flex h-full flex-col rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm transition-colors hover:border-[#B45309]/45 hover:bg-[#FFF8EF]"
                >
                  <d.icon className="h-5 w-5 text-[#B45309]" aria-hidden />
                  <p className="font-telugu mt-3 text-sm font-semibold text-[#0F172A]">
                    {d.titleTe}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{d.titleEn}</p>
                  <p className="font-telugu mt-3 text-[11px] leading-relaxed text-[#B45309]">
                    {d.citeTe}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-telugu text-xl font-bold text-[#0F172A]">
                  వార్డ్ ఎక్స్‌ప్లోరర్
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  WARD EXPLORER · {entity.subUnitsCount}{" "}
                  {entity.subUnitsLabelTe}
                </p>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {entity.subUnitsList.map((ward) => (
                <li
                  key={ward.id}
                  className="rounded-xl border border-[#E8E4DC] bg-white px-3 py-2.5"
                >
                  <p className="font-telugu text-sm font-semibold text-[#0F172A]">
                    {ward.nameTe}
                  </p>
                  <p className="text-[11px] text-slate-500">{ward.nameEn}</p>
                </li>
              ))}
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
