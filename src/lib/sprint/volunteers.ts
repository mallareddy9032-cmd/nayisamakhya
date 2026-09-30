import { resolveRegionalHubForDistrict } from "@/config/communityHubs";
import { listGeoDistricts, getGeoDistrict } from "@/data/telanganaGeo";
import { PORTAL_URL } from "@/lib/data/communityAnnounce";
import { HELPLINE_WA_URL } from "@/lib/data/mobilizationDispatcher";
import {
  SPRINT_CERT_THRESHOLD,
  SPRINT_SESSION_KEY,
  VOLUNTEERS_STORAGE_KEY,
  type Volunteer,
  type VolunteerStatus,
} from "@/types/volunteer";

export function districtCodeFromSlug(districtSlug: string): string {
  const cleaned = districtSlug.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (cleaned.length >= 4) return cleaned.slice(0, 4);
  if (cleaned.length >= 2) return cleaned.padEnd(4, "X");
  return "XXXX";
}

/** Spec: SARATHI-${districtCode}-${Math.floor(1000 + Math.random() * 9000)} */
export function generateSarathiRefCode(districtSlug: string): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SARATHI-${districtCodeFromSlug(districtSlug)}-${n}`;
}

export function isValidSarathiRef(ref: string | null | undefined): boolean {
  if (!ref) return false;
  return /^SARATHI-[A-Z0-9]{2,8}-\d{4}$/i.test(ref.trim());
}

export function normalizeRefCode(ref: string): string {
  return ref.trim().toUpperCase();
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `vol-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function surveyShareUrl(refCode: string): string {
  return `https://www.nayisamakhya.org/survey?ref=${encodeURIComponent(normalizeRefCode(refCode))}`;
}

/**
 * Exact Telugu WhatsApp blast for సేవా సారథి —
 * GO 23 + municipal rights + marriage platform + survey?ref=
 */
export function buildSprintWhatsAppMessage(refCode: string): string {
  const link = surveyShareUrl(refCode);
  return (
    `🙏 *నాయీ సమాఖ్య — మండల సేవా సారథి*\n\n` +
    `సోదరులారా! *జీ.ఓ. 23* ఉచిత విద్యుత్, *మున్సిపల్ షాపు హక్కులు*, ట్రేడ్ లైసెన్స్ రక్షణ, మరియు మన కమ్యూనిటీ *వివాహ వేదిక* కోసం రాష్ట్రవ్యాప్త సర్వేలో చేరండి.\n\n` +
    `✅ కుటుంబ & వృత్తి వివరాలు నమోదు\n` +
    `✅ సంక్షేమ అర్హత గుర్తింపు\n` +
    `✅ వివాహ వేదికకు అర్హులైన అభ్యర్థుల నమోదు\n` +
    `✅ వినతిపత్రం & సమన్వయకర్త సహాయం\n\n` +
    `👉 *సర్వే లింక్:*\n${link}\n\n` +
    `_ఈ సందేశాన్ని మీ మండల వాట్సాప్ గ్రూపుల్లో తప్పకుండా షేర్ చేయండి._\n` +
    `🤝 *నాయీ సమాఖ్య తెలంగాణ*`
  );
}

