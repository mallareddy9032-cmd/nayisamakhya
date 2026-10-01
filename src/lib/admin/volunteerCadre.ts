/**
 * Unified Volunteer Cadre aggregation for the Admin Portal desk.
 * Sources: Supabase (volunteers / quiz_records / surveys) → localStorage → seed roster.
 */

import { getGeoDistrict } from "@/data/telanganaGeo";
import { isSupabaseEnvReady, supabase } from "@/lib/supabaseClient";
import { readLocalSurveys, type SurveyWithRef } from "@/lib/moderation/csvExport";
import { readLocalReels } from "@/lib/reels/store";
import { mapDbRow as mapVolunteerDbRow, readLocalVolunteers } from "@/lib/sprint/volunteers";
import { readAttempts } from "@/lib/quiz/store";
import { QUIZ_PASS_THRESHOLD } from "@/types/quiz";
import { reelCategoryLabel, type ReelSubmission } from "@/types/reels";
import type { Volunteer } from "@/types/volunteer";
import type { QuizAttempt } from "@/types/quiz";

export type CadreChannel = "sprint" | "legal" | "reels" | "survey";

export type CadreStatus = "certified" | "active";

export type CadreRow = {
  id: string;
  regId: string;
  dateIso: string;
  name: string;
  phone: string;
  districtSlug: string;
  mandalSlug: string;
  channel: CadreChannel;
  merit: string;
  status: CadreStatus;
  /** Sprint referral completions */
  completedCount?: number;
  /** Quiz score out of 10 */
  quizScore?: number;
  /** Survey household flag / USCNO */
  uscno?: string;
};

export type CadreMetrics = {
  totalCadre: number;
  sprintLeaders: number;
  legalAdvocates: number;
  verifiedSurveys: number;
};

export type CadreBundle = {
  rows: CadreRow[];
  volunteers: Volunteer[];
  quizRecords: QuizAttempt[];
  surveys: SurveyWithRef[];
  reels: ReelSubmission[];
  source: "supabase" | "local" | "seed";
  usedSeed: boolean;
};

export const CHANNEL_FILTERS = [
  { id: "all" as const, labelTe: "అన్నీ", labelEn: "All" },
  { id: "sprint" as const, labelTe: "🏃 మండల స్ప్రింట్", labelEn: "Sprint" },
  { id: "reels" as const, labelTe: "🎥 మన కళ రీల్స్", labelEn: "Reels" },
  { id: "legal" as const, labelTe: "⚖️ లీగల్ సెల్", labelEn: "Legal" },
  { id: "survey" as const, labelTe: "📋 సర్వేలు", labelEn: "Surveys" },
];

export type ChannelFilterId = (typeof CHANNEL_FILTERS)[number]["id"];

export function districtLabel(slug: string, te = true): string {
  if (!slug) return "—";
  const d = getGeoDistrict(slug);
  if (!d) return slug;
  return te ? d.nameTe || d.nameEn : d.nameEn;
}

export function mandalLabel(
  districtSlug: string,
  mandalSlug: string,
  te = true,
): string {
  if (!mandalSlug) return "—";
  const d = getGeoDistrict(districtSlug);
  const m = d?.mandals.find((x) => x.slug === mandalSlug);
  if (!m) return mandalSlug;
  return te ? m.nameTe || m.nameEn : m.nameEn;
}

