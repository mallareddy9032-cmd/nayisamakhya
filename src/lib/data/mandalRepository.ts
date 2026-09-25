import type {
  GramPanchayat,
  Mandal,
  MandalAction,
  MandalNotice,
  MandalOfficer,
  Officer,
} from "@/lib/types";
import { getMandal, listMandals } from "@/lib/data/mandals";
import { listDistricts } from "@/lib/data/districts";
import {
  listMandalsDirectory,
  type MandalDirectoryEntry,
} from "@/lib/data/mandalsDirectory";
import {
  canonicalDistrictSlug,
  canonicalMandalSlug,
} from "@/lib/data/locationAliases";
import { getSupabase } from "@/lib/supabase/client";

const HELPLINE = "919032654111";

type DistrictRow = {
  slug: string;
  name_en: string;
  name_te: string;
};

type MandalRow = {
  id: string;
  slug: string;
  name_en: string;
  name_te: string;
  total_households: number;
  salons_count: number;
  artistes_count: number;
  free_power_pct: number | null;
  survey_completion_pct: number;
  portal_headline_te: string | null;
  portal_headline_en: string | null;
  portal_sub_te: string | null;
  portal_sub_en: string | null;
  whatsapp_group: string | null;
  cartel_whatsapp: string | null;
  districts: DistrictRow | DistrictRow[] | null;
};

type OfficerRow = {
  name_en: string;
  name_te: string;
  role_title_en: string;
  role_title_te: string;
  phone_number: string;
  whatsapp_link: string | null;
  photo_url: string | null;
  jurisdiction_en: string | null;
  jurisdiction_te: string | null;
};

type MandalOfficerRow = {
  id: string;
  name_en: string;
  name_te: string;
  role: string;
  role_te: string;
  phone: string;
  email: string | null;
  status: string;
  is_verified: boolean;
  photo_url: string | null;
};

type GpRow = {
  id: string;
  name_en: string;
  name_te: string;
  households_count: number;
  survey_pct: number;
};

type UpdateRow = {
  id: string;
  caption_te: string | null;
  caption_en: string | null;
  image_urls: string[];
  published_at: string | null;
  category: string;
};

function districtOf(row: MandalRow): DistrictRow | null {
  const d = row.districts;
  if (!d) return null;
  return Array.isArray(d) ? d[0] ?? null : d;
}

function buildActions(
  shortTe: string,
  mandalEn: string,
  districtTe: string,
  districtEn: string,
  cartelHref: string,
): MandalAction[] {
  return [
    {
      id: "cartel",
      title: {
        te: `${shortTe} సెలూన్ కొనుగోలు కార్టెల్`,
        en: `${mandalEn} Salon Wholesale Cartel`,
      },
      description: {
        te: `కత్తెరలు, క్లిప్పర్లు, సెలూన్ కుర్చీలు, కాస్మెటిక్ కిట్లు — ఫ్యాక్టరీ ధరలకు. మధ్యవర్తులు లేకుండా ${districtTe}లో సమూహ కొనుగోలు.`,
        en: `Scissors, clippers, salon chairs, and cosmetic kits at factory prices — eliminating middleman margins across ${districtEn} district.`,
      },
      cta: { te: "కార్టెల్ బల్క్ ఆర్డర్ నమోదు", en: "Register cartel bulk order" },
      href: cartelHref,
      external: true,
    },
    {
      id: "power",
      title: {
        te: "250 యూనిట్ల ఉచిత విద్యుత్ గ్రీవెన్స్ సెల్",
        en: "250-Unit Free Power Grievance Cell",
      },
      description: {
        te: "పట్టణ & గ్రామీణ సబ్-స్టేషన్ల వద్ద పెండింగ్ సబ్సిడీ దరఖాస్తులు క్లియర్ చేయడానికి స్థానిక మార్గదర్శకం.",
        en: "Local guidance to resolve pending power subsidy applications at town and rural sub-stations.",
      },
      cta: { te: "వినతి పత్రం కాపీ డౌన్‌లోడ్", en: "Download petition copy" },
      href: "/discom-petition.txt",
    },
    {
      id: "artisans",
      title: {
        te: "స్థానిక భజంత్రి & కళాకారుల రక్షణ విభాగం",
        en: "Local Bajantri & Artisans Wing",
      },
      description: {
        te: "దేవాలయ గౌరవాలు, సాంస్కృతిక శాఖ పెన్షన్ డాక్యుమెంటేషన్, పండుగ నమోదు.",
        en: "Temple honors advocacy, cultural department pension documentation, and festival engagement registry.",
      },
      cta: { te: "కళాకారుల జాబితా చూడండి", en: "View artiste registry" },
      href: "/verticals/bajantri",
    },
  ];
}

