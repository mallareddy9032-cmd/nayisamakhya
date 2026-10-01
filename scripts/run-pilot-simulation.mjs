#!/usr/bin/env node
/**
 * NayiSamakhya 2.0 — End-to-end Pilot Testing Harness
 *
 * Simulates all 5 Suryapet field-coordinator cohorts:
 *   1. Kodad Town household survey
 *   2. Chilkur / Munagala rural survey
 *   3. Huzurnagar Civic Rights Quiz → Legal Advocacy Cell
 *   4. Suryapet Urban G.O. 23 grievance docket
 *   5. Mellachervu bulk procurement indent
 *
 * Usage:
 *   npm run test:pilot
 *   # or: node --env-file=.env.local scripts/run-pilot-simulation.mjs
 *
 * Env (from .env.local / process):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (optional — skips cleanly if unset)
 *   NEXT_PUBLIC_SITE_URL (optional — for /api/notify POST fallback)
 *
 * Exit codes:
 *   0 — harness completed (individual cohorts may soft-skip missing tables)
 *   1 — fatal config / unexpected crash
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_LOCAL = resolve(ROOT, ".env.local");
const ENV_FALLBACK = resolve(ROOT, ".env");
const ARTIFACT_DIR = resolve(ROOT, "scripts/.pilot-artifacts");
const QUIZ_PASS_THRESHOLD = 7;

/** Parse KEY=VALUE dotenv without overwriting existing process.env. */
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(ENV_FALLBACK);
loadEnvFile(ENV_LOCAL);