export function whatsAppShareHref(refCode: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildSprintWhatsAppMessage(refCode))}`;
}

/** Spec Button1: /coordinator-card?name=...&mandal=...&role=Mandal+Coordinator */
export function coordinatorCardDownloadUrl(v: Volunteer): string {
  const district = getGeoDistrict(v.district);
  const mandal =
    district?.mandals.find((m) => m.slug === v.mandal) || null;
  const params = new URLSearchParams({
    name: v.name,
    mandal: mandal?.nameTe || mandal?.nameEn || v.mandal,
    role: "Mandal Coordinator",
  });
  if (district?.nameTe || district?.nameEn) {
    params.set("district", district.nameTe || district.nameEn);
  }
  if (v.phone) params.set("phone", v.phone);
  return `/coordinator-card?${params.toString()}`;
}

export function districtHubJoinUrl(districtSlug: string): string {
  const hub = resolveRegionalHubForDistrict(districtSlug);
  if (hub?.inviteUrl && !hub.inviteUrl.includes("sample-")) {
    return hub.inviteUrl;
  }
  if (hub?.helplineUrl) return hub.helplineUrl;
  return `${HELPLINE_WA_URL}?text=${encodeURIComponent(
    "మండల సేవా సారథి సర్టిఫైడ్ — జిల్లా వాట్సాప్ గ్రూపులో చేరాలనుకుంటున్నాను",
  )}`;
}

export function deriveStatus(completedCount: number): VolunteerStatus {
  return completedCount >= SPRINT_CERT_THRESHOLD ? "certified" : "active";
}

function coerceVolunteer(raw: Partial<Volunteer> & { count?: number }): Volunteer | null {
  if (!raw || typeof raw !== "object") return null;
  const phone = String(raw.phone || "").replace(/\D/g, "");
  const refCode = String(raw.refCode || "").trim();
  if (!refCode && !phone) return null;
  const completedCount = Number(
    raw.completedCount ?? raw.count ?? 0,
  );
  return {
    id: String(raw.id || uid()),
    name: String(raw.name || ""),
    phone,
    district: String(raw.district || ""),
    mandal: String(raw.mandal || ""),
    refCode,
    completedCount: Number.isFinite(completedCount) ? completedCount : 0,
    status:
      raw.status === "certified" || completedCount >= SPRINT_CERT_THRESHOLD
        ? "certified"
        : "active",
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

export function readLocalVolunteers(): Volunteer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOLUNTEERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => coerceVolunteer(row as Partial<Volunteer>))
      .filter((v): v is Volunteer => Boolean(v));
  } catch {
    return [];
  }
}

export function writeLocalVolunteers(list: Volunteer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      VOLUNTEERS_STORAGE_KEY,
      JSON.stringify(list.slice(-500)),
    );
  } catch {
    /* quota */
  }
}

export function upsertLocalVolunteer(volunteer: Volunteer): Volunteer {
  const list = readLocalVolunteers();
  const idx = list.findIndex(
    (v) =>
      normalizeRefCode(v.refCode) === normalizeRefCode(volunteer.refCode) ||
      (v.phone === volunteer.phone && volunteer.phone.length === 10),
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...volunteer };
  } else {
    list.push(volunteer);
  }
  writeLocalVolunteers(list);
  return volunteer;
}

export function findLocalByPhone(phone: string): Volunteer | null {
  const digits = phone.replace(/\D/g, "");
  return readLocalVolunteers().find((v) => v.phone === digits) || null;
}

export function findLocalByRef(refCode: string): Volunteer | null {
  const code = normalizeRefCode(refCode);
  return (
    readLocalVolunteers().find(
      (v) => normalizeRefCode(v.refCode) === code,
    ) || null
  );
}

/** Increment completedCount for a ref in volunteers_db; returns updated volunteer or null. */
export function creditLocalRef(refCode: string): Volunteer | null {
  if (!isValidSarathiRef(refCode)) return null;
  const code = normalizeRefCode(refCode);
  const list = readLocalVolunteers();
  const idx = list.findIndex((v) => normalizeRefCode(v.refCode) === code);
  if (idx < 0) return null;
  const nextCount = (list[idx]!.completedCount || 0) + 1;
  const updated: Volunteer = {
    ...list[idx]!,
    completedCount: nextCount,
    status: deriveStatus(nextCount),
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeLocalVolunteers(list);
  return updated;
}

export type SprintSession = {
  phone: string;
  refCode: string;
};

export function readSprintSession(): SprintSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SPRINT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SprintSession;
    if (parsed?.phone && parsed?.refCode) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function writeSprintSession(session: SprintSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SPRINT_SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function districtOptions() {
  return listGeoDistricts()
    .slice()
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));
}

export function mandalOptions(districtSlug: string) {
  const d = getGeoDistrict(districtSlug);
  if (!d) return [];
  return d.mandals
    .slice()
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));
}

export function mapDbRow(row: Record<string, unknown>): Volunteer {
  const completedCount = Number(
    row.completed_count ?? row.completedCount ?? row.count ?? 0,
  );
  return {
    id: String(row.id || uid()),
    name: String(row.name || ""),
    phone: String(row.phone || "").replace(/\D/g, ""),
    district: String(row.district || ""),
    mandal: String(row.mandal || ""),
    refCode: String(row.ref_code || row.refCode || ""),
    completedCount,
    status: deriveStatus(completedCount),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

/** Re-export portal constant for callers that need SITE. */
export { PORTAL_URL };
