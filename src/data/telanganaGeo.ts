/**
 * Telangana statewide geographic directory — 33 districts × 589 mandals.
 *
 * Curated desk metadata (zones, WhatsApp corridors, ULB typing) is merged
 * onto the Phase-2 LGD mandal directory so every district remains complete.
 */

import { TELANGANA_DISTRICTS as DISTRICT_SEEDS } from "@/lib/data/districts";
import { MANDALS_DIRECTORY } from "@/lib/data/mandalsDirectory";
import {
  URBAN_DIRECTORY,
  type StaticUlb,
} from "@/lib/data/urbanDirectory";
import { resolveRegionalHubForDistrict } from "@/config/communityHubs";

export interface MandalInfo {
  slug: string;
  nameEn: string;
  nameTe: string;
  type: "mandal" | "municipality" | "corporation";
}

export interface DistrictInfo {
  slug: string;
  nameEn: string;
  nameTe: string;
  headquarters: string;
  zone: "South Telangana" | "North Telangana" | "Central/Capital";
  whatsappCorridorUrl: string;
  mandals: MandalInfo[];
}

export type GeoZone = DistrictInfo["zone"];

/** Canonical 33-district key list (slug order matches civic directory). */
export const ALL_33_DISTRICT_KEYS = [
  "adilabad",
  "bhadradri-kothagudem",
  "hanumakonda",
  "hyderabad",
  "jagtial",
  "jangaon",
  "jayashankar-bhupalpally",
  "jogulamba-gadwal",
  "kamareddy",
  "karimnagar",
  "khammam",
  "kumuram-bheem-asifabad",
  "mahabubabad",
  "mahabubnagar",
  "mancherial",
  "medak",
  "medchal-malkajgiri",
  "mulugu",
  "nagarkurnool",
  "nalgonda",
  "narayanpet",
  "nirmal",
  "nizamabad",
  "peddapalli",
  "rajanna-sircilla",
  "rangareddy",
  "sangareddy",
  "siddipet",
  "suryapet",
  "vikarabad",
  "wanaparthy",
  "warangal",
  "yadadri-bhuvanagiri",
] as const;

export type DistrictKey = (typeof ALL_33_DISTRICT_KEYS)[number];