const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pvhnwoukpccgeoqdsevm.supabase.co"
).replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const SUPABASE_KEY = SERVICE_KEY || ANON_KEY;
const KEY_MODE = SERVICE_KEY ? "service_role" : ANON_KEY ? "anon" : "none";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
const TELEGRAM_CHAT =
  process.env.TELEGRAM_CHAT_ID?.trim() ||
  process.env.TELEGRAM_ADMIN_CHANNEL_ID?.trim() ||
  "";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  ""
).replace(/\/$/, "");
const NOTIFY_URL = SITE_URL
  ? `${SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`}/api/notify`
  : "https://www.nayisamakhya.org/api/notify";

const RUN_ID = `PILOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString(36).toUpperCase()}`;

const results = [];

function log(section, msg) {
  const stamp = new Date().toISOString().slice(11, 23);
  console.log(`[${stamp}] [${section}] ${msg}`);
}

function hr(ms) {
  return `${ms.toFixed(1)}ms`;
}

function isMissingTable(error) {
  if (!error) return false;
  const msg = String(error.message || error.details || error || "").toLowerCase();
  const code = String(error.code || "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("could not find the table") ||
    (msg.includes("does not exist") && msg.includes("table"))
  );
}

function isMissingColumn(error) {
  if (!error) return false;
  const msg = String(error.message || error.details || error || "").toLowerCase();
  const code = String(error.code || "");
  return (
    code === "PGRST204" ||
    (msg.includes("could not find the") && msg.includes("column")) ||
    (msg.includes("schema cache") && msg.includes("column"))
  );
}

function clip(value, max) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
}

function buildReferenceId(districtSlug, mandalSlug) {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const n = Math.floor(1000 + Math.random() * 9000);
  return `NS-${districtSlug.slice(0, 3).toUpperCase()}-${mandalSlug.slice(0, 3).toUpperCase()}-${day}-${n}`;
}

/** UTF-8 BOM CSV — mirrors src/lib/exportToCSV.ts */
function exportToCSVString(rows, columnLabels) {
  if (!rows.length) return "\uFEFF";
  const keys = Object.keys(rows[0]);
  const header = keys
    .map((k) => (columnLabels && columnLabels[k] ? columnLabels[k] : k))
    .join(",");
  const body = rows.map((row) =>
    keys
      .map((key) => {
        let val = row[key];
        if (typeof val === "object" && val !== null) val = JSON.stringify(val);
        const stringVal = String(val ?? "").replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(","),
  );
  return "\uFEFF" + [header, ...body].join("\n");
}

function validateCsvBomAndTelugu(csv, sampleTelugu) {
  const checks = {
    startsWithBom: csv.charCodeAt(0) === 0xfeff || csv.startsWith("\uFEFF"),
    containsTelugu: sampleTelugu ? csv.includes(sampleTelugu) : true,
    noReplacementChar: !csv.includes("\uFFFD"),
    byteLength: Buffer.byteLength(csv, "utf8"),
  };
  checks.ok =
    checks.startsWithBom && checks.containsTelugu && checks.noReplacementChar;
  return checks;
}

async function sendTelegramDirect(text) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) {
    return { ok: false, skipped: true, reason: "telegram_unset", ms: 0 };
  }
  const t0 = performance.now();
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    const ms = performance.now() - t0;
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        skipped: false,
        reason: `telegram_http_${res.status}`,
        detail: clip(errText, 200),
        ms,
      };
    }
    return { ok: true, skipped: false, ms };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      reason: "telegram_fetch_failed",
      detail: clip(err?.message || err, 200),
      ms: performance.now() - t0,
    };
  }
}

/** Prefer production /api/notify for grievance; fall back to direct Bot API. */
async function dispatchWarRoom(kind, text, notifyBody) {
  if (kind === "grievance" && notifyBody) {
    const t0 = performance.now();
    try {
      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifyBody),
        signal: AbortSignal.timeout(12000),
      });
      const ms = performance.now() - t0;
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.ok) {
        return {
          channel: "api_notify",
          ok: true,
          skipped: Boolean(json?.telegram?.skipped),
          reason: json?.telegram?.reason,
          referenceId: json?.referenceId,
          ms,
        };
      }
      log(
        "telegram",
        `/api/notify soft-fail (${res.status}) — falling back to Bot API`,
      );
    } catch (err) {
      log(
        "telegram",
        `/api/notify unreachable (${clip(err?.message || err, 80)}) — Bot API fallback`,
      );
    }
  }
  const direct = await sendTelegramDirect(text);
  return { channel: "telegram_bot_api", ...direct };
}

async function timedInsert(supabase, table, row) {
  const t0 = performance.now();
  const { data, error } = await supabase.from(table).insert(row).select("*").maybeSingle();
  const ms = performance.now() - t0;
  return { data, error, ms };
}

function recordCohort(entry) {
  results.push(entry);
  const status = entry.status.toUpperCase();
  log(
    entry.cohort,
    `${status} db=${entry.db?.ok ? "ok" : entry.db?.skipped ? "skip" : "fail"} ` +
      `(${hr(entry.db?.ms || 0)}) tg=${entry.telegram?.ok ? "ok" : entry.telegram?.skipped ? "skip" : "fail"} ` +
      `csv=${entry.csv?.ok ? "ok" : "fail"}`,
  );
}

function getClient() {
  if (!SUPABASE_KEY) {
    console.error(
      "FATAL: Missing SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
        "Add them to .env.local (see .env.example).",
    );
    process.exit(1);
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Cohort payloads ──────────────────────────────────────────────────────────

function cohort1Survey() {
  const referenceId = buildReferenceId("suryapet", "kodad");
  const shop = "శ్రీ లక్ష్మి హెయిర్ స్టైల్స్";
  const owner = "లక్ష్మి నాయీ";
  const payload = {
    schema: "statewide_v1",
    pilot: true,
    pilotRunId: RUN_ID,
    cohort: 1,
    fullName: owner,
    phone: "9876543201",
    subCaste: "nayi_brahmin",
    districtSlug: "suryapet",
    areaType: "urban",
    mandalSlug: "kodad",
    wardOrPanchayat: "Kodad Town Ward 3",
    shopName: shop,
    totalFamilyMembers: 4,
    studentsCount: 1,
    familyMembers: [],
    hasMatrimonialCandidate: false,
    primaryProfession: "salon_owner",
    shopTenancy: "rented_private",
    monthlyRent: 8000,
    tradeLicenseStatus: "valid",
    uscno: "100234891024",
    connectedLoad: "1.5 kW",
    avgMonthlyUnits: 190,
    go23Status: "pending",
    welfareReceived: [],
    immediateGrievance: "G.O. 23 subsidy flag pending on Cat-I service",
    desiredAction: "petition",
    declarationAccepted: true,
    submittedAt: new Date().toISOString(),
  };
  // Live production surveys shape (OpenAPI) — preferred.
  const liveRow = {
    full_name: owner,
    phone: "9876543201",
    sub_caste: "nayi_brahmin",
    district: "suryapet",
    mandal: "kodad",
    household_count: 4,
    uscno: "100234891024",
    go23_status: "pending",
    shop_tenancy: "rented_private",
    monthly_rent: 8000,
    grievance_type: `pilot_c1|load:1.5kW|units:190|shop:${shop}|ref:${referenceId}`,
    volunteer_ref: RUN_ID,
  };
  // Migration 002 shape — fallback if live columns absent.
  const migrationRow = {
    reference_id: referenceId,
    district_slug: "suryapet",
    mandal_slug: "kodad",
    gram_panchayat: "Kodad Town Ward 3",
    head_name: owner,
    whatsapp: "9876543201",
    community_wing: "nayi_brahmin",
    occupation: "salon_owner",
    payload,
  };
  return {
    label: "Cohort 1 — Kodad Town Household Survey",
    cohort: "C1-kodad-survey",
    table: "surveys",
    teluguSample: shop,
    rowVariants: [liveRow, migrationRow],
    row: liveRow,
    csvRow: {
      cohort: 1,
      reference_id: referenceId,
      shop_name: shop,
      owner,
      uscno: "100234891024",
      connected_load: "1.5 kW",
      avg_monthly_units: 190,
      district: "సూర్యాపేట",
      mandal: "కోదాడ",
    },
    warRoomText:
      `🧪 <b>PILOT C1 · కోదాడ హౌస్‌హోల్డ్ సర్వే</b>\n` +
      `• షాపు: ${shop}\n` +
      `• USCNO: 100234891024 · లోడ్ 1.5 kW · 190 యూనిట్లు\n` +
      `• Ref: ${referenceId}\n` +
      `• Run: ${RUN_ID}`,
  };
}

function cohort2Survey() {
  const referenceId = buildReferenceId("suryapet", "chilkur");
  const shop = "వెంకటేశ్వర సెలూన్";
  const owner = "రాముడు నాయీ";
  const payload = {
    schema: "statewide_v1",
    pilot: true,
    pilotRunId: RUN_ID,
    cohort: 2,
    fullName: owner,
    phone: "9876543202",
    subCaste: "nayi_brahmin",
    districtSlug: "suryapet",
    areaType: "rural",
    mandalSlug: "chilkur",
    wardOrPanchayat: "Chilkur GP (Munagala corridor)",
    shopName: shop,
    totalFamilyMembers: 5,
    studentsCount: 2,
    familyMembers: [],
    hasMatrimonialCandidate: false,
    primaryProfession: "salon_owner",
    shopTenancy: "owned",
    tradeLicenseStatus: "na_rural",
    uscno: "100234891089",
    commercialCategory: "Category-II",
    connectedLoad: "2 kW",
    avgMonthlyUnits: 210,
    go23Status: "rejected_commercial",
    welfareReceived: [],
    immediateGrievance: "Commercial Category-II misclassification — seek Cat-I + G.O.23",
    desiredAction: "coordinator_visit",
    declarationAccepted: true,
    submittedAt: new Date().toISOString(),
  };
  const liveRow = {
    full_name: owner,
    phone: "9876543202",
    sub_caste: "nayi_brahmin",
    district: "suryapet",
    mandal: "chilkur",
    household_count: 5,
    uscno: "100234891089",
    go23_status: "rejected_commercial",
    shop_tenancy: "owned",
    monthly_rent: null,
    grievance_type: `pilot_c2|Commercial Category-II|shop:${shop}|owner:${owner}|ref:${referenceId}`,
    volunteer_ref: RUN_ID,
  };
  const migrationRow = {
    reference_id: referenceId,
    district_slug: "suryapet",
    mandal_slug: "chilkur",
    gram_panchayat: "Chilkur GP",
    head_name: owner,
    whatsapp: "9876543202",
    community_wing: "nayi_brahmin",
    occupation: "salon_owner",
    payload,
  };
  return {
    label: "Cohort 2 — Chilkur / Munagala Rural Survey",
    cohort: "C2-chilkur-survey",
    table: "surveys",
    teluguSample: shop,
    rowVariants: [liveRow, migrationRow],
    row: liveRow,
    csvRow: {
      cohort: 2,
      reference_id: referenceId,
      shop_name: shop,
      owner,
      uscno: "100234891089",
      commercial_category: "Category-II",
      district: "సూర్యాపేట",
      mandal: "చిలుకూరు",
    },
    warRoomText:
      `🧪 <b>PILOT C2 · చిలుకూరు / మునగాల రూరల్ సర్వే</b>\n` +
      `• షాపు: ${shop}\n` +
      `• యజమాని: ${owner}\n` +
      `• USCNO: 100234891089 · Commercial Category-II\n` +
      `• Ref: ${referenceId}\n` +
      `• Run: ${RUN_ID}`,
  };
}

function cohort3Quiz() {
  const cert = "NS-CERT-2026-HZR01";
  const name = "రమేష్ నాయీ";
  const score = 9;
  const total = 10;
  const passed = score >= QUIZ_PASS_THRESHOLD;
  const answers = [0, 1, 2, 0, 1, 2, 0, 1, 0, 1];
  // Live production quiz_records shape.
  const liveRow = {
    full_name: name,
    phone: "9876543203",
    district: "suryapet",
    mandal: "huzurnagar",
    score,
    certificate_id: cert,
    is_legal_advocate: passed,
  };
  // Migration 017 shape — fallback.
  const migrationRow = {
    name,
    phone: "9876543203",
    district: "suryapet",
    mandal: "huzurnagar",
    score,
    total,
    answers,
    certificate_id: cert,
    passed,
    completed_at: new Date().toISOString(),
  };
  return {
    label: "Cohort 3 — Huzurnagar Civic Rights Quiz & Legal Cell",
    cohort: "C3-huzurnagar-quiz",
    table: "quiz_records",
    teluguSample: name,
    rowVariants: [liveRow, migrationRow],
    row: liveRow,
    csvRow: {
      cohort: 3,
      name,
      phone: "9876543203",
      district: "సూర్యాపేట",
      mandal: "హుజూర్‌నగర్",
      score,
      total,
      certificate_id: cert,
      passed: passed ? "Yes" : "No",
      legal_advocacy_eligible: passed ? "Yes" : "No",
      is_legal_advocate: passed ? "Yes" : "No",
    },
    eligibility: {
      threshold: QUIZ_PASS_THRESHOLD,
      score,
      eligible: passed,
      flag: "is_legal_advocate",
    },
    warRoomText:
      `🧪 <b>PILOT C3 · హుజూర్‌నగర్ చట్ట హక్కుల క్విజ్</b>\n` +
      `• పేరు: ${name}\n` +
      `• స్కోర్: ${score}/${total} (≥${QUIZ_PASS_THRESHOLD} → Legal Advocacy Cell)\n` +
      `• Certificate: ${cert}\n` +
      `• Eligible: ${passed ? "✅ YES" : "❌ NO"} (is_legal_advocate=${passed})\n` +
      `• Run: ${RUN_ID}`,
  };
}

function cohort4Grievance() {
  const referenceId = `NS-GO23-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  const shop = "సూర్యాపేట సిటీ సెలూన్";
  const owner = "శ్రీనివాస్ నాయీ";
  const narrative =
    "Arbitrary commercial billing dispute: ₹4,800 levied for only 180 units consumption. " +
    "Request ADE Operations Suryapet (TGSPDCL) to reverse Cat-II overbilling under G.O. Ms. No. 23.";
  return {
    label: "Cohort 4 — Suryapet Urban G.O. 23 Grievance Docket",
    cohort: "C4-suryapet-grievance",
    table: "grievances",
    teluguSample: shop,
    rowVariants: [
      {
        reference_id: referenceId,
        full_name: owner,
        shop_name: shop,
        mobile: "9876543204",
        uscno: "100234891156",
        district_slug: "suryapet",
        district_te: "సూర్యాపేట",
        mandal_slug: "suryapet",
        mandal_te: "సూర్యాపేట అర్బన్",
        discom: "TGSPDCL",
        connected_load: "1.5 kW",
        avg_monthly_units: "180",
        grievance_type: "commercial_overbilling",
        grievance_label_te: "B. ఆర్బిట్రరీ కమర్షియల్ బిల్లింగ్ / అధిక బిల్లు రావడం",
        narrative,
        payload: {
          type: "grievance",
          source: "pilot_simulation",
          pilotRunId: RUN_ID,
          disputedAmountInr: 4800,
          consumptionUnits: 180,
          targetOffice: "ADE Operations Suryapet",
          discom: "TGSPDCL",
          notified_at: new Date().toISOString(),
        },
      },
    ],
    row: {
      reference_id: referenceId,
      full_name: owner,
      shop_name: shop,
      mobile: "9876543204",
      uscno: "100234891156",
      district_slug: "suryapet",
      district_te: "సూర్యాపేట",
      mandal_slug: "suryapet",
      mandal_te: "సూర్యాపేట అర్బన్",
      discom: "TGSPDCL",
      connected_load: "1.5 kW",
      avg_monthly_units: "180",
      grievance_type: "commercial_overbilling",
      grievance_label_te: "B. ఆర్బిట్రరీ కమర్షియల్ బిల్లింగ్ / అధిక బిల్లు రావడం",
      narrative,
      payload: {
        type: "grievance",
        source: "pilot_simulation",
        pilotRunId: RUN_ID,
        disputedAmountInr: 4800,
        consumptionUnits: 180,
        targetOffice: "ADE Operations Suryapet",
        discom: "TGSPDCL",
        notified_at: new Date().toISOString(),
      },
    },
    csvRow: {
      cohort: 4,
      reference_id: referenceId,
      shop_name: shop,
      owner,
      uscno: "100234891156",
      discom: "TGSPDCL",
      target: "ADE Operations Suryapet",
      disputed_amount_inr: 4800,
      consumption_units: 180,
      district: "సూర్యాపేట",
      mandal: "సూర్యాపేట అర్బన్",
    },
    notifyBody: {
      type: "grievance",
      fullName: owner,
      shopName: shop,
      uscno: "100234891156",
      mandal: "సూర్యాపేట అర్బన్",
      district: "సూర్యాపేట",
      grievanceType: "B. ఆర్బిట్రరీ కమర్షియల్ బిల్లింగ్ / అధిక బిల్లు రావడం",
      grievanceTypeId: "commercial_overbilling",
      discom: "TGSPDCL",
      mobile: "9876543204",
      connectedLoad: "1.5 kW",
      avgMonthlyUnits: "180",
      narrative,
      districtSlug: "suryapet",
      mandalSlug: "suryapet",
      referenceId,
    },
    warRoomText:
      `🧪 <b>PILOT C4 · సూర్యాపేట G.O.23 ఫిర్యాదు</b>\n` +
      `• షాపు: ${shop}\n` +
      `• వివాదం: ₹4,800 / 180 యూనిట్లు\n` +
      `• DISCOM: TGSPDCL · ADE Operations Suryapet\n` +
      `• Ref: ${referenceId}\n` +
      `• Run: ${RUN_ID}`,
  };
}

