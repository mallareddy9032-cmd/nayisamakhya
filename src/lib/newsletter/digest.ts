/**
 * Fortnightly civic newsletter — types, badges, and fallback notices.
 */

export const NEWSLETTER_TITLE =
  "పాక్షిక పౌర సమాచార పత్రిక (Civic Fortnightly Digest)";

export const NEWSLETTER_TITLE_SHORT = "పాక్షిక పౌర సమాచార పత్రిక";

export const NEWSLETTER_CANONICAL = "https://www.nayisamakhya.org/newsletter";

/** Categories shown in the digest UI (includes G.O. 23 Power accent). */
export const DIGEST_CATEGORIES = [
  "G.O. 23 Power",
  "BC-A Welfare",
  "Collector Circular",
  "Education & Scholarships",
  "Education/Scholarships",
  "Legal Rights",
] as const;

export type DigestCategory = (typeof DIGEST_CATEGORIES)[number] | string;

export type DigestBulletin = {
  id: string;
  title: string;
  category: DigestCategory;
  summary_te: string;
  target_districts: string[];
  source_url: string | null;
  pdf_url: string | null;
  published_at: string;
  created_at: string;
  is_fallback?: boolean;
};

export type FortnightEdition = {
  id: string;
  label_te: string;
  start: string;
  end: string;
  is_current: boolean;
  bulletins: DigestBulletin[];
};

export const CATEGORY_FILTER_TABS = [
  { id: "all", label: "అన్నీ" },
  { id: "G.O. 23 Power", label: "G.O. 23 Power" },
  { id: "BC-A Welfare", label: "BC-A Welfare" },
  { id: "Collector Circular", label: "Collector Circular" },
  { id: "Education & Scholarships", label: "విద్యా ఉపకార వేతనాలు" },
] as const;

export type CategoryFilterId = (typeof CATEGORY_FILTER_TABS)[number]["id"];

/** Spec badge accents. */
export function categoryBadgeStyle(category: DigestCategory): {
  className: string;
  style?: Record<string, string>;
} {
  const normalized = normalizeCategory(category);
  switch (normalized) {
    case "G.O. 23 Power":
      return {
        className: "border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        style: {
          background: "rgb(5 150 105 / 0.12)",
          color: "#059669",
          borderColor: "rgb(5 150 105 / 0.35)",
        },
      };
    case "BC-A Welfare":
      return {
        className: "border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        style: {
          background: "rgb(180 83 9 / 0.12)",
          color: "#B45309",
          borderColor: "rgb(180 83 9 / 0.35)",
        },
      };
    case "Collector Circular":
      return {
        className: "border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        style: {
          background: "rgb(30 41 59 / 0.08)",
          color: "#1E293B",
          borderColor: "rgb(30 41 59 / 0.25)",
        },
      };
    default:
      return {
        className:
          "border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700",
      };
  }
}

export function normalizeCategory(category: string): DigestCategory {
  const c = category.trim();
  if (c === "Education/Scholarships" || c === "Education & Scholarships") {
    return "Education & Scholarships";
  }
  if (/g\.?o\.?\s*23|250\s*unit|free\s*power/i.test(c)) {
    return "G.O. 23 Power";
  }
  return c;
}

export function matchesFilter(
  bulletin: DigestBulletin,
  filter: CategoryFilterId | string,
): boolean {
  if (filter === "all") return true;
  const cat = normalizeCategory(bulletin.category);
  if (filter === "Education & Scholarships") {
    return (
      cat === "Education & Scholarships" ||
      bulletin.category === "Education/Scholarships"
    );
  }
  return cat === filter;
}

const FORTNIGHT_MS = 14 * 24 * 60 * 60 * 1000;

export function fortnightWindowFor(date: Date, now = new Date()) {
  const age = Math.max(0, now.getTime() - date.getTime());
  const index = Math.floor(age / FORTNIGHT_MS);
  const end = new Date(now.getTime() - index * FORTNIGHT_MS);
  const start = new Date(end.getTime() - FORTNIGHT_MS);
  return { index, start, end };
}