/** Curated pilot hubs — names, zones, corridors, and ULB typing overrides. */
const CURATED_DISTRICTS: Partial<Record<string, DistrictInfo>> = {
  suryapet: {
    slug: "suryapet",
    nameEn: "Suryapet",
    nameTe: "సూర్యాపేట",
    headquarters: "Suryapet",
    zone: "South Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-suryapet-hub",
    mandals: [
      { slug: "kodad", nameEn: "Kodad", nameTe: "కోదాడ", type: "municipality" },
      {
        slug: "suryapet",
        nameEn: "Suryapet Urban",
        nameTe: "సూర్యాపేట అర్బన్",
        type: "municipality",
      },
      {
        slug: "huzurnagar",
        nameEn: "Huzurnagar",
        nameTe: "హుజూర్‌నగర్",
        type: "municipality",
      },
      { slug: "mothey", nameEn: "Mothey", nameTe: "మోతే", type: "mandal" },
      { slug: "munagala", nameEn: "Munagala", nameTe: "మునగాల", type: "mandal" },
      {
        slug: "nadigudem",
        nameEn: "Nadigudem",
        nameTe: "నడిగూడెం",
        type: "mandal",
      },
      { slug: "chilkur", nameEn: "Chilkur", nameTe: "చిలుకూరు", type: "mandal" },
      {
        slug: "mellachervu",
        nameEn: "Mellachervu",
        nameTe: "మేళ్లచెరువు",
        type: "mandal",
      },
      {
        slug: "chivemla",
        nameEn: "Chivvemla",
        nameTe: "చివ్వెంల",
        type: "mandal",
      },
      {
        slug: "atmakur-s",
        nameEn: "Atmakur (S)",
        nameTe: "ఆత్మకూర్ (ఎస్)",
        type: "mandal",
      },
    ],
  },
  rangareddy: {
    slug: "rangareddy",
    nameEn: "Rangareddy",
    nameTe: "రంగారెడ్డి",
    headquarters: "Shamshabad",
    zone: "Central/Capital",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-rangareddy-hub",
    mandals: [
      {
        slug: "ibrahimpatnam",
        nameEn: "Ibrahimpatnam",
        nameTe: "ఇబ్రహీంపట్నం",
        type: "municipality",
      },
      {
        slug: "rajendranagar",
        nameEn: "Rajendranagar",
        nameTe: "రాజేంద్రనగర్",
        type: "corporation",
      },
      {
        slug: "serilingampally",
        nameEn: "Serilingampally",
        nameTe: "శేరిలింగంపల్లి",
        type: "corporation",
      },
      {
        slug: "maheshwaram",
        nameEn: "Maheshwaram",
        nameTe: "మహేశ్వరం",
        type: "mandal",
      },
      { slug: "chevella", nameEn: "Chevella", nameTe: "చేవెళ్ల", type: "mandal" },
      {
        slug: "shadnagar",
        nameEn: "Shadnagar",
        nameTe: "షాద్‌‌నగర్",
        type: "municipality",
      },
    ],
  },
  hyderabad: {
    slug: "hyderabad",
    nameEn: "Hyderabad",
    nameTe: "హైదరాబాద్",
    headquarters: "Hyderabad",
    zone: "Central/Capital",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-hyderabad-hub",
    mandals: [
      {
        slug: "amberpet",
        nameEn: "Amberpet",
        nameTe: "అంబర్‌పేట్",
        type: "corporation",
      },
      {
        slug: "khairatabad",
        nameEn: "Khairatabad",
        nameTe: "ఖైరతాబాద్",
        type: "corporation",
      },
      {
        slug: "secunderabad",
        nameEn: "Secunderabad",
        nameTe: "సికింద్రాబాద్",
        type: "corporation",
      },
      {
        slug: "charminar",
        nameEn: "Charminar",
        nameTe: "చార్మినార్",
        type: "corporation",
      },
      {
        slug: "jubilee-hills",
        nameEn: "Jubilee Hills",
        nameTe: "జూబ్లీహిల్స్",
        type: "corporation",
      },
    ],
  },
  hanumakonda: {
    slug: "hanumakonda",
    nameEn: "Hanumakonda",
    nameTe: "హనుమకొండ",
    headquarters: "Hanumakonda",
    zone: "North Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-warangal-hub",
    mandals: [
      {
        slug: "hanumakonda",
        nameEn: "Hanumakonda Urban",
        nameTe: "హనుమకొండ అర్బన్",
        type: "corporation",
      },
      { slug: "kazipet", nameEn: "Kazipet", nameTe: "కాజీపేట", type: "corporation" },
      {
        slug: "kamalapur",
        nameEn: "Kamalapur",
        nameTe: "కమలాపూర్",
        type: "mandal",
      },
      { slug: "parkal", nameEn: "Parkal", nameTe: "పరకాల", type: "municipality" },
    ],
  },
  karimnagar: {
    slug: "karimnagar",
    nameEn: "Karimnagar",
    nameTe: "కరీంనగర్",
    headquarters: "Karimnagar",
    zone: "North Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-karimnagar-hub",
    mandals: [
      {
        slug: "karimnagar",
        nameEn: "Karimnagar Urban",
        nameTe: "కరీంనగర్ అర్బన్",
        type: "corporation",
      },
      {
        slug: "huzurabad",
        nameEn: "Huzurabad",
        nameTe: "హుజూరాబాద్",
        type: "municipality",
      },
      {
        slug: "choppadandi",
        nameEn: "Choppadandi",
        nameTe: "చొప్పదండి",
        type: "municipality",
      },
      {
        slug: "manakondur",
        nameEn: "Manakondur",
        nameTe: "మానకొండూర్",
        type: "mandal",
      },
    ],
  },
  khammam: {
    slug: "khammam",
    nameEn: "Khammam",
    nameTe: "ఖమ్మం",
    headquarters: "Khammam",
    zone: "South Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-khammam-hub",
    mandals: [
      {
        slug: "khammam-urban",
        nameEn: "Khammam Urban",
        nameTe: "ఖమ్మం అర్బన్",
        type: "corporation",
      },
      { slug: "madhira", nameEn: "Madhira", nameTe: "మధిర", type: "municipality" },
      {
        slug: "sathupalli",
        nameEn: "Sathupalli",
        nameTe: "సత్తుపల్లి",
        type: "municipality",
      },
      { slug: "kalluru", nameEn: "Kalluru", nameTe: "కల్లూరు", type: "mandal" },
    ],
  },
  nalgonda: {
    slug: "nalgonda",
    nameEn: "Nalgonda",
    nameTe: "నల్గొండ",
    headquarters: "Nalgonda",
    zone: "South Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-nalgonda-hub",
    mandals: [
      {
        slug: "nalgonda",
        nameEn: "Nalgonda Urban",
        nameTe: "నల్గొండ అర్బన్",
        type: "municipality",
      },
      {
        slug: "miryalaguda",
        nameEn: "Miryalaguda",
        nameTe: "మిర్యాలగూడ",
        type: "municipality",
      },
      {
        slug: "devarakonda",
        nameEn: "Devarakonda",
        nameTe: "దేవరకొండ",
        type: "municipality",
      },
      {
        slug: "nakrekal",
        nameEn: "Nakrekal",
        nameTe: "నకిరేకల్",
        type: "municipality",
      },
    ],
  },
  nizamabad: {
    slug: "nizamabad",
    nameEn: "Nizamabad",
    nameTe: "నిజామాబాద్",
    headquarters: "Nizamabad",
    zone: "North Telangana",
    whatsappCorridorUrl: "https://chat.whatsapp.com/sample-nizamabad-hub",
    mandals: [
      {
        slug: "nizamabad-north",
        nameEn: "Nizamabad North",
        nameTe: "నిజామాబాద్ నార్త్",
        type: "corporation",
      },
      { slug: "armur", nameEn: "Armur", nameTe: "ఆర్మూర్", type: "municipality" },
      { slug: "bodhan", nameEn: "Bodhan", nameTe: "బోధన్", type: "municipality" },
      { slug: "balkonda", nameEn: "Balkonda", nameTe: "బాల్కొండ", type: "mandal" },
    ],
  },
};

