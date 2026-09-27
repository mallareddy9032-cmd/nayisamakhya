import type { BulletinCategory } from "@/lib/bulletins/types";

/** Newsletter filter pill ids — labels are verbatim Module 3 copy. */
export const NEWSLETTER_FILTERS = [
  {
    id: "bc-a-welfare",
    label: "BC-A సంక్షేమం",
    categories: ["BC-A Welfare"] as BulletinCategory[],
    includeFieldReports: false,
  },
  {
    id: "gos-circulars",
    label: "జీవోలు & ఉత్తర్వులు",
    categories: ["Collector Circular", "Legal Rights"] as BulletinCategory[],
    includeFieldReports: false,
  },
  {
    id: "education-scholarships",
    label: "విద్యా ఉపకార వేతనాలు",
    categories: ["Education/Scholarships"] as BulletinCategory[],
    includeFieldReports: false,
  },
  {
    id: "field-reports",
    label: "క్షేత్రస్థాయి నివేదికలు",
    categories: [] as BulletinCategory[],
    includeFieldReports: true,
  },
] as const;

export type NewsletterFilterId = (typeof NEWSLETTER_FILTERS)[number]["id"];

export const NEWSLETTER_TITLE = "పాక్షిక పౌర సమాచార పత్రిక";

export function categoryBadgeClass(category: BulletinCategory): string {
  switch (category) {
    case "BC-A Welfare":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Collector Circular":
      return "bg-slate-100 text-slate-800 border-slate-200";
    case "Education/Scholarships":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "Legal Rights":
      return "bg-sky-100 text-sky-900 border-sky-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}