export function groupIntoFortnightEditions(
  bulletins: DigestBulletin[],
  now = new Date(),
): FortnightEdition[] {
  const buckets = new Map<number, DigestBulletin[]>();
  for (const b of bulletins) {
    const when = new Date(b.created_at || b.published_at);
    const { index } = fortnightWindowFor(when, now);
    const list = buckets.get(index) || [];
    list.push(b);
    buckets.set(index, list);
  }

  // Always materialize current edition (index 0), even if empty.
  if (!buckets.has(0)) buckets.set(0, []);

  const indices = [...buckets.keys()].sort((a, b) => a - b);
  return indices.map((index) => {
    // Align window precisely for label
    const winEnd = new Date(now.getTime() - index * FORTNIGHT_MS);
    const winStart = new Date(winEnd.getTime() - FORTNIGHT_MS);
    const rows = (buckets.get(index) || []).slice().sort((a, b) => {
      return (
        new Date(b.created_at || b.published_at).getTime() -
        new Date(a.created_at || a.published_at).getTime()
      );
    });
    return {
      id: `fn-${index}-${winStart.toISOString().slice(0, 10)}`,
      label_te:
        index === 0
          ? "ప్రస్తుత పాక్షిక సంకలనం"
          : `గత సంకలనం · ${index * 14}–${(index + 1) * 14} రోజుల క్రితం`,
      start: winStart.toISOString(),
      end: (index === 0 ? now : winEnd).toISOString(),
      is_current: index === 0,
      bulletins: rows,
    };
  });
}

/** Institutional fallback when the current fortnight has no live bulletins. */
export function institutionalFallbackNotices(now = new Date()): DigestBulletin[] {
  const iso = now.toISOString();
  return [
    {
      id: "fallback-go23",
      title: "G.O. 23 — కమ్యూనిటీ సెలూన్లకు 250 యూనిట్ల ఉచిత విద్యుత్",
      category: "G.O. 23 Power",
      summary_te:
        "తెలంగాణ ప్రభుత్వ G.O. 23 ప్రకారం అర్హతగల కమ్యూనిటీ సెలూన్ / బజంత్రి వృత్తిదుకాణాలకు నెలకు 250 యూనిట్ల ఉచిత విద్యుత్ సబ్సిడీ వర్తిస్తుంది. మండల సమన్వయకర్తలు DISCOM వినతి ఫారం & స్థానిక ధృవీకరణ శిబిరాలు నిర్వహించాలి.",
      target_districts: ["STATEWIDE"],
      source_url: "https://www.nayisamakhya.org/policies/go-23",
      pdf_url: null,
      published_at: iso,
      created_at: iso,
      is_fallback: true,
    },
    {
      id: "fallback-bca-overseas",
      title: "BC-A విదేశీ / ప్రీ-మ్యాట్రిక్ ఉపకార వేతనాలు — దరఖాస్తు విండో",
      category: "BC-A Welfare",
      summary_te:
        "BC-A విద్యార్థులకు ఓవర్సీస్ స్కాలర్‌షిప్ మరియు ప్రీ-మ్యాట్రిక్ ఉపకార వేతనాల దరఖాస్తు కాలపరిమితి ప్రారంభమైంది. జిల్లా సంక్షేమ కార్యాలయం / ఆన్‌లైన్ పోర్టల్ ద్వారా పత్రాలు సమర్పించి రసీదు తీసుకోండి.",
      target_districts: ["STATEWIDE"],
      source_url: "https://www.nayisamakhya.org/verticals/education",
      pdf_url: null,
      published_at: iso,
      created_at: iso,
      is_fallback: true,
    },
    {
      id: "fallback-corridor",
      title: "పైలట్ కారిడార్ పురోగతి — సూర్యాపేట · కోదాడ · రంగారెడ్డి",
      category: "Collector Circular",
      summary_te:
        "సూర్యాపేట, కోదాడ మండలం, రంగారెడ్డి పైలట్ కారిడార్లలో సాచ్యూరేషన్ ఇండెక్స్, ఫీల్డ్ ఫోటో ధృవీకరణ, సమన్వయకర్త నెట్‌వర్క్ విస్తరణ కొనసాగుతోంది. జిల్లా డెస్క్‌లు వారం వారం పెండింగ్ ఆమోదాలు క్లియర్ చేయాలి.",
      target_districts: ["suryapet", "rangareddy"],
      source_url: "https://www.nayisamakhya.org/admin/desk",
      pdf_url: null,
      published_at: iso,
      created_at: iso,
      is_fallback: true,
    },
  ];
}