const SOUTH_ZONE = new Set([
  "suryapet",
  "nalgonda",
  "khammam",
  "bhadradri-kothagudem",
  "yadadri-bhuvanagiri",
  "mahabubnagar",
  "nagarkurnool",
  "wanaparthy",
  "jogulamba-gadwal",
  "narayanpet",
  "mahabubabad",
  "mulugu",
  "jayashankar-bhupalpally",
]);

const CENTRAL_ZONE = new Set([
  "hyderabad",
  "rangareddy",
  "medchal-malkajgiri",
  "vikarabad",
  "sangareddy",
  "medak",
  "siddipet",
]);

const HQ_EN: Record<string, string> = {
  adilabad: "Adilabad",
  "bhadradri-kothagudem": "Kothagudem",
  hanumakonda: "Hanumakonda",
  hyderabad: "Hyderabad",
  jagtial: "Jagtial",
  jangaon: "Jangaon",
  "jayashankar-bhupalpally": "Bhupalpally",
  "jogulamba-gadwal": "Gadwal",
  kamareddy: "Kamareddy",
  karimnagar: "Karimnagar",
  khammam: "Khammam",
  "kumuram-bheem-asifabad": "Asifabad",
  mahabubabad: "Mahabubabad",
  mahabubnagar: "Mahabubnagar",
  mancherial: "Mancherial",
  medak: "Medak",
  "medchal-malkajgiri": "Medchal",
  mulugu: "Mulugu",
  nagarkurnool: "Nagarkurnool",
  nalgonda: "Nalgonda",
  narayanpet: "Narayanpet",
  nirmal: "Nirmal",
  nizamabad: "Nizamabad",
  peddapalli: "Peddapalli",
  "rajanna-sircilla": "Sircilla",
  rangareddy: "Shamshabad",
  sangareddy: "Sangareddy",
  siddipet: "Siddipet",
  suryapet: "Suryapet",
  vikarabad: "Vikarabad",
  wanaparthy: "Wanaparthy",
  warangal: "Warangal",
  "yadadri-bhuvanagiri": "Bhuvanagiri",
};

function zoneFor(slug: string): GeoZone {
  if (CENTRAL_ZONE.has(slug)) return "Central/Capital";
  if (SOUTH_ZONE.has(slug)) return "South Telangana";
  return "North Telangana";
}

function corridorUrlFor(slug: string, curated?: string): string {
  if (curated?.trim()) return curated.trim();
  const hub = resolveRegionalHubForDistrict(slug);
  if (hub?.inviteUrl) return hub.inviteUrl;
  return `https://chat.whatsapp.com/sample-${slug}-hub`;
}

