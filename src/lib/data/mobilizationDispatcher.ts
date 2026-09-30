/** Localized WhatsApp mobilization templates for State/District/Mandal coordinators. */

import type { AdminEntity } from "@/data/telanganaGeo";
import { PORTAL_URL } from "@/lib/data/communityAnnounce";

export const SHARE_PAYLOAD_MAX = 1200;
export const HELPLINE_DISPLAY = "+91 9032654111";
export const HELPLINE_WA_URL = "https://wa.me/919032654111";

export type MobilizationFocusId = "go23" | "urban-trade" | "cadre";

export type MobilizationFocus = {
  id: MobilizationFocusId;
  title_te: string;
  title_en: string;
  blurb_te: string;
};

export const MOBILIZATION_FOCUSES: MobilizationFocus[] = [
  {
    id: "go23",
    title_te: "సమగ్ర సంక్షేమం & జీ.ఓ. 23 (Free Power & Livelihood)",
    title_en: "Welfare & G.O. 23 — free power & livelihood",
    blurb_te: "250 యూనిట్ల ఉచిత విద్యుత్ + జీవనోపాధి హక్కులు",
  },
  {
    id: "urban-trade",
    title_te: "మున్సిపల్ షాప్ రక్షణ & ట్రేడ్ లైసెన్స్ (Urban Trade Defense)",
    title_en: "Municipal shop protection & trade licence",
    blurb_te: "షాపు హక్కులు, లైసెన్స్, నోటీసు రక్షణ",
  },
  {
    id: "cadre",
    title_te: "సమన్వయకర్త ఐడీ కార్డు నమోదు (Coordinator Cadre Drive)",
    title_en: "Coordinator ID card enrolment",
    blurb_te: "డిజిటల్ ఐడీ కార్డు + QR నమోదు",
  },
];

export function getMobilizationFocus(
  id: string | null | undefined,
): MobilizationFocus {
  return (
    MOBILIZATION_FOCUSES.find((f) => f.id === id) || MOBILIZATION_FOCUSES[0]
  );
}

export type MobilizationContext = {
  districtSlug: string;
  districtNameTe: string;
  districtNameEn: string;
  entity: AdminEntity | null;
};

export function districtDeskUrl(districtSlug: string): string {
  return `${PORTAL_URL}/${districtSlug}`;
}

export function entityDeskUrl(districtSlug: string, entitySlug: string): string {
  return `${PORTAL_URL}/${districtSlug}/${entitySlug}`;
}

export function representationUrl(focus: MobilizationFocusId): string {
  if (focus === "go23") {
    return `${PORTAL_URL}/representation?subject=go23_free_power`;
  }
  if (focus === "urban-trade") {
    return `${PORTAL_URL}/representation?subject=trade_licence`;
  }
  return `${PORTAL_URL}/representation`;
}

export function coordinatorCardUrl(): string {
  return `${PORTAL_URL}/coordinators/card`;
}

export function clampSharePayload(text: string, max = SHARE_PAYLOAD_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const breakAt = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
  const cut = breakAt > max * 0.6 ? slice.slice(0, breakAt) : slice;
  return `${cut.trimEnd()}…`;
}

function placeLine(ctx: MobilizationContext): string {
  const entity = ctx.entity;
  if (!entity) {
    return `📍 *${ctx.districtNameTe} జిల్లా*`;
  }
  const kind =
    entity.type === "corporation"
      ? "కార్పొరేషన్"
      : entity.type === "municipality"
        ? "మున్సిపాలిటీ"
        : "మండలం";
  return `📍 *${ctx.districtNameTe}* · *${entity.nameTe}* (${kind})`;
}

function linksBlock(ctx: MobilizationContext, focus: MobilizationFocusId): string {
  const lines = [
    `📄 వినతిపత్రం: ${representationUrl(focus)}`,
    `🪪 సమన్వయకర్త కార్డు: ${coordinatorCardUrl()}`,
    `🏛️ జిల్లా డెస్క్: ${districtDeskUrl(ctx.districtSlug)}`,
  ];
  if (ctx.entity) {
    lines.push(
      `📌 స్థానిక డెస్క్: ${entityDeskUrl(ctx.districtSlug, ctx.entity.slug)}`,
    );
  }
  lines.push(`☎️ సహాయవాణి: ${HELPLINE_DISPLAY}`);
  lines.push(`🌐 ${PORTAL_URL.replace(/^https:\/\//, "")}`);
  return lines.join("\n");
}

