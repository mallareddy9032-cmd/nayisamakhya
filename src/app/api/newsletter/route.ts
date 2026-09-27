import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  NEWSLETTER_FILTERS,
  NEWSLETTER_TITLE,
  type NewsletterFilterId,
} from "@/lib/bulletins/categories";
import type { CivicBulletin } from "@/lib/bulletins/types";
import { seedMockAdapter } from "@/lib/bulletins/adapters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FieldReport = {
  id: string;
  kind: "field_report";
  title: string;
  summary_te: string;
  published_at: string;
  district_te?: string | null;
  mandal_te?: string | null;
  photo_url?: string | null;
  source: "survey_submissions";
};

function getSupabase() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "https://pvhnwoukpccgeoqdsevm.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
  if (!anonKey) return null;
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}

function editionWindow() {
  const end = new Date();
  const start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
  return { start, end };
}

/**
 * Public newsletter payload: approved civic_bulletins + verified field submissions.
 * Zero manual editorial — auto-populated for the current bi-weekly window.
 */
export async function GET(req: NextRequest) {
  const filterParam = (req.nextUrl.searchParams.get("filter") ||
    "all") as NewsletterFilterId | "all";
  const { start, end } = editionWindow();
  const supabase = getSupabase();

  let bulletins: CivicBulletin[] = [];
  let fieldReports: FieldReport[] = [];
  let source: "supabase" | "seed_fallback" = "supabase";
  let error: string | null = null;

  if (!supabase) {
    source = "seed_fallback";
    const seed = await seedMockAdapter.fetchNotices();
    bulletins = seed.map((n, i) => ({
      id: `seed-${i}`,
      title: n.title,
      category: n.category,
      target_districts: n.target_districts,
      source_url: n.source_url,
      pdf_url: n.pdf_url,
      summary_te: n.summary_te,
      published_at: n.published_at,
      broadcast_status: "ready",
      approved_for_newsletter: true,
    }));
  } else {
    const { data, error: bErr } = await supabase
      .from("civic_bulletins")
      .select(
        "id, title, category, target_districts, source_url, pdf_url, summary_te, published_at, broadcast_status, approved_for_newsletter",
      )
      .eq("approved_for_newsletter", true)
      .gte("published_at", start.toISOString())
      .lte("published_at", end.toISOString())
      .order("published_at", { ascending: false })
      .limit(80);

    if (bErr) {
      // Table missing / RLS — fall back to seed so the page stays usable.
      error = bErr.message;
      source = "seed_fallback";
      const seed = await seedMockAdapter.fetchNotices();
      bulletins = seed.map((n, i) => ({
        id: `seed-${i}`,
        title: n.title,
        category: n.category,
        target_districts: n.target_districts,
        source_url: n.source_url,
        pdf_url: n.pdf_url,
        summary_te: n.summary_te,
        published_at: n.published_at,
        broadcast_status: "ready",
        approved_for_newsletter: true,
      }));
    } else {
      bulletins = (data || []) as CivicBulletin[];
      if (bulletins.length === 0) {
        // Empty DB after migration — still show seed edition so UI isn't blank.
        source = "seed_fallback";
        const seed = await seedMockAdapter.fetchNotices();
        bulletins = seed.map((n, i) => ({
          id: `seed-${i}`,
          title: n.title,
          category: n.category,
          target_districts: n.target_districts,
          source_url: n.source_url,
          pdf_url: n.pdf_url,
          summary_te: n.summary_te,
          published_at: n.published_at,
          broadcast_status: "ready",
          approved_for_newsletter: true,
        }));
      }
    }

    const { data: feed, error: fErr } = await supabase
      .from("survey_submissions")
      .select(
        `
        id,
        created_at,
        photo_url,
        raw_caption,
        districts(name_te),
        mandals(name_te)
      `,
      )
      .eq("status", "approved")
      .gte("created_at", start.toISOString())
      .order("created_at", { ascending: false })
      .limit(24);

    if (!fErr && feed) {
      fieldReports = feed.map((row) => {
        const r = row as {
          id: string;
          created_at: string;
          photo_url?: string | null;
          raw_caption?: string | null;
          districts?: { name_te?: string } | null;
          mandals?: { name_te?: string } | null;
        };
        const caption = (r.raw_caption || "").trim();
        return {
          id: r.id,
          kind: "field_report" as const,
          title: caption
            ? caption.slice(0, 80)
            : "క్షేత్రస్థాయి ఫోటో నివేదిక",
          summary_te:
            caption ||
            "ధృవీకరించబడిన క్షేత్రస్థాయి సమర్పణ — వివరాల కోసం ఫీడ్ చూడండి.",
          published_at: r.created_at,
          district_te: r.districts?.name_te || null,
          mandal_te: r.mandals?.name_te || null,
          photo_url: r.photo_url || null,
          source: "survey_submissions" as const,
        };
      });
    }
  }

  const activeFilter =
    NEWSLETTER_FILTERS.find((f) => f.id === filterParam) || null;

  const filteredBulletins = activeFilter
    ? bulletins.filter((b) =>
        activeFilter.categories.includes(
          b.category as (typeof activeFilter.categories)[number],
        ),
      )
    : bulletins;

  const includeField =
    !activeFilter || activeFilter.includeFieldReports || filterParam === "all";
  const filteredField =
    filterParam === "all"
      ? fieldReports
      : includeField && activeFilter?.includeFieldReports
        ? fieldReports
        : [];

  // When filter is a bulletin category, hide field reports; when field-reports, hide bulletins.
  const showBulletins =
    filterParam === "all" ||
    (activeFilter && !activeFilter.includeFieldReports);
  const showField =
    filterParam === "all" ||
    Boolean(activeFilter?.includeFieldReports);

  return NextResponse.json({
    title: NEWSLETTER_TITLE,
    edition: {
      start: start.toISOString(),
      end: end.toISOString(),
      label_te: "పాక్షిక (14 రోజుల) సంకలనం",
    },
    filters: NEWSLETTER_FILTERS.map((f) => ({ id: f.id, label: f.label })),
    active_filter: filterParam,
    source,
    error,
    bulletins: showBulletins ? filteredBulletins : [],
    field_reports: showField ? filteredField : [],
    counts: {
      bulletins: showBulletins ? filteredBulletins.length : 0,
      field_reports: showField ? filteredField.length : 0,
    },
  });
}