function ulbTypeForSlug(
  districtSlug: string,
  mandalSlug: string,
): MandalInfo["type"] | null {
  const base = mandalSlug.replace(/-urban$|-rural$/i, "");
  const hit = URBAN_DIRECTORY.find((u) => {
    if (u.district_slug !== districtSlug) return false;
    const us = u.slug
      .replace(/-municipality$|-municipal-corporation$|-nagar-panchayat$/i, "")
      .replace(/-corporation$/i, "");
    return (
      u.slug === mandalSlug ||
      us === mandalSlug ||
      us === base ||
      u.slug.includes(base) ||
      mandalSlug.includes(us)
    );
  });
  if (!hit) return null;
  if (hit.ulb_type === "municipal_corporation") return "corporation";
  return "municipality";
}

function inferMandalType(
  districtSlug: string,
  mandalSlug: string,
  nameEn: string,
): MandalInfo["type"] {
  const fromUlb = ulbTypeForSlug(districtSlug, mandalSlug);
  if (fromUlb) return fromUlb;
  const blob = `${mandalSlug} ${nameEn}`.toLowerCase();
  if (/corporation|ghmc|circle/.test(blob)) return "corporation";
  if (/municipality|urban|town|nagar/.test(blob)) return "municipality";
  if (districtSlug === "hyderabad") return "corporation";
  return "mandal";
}

function curatedOverrideMap(
  curated: DistrictInfo | undefined,
): Map<string, MandalInfo> {
  const map = new Map<string, MandalInfo>();
  if (!curated) return map;
  for (const m of curated.mandals) {
    map.set(m.slug, m);
    // Accept legacy aliases used in curated drafts.
    if (m.slug === "suryapet") map.set("suryapet-urban", m);
    if (m.slug === "chivemla") map.set("chivvemla", m);
    if (m.slug === "nadigudem") map.set("nadirgudem", m);
    if (m.slug === "hanumakonda") map.set("hanumakonda-urban", m);
    if (m.slug === "karimnagar") map.set("karimnagar-urban", m);
    if (m.slug === "nalgonda") map.set("nalgonda-urban", m);
  }
  return map;
}

function buildDistrict(slug: string): DistrictInfo {
  const curated = CURATED_DISTRICTS[slug];
  const seed = DISTRICT_SEEDS.find((d) => d.slug === slug);
  const overrides = curatedOverrideMap(curated);

  const directoryRows = MANDALS_DIRECTORY.filter(
    (m) => m.district_slug === slug,
  );

  const mandals: MandalInfo[] = directoryRows
    .map((row) => {
      const override = overrides.get(row.slug);
      if (override) {
        return {
          slug: row.slug,
          nameEn: override.nameEn || row.name_en,
          nameTe: override.nameTe || row.name_te,
          type: override.type,
        };
      }
      return {
        slug: row.slug,
        nameEn: row.name_en,
        nameTe: row.name_te,
        type: inferMandalType(slug, row.slug, row.name_en),
      };
    })
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));

  return {
    slug,
    nameEn: curated?.nameEn || seed?.name_en || slug,
    nameTe: curated?.nameTe || seed?.name_te || slug,
    headquarters: curated?.headquarters || HQ_EN[slug] || seed?.name_en || slug,
    zone: curated?.zone || zoneFor(slug),
    whatsappCorridorUrl: corridorUrlFor(slug, curated?.whatsappCorridorUrl),
    mandals,
  };
}

/** Full 33-district geographic index (curated + dynamically extended). */
export const TELANGANA_DISTRICTS: Record<string, DistrictInfo> =
  Object.fromEntries(
    ALL_33_DISTRICT_KEYS.map((slug) => [slug, buildDistrict(slug)]),
  );

export const TELANGANA_GEO: DistrictInfo[] = ALL_33_DISTRICT_KEYS.map(
  (slug) => TELANGANA_DISTRICTS[slug],
);

export const TELANGANA_DISTRICT_COUNT = TELANGANA_GEO.length;
export const TELANGANA_MANDAL_COUNT = TELANGANA_GEO.reduce(
  (n, d) => n + d.mandals.length,
  0,
);
export const TELANGANA_TOWN_COUNT = TELANGANA_GEO.reduce(
  (n, d) =>
    n + d.mandals.filter((m) => m.type !== "mandal").length,
  0,
);

