"use client";

import { useMemo, useState } from "react";
import { listGeoDistricts } from "@/data/telanganaGeo";

const fieldClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass = "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

export type GeoSelection = {
  districtSlug: string;
  districtNameTe: string;
  mandalSlug: string;
  mandalNameTe: string;
};

export function DistrictMandalFields({
  value,
  onChange,
  idPrefix = "salon",
}: {
  value: GeoSelection;
  onChange: (next: GeoSelection) => void;
  idPrefix?: string;
}) {
  const districts = useMemo(
    () =>
      listGeoDistricts()
        .slice()
        .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en")),
    [],
  );

  const mandals = useMemo(() => {
    const d = districts.find((x) => x.slug === value.districtSlug);
    return d?.mandals?.slice().sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en")) ?? [];
  }, [districts, value.districtSlug]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor={`${idPrefix}-district`}>
          జిల్లా *
        </label>
        <select
          id={`${idPrefix}-district`}
          className={fieldClass}
          value={value.districtSlug}
          onChange={(e) => {
            const d = districts.find((x) => x.slug === e.target.value);
            onChange({
              districtSlug: d?.slug ?? "",
              districtNameTe: d?.nameTe ?? "",
              mandalSlug: "",
              mandalNameTe: "",
            });
          }}
          required
        >
          <option value="">జిల్లా ఎంచుకోండి</option>
          {districts.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.nameTe} ({d.nameEn})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor={`${idPrefix}-mandal`}>
          మండలం *
        </label>
        <select
          id={`${idPrefix}-mandal`}
          className={fieldClass}
          value={value.mandalSlug}
          disabled={!value.districtSlug}
          onChange={(e) => {
            const m = mandals.find((x) => x.slug === e.target.value);
            onChange({
              ...value,
              mandalSlug: m?.slug ?? "",
              mandalNameTe: m?.nameTe ?? "",
            });
          }}
          required
        >
          <option value="">మండలం ఎంచుకోండి</option>
          {mandals.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.nameTe} ({m.nameEn})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function useGeoSelection(): [GeoSelection, (n: GeoSelection) => void] {
  const [geo, setGeo] = useState<GeoSelection>({
    districtSlug: "",
    districtNameTe: "",
    mandalSlug: "",
    mandalNameTe: "",
  });
  return [geo, setGeo];
}

export { fieldClass, labelClass };
