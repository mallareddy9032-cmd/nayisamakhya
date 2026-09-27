export const BULLETIN_CATEGORIES = [
  "BC-A Welfare",
  "Collector Circular",
  "Education/Scholarships",
  "Legal Rights",
] as const;

export type BulletinCategory = (typeof BULLETIN_CATEGORIES)[number];

export const BROADCAST_STATUSES = [
  "pending",
  "ready",
  "dispatched",
  "failed",
  "skipped",
] as const;

export type BroadcastStatus = (typeof BROADCAST_STATUSES)[number];

export type CivicBulletin = {
  id: string;
  title: string;
  category: BulletinCategory;
  target_districts: string[];
  source_url: string | null;
  pdf_url: string | null;
  summary_te: string;
  published_at: string;
  broadcast_status: BroadcastStatus;
  source_adapter?: string;
  source_external_id?: string | null;
  approved_for_newsletter?: boolean;
  dispatched_at?: string | null;
  dispatch_meta?: Record<string, unknown>;
  created_at?: string;
};

export type IngestedBulletin = {
  title: string;
  category: BulletinCategory;
  target_districts: string[];
  source_url: string | null;
  pdf_url: string | null;
  summary_te: string;
  published_at: string;
  source_adapter: string;
  source_external_id: string;
  broadcast_status?: BroadcastStatus;
  approved_for_newsletter?: boolean;
};

export type BulletinCoordinatorEndpoint = {
  id: string;
  district_slug: string;
  name_en: string;
  name_te: string | null;
  telegram_chat_id: string | null;
  whatsapp_e164: string | null;
  is_active: boolean;
};
