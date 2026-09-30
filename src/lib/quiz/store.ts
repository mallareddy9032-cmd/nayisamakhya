import { listGeoDistricts, getGeoDistrict } from "@/data/telanganaGeo";
import { HELPLINE_WA_URL } from "@/lib/data/mobilizationDispatcher";
import { resolveRegionalHubForDistrict } from "@/config/communityHubs";
import {
  QUIZ_PASS_THRESHOLD,
  QUIZ_SESSION_KEY,
  QUIZ_STORAGE_KEY,
  type QuizAttempt,
  type QuizRegistrant,
} from "@/types/quiz";

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

export function generateCertificateId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `NS-LEG-2026-${n}`;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `quiz-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatQuizDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  try {
    return d.toLocaleDateString("te-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function districtLabel(slug: string, te = true): string {
  const d = getGeoDistrict(slug);
  if (!d) return slug;
  return te ? d.nameTe || d.nameEn : d.nameEn;
}

export function mandalLabel(
  districtSlug: string,
  mandalSlug: string,
  te = true,
): string {
  const d = getGeoDistrict(districtSlug);
  const m = d?.mandals.find((x) => x.slug === mandalSlug);
  if (!m) return mandalSlug;
  return te ? m.nameTe || m.nameEn : m.nameEn;
}

export function readAttempts(): QuizAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuizAttempt[];
    return Array.isArray(parsed) ? parsed.slice(-100) : [];
  } catch {
    return [];
  }
}

export function persistAttempt(attempt: QuizAttempt): void {
  if (typeof window === "undefined") return;
  try {
    const list = readAttempts();
    list.push(attempt);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(list.slice(-100)));
  } catch {
    /* quota */
  }
}

export function writeSession(reg: QuizRegistrant): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(reg));
  } catch {
    /* ignore */
  }
}

export function readSession(): QuizRegistrant | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUIZ_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizRegistrant;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUIZ_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function verifyUrl(certificateId: string): string {
  return `https://www.nayisamakhya.org/quiz?cert=${encodeURIComponent(certificateId)}`;
}

export function buildCertificateShareMessage(opts: {
  name: string;
  score: number;
  total: number;
  certificateId: string;
  district: string;
  mandal: string;
}): string {
  const place = `${mandalLabel(opts.district, opts.mandal)} · ${districtLabel(opts.district)}`;
  return (
    `⚖️ *నాయీ సమాఖ్య — చట్ట హక్కుల అన్వేషి*\n\n` +
    `🏆 *ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు*\n` +
    `👤 ${opts.name}\n` +
    `📍 ${place}\n` +
    `✅ స్కోర్: ${opts.score}/${opts.total}\n` +
    `🆔 ${opts.certificateId}\n\n` +
    `👉 క్విజ్: https://www.nayisamakhya.org/quiz\n` +
    `🤝 నాయీ సమాఖ్య తెలంగాణ`
  );
}

export function whatsAppShareHref(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/** Legal Advocacy Cell — prefer district hub, else helpline. */
export function advocacyWhatsAppHref(districtSlug?: string): string {
  if (districtSlug) {
    const hub = resolveRegionalHubForDistrict(districtSlug);
    if (hub?.inviteUrl && !hub.inviteUrl.includes("sample-")) {
      return hub.inviteUrl;
    }
    if (hub?.helplineUrl) return hub.helplineUrl;
  }
  return `${HELPLINE_WA_URL}?text=${encodeURIComponent(
    "నమస్కారం — చట్ట హక్కుల క్విజ్ పూర్తి చేశాను. లీగల్ అడ్వకసీ సెల్ సహాయం కావాలి (G.O. 23 / మున్సిపల్ హక్కులు).",
  )}`;
}

export { QUIZ_PASS_THRESHOLD, HELPLINE_WA_URL };