function mapOfficer(row: OfficerRow | null, mandalTe: string, mandalEn: string): Officer {
  if (!row) {
    return {
      name: { te: "నియామకం పెండింగ్", en: "Appointment pending" },
      title: {
        te: "మండల నోడల్ అధికారి",
        en: "Mandal Nodal Officer",
      },
      phone: HELPLINE,
      status: { te: "నియామకం పెండింగ్", en: "Pending appointment" },
      initials: "—",
      jurisdiction: {
        te: `${mandalTe} & అనుబంధ గ్రామాలు`,
        en: `${mandalEn} & affiliated villages`,
      },
    };
  }
  const nameTe = row.name_te || row.name_en || "Officer";
  const nameEn = row.name_en || row.name_te || "Officer";
  const titleTe =
    row.role_title_te ||
    (row as OfficerRow & { role_title?: string }).role_title ||
    "మండల నోడల్ అధికారి";
  const titleEn =
    row.role_title_en ||
    (row as OfficerRow & { role_title?: string }).role_title ||
    "Mandal Nodal Officer";
  const initials = nameTe.trim().charAt(0) || nameEn.trim().charAt(0) || "O";
  return {
    name: { te: nameTe, en: nameEn },
    title: { te: titleTe, en: titleEn },
    phone: String(row.phone_number || "").replace(/\D/g, "") || HELPLINE,
    status: { te: "ఆన్‌లైన్ / క్రియాశీలం", en: "Online / Active" },
    initials,
    jurisdiction: {
      te: row.jurisdiction_te || `${mandalTe} & అనుబంధ గ్రామాలు`,
      en: row.jurisdiction_en || `${mandalEn} & affiliated villages`,
    },
    portrait: row.photo_url || undefined,
  };
}

function mapRoster(rows: MandalOfficerRow[]): MandalOfficer[] {
  return rows
    .filter((r) => r && r.id)
    .map((r) => ({
      id: String(r.id),
      name: {
        te: r.name_te || r.name_en || "Officer",
        en: r.name_en || r.name_te || "Officer",
      },
      role: {
        te: r.role_te || r.role || "నోడల్ అధికారి",
        en: r.role || r.role_te || "Nodal Officer",
      },
      phone: String(r.phone || "").replace(/\D/g, "") || HELPLINE,
      email: r.email || undefined,
      status: r.status || "active",
      isVerified: r.is_verified !== false,
      photoUrl: r.photo_url || undefined,
    }));
}

function officerFromRoster(
  roster: MandalOfficer[],
  mandalTe: string,
  mandalEn: string,
): Officer {
  const primary =
    roster.find((o) => /social media/i.test(o.role.en)) || roster[0];
  if (!primary) {
    return mapOfficer(null, mandalTe, mandalEn);
  }
  return {
    name: primary.name,
    title: primary.role,
    phone: primary.phone,
    status: { te: "ఆన్‌లైన్ / క్రియాశీలం", en: "Online / Active" },
    initials:
      primary.name.te.trim().charAt(0) ||
      primary.name.en.trim().charAt(0) ||
      "O",
    jurisdiction: {
      te: `${mandalTe} & అనుబంధ గ్రామాలు`,
      en: `${mandalEn} & affiliated villages`,
    },
    portrait: primary.photoUrl,
  };
}

function mapGps(rows: GpRow[]): GramPanchayat[] {
  return rows
    .filter((gp) => gp && (gp.name_en || gp.name_te))
    .map((gp) => ({
      id: String(gp.id),
      name: {
        te: gp.name_te || gp.name_en || "GP",
        en: gp.name_en || gp.name_te || "GP",
      },
      households: Number(gp.households_count) || 0,
      surveyPct: Number(gp.survey_pct) || 0,
    }));
}

function mapNotices(rows: UpdateRow[]): MandalNotice[] {
  return rows
    .filter((u) => u && u.id)
    .map((u) => ({
      id: String(u.id),
      title: {
        te: u.caption_te || u.category || "Update",
        en: u.caption_en || u.category || "Update",
      },
      date: (u.published_at || new Date().toISOString()).slice(0, 10),
      image:
        (Array.isArray(u.image_urls) && u.image_urls[0]) ||
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800",
    }));
}