function cohort5Order() {
  const orderId = `INDENT-mellachervu-${Math.floor(1000 + Math.random() * 9000)}`;
  const salon = "మేళ్లచెరువు నాయీ స్టూడియో";
  const owner = "వెంకట్ నాయీ";
  // Catalog hub prices: barber ₹850, spa ₹1450 → 2×850+1450=₹3,150.
  // Pilot brief specifies scenario value ₹6,500 (includes logistics / kit uplift).
  const lines = [
    {
      packageId: "barber",
      nameTe: "నిత్యవసర బార్బర్ ప్యాక్",
      nameEn: "Daily Barber Essentials Kit",
      qty: 2,
      hubPriceInr: 850,
      mrpInr: 1400,
      lineTotalInr: 1700,
    },
    {
      packageId: "spa",
      nameTe: "హెయిర్ ట్రీట్‌మెంట్ & స్పా ప్యాక్",
      nameEn: "Hair Spa & Treatment Pack",
      qty: 1,
      hubPriceInr: 1450,
      mrpInr: 2350,
      lineTotalInr: 1450,
    },
  ];
  const catalogTotal = lines.reduce((s, l) => s + l.lineTotalInr, 0);
  const pilotValueInr = 6500;
  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    salonName: salon,
    ownerName: owner,
    whatsapp: "9876543205",
    districtSlug: "suryapet",
    districtNameTe: "సూర్యాపేట",
    mandalSlug: "mellachervu",
    mandalNameTe: "మేళ్లచెరువు",
    payment: "cod_upi_hub",
    lines,
    totalItems: 3,
    catalogTotalInr: catalogTotal,
    totalInr: pilotValueInr,
    savingsInr: 1400 * 2 + 2350 - catalogTotal,
    pilot: true,
    pilotRunId: RUN_ID,
    storagePattern: "salon_hub_orders localStorage (no dedicated orders table)",
  };
  return {
    label: "Cohort 5 — Mellachervu Bulk Procurement Indent",
    cohort: "C5-mellachervu-procure",
    table: "orders",
    altTables: ["salon_hub_orders"],
    teluguSample: salon,
    rowVariants: [
      {
        id: orderId,
        created_at: order.createdAt,
        salon_name: salon,
        owner_name: owner,
        whatsapp: "9876543205",
        district_slug: "suryapet",
        mandal_slug: "mellachervu",
        total_inr: pilotValueInr,
        payload: order,
      },
    ],
    row: {
      id: orderId,
      created_at: order.createdAt,
      salon_name: salon,
      owner_name: owner,
      whatsapp: "9876543205",
      district_slug: "suryapet",
      mandal_slug: "mellachervu",
      total_inr: pilotValueInr,
      payload: order,
    },
    localOrder: order,
    csvRow: {
      cohort: 5,
      order_id: orderId,
      salon_name: salon,
      owner,
      items: "2× Daily Barber Kit + 1× Hair Spa Kit",
      catalog_total_inr: catalogTotal,
      pilot_value_inr: pilotValueInr,
      district: "సూర్యాపేట",
      mandal: "మేళ్లచెరువు",
    },
    warRoomText:
      `🧪 <b>PILOT C5 · మేళ్లచెరువు బల్క్ ప్రొక్యూర్‌మెంట్</b>\n` +
      `• సెలూన్: ${salon}\n` +
      `• ఆర్డర్: 2× Barber Kit + 1× Hair Spa Kit\n` +
      `• Value: ₹${pilotValueInr.toLocaleString("en-IN")} (catalog hub ₹${catalogTotal})\n` +
      `• Docket: ${orderId}\n` +
      `• Run: ${RUN_ID}`,
  };
}