if (TELANGANA_DISTRICT_COUNT !== 33) {
  throw new Error(
    `Expected 33 Telangana districts, got ${TELANGANA_DISTRICT_COUNT}`,
  );
}
if (TELANGANA_MANDAL_COUNT !== 589) {
  throw new Error(
    `Expected 589 Telangana mandals, got ${TELANGANA_MANDAL_COUNT}`,
  );
}

/** @deprecated Prefer DistrictInfo — kept for page/helper aliases. */
export type GeoDistrict = DistrictInfo;
/** @deprecated Prefer MandalInfo */
export type GeoMandal = MandalInfo;

export function listGeoDistricts(): DistrictInfo[] {
  return TELANGANA_GEO;
}

export function getGeoDistrict(slug: string): DistrictInfo | undefined {
  return TELANGANA_DISTRICTS[slug.trim().toLowerCase()];
}

export function getGeoMandal(
  districtSlug: string,
  mandalSlug: string,
): MandalInfo | undefined {
  const d = getGeoDistrict(districtSlug);
  if (!d) return undefined;
  const key = mandalSlug.trim().toLowerCase();
  return d.mandals.find((m) => m.slug === key);
}

export function listUrbanPlaces(district: DistrictInfo): MandalInfo[] {
  return district.mandals.filter((m) => m.type !== "mandal");
}

/** Stable FNV-1a style hash for deterministic desk metrics (SSR-safe). */
export function geoHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type DeskMetrics = {
  activeSalons: number;
  go23Claims: number;
  openPetitions: number;
  verifiedCoordinators: number;
};

export function districtDeskMetrics(districtSlug: string): DeskMetrics {
  const h = geoHash(`district:${districtSlug}`);
  const d = getGeoDistrict(districtSlug);
  const mandals = d?.mandals.length ?? 12;
  return {
    activeSalons: 40 + (h % 90) + mandals * 2,
    go23Claims: 25 + (h % 70) + Math.floor(mandals * 1.5),
    openPetitions: 8 + (h % 28),
    verifiedCoordinators: Math.max(1, Math.min(mandals, 4 + (h % 6))),
  };
}

export function mandalDeskMetrics(
  districtSlug: string,
  mandalSlug: string,
): DeskMetrics {
  const h = geoHash(`mandal:${districtSlug}/${mandalSlug}`);
  return {
    activeSalons: 6 + (h % 28),
    go23Claims: 4 + (h % 22),
    openPetitions: 1 + (h % 9),
    verifiedCoordinators: 1,
  };
}

export type CoordinatorBadge = {
  id: string;
  nameTe: string;
  nameEn: string;
  roleTe: string;
  roleEn: string;
  phoneDisplay: string;
  phoneE164: string;
  verified: boolean;
};

export function mandalCoordinatorBadge(
  district: DistrictInfo,
  mandal: MandalInfo,
): CoordinatorBadge {
  const code = geoHash(`${district.slug}:${mandal.slug}`)
    .toString(16)
    .toUpperCase()
    .slice(0, 6);
  const shortTe = mandal.nameTe.replace(/\s*\(.*\)\s*$/, "").trim();
  return {
    id: `NS-TG-${district.slug.slice(0, 3).toUpperCase()}-${mandal.slug
      .slice(0, 4)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")}-${code}`,
    nameTe: `${shortTe} సమన్వయ డెస్క్`,
    nameEn: `${mandal.nameEn} Coordination Desk`,
    roleTe: "ధృవీకృత మండల సమన్వయకర్త",
    roleEn: "Verified Mandal Coordinator",
    phoneDisplay: "90326 54111",
    phoneE164: "919032654111",
    verified: true,
  };
}

export type GeoSearchHit =
  | {
      kind: "district";
      district: DistrictInfo;
      labelEn: string;
      labelTe: string;
      href: string;
    }
  | {
      kind: "mandal" | "town";
      district: DistrictInfo;
      mandal: MandalInfo;
      labelEn: string;
      labelTe: string;
      href: string;
    };

export function searchTelanganaGeo(query: string, limit = 48): GeoSearchHit[] {
  const raw = query.trim();
  if (!raw) return [];
  const q = raw.toLowerCase();
  const hits: GeoSearchHit[] = [];

  for (const d of TELANGANA_GEO) {
    if (
      d.slug.includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.nameTe.includes(raw) ||
      d.headquarters.toLowerCase().includes(q) ||
      d.zone.toLowerCase().includes(q)
    ) {
      hits.push({
        kind: "district",
        district: d,
        labelEn: d.nameEn,
        labelTe: d.nameTe,
        href: `/districts/${d.slug}`,
      });
    }

    for (const m of d.mandals) {
      if (
        m.slug.includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.nameTe.includes(raw)
      ) {
        hits.push({
          kind: m.type === "mandal" ? "mandal" : "town",
          district: d,
          mandal: m,
          labelEn: `${m.nameEn} · ${d.nameEn}`,
          labelTe: `${m.nameTe} · ${d.nameTe}`,
          href: `/${d.slug}/${m.slug}`,
        });
      }
    }

    if (hits.length >= limit) break;
  }

  return hits.slice(0, limit);
}

