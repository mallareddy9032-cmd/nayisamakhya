import { createClient } from "@supabase/supabase-js";
import {
  groupIntoFortnightEditions,
  institutionalFallbackNotices,
  normalizeCategory,
  type DigestBulletin,
  type FortnightEdition,
} from "@/lib/newsletter/digest";

function getPublicSupabase() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "https://pvhnwoukpccgeoqdsevm.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
  if (!anonKey || supabaseUrl.includes("YOUR_PROJECT")) return null;
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}

type RawBulletin = {
  id: string;
  title: string;
  category: string;
  target_districts?: string[] | null;
  source_url?: string | null;
  pdf_url?: string | null;
  summary_te: string;
  published_at?: string | null;
  created_at?: string | null;
  approved_for_newsletter?: boolean | null;
};

function mapRow(row: RawBulletin): DigestBulletin {
  const created = row.created_at || row.published_at || new Date().toISOString();
  return {
    id: row.id,
    title: row.title,
    category: normalizeCategory(row.category),
    summary_te: row.summary_te,
    target_districts: row.target_districts || [],
    source_url: row.source_url || null,
    pdf_url: row.pdf_url || null,
    published_at: row.published_at || created,
    created_at: created,
  };
}

export type NewsletterDigestPayload = {
  editions: FortnightEdition[];
  currentEdition: FortnightEdition;
  archives: FortnightEdition[];
  source: "supabase" | "fallback";
  error: string | null;
};

/**
 * Load civic_bulletins ordered by created_at desc, group into fortnights.
 * Current empty window → institutional fallback notices (G.O. 23, BC-A, corridor).
 */
export async function loadNewsletterDigest(): Promise<NewsletterDigestPayload> {
  const now = new Date();
  const supabase = getPublicSupabase();
  let rows: DigestBulletin[] = [];
  let source: "supabase" | "fallback" = "supabase";
  let error: string | null = null;

  if (!supabase) {
    source = "fallback";
    error = "supabase_not_configured";
  } else {
    const { data, error: qErr } = await supabase
      .from("civic_bulletins")
      .select(
        "id, title, category, target_districts, source_url, pdf_url, summary_te, published_at, created_at, approved_for_newsletter",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (qErr) {
      error = qErr.message;
      source = "fallback";
      console.error("[newsletter] civic_bulletins query failed", qErr.message);
    } else {
      rows = (data || [])
        .filter((r) => (r as RawBulletin).approved_for_newsletter !== false)
        .map((r) => mapRow(r as RawBulletin));
    }
  }

  let editions = groupIntoFortnightEditions(rows, now);
  let currentEdition = editions.find((e) => e.is_current) || editions[0];

  if (!currentEdition || currentEdition.bulletins.length === 0) {
    const fallbacks = institutionalFallbackNotices(now);
    currentEdition = {
      id: currentEdition?.id || `fn-0-${now.toISOString().slice(0, 10)}`,
      label_te: "ప్రస్తుత పాక్షిక సంకలనం",
      start:
        currentEdition?.start ||
        new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      end: now.toISOString(),
      is_current: true,
      bulletins: fallbacks,
    };
    source = rows.length === 0 ? "fallback" : source;
    editions = [currentEdition, ...editions.filter((e) => !e.is_current)];
  }

  const archives = editions.filter((e) => !e.is_current && e.bulletins.length > 0);

  return {
    editions,
    currentEdition,
    archives,
    source,
    error,
  };
}