function buildGo23(ctx: MobilizationContext): string {
  return [
    `⚡ *నాయి సమాఖ్య — జీ.ఓ. 23 & సమగ్ర సంక్షేమం*`,
    ``,
    placeLine(ctx),
    ``,
    `సోదరులారా, *250 యూనిట్ల ఉచిత విద్యుత్* మరియు జీవనోపాధి హక్కుల కోసం మన మండల/పట్టణ వాట్సాప్ గ్రూపుల్లో ఈ సందేశం తప్పక షేర్ చేయండి.`,
    ``,
    `✅ చేయవలసినవి:`,
    `1️⃣ వినతిపత్రం ప్రింట్ చేసి MRO / మున్సిపల్ అధికారికి సమర్పించండి`,
    `2️⃣ సెలూన్ / షాపు ఫోటో + జిల్లా-మండలం పేరుతో డెస్క్‌కు పంపండి`,
    `3️⃣ సమన్వయకర్త ఐడీ కార్డు నమోదు పూర్తి చేయండి`,
    ``,
    linksBlock(ctx, "go23"),
    ``,
    `_ఒకే సందేశం — ఒకే ఉద్యమం._`,
    `🤝 *నాయి సమాఖ్య తెలంగాణ*`,
  ].join("\n");
}

function buildUrbanTrade(ctx: MobilizationContext): string {
  const urbanHint =
    ctx.entity && ctx.entity.type !== "rural-mandal"
      ? `\n🏙️ ఈ ప్రసారం *${ctx.entity.nameTe}* పట్టణ వ్యాపారులకు ప్రత్యేకం.`
      : "";

  return [
    `🛡️ *నాయి సమాఖ్య — మున్సిపల్ షాప్ రక్షణ & ట్రేడ్ లైసెన్స్*`,
    ``,
    placeLine(ctx),
    urbanHint,
    ``,
    `షాపు నోటీసులు, లైసెన్స్ ఆలస్యం, స్థల హక్కుల సమస్యలు ఉంటే *అధికారిక వినతిపత్రం*తో ముందుకు రండి — ఫీజు లేదు.`,
    ``,
    `✅ చేయవలసినవి:`,
    `1️⃣ ట్రేడ్ లైసెన్స్ / షాప్ రక్షణ వినతిపత్రం డౌన్‌లోడ్`,
    `2️⃣ మున్సిపల్ / కార్పొరేషన్ కార్యాలయానికి అక్నాలెడ్జ్‌మెంట్‌తో సమర్పణ`,
    `3️⃣ వాట్సాప్ గ్రూపుల్లో ఈ సందేశం షేర్`,
    ``,
    linksBlock(ctx, "urban-trade"),
    ``,
    `_పట్టణ వ్యాపార రక్షణ — సమాఖ్య బాధ్యత._`,
    `🤝 *నాయి సమాఖ్య తెలంగాణ*`,
  ].join("\n");
}

function buildCadre(ctx: MobilizationContext): string {
  return [
    `🪪 *నాయి సమాఖ్య — సమన్వయకర్త ఐడీ కార్డు నమోదు*`,
    ``,
    placeLine(ctx),
    ``,
    `ప్రతి మండల / పట్టణ సమన్వయకర్త *డిజిటల్ ఐడీ కార్డు* నమోదు చేసుకోవాలి. QR స్కాన్‌తో సేవా డెస్క్‌కు నేరుగా చేరుకుంటారు.`,
    ``,
    `✅ చేయవలసినవి:`,
    `1️⃣ కార్డు పేజీలో పేరు, మండలం, మొబైల్ నమోదు`,
    `2️⃣ Print Card → PDF / లామినేషన్`,
    `3️⃣ స్థానిక వాట్సాప్ గ్రూపుల్లో కార్డు లింక్ షేర్`,
    ``,
    linksBlock(ctx, "cadre"),
    ``,
    `_క్యాడర్ బలం = జిల్లా బలం._`,
    `🤝 *నాయి సమాఖ్య తెలంగాణ*`,
  ].join("\n");
}

export function buildMobilizationMessage(
  focusId: MobilizationFocusId,
  ctx: MobilizationContext,
): string {
  const raw =
    focusId === "urban-trade"
      ? buildUrbanTrade(ctx)
      : focusId === "cadre"
        ? buildCadre(ctx)
        : buildGo23(ctx);
  return clampSharePayload(raw);
}

export function whatsappShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