export function channelBadge(channel: CadreChannel): {
  te: string;
  en: string;
  className: string;
} {
  switch (channel) {
    case "sprint":
      return {
        te: "స్ప్రింట్",
        en: "Sprint",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    case "legal":
      return {
        te: "లీగల్",
        en: "Legal",
        className: "bg-slate-100 text-slate-800 border-slate-300",
      };
    case "reels":
      return {
        te: "రీల్స్",
        en: "Reels",
        className: "bg-amber-50 text-amber-900 border-amber-200",
      };
    case "survey":
      return {
        te: "సర్వే",
        en: "Survey",
        className: "bg-warm text-ink border-line",
      };
  }
}

export function formatCadreDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("te-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function waMeHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry =
    digits.length === 10 ? `91${digits}` : digits.replace(/^\+/, "");
  return `https://wa.me/${withCountry}`;
}

function shortReg(prefix: string, seed: string): string {
  const clean = seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const tail = (clean.slice(-6) || "000000").padStart(6, "0");
  return `NS-VOL-${prefix}-${tail}`;
}

export function volunteerToCadre(v: Volunteer): CadreRow {
  const count = v.completedCount || 0;
  return {
    id: `sprint:${v.id}`,
    regId: shortReg("SPR", v.refCode || v.id),
    dateIso: v.createdAt || v.updatedAt || new Date().toISOString(),
    name: v.name,
    phone: v.phone,
    districtSlug: v.district,
    mandalSlug: v.mandal,
    channel: "sprint",
    merit:
      count > 0
        ? `${count} Surveys Completed`
        : "Active referrals pending",
    status: v.status === "certified" || count >= 15 ? "certified" : "active",
    completedCount: count,
  };
}

export function quizToCadre(q: QuizAttempt): CadreRow {
  const passed = q.passed || q.score >= QUIZ_PASS_THRESHOLD;
  return {
    id: `legal:${q.id}`,
    regId: shortReg("LEG", q.certificateId || q.id),
    dateIso: q.completedAt || new Date().toISOString(),
    name: q.name,
    phone: q.phone,
    districtSlug: q.district,
    mandalSlug: q.mandal,
    channel: "legal",
    merit: `Quiz: ${q.score}/${q.total || 10}`,
    status: passed ? "certified" : "active",
    quizScore: q.score,
  };
}

export function surveyToCadre(s: SurveyWithRef): CadreRow {
  const uscno = s.uscno?.trim();
  return {
    id: `survey:${s.id}`,
    regId: shortReg("SRV", s.referenceId || s.refCode || s.id),
    dateIso: s.timestamp || new Date().toISOString(),
    name: s.fullName,
    phone: s.phone,
    districtSlug: s.districtSlug,
    mandalSlug: s.mandalSlug,
    channel: "survey",
    merit: uscno
      ? `USCNO ${uscno}`
      : `Household · ${s.totalFamilyMembers || 0} members`,
    status: "active",
    uscno,
  };
}

export function reelToCadre(r: ReelSubmission): CadreRow {
  const label = reelCategoryLabel(r.category);
  const short =
    r.category === "salon_craft"
      ? "Salon Craft Reel"
      : r.category === "nadaswaram_music"
        ? "Nadaswaram Reel"
        : "Youth Education Reel";
  return {
    id: `reels:${r.id}`,
    regId: shortReg("REL", r.id),
    dateIso: r.createdAt || new Date().toISOString(),
    name: r.creatorName,
    phone: r.phone,
    districtSlug: r.districtSlug,
    mandalSlug: r.mandalSlug,
    channel: "reels",
    merit: short || label,
    status:
      r.status === "featured" || r.status === "approved"
        ? "certified"
        : "active",
  };
}

/** Standard seed roster — Kodad, Madhira, Sircilla, Nizamabad (never blank UI). */
export const SEED_CADRE_ROSTER: CadreRow[] = [
  {
    id: "seed:sprint-kodad",
    regId: "NS-VOL-SPR-KOD018",
    dateIso: "2026-09-14T09:00:00.000Z",
    name: "శ్రీనివాస్ నాయి",
    phone: "9876543210",
    districtSlug: "suryapet",
    mandalSlug: "kodad",
    channel: "sprint",
    merit: "18 Surveys Completed",
    status: "certified",
    completedCount: 18,
  },
  {
    id: "seed:sprint-madhira",
    regId: "NS-VOL-SPR-MAD012",
    dateIso: "2026-09-16T10:30:00.000Z",
    name: "వెంకట రమణ",
    phone: "9876543211",
    districtSlug: "khammam",
    mandalSlug: "madhira",
    channel: "sprint",
    merit: "12 Surveys Completed",
    status: "active",
    completedCount: 12,
  },
  {
    id: "seed:legal-sircilla",
    regId: "NS-VOL-LEG-SIR009",
    dateIso: "2026-09-18T14:00:00.000Z",
    name: "లక్ష్మీ నరసింహ",
    phone: "9876543212",
    districtSlug: "rajanna-sircilla",
    mandalSlug: "sircilla",
    channel: "legal",
    merit: "Quiz: 9/10",
    status: "certified",
    quizScore: 9,
  },
  {
    id: "seed:legal-nizamabad",
    regId: "NS-VOL-LEG-NZB008",
    dateIso: "2026-09-19T11:20:00.000Z",
    name: "పద్మావతి దేవి",
    phone: "9876543213",
    districtSlug: "nizamabad",
    mandalSlug: "nizamabad-north",
    channel: "legal",
    merit: "Quiz: 8/10",
    status: "certified",
    quizScore: 8,
  },
  {
    id: "seed:reels-kodad",
    regId: "NS-VOL-REL-KOD001",
    dateIso: "2026-09-12T08:30:00.000Z",
    name: "రాములు నాయి",
    phone: "9000000001",
    districtSlug: "suryapet",
    mandalSlug: "kodad",
    channel: "reels",
    merit: "Salon Craft Reel",
    status: "certified",
  },
  {
    id: "seed:survey-madhira",
    regId: "NS-VOL-SRV-MAD077",
    dateIso: "2026-09-20T16:45:00.000Z",
    name: "అనితా మంగళి",
    phone: "9876543214",
    districtSlug: "khammam",
    mandalSlug: "madhira",
    channel: "survey",
    merit: "USCNO 1234 5678 9012",
    status: "active",
    uscno: "1234 5678 9012",
  },
];

function mapQuizDbRow(row: Record<string, unknown>): QuizAttempt | null {
  const name = String(row.name || "").trim();
  const phone = String(row.phone || "").replace(/\D/g, "");
  if (!name && !phone) return null;
  const score = Number(row.score ?? 0);
  const total = Number(row.total ?? 10) || 10;
  const passed =
    row.passed === true ||
    String(row.passed) === "true" ||
    score >= QUIZ_PASS_THRESHOLD;
  return {
    id: String(row.id || `quiz-${phone || Date.now()}`),
    name,
    phone,
    district: String(row.district || row.district_slug || ""),
    mandal: String(row.mandal || row.mandal_slug || ""),
    score,
    total,
    answers: Array.isArray(row.answers) ? (row.answers as number[]) : [],
    certificateId: row.certificate_id
      ? String(row.certificate_id)
      : row.certificateId
        ? String(row.certificateId)
        : null,
    passed,
    completedAt: String(
      row.completed_at || row.completedAt || new Date().toISOString(),
    ),
  };
}

function mapSurveyDbRow(row: Record<string, unknown>): SurveyWithRef | null {
  const payload =
    row.payload && typeof row.payload === "object"
      ? (row.payload as Record<string, unknown>)
      : {};
  const fullName =
    String(payload.fullName || row.head_name || "").trim();
  const phone =
    String(payload.phone || row.whatsapp || "").replace(/\D/g, "");
  if (!fullName && !phone) return null;
  const familyMembers = Array.isArray(payload.familyMembers)
    ? (payload.familyMembers as SurveyWithRef["familyMembers"])
    : [];
  return {
    id: String(row.id || row.reference_id || `${phone}-${Date.now()}`),
    timestamp: String(
      payload.timestamp || row.created_at || new Date().toISOString(),
    ),
    fullName,
    phone,
    subCaste: (payload.subCaste ||
      row.community_wing ||
      "nayi_brahmin") as SurveyWithRef["subCaste"],
    districtSlug: String(
      payload.districtSlug || row.district_slug || "",
    ),
    areaType: (payload.areaType || "rural") as SurveyWithRef["areaType"],
    mandalSlug: String(payload.mandalSlug || row.mandal_slug || ""),
    wardOrPanchayat: String(
      payload.wardOrPanchayat || row.gram_panchayat || "",
    ),
    totalFamilyMembers:
      Number(payload.totalFamilyMembers) || familyMembers.length || 0,
    studentsCount: Number(payload.studentsCount) || 0,
    familyMembers,
    hasMatrimonialCandidate: Boolean(payload.hasMatrimonialCandidate),
    primaryProfession: (payload.primaryProfession ||
      row.occupation ||
      "other") as SurveyWithRef["primaryProfession"],
    shopTenancy: (payload.shopTenancy ||
      "na") as SurveyWithRef["shopTenancy"],
    tradeLicenseStatus: (payload.tradeLicenseStatus ||
      "na_rural") as SurveyWithRef["tradeLicenseStatus"],
    uscno: payload.uscno ? String(payload.uscno) : undefined,
    go23Status: (payload.go23Status || "na") as SurveyWithRef["go23Status"],
    welfareReceived: Array.isArray(payload.welfareReceived)
      ? (payload.welfareReceived as string[])
      : [],
    immediateGrievance: String(payload.immediateGrievance || ""),
    desiredAction: (payload.desiredAction ||
      "whatsapp_updates") as SurveyWithRef["desiredAction"],
    declarationAccepted: Boolean(payload.declarationAccepted ?? true),
    refCode: payload.refCode ? String(payload.refCode) : undefined,
    referenceId: row.reference_id
      ? String(row.reference_id)
      : payload.referenceId
        ? String(payload.referenceId)
        : undefined,
  };
}

async function safeSelect(
  table: string,
): Promise<Record<string, unknown>[]> {
  if (!isSupabaseEnvReady()) return [];
  try {
    const { data, error } = await supabase.from(table).select("*").limit(2000);
    if (error || !data) return [];
    return data as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export function aggregateCadreRows(input: {
  volunteers: Volunteer[];
  quizRecords: QuizAttempt[];
  surveys: SurveyWithRef[];
  reels?: ReelSubmission[];
}): CadreRow[] {
  const rows: CadreRow[] = [
    ...input.volunteers.map(volunteerToCadre),
    ...input.quizRecords.map(quizToCadre),
    ...input.surveys.map(surveyToCadre),
    ...(input.reels || []).map(reelToCadre),
  ];
  rows.sort(
    (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime(),
  );
  return rows;
}

export function computeMetrics(
  rows: CadreRow[],
  surveyCount: number,
): CadreMetrics {
  return {
    totalCadre: rows.length,
    sprintLeaders: rows.filter(
      (r) => r.channel === "sprint" && (r.completedCount || 0) > 0,
    ).length,
    legalAdvocates: rows.filter(
      (r) =>
        r.channel === "legal" &&
        (r.quizScore ?? 0) >= QUIZ_PASS_THRESHOLD,
    ).length,
    verifiedSurveys: surveyCount,
  };
}

export async function loadCadreBundle(): Promise<CadreBundle> {
  const [volRows, quizRows, surveyRows] = await Promise.all([
    safeSelect("volunteers"),
    safeSelect("quiz_records"),
    safeSelect("surveys"),
  ]);

  let volunteers = volRows.map(mapVolunteerDbRow).filter((v) => v.name || v.phone);
  let quizRecords = quizRows
    .map(mapQuizDbRow)
    .filter((q): q is QuizAttempt => Boolean(q));
  let surveys = surveyRows
    .map(mapSurveyDbRow)
    .filter((s): s is SurveyWithRef => Boolean(s));

  const localVolunteers = readLocalVolunteers();
  const localQuiz = readAttempts();
  const localSurveys = readLocalSurveys();
  const localReels = readLocalReels();

  if (volunteers.length === 0 && localVolunteers.length > 0) {
    volunteers = localVolunteers;
  }
  if (quizRecords.length === 0 && localQuiz.length > 0) {
    quizRecords = localQuiz;
  }
  if (surveys.length === 0 && localSurveys.length > 0) {
    surveys = localSurveys;
  }

  const remoteHit =
    volRows.length > 0 || quizRows.length > 0 || surveyRows.length > 0;
  const localHit =
    localVolunteers.length > 0 ||
    localQuiz.length > 0 ||
    localSurveys.length > 0 ||
    localReels.length > 0;

  let rows = aggregateCadreRows({
    volunteers,
    quizRecords,
    surveys,
    reels: localReels,
  });

  let usedSeed = false;
  let source: CadreBundle["source"] = remoteHit
    ? "supabase"
    : localHit
      ? "local"
      : "seed";

  if (rows.length === 0) {
    rows = SEED_CADRE_ROSTER.slice();
    usedSeed = true;
    source = "seed";
    // Synthetic backing stores so CSV exports still work on empty DBs
    volunteers = SEED_CADRE_ROSTER.filter((r) => r.channel === "sprint").map(
      (r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        district: r.districtSlug,
        mandal: r.mandalSlug,
        refCode: r.regId.replace("NS-VOL-", "SARATHI-"),
        completedCount: r.completedCount || 0,
        status: r.status === "certified" ? "certified" : "active",
        createdAt: r.dateIso,
      }),
    );
    quizRecords = SEED_CADRE_ROSTER.filter((r) => r.channel === "legal").map(
      (r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        district: r.districtSlug,
        mandal: r.mandalSlug,
        score: r.quizScore || 0,
        total: 10,
        answers: [],
        certificateId: r.regId,
        passed: (r.quizScore || 0) >= QUIZ_PASS_THRESHOLD,
        completedAt: r.dateIso,
      }),
    );
    surveys = SEED_CADRE_ROSTER.filter((r) => r.channel === "survey").map(
      (r) =>
        ({
          id: r.id,
          timestamp: r.dateIso,
          fullName: r.name,
          phone: r.phone,
          subCaste: "nayi_brahmin",
          districtSlug: r.districtSlug,
          areaType: "rural",
          mandalSlug: r.mandalSlug,
          wardOrPanchayat: "",
          totalFamilyMembers: 4,
          studentsCount: 1,
          familyMembers: [],
          hasMatrimonialCandidate: false,
          primaryProfession: "salon_owner",
          shopTenancy: "rented_private",
          tradeLicenseStatus: "valid",
          uscno: r.uscno,
          go23Status: "pending",
          welfareReceived: [],
          immediateGrievance: "",
          desiredAction: "whatsapp_updates",
          declarationAccepted: true,
          referenceId: r.regId,
        }) satisfies SurveyWithRef,
    );
  }

  return {
    rows,
    volunteers,
    quizRecords,
    surveys,
    reels: localReels,
    source,
    usedSeed,
  };
}

/** Telugu-friendly CSV column labels for survey export. */
export const SURVEY_CSV_LABELS: Record<string, string> = {
  id: "నమోదు ID (ID)",
  timestamp: "తేదీ (Timestamp)",
  fullName: "పూర్తి పేరు (Full Name)",
  phone: "వాట్సాప్ (WhatsApp)",
  districtSlug: "జిల్లా (District)",
  mandalSlug: "మండలం (Mandal)",
  subCaste: "ఉప కులం (Sub-Caste)",
  totalFamilyMembers: "కుటుంబ సభ్యులు (Family Members)",
  uscno: "USCNO",
  go23Status: "జీ.ఓ. 23 స్థితి (G.O. 23)",
  immediateGrievance: "ఫిర్యాదు (Grievance)",
  referenceId: "రిఫరెన్స్ (Reference)",
  refCode: "సారథి కోడ్ (Ref Code)",
};

export const LEGAL_CSV_LABELS: Record<string, string> = {
  id: "నమోదు ID (ID)",
  name: "పూర్తి పేరు (Full Name)",
  phone: "వాట్సాప్ (WhatsApp)",
  district: "జిల్లా (District)",
  mandal: "మండలం (Mandal)",
  score: "స్కోర్ (Score)",
  total: "మొత్తం (Total)",
  certificateId: "సర్టిఫికేట్ ID",
  passed: "ఉత్తీర్ణత (Passed)",
  completedAt: "తేదీ (Completed At)",
};

export const VOLUNTEER_CSV_LABELS: Record<string, string> = {
  id: "నమోదు ID (ID)",
  name: "పూర్తి పేరు (Full Name)",
  phone: "వాట్సాప్ (WhatsApp)",
  district: "జిల్లా (District)",
  mandal: "మండలం (Mandal)",
  refCode: "సారథి కోడ్ (Ref Code)",
  completedCount: "పూర్తయిన సర్వేలు (Surveys Completed)",
  status: "స్థితి (Status)",
  createdAt: "తేదీ (Created At)",
};

export function surveysForExport(surveys: SurveyWithRef[]): Record<string, unknown>[] {
  return surveys.map((s) => ({
    id: s.id,
    timestamp: s.timestamp,
    fullName: s.fullName,
    phone: s.phone,
    districtSlug: districtLabel(s.districtSlug, false),
    mandalSlug: mandalLabel(s.districtSlug, s.mandalSlug, false),
    subCaste: s.subCaste,
    totalFamilyMembers: s.totalFamilyMembers,
    uscno: s.uscno || "",
    go23Status: s.go23Status,
    immediateGrievance: s.immediateGrievance,
    referenceId: s.referenceId || "",
    refCode: s.refCode || "",
  }));
}

export function legalAdvocatesForExport(
  quizRecords: QuizAttempt[],
): Record<string, unknown>[] {
  return quizRecords
    .filter((q) => q.score >= QUIZ_PASS_THRESHOLD)
    .map((q) => ({
      id: q.id,
      name: q.name,
      phone: q.phone,
      district: districtLabel(q.district, false),
      mandal: mandalLabel(q.district, q.mandal, false),
      score: q.score,
      total: q.total || 10,
      certificateId: q.certificateId || "",
      passed: q.passed ? "Yes" : "No",
      completedAt: q.completedAt,
    }));
}

export function volunteersForExport(
  volunteers: Volunteer[],
): Record<string, unknown>[] {
  return volunteers.map((v) => ({
    id: v.id,
    name: v.name,
    phone: v.phone,
    district: districtLabel(v.district, false),
    mandal: mandalLabel(v.district, v.mandal, false),
    refCode: v.refCode,
    completedCount: v.completedCount,
    status: v.status,
    createdAt: v.createdAt || "",
  }));
}
