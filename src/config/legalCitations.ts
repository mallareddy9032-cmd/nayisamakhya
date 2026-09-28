/**
 * Statutory citations engine — maps grievance presets to constitutional /
 * G.O. / Act grounds in formal Telugu for institutional petition dockets.
 */

export type LegalCitationId =
  | "power_subsidy"
  | "trade_license"
  | "land_hall";

export type LegalCitation = {
  id: LegalCitationId;
  /** Short UI label (Telugu). */
  categoryTe: string;
  /** Short UI label (English). */
  categoryEn: string;
  /** Primary G.O. / Act cite (Telugu). */
  primaryTe: string;
  /** Secondary statutory cite (Telugu); optional. */
  statutoryTe?: string;
  /** Formal subject line for the petition (Telugu). */
  subjectRefTe: string;
  /** Compact English tag for verify metadata. */
  categoryEnShort: string;
};

export const LEGAL_CITATIONS: Record<LegalCitationId, LegalCitation> = {
  power_subsidy: {
    id: "power_subsidy",
    categoryTe: "విద్యుత్ సబ్సిడీ",
    categoryEn: "Power Subsidy",
    categoryEnShort: "Power Subsidy",
    primaryTe:
      "తెలంగాణ రాష్ట్ర ప్రభుత్వ ఉత్తర్వు G.O. Ms. No. 23, ఇంధన (విద్యుత్) శాఖ",
    statutoryTe:
      "భారత విద్యుత్ చట్టం (Electricity Act 2003) సెక్షన్ 43 మరియు 50 నిబంధనల ప్రకారం సాంప్రదాయ కుటీర వృత్తిదారులకు సంరక్షణ.",
    subjectRefTe:
      "నాయీబ్రాహ్మణ సెలూన్లకు ఉచిత 250 యూనిట్ల విద్యుత్ జీవో అమలు మరియు రీడింగ్ సర్దుబాటు కోరుతూ వినతి.",
  },
  trade_license: {
    id: "trade_license",
    categoryTe: "ట్రేడ్ లైసెన్స్ మినహాయింపు",
    categoryEn: "Trade License Fee Waiver",
    categoryEnShort: "Trade License Fee Waiver",
    primaryTe:
      "తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (Telangana Municipalities Act, 2019) మరియు పంచాయత్ రాజ్ నిబంధనలు.",
    subjectRefTe:
      "గ్రామీణ మరియు పట్టణ పరిధిలో సాంప్రదాయ సేవా సెలూన్లపై అదనపు వాణిజ్య ట్రేడ్ లైసెన్స్ ఫీజుల రద్దు మరియు మినహాయింపు.",
  },
  land_hall: {
    id: "land_hall",
    categoryTe: "స్థల కేటాయింపు & కమ్యూనిటీ భవనం",
    categoryEn: "Land & Hall Allotment",
    categoryEnShort: "Land & Hall Allotment",
    primaryTe:
      "తెలంగాణ బీసీ సంక్షేమ శాఖ సంక్షేమ మార్గదర్శకాలు & ప్రభుత్వ భూ కేటాయింపు నిబంధనలు.",
    subjectRefTe:
      "సాంప్రదాయ నాయీ బ్రాహ్మణ సమూహాల ఆత్మగౌరవ భవన నిర్మాణం మరియు వృత్తి నైపుణ్య శిక్షణ కేంద్రాల కొరకు స్థల మంజూరు.",
  },
};

/** Map wizard grievance preset ids → statutory citation bundle. */
export const PRESET_TO_CITATION: Record<string, LegalCitationId> = {
  go23_free_power: "power_subsidy",
  trade_license_fee: "trade_license",
  modern_salon_space: "land_hall",
  community_welfare_funds: "land_hall",
};

export function getCitationForPreset(presetId: string): LegalCitation {
  const key = PRESET_TO_CITATION[presetId] || "power_subsidy";
  return LEGAL_CITATIONS[key];
}

/** Combined statutory block for letter body / verify table. */
export function formatStatutoryBlock(citation: LegalCitation): string {
  if (citation.statutoryTe) {
    return `${citation.primaryTe}\n${citation.statutoryTe}`;
  }
  return citation.primaryTe;
}
