import { listGeoDistricts, getGeoDistrict } from "@/data/telanganaGeo";
import { PORTAL_URL } from "@/lib/data/communityAnnounce";
import {
  REELS_STORAGE_KEY,
  isReelCategory,
  type ReelCategory,
  type ReelSubmission,
} from "@/types/reels";

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `reel-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Accept Instagram Reels, YouTube Shorts, or Google Drive share links. */
export function isValidVideoUrl(raw: string): boolean {
  const url = raw.trim();
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "instagram.com" || host === "instagr.am") return true;
    if (
      host === "youtube.com" ||
      host === "youtu.be" ||
      host === "m.youtube.com"
    ) {
      return true;
    }
    if (
      host === "drive.google.com" ||
      host === "docs.google.com"
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function coerceReel(
  raw: Partial<ReelSubmission> & Record<string, unknown>,
): ReelSubmission | null {
  if (!raw || typeof raw !== "object") return null;
  const category = String(raw.category || "");
  if (!isReelCategory(category)) return null;
  const phone = String(raw.phone || "").replace(/\D/g, "");
  const videoUrl = String(raw.videoUrl || raw.video_url || "").trim();
  const title = String(raw.title || "").trim();
  const creatorName = String(
    raw.creatorName || raw.creator_name || "",
  ).trim();
  if (!creatorName || !videoUrl || !title) return null;
  const statusRaw = String(raw.status || "pending");
  const status =
    statusRaw === "approved" || statusRaw === "featured"
      ? statusRaw
      : "pending";
  const sharesCount = Number(raw.sharesCount ?? raw.shares_count ?? 0);
  return {
    id: String(raw.id || uid()),
    createdAt: String(
      raw.createdAt || raw.created_at || new Date().toISOString(),
    ),
    creatorName,
    phone,
    districtSlug: String(
      raw.districtSlug || raw.district_slug || raw.district || "",
    )
      .trim()
      .toLowerCase(),
    mandalSlug: String(
      raw.mandalSlug || raw.mandal_slug || raw.mandal || "",
    )
      .trim()
      .toLowerCase(),
    category: category as ReelCategory,
    videoUrl,
    title,
    sharesCount: Number.isFinite(sharesCount) ? sharesCount : 0,
    status,
  };
}

export function readLocalReels(): ReelSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REELS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => coerceReel(row as Partial<ReelSubmission>))
      .filter((v): v is ReelSubmission => Boolean(v));
  } catch {
    return [];
  }
}

export function writeLocalReels(list: ReelSubmission[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      REELS_STORAGE_KEY,
      JSON.stringify(list.slice(-500)),
    );
  } catch {
    /* quota */
  }
}

export function upsertLocalReel(reel: ReelSubmission): ReelSubmission {
  const list = readLocalReels();
  const idx = list.findIndex((r) => r.id === reel.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...reel };
  } else {
    list.push(reel);
  }
  writeLocalReels(list);
  return reel;
}

export function incrementLocalShares(id: string): ReelSubmission | null {
  const list = readLocalReels();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const updated: ReelSubmission = {
    ...list[idx]!,
    sharesCount: (list[idx]!.sharesCount || 0) + 1,
  };
  list[idx] = updated;
  writeLocalReels(list);
  return updated;
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

export function mapDbRow(row: Record<string, unknown>): ReelSubmission {
  const coerced = coerceReel({
    id: String(row.id || ""),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
    creatorName: String(row.creator_name || ""),
    creator_name: String(row.creator_name || ""),
    phone: String(row.phone || ""),
    districtSlug: String(row.district_slug || ""),
    district_slug: String(row.district_slug || ""),
    mandalSlug: String(row.mandal_slug || ""),
    mandal_slug: String(row.mandal_slug || ""),
    category: String(row.category || ""),
    videoUrl: String(row.video_url || ""),
    video_url: String(row.video_url || ""),
    title: String(row.title || ""),
    sharesCount: Number(row.shares_count ?? 0),
    shares_count: Number(row.shares_count ?? 0),
    status: String(row.status || "pending"),
  } as Partial<ReelSubmission> & Record<string, unknown>);
  if (coerced) return coerced;
  throw new Error("Invalid reel row");
}

export function entryShareUrl(id: string): string {
  return `${PORTAL_URL}/reels?entry=${encodeURIComponent(id)}`;
}

export function buildReelWhatsAppMessage(reel: ReelSubmission): string {
  const link = entryShareUrl(reel.id);
  return (
    `🎬 *నాయీ సమాఖ్య — మన కళ · మన ఆత్మగౌరవం*\n\n` +
    `*${reel.title}*\n` +
    `నిర్మాత: ${reel.creatorName}\n\n` +
    `60-సెకన్ల రీల్ చూడండి:\n${reel.videoUrl}\n\n` +
    `👉 కాంటెస్ట్ గ్యాలరీ:\n${link}\n\n` +
    `_మన సంప్రదాయం · మన గౌరవం — షేర్ చేయండి!_\n` +
    `🤝 *నాయీ సమాఖ్య తెలంగాణ*`
  );
}

export function whatsAppShareHref(reel: ReelSubmission): string {
  return `https://wa.me/?text=${encodeURIComponent(buildReelWhatsAppMessage(reel))}`;
}

export { PORTAL_URL };