async function insertWithFallback(supabase, spec) {
  const tables = [spec.table, ...(spec.altTables || [])];
  const variants =
    Array.isArray(spec.rowVariants) && spec.rowVariants.length
      ? spec.rowVariants
      : [spec.row];
  let last = { error: { message: "no_table_attempted" }, ms: 0, table: null };
  let sawMissingTable = false;
  let sawMissingColumn = false;

  for (const table of tables) {
    for (let vi = 0; vi < variants.length; vi++) {
      const row = variants[vi];
      const result = await timedInsert(supabase, table, row);
      last = { ...result, table, variant: vi };
      if (!result.error) {
        return {
          ...result,
          table,
          skipped: false,
          persisted: true,
          variant: vi,
        };
      }
      if (isMissingTable(result.error)) {
        sawMissingTable = true;
        log(
          spec.cohort,
          `table "${table}" missing — ${clip(result.error.message, 120)}`,
        );
        break; // next alt table
      }
      if (isMissingColumn(result.error)) {
        sawMissingColumn = true;
        log(
          spec.cohort,
          `column mismatch on "${table}" (shape #${vi + 1}) — ${clip(result.error.message, 140)}`,
        );
        continue; // try next row shape
      }
      return {
        ...result,
        table,
        skipped: false,
        persisted: false,
        reason: clip(result.error.message, 200),
      };
    }
  }

  // All tables missing — for procure, write local artifact mirroring localStorage
  if (spec.localOrder) {
    mkdirSync(ARTIFACT_DIR, { recursive: true });
    const path = resolve(ARTIFACT_DIR, `${spec.localOrder.id}.json`);
    writeFileSync(path, JSON.stringify(spec.localOrder, null, 2), "utf8");
    log(
      spec.cohort,
      `no orders table — wrote localStorage-pattern artifact ${path}`,
    );
    return {
      data: spec.localOrder,
      error: null,
      ms: last.ms,
      table: "local_artifact",
      skipped: true,
      persisted: false,
      reason: "orders_table_absent_local_artifact",
      artifact: path,
    };
  }

  const reason = sawMissingTable
    ? `missing_table:${tables.join("|")}`
    : sawMissingColumn
      ? `column_mismatch:${tables.join("|")}`
      : clip(last.error?.message || "insert_failed", 200);

  return {
    data: null,
    error: last.error,
    ms: last.ms,
    table: last.table,
    skipped: sawMissingTable || sawMissingColumn,
    persisted: false,
    reason,
  };
}