/** Spec WhatsApp broadcast for a single bulletin. */
export function buildBulletinWhatsAppText(b: DigestBulletin): string {
  const goMatch = b.title.match(/G\.?O\.?\s*[\d.]+/i);
  const goNumber =
    goMatch?.[0] ||
    (normalizeCategory(b.category) === "G.O. 23 Power"
      ? "G.O. Ms. No. 23"
      : b.category);
  const date = (() => {
    try {
      return new Intl.DateTimeFormat("te-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(b.published_at || b.created_at));
    } catch {
      return (b.published_at || "").slice(0, 10);
    }
  })();

  return [
    "📢 *తెలంగాణ నాయీ సమాఖ్య - తాజా సంక్షేమ బులెటిన్* 🏛️",
    "",
    `🔹 *ముఖ్య సమాచారం:* ${b.title}`,
    `📜 *ప్రభుత్వ ఉత్తర్వు:* ${goNumber}`,
    `📅 *తేది:* ${date}`,
    "",
    "🔍 *కీలక అంశాలు:*",
    `• ${b.summary_te}`,
    "",
    "📄 అధికారిక పత్రం మరియు పూర్తి వినతిపత్రాల కొరకు:",
    `👉 ${NEWSLETTER_CANONICAL}`,
    "",
    "సహాయవాణి & సమన్వయం: +91 9032654111",
    "నాయీ సమాఖ్య అధికారిక సమాచారం",
  ].join("\n");
}

export function buildWhatsAppShareText(
  edition: FortnightEdition,
  top: DigestBulletin[],
): string {
  const lines = [
    "📢 *తెలంగాణ నాయీ సమాఖ్య - తాజా సంక్షేమ బులెటిన్* 🏛️",
    "",
    `📰 ${NEWSLETTER_TITLE_SHORT}`,
    `*${edition.label_te}*`,
    "",
    ...top.slice(0, 3).flatMap((b, i) => [
      `🔹 *${i + 1}. ${b.title}*`,
      `• ${b.summary_te.slice(0, 160)}${b.summary_te.length > 160 ? "…" : ""}`,
      "",
    ]),
    "📄 అధికారిక పత్రం మరియు పూర్తి వినతిపత్రాల కొరకు:",
    `👉 ${NEWSLETTER_CANONICAL}`,
    "",
    "సహాయవాణి & సమన్వయం: +91 9032654111",
    "నాయీ సమాఖ్య అధికారిక సమాచారం",
  ];
  return lines.join("\n");
}

/** Top-3 gazette items for A4 wall poster (live or institutional fallback). */
export function gazettePosterItems(
  edition: FortnightEdition,
  now = new Date(),
): DigestBulletin[] {
  const live = edition.bulletins.slice(0, 3);
  if (live.length >= 3) return live;
  const fallback = institutionalFallbackNotices(now);
  const merged = [...live];
  for (const f of fallback) {
    if (merged.length >= 3) break;
    if (!merged.some((b) => b.id === f.id)) merged.push(f);
  }
  return merged.slice(0, 3);
}
