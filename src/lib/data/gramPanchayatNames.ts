import type { Lang, Localized } from "@/lib/types";

/** Known bad machine-translations / poisoned seed strings in gram_panchayats.name_en */
const BLOCKED_EN_PATTERNS: RegExp[] = [
  /i will not follow you/i,
  /^pity$/i,
  /^jackal$/i,
  /\bwill not follow\b/i,
];

/** English-only sentences (5+ tokens) without Telugu script are usually MT garbage. */
function looksLikeMachineTranslation(nameEn: string, nameTe: string): boolean {
  const en = nameEn.trim();
  const te = nameTe.trim();
  if (!en) return true;
  if (/[ఀ-࿀]/.test(te)) return false;
  const tokens = en.split(/\s+/).filter(Boolean);
  return tokens.length >= 5;
}

export function isBlockedGramPanchayatName(nameEn: string, nameTe: string): boolean {
  const en = nameEn.trim();
  const te = nameTe.trim();
  if (!en && !te) return true;
  if (BLOCKED_EN_PATTERNS.some((re) => re.test(en) || re.test(te))) return true;
  return looksLikeMachineTranslation(en, te);
}

/** Telugu primary + admin transliteration, e.g. "చిలుకూరు (Chilkur)". */
export function formatGramPanchayatDisplay(
  name: Localized,
  _lang: Lang,
): string {
  const te = name.te.trim();
  const en = name.en.trim();
  if (te && en && te !== en) return `${te} (${en})`;
  return te || en;
}
