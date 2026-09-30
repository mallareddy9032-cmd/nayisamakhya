import type { ReelSubmission } from "@/types/reels";

/**
 * Featured / approved showcase seeds — gallery never empty on first paint.
 * Merged with API + localStorage submissions (seeds win on id collision).
 */
export const SEED_SHOWCASE_REELS: ReelSubmission[] = [
  {
    id: "seed-reel-salon-kodad",
    createdAt: "2026-09-12T08:30:00.000Z",
    creatorName: "రాములు నాయి",
    phone: "9000000001",
    districtSlug: "suryapet",
    mandalSlug: "kodad",
    category: "salon_craft",
    videoUrl: "https://www.youtube.com/shorts/nayi-salon-craft-demo",
    caption: "మా ఊరి సెలూన్ కళ — కత్తెర నైపుణ్యం",
    sharesCount: 67,
    likesCount: 248,
    status: "featured",
  },
  {
    id: "seed-reel-nadaswaram-suryapet",
    createdAt: "2026-09-18T11:15:00.000Z",
    creatorName: "వెంకటేశ్వర శర్మ",
    phone: "9000000002",
    districtSlug: "suryapet",
    mandalSlug: "suryapet",
    category: "nadaswaram_music",
    videoUrl: "https://www.youtube.com/shorts/nayi-nadaswaram-demo",
    caption: "పెళ్లి మండపం నాదస్వరం — మన సంప్రదాయ ధ్వని",
    sharesCount: 128,
    likesCount: 412,
    status: "featured",
  },
  {
    id: "seed-reel-youth-hanumakonda",
    createdAt: "2026-09-22T14:00:00.000Z",
    creatorName: "లక్ష్మి దేవి",
    phone: "9000000003",
    districtSlug: "hanumakonda",
    mandalSlug: "hanumakonda",
    category: "youth_education",
    videoUrl: "https://www.instagram.com/reel/nayi-youth-edu-demo",
    caption: "యువతకు విద్యా వెలుగు — ఆత్మగౌరవ కథ",
    sharesCount: 54,
    likesCount: 189,
    status: "approved",
  },
];

/** Merge seeds + remote + local public rows; prefer higher engagement on same id. */
export function mergeShowcaseGallery(
  remote: ReelSubmission[],
  localPublic: ReelSubmission[],
): ReelSubmission[] {
  const map = new Map<string, ReelSubmission>();

  for (const seed of SEED_SHOWCASE_REELS) {
    map.set(seed.id, seed);
  }

  for (const row of [...remote, ...localPublic]) {
    if (row.status !== "approved" && row.status !== "featured") continue;
    const prev = map.get(row.id);
    if (!prev) {
      map.set(row.id, row);
      continue;
    }
    // Keep the richer engagement snapshot
    const prevScore = (prev.likesCount || 0) + (prev.sharesCount || 0);
    const nextScore = (row.likesCount || 0) + (row.sharesCount || 0);
    if (nextScore >= prevScore) map.set(row.id, { ...prev, ...row });
  }

  return Array.from(map.values()).sort((a, b) => {
    const featuredDelta =
      Number(b.status === "featured") - Number(a.status === "featured");
    if (featuredDelta !== 0) return featuredDelta;
    const likeDelta = (b.likesCount || 0) - (a.likesCount || 0);
    if (likeDelta !== 0) return likeDelta;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}
