export type ReelCategory = 'salon_craft' | 'nadaswaram_music' | 'youth_education';

export interface ReelSubmission {
  id: string;
  createdAt: string;
  creatorName: string;
  phone: string;
  districtSlug: string;
  mandalSlug: string;
  category: ReelCategory;
  videoUrl: string; // Instagram Reel, YouTube Shorts, or Google Drive
  title: string;
  sharesCount: number;
  status: 'pending' | 'approved' | 'featured';
}

/** Spec localStorage key — array of ReelSubmission records */
export const REELS_STORAGE_KEY = "reels_db";

export const REEL_CATEGORIES: {
  value: ReelCategory;
  labelTe: string;
  labelEn: string;
}[] = [
  {
    value: "salon_craft",
    labelTe: "సెలూన్ కళ",
    labelEn: "Salon Craft",
  },
  {
    value: "nadaswaram_music",
    labelTe: "నాదస్వరం సంగీతం",
    labelEn: "Nadaswaram Music",
  },
  {
    value: "youth_education",
    labelTe: "యువ విద్యా",
    labelEn: "Youth Education",
  },
];

export function reelCategoryLabel(category: ReelCategory): string {
  const hit = REEL_CATEGORIES.find((c) => c.value === category);
  return hit ? `${hit.labelTe} · ${hit.labelEn}` : category;
}

export function isReelCategory(value: string): value is ReelCategory {
  return (
    value === "salon_craft" ||
    value === "nadaswaram_music" ||
    value === "youth_education"
  );
}