async function runCohort(supabase, spec) {
  log("run", `▶ ${spec.label}`);

  const db = await insertWithFallback(supabase, spec);

  let eligibilityNote = null;
  if (spec.eligibility) {
    eligibilityNote = spec.eligibility.eligible
      ? `Legal Advocacy Cell ELIGIBLE (score ${spec.eligibility.score} ≥ ${spec.eligibility.threshold})`
      : `NOT eligible (score ${spec.eligibility.score} < ${spec.eligibility.threshold})`;
    log(spec.cohort, eligibilityNote);
  }

  const telegram = await dispatchWarRoom(
    spec.table === "grievances" ? "grievance" : "pilot",
    spec.warRoomText,
    spec.notifyBody,
  );

  const csv = exportToCSVString([spec.csvRow]);
  const csvCheck = validateCsvBomAndTelugu(csv, spec.teluguSample);
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const csvPath = resolve(ARTIFACT_DIR, `${spec.cohort}-${RUN_ID}.csv`);
  writeFileSync(csvPath, csv, "utf8");

  // Integrity: confirm key Telugu / IDs round-trip in CSV + DB row shape
  const integrity = {
    csvBom: csvCheck.startsWithBom,
    teluguIntact: csvCheck.containsTelugu,
    eligibility: spec.eligibility || null,
    dbPersisted: Boolean(db.persisted),
    referenceOrId:
      spec.row.reference_id ||
      spec.row.certificate_id ||
      spec.row.id ||
      spec.row.uscno ||
      spec.row.full_name ||
      null,
  };

  const status =
    db.persisted || db.skipped
      ? db.persisted
        ? "pass"
        : "soft_skip"
      : "fail";

  recordCohort({
    cohort: spec.cohort,
    label: spec.label,
    status,
    db: {
      ok: Boolean(db.persisted),
      skipped: Boolean(db.skipped),
      table: db.table,
      ms: db.ms,
      reason: db.reason || (db.error ? clip(db.error.message, 160) : undefined),
      artifact: db.artifact,
    },
    telegram: {
      ok: Boolean(telegram.ok),
      skipped: Boolean(telegram.skipped),
      channel: telegram.channel,
      reason: telegram.reason,
      ms: telegram.ms,
    },
    csv: {
      ok: csvCheck.ok,
      path: csvPath,
      ...csvCheck,
    },
    integrity,
    eligibilityNote,
  });
}