function mapRowToMandal(
  row: MandalRow,
  officer: OfficerRow | null,
  rosterRows: MandalOfficerRow[],
  gps: GpRow[],
  updates: UpdateRow[],
): Mandal {
  const district = districtOf(row);
  const districtSlug = district?.slug ?? "unknown";
  const path = `/${districtSlug}/${row.slug}`;
  const shortTe = row.name_te.replace(/ మండలం$/, "");
  const districtTe = district?.name_te ?? districtSlug;
  const districtEn = district?.name_en ?? districtSlug;
  const cartel =
    row.cartel_whatsapp ||
    "https://chat.whatsapp.com/invite/salon-cartel-demo";

  const officers = mapRoster(rosterRows);
  const primaryOfficer =
    officers.length > 0
      ? officerFromRoster(officers, row.name_te, row.name_en)
      : mapOfficer(officer, row.name_te, row.name_en);

  return {
    districtSlug,
    mandalSlug: row.slug,
    path,
    surveyPath: `${path}/survey`,
    state: { te: "తెలంగాణ", en: "Telangana" },
    district: { te: districtTe, en: districtEn },
    mandal: { te: row.name_te, en: row.name_en },
    hubTitle: {
      te: `${shortTe} మండల సమాఖ్య కేంద్రం`,
      en: `${row.name_en} Mandal Samakhya Hub`,
    },
    portalHeadline: {
      te:
        row.portal_headline_te ||
        `${shortTe} మండల నాయీ - భజంత్రి సమాఖ్య అధికారిక వేదిక`,
      en:
        row.portal_headline_en ||
        `Official ${row.name_en} Mandal Nayi–Bajantri Samakhya Portal`,
    },
    portalSub: {
      te:
        row.portal_sub_te ||
        "మండల స్థాయి సంక్షేమం, సెలూన్ వ్యాపార బలోపేతం, సాంప్రదాయ కళాకారుల రక్షణ మరియు సమగ్ర కుటుంబ సేవలు.",
      en:
        row.portal_sub_en ||
        "Mandal welfare, salon enterprise support, traditional artiste protection, and comprehensive family services.",
    },
    summary: {
      households: row.total_households,
      salons: row.salons_count,
      bajantri: row.artistes_count,
      freePowerPct: row.free_power_pct ?? 0,
      surveyPct: row.survey_completion_pct,
      gpCount: gps.length,
    },
    officer: primaryOfficer,
    officers,
    whatsappGroup:
      row.whatsapp_group ||
      officer?.whatsapp_link ||
      "https://chat.whatsapp.com/invite/nayi-demo",
    telegramChannel: "https://t.me/nayi_samakhya_demo",
    cartelWhatsapp: cartel,
    gramPanchayats: mapGps(gps),
    actions: buildActions(shortTe, row.name_en, districtTe, districtEn, cartel),
    notices: mapNotices(updates),
  };
}

/**
 * Lightweight portal for any of the 589 directory mandals when Supabase /
 * rich static hubs do not yet have a full payload.
 */
export function getDirectoryMandal(
  districtSlug: string,
  mandalSlug: string,
): Mandal | undefined {
  const dSlug = canonicalDistrictSlug(districtSlug.trim());
  const mSlug = canonicalMandalSlug(mandalSlug.trim());
  const entry = listMandalsDirectory().find(
    (m) =>
      canonicalDistrictSlug(m.district_slug) === dSlug &&
      canonicalMandalSlug(m.slug) === mSlug,
  );
  if (!entry) return undefined;
  return buildDirectoryStub(entry);
}

function buildDirectoryStub(entry: MandalDirectoryEntry): Mandal {
  const districtSlug = canonicalDistrictSlug(entry.district_slug);
  const mandalSlug = canonicalMandalSlug(entry.slug);
  const districtMeta = listDistricts().find((d) => d.slug === districtSlug);
  const districtTe = districtMeta?.name_te || districtSlug;
  const districtEn = districtMeta?.name_en || districtSlug;
  const shortTe = entry.name_te.replace(/ మండలం$/, "");
  const path = `/${districtSlug}/${mandalSlug}`;
  const cartel = "https://chat.whatsapp.com/invite/salon-cartel-demo";

  return {
    districtSlug,
    mandalSlug,
    path,
    surveyPath: `${path}/survey`,
    state: { te: "తెలంగాణ", en: "Telangana" },
    district: { te: districtTe, en: districtEn },
    mandal: { te: entry.name_te, en: entry.name_en },
    hubTitle: {
      te: `${shortTe} మండల సమాఖ్య కేంద్రం`,
      en: `${entry.name_en} Mandal Samakhya Hub`,
    },
    portalHeadline: {
      te: `${shortTe} మండల నాయీ - భజంత్రి సమాఖ్య అధికారిక వేదిక`,
      en: `Official ${entry.name_en} Mandal Nayi–Bajantri Samakhya Portal`,
    },
    portalSub: {
      te: "మండల స్థాయి సంక్షేమం, సెలూన్ వ్యాపార బలోపేతం, సాంప్రదాయ కళాకారుల రక్షణ మరియు సమగ్ర కుటుంబ సేవలు. గ్రామ పంచాయతీ జాబితా సీడ్ అయిన తర్వాత ఇక్కడ కనిపిస్తుంది.",
      en: "Mandal welfare, salon enterprise support, traditional artiste protection, and family services. Gram panchayat list appears here once seeded in Supabase.",
    },
    summary: {
      households: 0,
      salons: 0,
      bajantri: 0,
      freePowerPct: 0,
      surveyPct: 0,
      gpCount: 0,
    },
    officer: mapOfficer(null, entry.name_te, entry.name_en),
    officers: [],
    whatsappGroup: "https://chat.whatsapp.com/invite/nayi-demo",
    telegramChannel: "https://t.me/nayi_samakhya_demo",
    cartelWhatsapp: cartel,
    gramPanchayats: [],
    actions: buildActions(
      shortTe,
      entry.name_en,
      districtTe,
      districtEn,
      cartel,
    ),
    notices: [],
  };
}

