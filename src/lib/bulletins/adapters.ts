import type { IngestedBulletin } from "@/lib/bulletins/types";
import { generateTeluguSummary } from "@/lib/bulletins/summary";

export type BulletinSourceAdapter = {
  id: string;
  label: string;
  description: string;
  fetchNotices: () => Promise<IngestedBulletin[]>;
};

/** Mock Telangana GO / welfare notices — keeps the pipeline runnable without live scrapers. */
const SEED_NOTICES: Omit<
  IngestedBulletin,
  "summary_te" | "source_adapter" | "broadcast_status"
>[] = [
  {
    title: "BC-A Community Hall land allotment — Suryapet & Nalgonda",
    category: "BC-A Welfare",
    target_districts: ["suryapet", "nalgonda"],
    source_url: "https://www.nayisamakhya.org/policies/go-23",
    pdf_url: null,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source_external_id: "seed-bca-hall-2026-01",
    approved_for_newsletter: true,
  },
  {
    title: "Collector circular — free power saturation drive (250 units)",
    category: "Collector Circular",
    target_districts: ["suryapet", "khammam", "nalgonda"],
    source_url: "https://www.nayisamakhya.org/policies/free-power",
    pdf_url: null,
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    source_external_id: "seed-collector-power-2026-01",
    approved_for_newsletter: true,
  },
  {
    title: "Post-matric scholarship renewal window for BC-A students",
    category: "Education/Scholarships",
    target_districts: ["hyderabad", "rangareddy", "medchal-malkajgiri"],
    source_url: "https://www.nayisamakhya.org/verticals/education",
    pdf_url: null,
    published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    source_external_id: "seed-edu-scholarship-2026-01",
    approved_for_newsletter: true,
  },
  {
    title: "Legal aid desk — shop license & trade dispute guidance",
    category: "Legal Rights",
    target_districts: ["hyderabad", "rangareddy"],
    source_url: "https://www.nayisamakhya.org/representation",
    pdf_url: null,
    published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    source_external_id: "seed-legal-aid-2026-01",
    approved_for_newsletter: true,
  },
  {
    title: "North corridor BC welfare camp calendar — Adilabad & Nirmal",
    category: "BC-A Welfare",
    target_districts: ["adilabad", "nirmal", "mancherial"],
    source_url: "https://www.nayisamakhya.org/verticals/welfare",
    pdf_url: null,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source_external_id: "seed-north-welfare-camp-2026-01",
    approved_for_newsletter: true,
  },
];

function withSummary(
  row: (typeof SEED_NOTICES)[number],
  adapterId: string,
): IngestedBulletin {
  return {
    ...row,
    source_adapter: adapterId,
    broadcast_status: "ready",
    summary_te: generateTeluguSummary({
      title: row.title,
      category: row.category,
      districts: row.target_districts,
      bodyExcerpt: row.title,
    }),
  };
}

export const seedMockAdapter: BulletinSourceAdapter = {
  id: "seed-mock",
  label: "Seed mock notices",
  description:
    "Deterministic fixture GOs/circulars/welfare notices for local + Vercel Cron runs when live gov scrapers are unavailable.",
  async fetchNotices() {
    return SEED_NOTICES.map((n) => withSummary(n, "seed-mock"));
  },
};

/**
 * Placeholder adapter for telangana.gov / district portals.
 * Returns [] until live scraping credentials / HTML adapters are wired.
 */
export const telanganaGoAdapter: BulletinSourceAdapter = {
  id: "telangana-go-portal",
  label: "Telangana GO portal (stub)",
  description:
    "Reserved for go.telangana.gov.in / district collector circular feeds. Currently returns no rows; enable via BULLETIN_ENABLE_LIVE_ADAPTERS=1 once parsers ship.",
  async fetchNotices() {
    if (process.env.BULLETIN_ENABLE_LIVE_ADAPTERS?.trim() !== "1") {
      return [];
    }
    // Live HTML parsing intentionally not implemented — keep cron green.
    return [];
  },
};

export const BULLETIN_ADAPTERS: BulletinSourceAdapter[] = [
  seedMockAdapter,
  telanganaGoAdapter,
];

export async function collectFromAllAdapters(): Promise<{
  notices: IngestedBulletin[];
  adapterReports: { id: string; count: number; error?: string }[];
}> {
  const notices: IngestedBulletin[] = [];
  const adapterReports: { id: string; count: number; error?: string }[] = [];

  for (const adapter of BULLETIN_ADAPTERS) {
    try {
      const rows = await adapter.fetchNotices();
      notices.push(...rows);
      adapterReports.push({ id: adapter.id, count: rows.length });
    } catch (err) {
      adapterReports.push({
        id: adapter.id,
        count: 0,
        error: err instanceof Error ? err.message : "adapter_failed",
      });
    }
  }

  return { notices, adapterReports };
}