export function districtStaticParams(): { district: string }[] {
  return ALL_33_DISTRICT_KEYS.map((district) => ({ district }));
}

export function mandalStaticParams(): {
  district: string;
  mandal: string;
}[] {
  return TELANGANA_GEO.flatMap((d) =>
    d.mandals.map((m) => ({ district: d.slug, mandal: m.slug })),
  );
}

/* -------------------------------------------------------------------------- */
/* AdminEntity — unified ULB + rural mandal desk model                        */
/* -------------------------------------------------------------------------- */

export type EntityType = "corporation" | "municipality" | "rural-mandal";

export interface AdminEntity {
  slug: string;
  nameTe: string;
  nameEn: string;
  type: EntityType;
  districtSlug: string;
  districtNameTe: string;
  districtNameEn: string;
  /** Wards for urban, Panchayats for rural */
  subUnitsCount: number;
  /** "మున్సిపల్ వార్డులు" or "గ్రామ పంచాయతీలు" */
  subUnitsLabelTe: string;
  headOfficeTe: string;
  subUnitsList: { id: number | string; nameTe: string; nameEn: string }[];
  /** Legacy urban-directory / Supabase slug when different from canonical */
  legacySlug?: string;
  ulbType?: StaticUlb["ulb_type"];
}

/** Explicit Khammam (and peer) canonical ULB slugs — never null/empty. */
const ULB_CANONICAL_BY_LEGACY: Record<string, string> = {
  "khammam:khammam-municipal-corporation": "khammam-corp",
  "khammam:madhira-municipality": "madhira",
  "khammam:sathupalli-municipality": "sathupalli",
  "khammam:wyra-municipality": "wyra",
  "khammam:kallur-municipality": "kallur",
  "khammam:yedulapuram-municipality": "yedulapuram",
};

/** Display name overrides (TE/EN) for key ULBs. */
const ULB_NAME_OVERRIDES: Record<
  string,
  { nameTe: string; nameEn: string; wards?: number }
> = {
  "khammam:khammam-corp": {
    nameTe: "ఖమ్మం మున్సిపల్ కార్పొరేషన్",
    nameEn: "Khammam Municipal Corporation",
    wards: 50,
  },
  "khammam:madhira": {
    nameTe: "మధిర పురపాలక సంఘం",
    nameEn: "Madhira Municipality",
    wards: 22,
  },
  "khammam:sathupalli": {
    nameTe: "సత్తుపల్లి మున్సిపాలిటీ",
    nameEn: "Sathupalli Municipality",
    wards: 24,
  },
  "khammam:wyra": {
    nameTe: "వైరా మున్సిపాలిటీ",
    nameEn: "Wyra Municipality",
    wards: 20,
  },
};

/** Mandals that are purely urban LGD rows — exclude from rural tab when ULB exists. */
const URBAN_ONLY_MANDAL_SLUGS = new Set([
  "khammam-urban",
  "suryapet-urban",
  "hanumakonda-urban",
  "karimnagar-urban",
  "nalgonda-urban",
  "nizamabad-north",
  "nizamabad-south",
]);

function stripUlbSuffix(slug: string): string {
  return slug
    .replace(/-municipal-corporation$/i, "")
    .replace(/-municipality$/i, "")
    .replace(/-nagar-panchayat$/i, "")
    .replace(/-corporation$/i, "")
    .replace(/-urban$/i, "");
}

export function canonicalUlbSlug(
  districtSlug: string,
  legacySlug: string,
  ulbType: StaticUlb["ulb_type"],
): string {
  const key = `${districtSlug}:${legacySlug}`;
  if (ULB_CANONICAL_BY_LEGACY[key]) return ULB_CANONICAL_BY_LEGACY[key];

  const base = stripUlbSuffix(legacySlug) || legacySlug;
  if (!base || base === "null" || base === "undefined") {
    throw new Error(
      `Refusing empty/null ULB slug for ${districtSlug}/${legacySlug}`,
    );
  }
  if (ulbType === "municipal_corporation") {
    if (base === districtSlug || legacySlug.includes(districtSlug)) {
      return `${districtSlug}-corp`;
    }
    return `${base}-corp`;
  }
  return base;
}