function resolveLocalMandal(
  districtSlug: string,
  mandalSlug: string,
): Mandal | undefined {
  return (
    getMandal(districtSlug, mandalSlug) ||
    getDirectoryMandal(districtSlug, mandalSlug)
  );
}

/**
 * Resolve a mandal portal payload.
 * Prefers Supabase when env is configured; falls back to rich static hubs,
 * then the Phase-2 directory of 589 mandals.
 */
export async function fetchMandalPortal(
  districtSlug: string,
  mandalSlug: string,
): Promise<Mandal | undefined> {
  const dSlug = canonicalDistrictSlug(districtSlug.trim());
  const mSlug = canonicalMandalSlug(mandalSlug.trim());
  const supabase = getSupabase();

  if (!supabase) {
    return resolveLocalMandal(dSlug, mSlug);
  }

  try {
    const { data: mandalData, error } = await supabase
      .from("mandals")
      .select(
        `
        *,
        districts!inner(slug, name_en, name_te)
      `,
      )
      .eq("slug", mSlug)
      .eq("districts.slug", dSlug)
      .maybeSingle();

    // Retry without alias in case DB still stores legacy slug forms.
    let rowData = !error && mandalData ? mandalData : null;
    if (!rowData && (dSlug !== districtSlug || mSlug !== mandalSlug)) {
      const retry = await supabase
        .from("mandals")
        .select(
          `
          *,
          districts!inner(slug, name_en, name_te)
        `,
        )
        .eq("slug", mandalSlug.trim())
        .eq("districts.slug", districtSlug.trim())
        .maybeSingle();
      if (!retry.error && retry.data) rowData = retry.data;
    }

    if (!rowData) {
      return resolveLocalMandal(dSlug, mSlug);
    }

    const row = rowData as MandalRow;

    const [officerRes, rosterRes, gpsRes, updatesRes] = await Promise.all([
      supabase
        .from("officers")
        .select("*")
        .eq("mandal_id", row.id)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("mandal_officers")
        .select(
          "id, name_en, name_te, role, role_te, phone, email, status, is_verified, photo_url",
        )
        .eq("mandal_id", row.id)
        .eq("status", "active")
        .order("role", { ascending: true }),
      supabase
        .from("gram_panchayats")
        .select("*")
        .eq("mandal_id", row.id)
        .order("name_en", { ascending: true }),
      supabase
        .from("local_updates")
        .select("*")
        .eq("mandal_slug", mSlug)
        .eq("district_slug", dSlug)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6),
    ]);

    // If mandal_officers table is missing, rosterRes.error is non-null — treat as [].
    const roster =
      !rosterRes.error && rosterRes.data
        ? (rosterRes.data as MandalOfficerRow[])
        : [];

    return mapRowToMandal(
      row,
      (officerRes.data as OfficerRow | null) ?? null,
      roster,
      (gpsRes.data as GpRow[] | null) ?? [],
      (updatesRes.data as UpdateRow[] | null) ?? [],
    );
  } catch {
    return resolveLocalMandal(dSlug, mSlug);
  }
}

/** Static path list for build-time SSG — avoids hanging Vercel builds on network. */
export async function listMandalPortalParams(): Promise<
  { district: string; mandal: string }[]
> {
  return listMandals().map((m) => ({
    district: m.districtSlug,
    mandal: m.mandalSlug,
  }));
}