function printSummary() {
  console.log("\n════════════ PILOT HARNESS SUMMARY ════════════");
  console.log(`Run ID     : ${RUN_ID}`);
  console.log(`Supabase   : ${SUPABASE_URL} (${KEY_MODE})`);
  console.log(
    `Telegram   : ${TELEGRAM_TOKEN && TELEGRAM_CHAT ? "configured" : "unset (will skip)"}`,
  );
  console.log(`Notify URL : ${NOTIFY_URL}`);
  console.log("───────────────────────────────────────────────");
  for (const r of results) {
    console.log(
      ` ${r.status.padEnd(9)} ${r.cohort.padEnd(24)} db=${hr(r.db.ms)} tg=${hr(r.telegram.ms || 0)} csv=${r.csv.ok ? "BOM✓" : "BOM✗"}`,
    );
    if (r.db.reason) console.log(`           └─ db: ${r.db.reason}`);
    if (r.telegram.reason && !r.telegram.ok)
      console.log(`           └─ tg: ${r.telegram.reason}`);
    if (r.eligibilityNote) console.log(`           └─ ${r.eligibilityNote}`);
  }
  const hardFails = results.filter((r) => r.status === "fail").length;
  const soft = results.filter((r) => r.status === "soft_skip").length;
  const pass = results.filter((r) => r.status === "pass").length;
  console.log("───────────────────────────────────────────────");
  console.log(`Totals: pass=${pass} soft_skip=${soft} fail=${hardFails}`);
  console.log(`Artifacts: ${ARTIFACT_DIR}`);
  console.log("═══════════════════════════════════════════════\n");

  mkdirSync(ARTIFACT_DIR, { recursive: true });
  writeFileSync(
    resolve(ARTIFACT_DIR, `summary-${RUN_ID}.json`),
    JSON.stringify({ runId: RUN_ID, keyMode: KEY_MODE, results }, null, 2),
    "utf8",
  );
}