function defaultWardCount(
  ulbType: StaticUlb["ulb_type"],
  seed: string,
): number {
  const h = geoHash(seed);
  if (ulbType === "municipal_corporation") return 40 + (h % 21); // 40–60
  if (ulbType === "nagar_panchayat") return 10 + (h % 6); // 10–15
  return 18 + (h % 11); // 18–28 municipalities
}

function buildWardList(
  count: number,
): { id: number; nameTe: string; nameEn: string }[] {
  const list: { id: number; nameTe: string; nameEn: string }[] = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      id: i,
      nameTe: `వార్డు ${i}`,
      nameEn: `Ward ${i}`,
    });
  }
  return list;
}

function entityTypeFromUlb(ulbType: StaticUlb["ulb_type"]): EntityType {
  return ulbType === "municipal_corporation" ? "corporation" : "municipality";
}

function buildUrbanEntity(ulb: StaticUlb): AdminEntity {
  const district = getGeoDistrict(ulb.district_slug);
  const slug = canonicalUlbSlug(ulb.district_slug, ulb.slug, ulb.ulb_type);
  if (!slug) {
    throw new Error(`Empty canonical slug for ${ulb.district_slug}/${ulb.slug}`);
  }
  const overrideKey = `${ulb.district_slug}:${slug}`;
  const override = ULB_NAME_OVERRIDES[overrideKey];
  const wards =
    override?.wards ??
    defaultWardCount(ulb.ulb_type, `${ulb.district_slug}:${slug}`);
  const nameTe = override?.nameTe || ulb.name_te;
  const nameEn = override?.nameEn || ulb.name_en;
  const districtNameTe = district?.nameTe || ulb.district_slug;
  const districtNameEn = district?.nameEn || ulb.district_slug;

  return {
    slug,
    nameTe,
    nameEn,
    type: entityTypeFromUlb(ulb.ulb_type),
    districtSlug: ulb.district_slug,
    districtNameTe,
    districtNameEn,
    subUnitsCount: wards,
    subUnitsLabelTe: "మున్సిపల్ వార్డులు",
    headOfficeTe: `${nameTe} ప్రధాన కార్యాలయం, ${districtNameTe}`,
    subUnitsList: buildWardList(wards),
    legacySlug: ulb.slug !== slug ? ulb.slug : undefined,
    ulbType: ulb.ulb_type,
  };
}

function ruralCanonicalSlug(
  districtSlug: string,
  mandalSlug: string,
  taken: Set<string>,
): string {
  let slug = mandalSlug.trim().toLowerCase();
  if (!slug || slug === "null" || slug === "undefined") {
    throw new Error(`Empty rural slug in ${districtSlug}`);
  }
  if (taken.has(slug)) {
    slug = `${slug}-rural`;
  }
  // Guarantee uniqueness even if -rural is taken.
  if (taken.has(slug)) {
    slug = `${mandalSlug}-mandal`;
  }
  if (taken.has(slug)) {
    slug = `${districtSlug}-${mandalSlug}-rural`;
  }
  return slug;
}

function buildRuralEntity(
  district: DistrictInfo,
  mandal: MandalInfo,
  slug: string,
): AdminEntity {
  const h = geoHash(`gp:${district.slug}:${slug}`);
  const gpCount = 8 + (h % 18); // 8–25 placeholder count
  return {
    slug,
    nameTe: mandal.nameTe,
    nameEn: mandal.nameEn,
    type: "rural-mandal",
    districtSlug: district.slug,
    districtNameTe: district.nameTe,
    districtNameEn: district.nameEn,
    subUnitsCount: gpCount,
    subUnitsLabelTe: "గ్రామ పంచాయతీలు",
    headOfficeTe: `${mandal.nameTe} మండల కార్యాలయం, ${district.nameTe}`,
    subUnitsList: [],
  };
}

type DistrictEntityIndex = {
  urban: AdminEntity[];
  rural: AdminEntity[];
  bySlug: Map<string, AdminEntity>;
  /** legacy urban slug → canonical */
  legacyToCanonical: Map<string, string>;
};

