/**
 * Grassroots WhatsApp Community Hubs — regional peer corridors.
 * Invite URLs: NEXT_PUBLIC_WA_HUB_* (preferred) or legacy NAYI_WA_HUB_*_URL.
 */

export interface RegionalHub {
  id: string;
  nameTe: string;
  coverageTe: string;
  districts: string[];
  inviteUrl: string;
  helplineUrl: string;
  badgeTe: string;
}

const HELPLINE_BASE = "https://wa.me/919032654111";

function helpline(prefillTe: string): string {
  return `${HELPLINE_BASE}?text=${encodeURIComponent(prefillTe)}`;
}

function envInvite(
  primary: string | undefined,
  secondary: string | undefined,
  tertiary: string | undefined,
  fallback: string,
): string {
  return (
    primary?.trim() || secondary?.trim() || tertiary?.trim() || fallback
  );
}

/** Fresh read each call so client + server both pick up NEXT_PUBLIC_* inlines. */
export function getRegionalCommunityHubs(): RegionalHub[] {
  return [
    {
      id: "south-telangana",
      nameTe: "దక్షిణ తెలంగాణ కారిడార్ (సూర్యాపేట & కోదాడ హబ్)",
      coverageTe:
        "సూర్యాపేట, కోదాడ, నల్గొండ, ఖమ్మం, భద్రాద్రి కొత్తగూడెం",
      districts: [
        "suryapet",
        "kodad",
        "nalgonda",
        "khammam",
        "bhadradri",
        "bhadradri-kothagudem",
        "yadadri-bhuvanagiri",
      ],
      inviteUrl: envInvite(
        process.env.NEXT_PUBLIC_WA_HUB_SOUTH,
        process.env.NEXT_PUBLIC_NAYI_WA_HUB_SOUTH_URL,
        process.env.NAYI_WA_HUB_SOUTH_URL,
        "https://chat.whatsapp.com/sample-south",
      ),
      helplineUrl: helpline(
        "దక్షిణ తెలంగాణ కారిడార్ గ్రూపులో జాయిన్ అవ్వాలనుకుంటున్నాను",
      ),
      badgeTe: "పైలట్ కారిడార్",
    },
    {
      id: "greater-hyderabad",
      nameTe: "గ్రేటర్ హైదరాబాద్ & రంగారెడ్డి హబ్",
      coverageTe:
        "హైదరాబాద్, రంగారెడ్డి, మేడ్చల్-మల్కాజిగిరి, వికారాబాద్",
      districts: [
        "hyderabad",
        "rangareddy",
        "medchal",
        "medchal-malkajgiri",
        "vikarabad",
        "sangareddy",
      ],
      inviteUrl: envInvite(
        process.env.NEXT_PUBLIC_WA_HUB_HYD,
        process.env.NEXT_PUBLIC_NAYI_WA_HUB_HYD_URL,
        process.env.NAYI_WA_HUB_HYD_URL,
        "https://chat.whatsapp.com/sample-hyd",
      ),
      helplineUrl: helpline(
        "రంగారెడ్డి/హైదరాబాద్ గ్రూపులో జాయిన్ అవ్వాలనుకుంటున్నాను",
      ),
      badgeTe: "అర్బన్ హబ్",
    },
    {
      id: "north-telangana",
      nameTe: "ఉత్తర తెలంగాణ కారిడార్",
      coverageTe:
        "వరంగల్, కరీంనగర్, నిజామాబాద్, ఆదిలాబాద్ పరిసర జిల్లాలు",
      districts: [
        "warangal",
        "warangal-urban",
        "hanumakonda",
        "karimnagar",
        "nizamabad",
        "adilabad",
        "nirmal",
        "mancherial",
        "kamareddy",
      ],
      inviteUrl: envInvite(
        process.env.NEXT_PUBLIC_WA_HUB_NORTH,
        process.env.NEXT_PUBLIC_NAYI_WA_HUB_NORTH_URL,
        process.env.NAYI_WA_HUB_NORTH_URL,
        "https://chat.whatsapp.com/sample-north",
      ),
      helplineUrl: helpline(
        "ఉత్తర తెలంగాణ గ్రూపులో జాయిన్ అవ్వాలనుకుంటున్నాను",
      ),
      badgeTe: "రీజనల్ హబ్",
    },
  ];
}

/** Static snapshot for typed imports; prefer getRegionalCommunityHubs() at runtime. */
export const REGIONAL_COMMUNITY_HUBS: RegionalHub[] =
  getRegionalCommunityHubs();

export function resolveRegionalHubForDistrict(
  districtSlug: string | null | undefined,
): RegionalHub | null {
  const slug = (districtSlug || "").trim().toLowerCase();
  if (!slug) return null;
  return (
    getRegionalCommunityHubs().find((h) => h.districts.includes(slug)) || null
  );
}

/** Sort hubs so the matching corridor (e.g. Suryapet → South) leads. */
export function sortHubsForDistrict(
  districtSlug: string | null | undefined,
): RegionalHub[] {
  const hubs = getRegionalCommunityHubs();
  const slug = (districtSlug || "").trim().toLowerCase();
  if (!slug) return hubs;
  return [...hubs].sort((a, b) => {
    const aMatch = a.districts.includes(slug) ? 0 : 1;
    const bMatch = b.districts.includes(slug) ? 0 : 1;
    return aMatch - bMatch;
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Telugu HTML block for Telegram /groups and /join. */
export function formatRegionalHubsForTelegramHtml(): string {
  const hubs = getRegionalCommunityHubs();
  const lines: string[] = [
    "<b>🌍 ప్రాంతీయ వాట్సాప్ కమ్యూనిటీ హబ్‌లు</b>",
    "",
    "కోఆర్డినేటర్ లోడ్ తగ్గించేందుకు మీ కారిడార్ గ్రూపులో చేరండి:",
    "",
  ];
  hubs.forEach((hub, i) => {
    lines.push(
      `${i + 1}. <b>${escapeHtml(hub.nameTe)}</b>\n` +
        `<i>${escapeHtml(hub.coverageTe)}</i>\n` +
        `💬 <a href="${escapeAttr(hub.inviteUrl)}">గ్రూపులో చేరండి</a>\n` +
        `📞 <a href="${escapeAttr(hub.helplineUrl)}">హెల్ప్‌లైన్ అడ్మిన్</a>`,
    );
  });
  lines.push(
    "",
    "<i>అధికారిక గ్రూపులు మాత్రమే — బయటి ప్రచారాలకు తావులేదు.</i>",
  );
  return lines.join("\n\n");
}