async function main() {
  console.log("\n🏛️  NayiSamakhya 2.0 — Pilot Simulation Harness");
  console.log(`    ${RUN_ID}\n`);

  if (!existsSync(ENV_LOCAL) && !SERVICE_KEY && !ANON_KEY) {
    log(
      "env",
      "WARNING: .env.local not found — relying on process env only",
    );
  } else if (existsSync(ENV_LOCAL)) {
    log("env", `loaded ${ENV_LOCAL}`);
  }

  const supabase = getClient();
  log("supabase", `connected as ${KEY_MODE}`);

  const cohorts = [
    cohort1Survey(),
    cohort2Survey(),
    cohort3Quiz(),
    cohort4Grievance(),
    cohort5Order(),
  ];

  for (const spec of cohorts) {
    try {
      await runCohort(supabase, spec);
    } catch (err) {
      recordCohort({
        cohort: spec.cohort,
        label: spec.label,
        status: "fail",
        db: {
          ok: false,
          skipped: false,
          ms: 0,
          reason: clip(err?.message || err, 200),
        },
        telegram: { ok: false, skipped: true, reason: "not_attempted", ms: 0 },
        csv: { ok: false },
        integrity: {},
      });
    }
  }

  // Aggregate CSV of all pilot rows that have csvRow
  const allCsvRows = cohorts.map((c) => c.csvRow);
  const aggregate = exportToCSVString(allCsvRows);
  const aggCheck = validateCsvBomAndTelugu(aggregate, "నాయీ");
  // Fallback sample — check any Telugu from C1 shop name
  const aggCheck2 = validateCsvBomAndTelugu(
    aggregate,
    "శ్రీ లక్ష్మి హెయిర్ స్టైల్స్",
  );
  const csvPath = resolve(ARTIFACT_DIR, `pilot-all-${RUN_ID}.csv`);
  writeFileSync(csvPath, aggregate, "utf8");
  log(
    "csv",
    `aggregate export ${csvPath} BOM=${aggCheck2.startsWithBom} telugu=${aggCheck2.containsTelugu}`,
  );

  printSummary();

  // Soft-skips (missing tables / telegram unset) are expected in partial envs.
  // Only hard DB constraint failures without skip mark the process as warning —
  // still exit 0 so CI/local can use this as a diagnostic harness.
  const hardFails = results.filter((r) => r.status === "fail");
  if (hardFails.length) {
    log(
      "done",
      `${hardFails.length} cohort(s) failed — see summary (exit 0 for diagnostic harness)`,
    );
  } else {
    log("done", "pilot harness finished");
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