function buildDistrictEntityIndex(districtSlug: string): DistrictEntityIndex {
  const district = getGeoDistrict(districtSlug);
  if (!district) {
    return {
      urban: [],
      rural: [],
      bySlug: new Map(),
      legacyToCanonical: new Map(),
    };
  }

  const urban = URBAN_DIRECTORY.filter((u) => u.district_slug === districtSlug)
    .map(buildUrbanEntity)
    .filter((e) => Boolean(e.slug))
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));

  const taken = new Set(urban.map((e) => e.slug));
  const legacyToCanonical = new Map<string, string>();
  for (const e of urban) {
    if (e.legacySlug) legacyToCanonical.set(e.legacySlug, e.slug);
    legacyToCanonical.set(e.slug, e.slug);
  }

  const rural: AdminEntity[] = [];
  for (const m of district.mandals) {
    if (!m.slug || m.slug === "null" || m.slug === "undefined") continue;
    if (URBAN_ONLY_MANDAL_SLUGS.has(m.slug)) continue;
    if (m.slug.endsWith("-urban")) continue;

    // Disambiguate when a ULB already claimed this slug (e.g. madhira town vs mandal).
    const slug = ruralCanonicalSlug(districtSlug, m.slug, taken);
    const entity = buildRuralEntity(district, { ...m, slug }, slug);
    taken.add(entity.slug);
    rural.push(entity);
  }

  rural.sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));

  const bySlug = new Map<string, AdminEntity>();
  for (const e of urban) bySlug.set(e.slug, e);
  for (const e of rural) bySlug.set(e.slug, e);

  return { urban, rural, bySlug, legacyToCanonical };
}

const DISTRICT_ENTITY_INDEX: Record<string, DistrictEntityIndex> =
  Object.fromEntries(
    ALL_33_DISTRICT_KEYS.map((slug) => [slug, buildDistrictEntityIndex(slug)]),
  );

/** All AdminEntity records (urban + rural) across Telangana. */
export const ADMIN_ENTITIES: AdminEntity[] = ALL_33_DISTRICT_KEYS.flatMap(
  (slug) => {
    const idx = DISTRICT_ENTITY_INDEX[slug];
    return [...idx.urban, ...idx.rural];
  },
);

for (const e of ADMIN_ENTITIES) {
  if (!e.slug || e.slug === "null" || e.slug === "undefined") {
    throw new Error(
      `AdminEntity has invalid slug: ${e.districtSlug}/${e.nameEn}`,
    );
  }
}

export function listUrbanEntities(districtSlug: string): AdminEntity[] {
  return DISTRICT_ENTITY_INDEX[districtSlug]?.urban ?? [];
}

export function listRuralEntities(districtSlug: string): AdminEntity[] {
  return DISTRICT_ENTITY_INDEX[districtSlug]?.rural ?? [];
}

export function listDistrictEntities(districtSlug: string): {
  urban: AdminEntity[];
  rural: AdminEntity[];
} {
  const idx = DISTRICT_ENTITY_INDEX[districtSlug];
  return {
    urban: idx?.urban ?? [],
    rural: idx?.rural ?? [],
  };
}

export function getAdminEntity(
  districtSlug: string,
  slug: string,
): AdminEntity | undefined {
  const d = districtSlug.trim().toLowerCase();
  const s = slug.trim().toLowerCase();
  if (!s || s === "null" || s === "undefined") return undefined;
  const idx = DISTRICT_ENTITY_INDEX[d];
  if (!idx) return undefined;
  const direct = idx.bySlug.get(s);
  if (direct) return direct;
  const canonical = idx.legacyToCanonical.get(s);
  if (canonical) return idx.bySlug.get(canonical);
  return undefined;
}

/** Map legacy urban-directory slug → canonical AdminEntity slug. */
export function resolveCanonicalEntitySlug(
  districtSlug: string,
  rawSlug: string,
): string | null {
  if (!rawSlug || rawSlug === "null" || rawSlug === "undefined") return null;
  const entity = getAdminEntity(districtSlug, rawSlug);
  return entity?.slug ?? null;
}

export function entityStaticParams(): { district: string; slug: string }[] {
  return ADMIN_ENTITIES.map((e) => ({
    district: e.districtSlug,
    slug: e.slug,
  }));
}

export function isUrbanEntityType(type: EntityType): boolean {
  return type === "corporation" || type === "municipality";
}
