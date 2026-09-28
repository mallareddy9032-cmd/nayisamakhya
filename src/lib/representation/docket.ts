/**
 * Docket reference helpers — REF: NS-TG-{DIST}-2026-{hash}
 */

const DISTRICT_CODES: Record<string, string> = {
  adilabad: "ADL",
  "bhadradri-kothagudem": "BKG",
  hanumakonda: "HNK",
  hyderabad: "HYD",
  jagtial: "JGT",
  jangaon: "JGN",
  "jayashankar-bhupalpally": "JBP",
  "jogulamba-gadwal": "JGD",
  kamareddy: "KMR",
  karimnagar: "KRM",
  khammam: "KMM",
  "kumuram-bheem-asifabad": "KBA",
  mahabubabad: "MBB",
  mahabubnagar: "MBN",
  mancherial: "MNC",
  medak: "MDK",
  "medchal-malkajgiri": "MMG",
  mulugu: "MLG",
  nagarkurnool: "NGK",
  nalgonda: "NLG",
  narayanpet: "NYP",
  nirmal: "NRM",
  nizamabad: "NZB",
  peddapalli: "PDP",
  "rajanna-sircilla": "RJS",
  rangareddy: "RRG",
  sangareddy: "SGR",
  siddipet: "SDP",
  suryapet: "SUR",
  vikarabad: "VKB",
  wanaparthy: "WNP",
  warangal: "WGL",
  "yadadri-bhuvanagiri": "YDB",
};

const TELUGU_MONTHS = [
  "జనవరి",
  "ఫిబ్రవరి",
  "మార్చి",
  "ఏప్రిల్",
  "మే",
  "జూన్",
  "జులై",
  "ఆగస్టు",
  "సెప్టెంబర్",
  "అక్టోబర్",
  "నవంబర్",
  "డిసెంబర్",
] as const;

const TELUGU_DIGITS = "౦౧౨౩౪౫౬౭౮౯";

export function districtCodeFromSlug(slug: string): string {
  const key = slug.trim().toLowerCase();
  if (DISTRICT_CODES[key]) return DISTRICT_CODES[key];
  const compact = key.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase();
  return compact || "TGX";
}

/** Convert ASCII digits in a string to Telugu numerals. */
export function toTeluguNumerals(value: string | number): string {
  return String(value).replace(/\d/g, (d) => TELUGU_DIGITS[Number(d)] ?? d);
}

/**
 * Strict Telugu administrative date — never uses client `toLocale*` / device locale.
 * Always Asia/Kolkata calendar parts + hardcoded Telugu month names.
 * Example: `28 సెప్టెంబర్, 2026`
 */
export function formatTeluguOfficialDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);

  const day = Number(parts.find((p) => p.type === "day")?.value || "1");
  // Intl month is 1–12; TELUGU_MONTHS is 0-indexed.
  const monthNum = Number(parts.find((p) => p.type === "month")?.value || "1");
  const year = Number(parts.find((p) => p.type === "year")?.value || "2026");
  const month = TELUGU_MONTHS[Math.max(0, Math.min(11, monthNum - 1))] || "";
  return `${day} ${month}, ${year}`;
}

function shortHashFromSeed(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(6, "0").slice(0, 6);
}

export type DocketParts = {
  /** Full display: REF: NS-TG-SUR-2026-A1B2C3 */
  refLabel: string;
  /** Path id without REF: prefix — NS-TG-SUR-2026-A1B2C3 */
  docketId: string;
  districtCode: string;
  year: number;
  shortHash: string;
};

export function buildDocketRef(opts: {
  districtSlug: string;
  mandalSlug?: string;
  presetId?: string;
  seed?: string;
  year?: number;
}): DocketParts {
  const year = opts.year ?? new Date().getFullYear();
  const districtCode = districtCodeFromSlug(opts.districtSlug);
  const seed =
    opts.seed ||
    `${opts.districtSlug}|${opts.mandalSlug || ""}|${opts.presetId || ""}|${Date.now()}`;
  const hash = shortHashFromSeed(seed);
  const docketId = `NS-TG-${districtCode}-${year}-${hash}`;
  return {
    refLabel: `REF: ${docketId}`,
    docketId,
    districtCode,
    year,
    shortHash: hash,
  };
}

/** Validate / parse a docket id of form NS-TG-{CODE}-{YEAR}-{HASH}. */
export function parseDocketId(raw: string): DocketParts | null {
  const id = raw.trim().replace(/^REF:\s*/i, "").toUpperCase();
  const m = id.match(/^NS-TG-([A-Z]{2,4})-(\d{4})-([A-F0-9]{4,8})$/i);
  if (!m) return null;
  return {
    refLabel: `REF: ${id}`,
    docketId: id,
    districtCode: m[1].toUpperCase(),
    year: Number(m[2]),
    shortHash: m[3].toUpperCase(),
  };
}

export function verifyUrlForDocket(docketId: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin.replace("nayisamakhya.org", "www.nayisamakhya.org")
      : "https://www.nayisamakhya.org";
  const base =
    origin.includes("localhost") || origin.includes("127.0.0.1")
      ? "https://www.nayisamakhya.org"
      : origin.startsWith("http")
        ? origin
        : "https://www.nayisamakhya.org";
  // Prefer www apex for Telegram / print QR scans.
  let host = base;
  try {
    const u = new URL(base);
    if (u.hostname === "nayisamakhya.org") u.hostname = "www.nayisamakhya.org";
    host = `${u.protocol}//${u.host}`;
  } catch {
    host = "https://www.nayisamakhya.org";
  }
  return `${host}/verify/${encodeURIComponent(docketId)}`;
}

export type PetitionDocketRecord = {
  docket_id: string;
  category_id: string;
  category_te: string;
  district_slug: string;
  district_te: string;
  mandal_slug: string;
  mandal_te: string;
  statutory_te: string;
  subject_te: string;
  issued_at: string;
  applicant_name?: string;
};
