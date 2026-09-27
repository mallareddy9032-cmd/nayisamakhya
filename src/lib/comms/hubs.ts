/**
 * Module 4 — multi-tier community communications routing.
 * Join URLs come from env when known; otherwise safe placeholders.
 */

function envOr(key: string, fallback: string): string {
  const publicKey = key.startsWith("NEXT_PUBLIC_")
    ? key
    : `NEXT_PUBLIC_${key}`;
  const v =
    process.env[key]?.trim() ||
    process.env[publicKey]?.trim() ||
    "";
  return v || fallback;
}

export type CommHub = {
  id: string;
  tier: "state" | "regional";
  channel: "telegram" | "whatsapp";
  name_en: string;
  name_te: string;
  description_en: string;
  description_te: string;
  join_url: string;
  /** District slugs this hub covers (empty = statewide). */
  districts: string[];
};

export function getStateCentralBroadcast(): CommHub[] {
  return [
    {
      id: "state-telegram-broadcast",
      tier: "state",
      channel: "telegram",
      name_en: "State Central Broadcast (Telegram)",
      name_te: "రాష్ట్ర కేంద్ర ప్రసారం (టెలిగ్రామ్)",
      description_en: "Official Telegram broadcast channel for statewide desk alerts.",
      description_te: "రాష్ట్రవ్యాప్త డెస్క్ హెచ్చరికల కోసం అధికారిక టెలిగ్రామ్ బ్రాడ్‌కాస్ట్ ఛానెల్.",
      join_url: envOr(
        "NAYI_TELEGRAM_BROADCAST_URL",
        "https://t.me/NayiSamakhyaBroadcast",
      ),
      districts: [],
    },
    {
      id: "state-whatsapp-announce",
      tier: "state",
      channel: "whatsapp",
      name_en: "WhatsApp Announcement Community",
      name_te: "వాట్సాప్ ప్రకటన కమ్యూనిటీ",
      description_en: "Statewide WhatsApp Announcement Community for verified coordinators.",
      description_te: "ధృవీకరించబడిన సమన్వయకర్తల కోసం రాష్ట్రవ్యాప్త వాట్సాప్ ప్రకటన కమ్యూనిటీ.",
      join_url: envOr(
        "NAYI_WHATSAPP_ANNOUNCE_COMMUNITY_URL",
        "https://chat.whatsapp.com/invite/nayi-state-announce-placeholder",
      ),
      districts: [],
    },
  ];
}

export function getRegionalWhatsAppHubs(): CommHub[] {
  return [
    {
      id: "hub-south-telangana",
      tier: "regional",
      channel: "whatsapp",
      name_en: "South Telangana Corridor (Suryapet / Kodada)",
      name_te: "దక్షిణ తెలంగాణ కారిడార్ (సూర్యాపేట / కోదాడ)",
      description_en: "Regional WhatsApp hub for Suryapet–Kodada corridor coordinators.",
      description_te: "సూర్యాపేట–కోదాడ కారిడార్ సమన్వయకర్తల ప్రాంతీయ వాట్సాప్ హబ్.",
      join_url: envOr(
        "NAYI_WA_HUB_SOUTH_URL",
        "https://chat.whatsapp.com/invite/nayi-hub-south-placeholder",
      ),
      districts: ["suryapet", "nalgonda", "yadadri-bhuvanagiri", "khammam"],
    },
    {
      id: "hub-north-corridor",
      tier: "regional",
      channel: "whatsapp",
      name_en: "North Corridor",
      name_te: "ఉత్తర కారిడార్",
      description_en: "Regional WhatsApp hub for northern Telangana districts.",
      description_te: "ఉత్తర తెలంగాణ జిల్లాల ప్రాంతీయ వాట్సాప్ హబ్.",
      join_url: envOr(
        "NAYI_WA_HUB_NORTH_URL",
        "https://chat.whatsapp.com/invite/nayi-hub-north-placeholder",
      ),
      districts: [
        "adilabad",
        "nirmal",
        "mancherial",
        "kumuram-bheem-asifabad",
        "nizamabad",
        "kamareddy",
      ],
    },
    {
      id: "hub-greater-hyderabad",
      tier: "regional",
      channel: "whatsapp",
      name_en: "Greater Hyderabad / Rangareddy",
      name_te: "గ్రేటర్ హైదరాబాద్ / రంగారెడ్డి",
      description_en: "Regional WhatsApp hub for GHMC and Rangareddy belt.",
      description_te: "GHMC మరియు రంగారెడ్డి బెల్ట్ ప్రాంతీయ వాట్సాప్ హబ్.",
      join_url: envOr(
        "NAYI_WA_HUB_HYD_URL",
        "https://chat.whatsapp.com/invite/nayi-hub-hyd-placeholder",
      ),
      districts: [
        "hyderabad",
        "rangareddy",
        "medchal-malkajgiri",
        "sangareddy",
        "vikarabad",
      ],
    },
  ];
}

export function getAllCommHubs(): CommHub[] {
  return [...getStateCentralBroadcast(), ...getRegionalWhatsAppHubs()];
}

/** Pick the best regional hub for a district slug (fallback: state WhatsApp). */
export function resolveHubForDistrict(districtSlug: string): CommHub {
  const slug = districtSlug.trim().toLowerCase();
  const regional = getRegionalWhatsAppHubs().find((h) =>
    h.districts.includes(slug),
  );
  if (regional) return regional;
  return getStateCentralBroadcast().find((h) => h.channel === "whatsapp")!;
}

export function formatHubsForTelegramHtml(): string {
  const lines: string[] = [
    "<b>సమాచార హబ్‌లు / Communication hubs</b>",
    "",
  ];
  for (const hub of getAllCommHubs()) {
    const icon = hub.channel === "telegram" ? "📢" : "💬";
    lines.push(
      `${icon} <b>${escapeHtml(hub.name_te)}</b>\n<a href="${escapeAttr(hub.join_url)}">${escapeHtml(hub.join_url)}</a>`,
    );
  }
  return lines.join("\n\n");
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
