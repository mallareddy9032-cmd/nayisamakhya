import type { BulletinCategory } from "@/lib/bulletins/types";

const CATEGORY_OPENERS: Record<BulletinCategory, string> = {
  "BC-A Welfare":
    "బిసి-ఎ సంక్షేమం సంబంధించిన అధికారిక నోటీసు",
  "Collector Circular":
    "కలెక్టర్ / ప్రభుత్వ ఉత్తర్వు సంబంధించిన అధికారిక సర్క్యులర్",
  "Education/Scholarships":
    "విద్యా ఉపకార వేతనాలు / విద్యా సహాయం సంబంధించిన నోటీసు",
  "Legal Rights":
    "చట్టపరమైన హక్కులు / న్యాయ సహాయం సంబంధించిన సమాచారం",
};

/**
 * Formal Telugu auto-summary for ingested GOs / circulars.
 * Deterministic template — no external LLM required for the pipeline to run.
 */
export function generateTeluguSummary(input: {
  title: string;
  category: BulletinCategory;
  districts: string[];
  bodyExcerpt?: string;
}): string {
  const opener = CATEGORY_OPENERS[input.category];
  const districtLine =
    input.districts.length === 0
      ? "ఇది రాష్ట్రస్థాయి వర్తింపు కలిగిన నోటీసు."
      : `లక్ష్య జిల్లాలు: ${input.districts.join(", ")}.`;
  const excerpt = (input.bodyExcerpt || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

  const body = excerpt
    ? `సారాంశం: ${excerpt}${excerpt.length >= 220 ? "…" : ""}`
    : "వివరాల కోసం అధికారిక మూల పత్రాన్ని చూడండి.";

  return [
    `${opener}.`,
    `శీర్షిక: ${input.title.trim()}.`,
    districtLine,
    body,
    "మండల సమన్వయకర్తలు స్థానిక సభ్యులకు తక్షణం చేరవేయాలి.",
  ].join(" ");
}
