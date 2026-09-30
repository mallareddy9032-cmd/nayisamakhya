import type { MetadataRoute } from "next";
import { listGeoDistricts } from "@/data/telanganaGeo";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";
import { verticals } from "@/lib/data/verticals";
import { SITE_ORIGIN } from "@/lib/seo/site";

/**
 * Programmatic sitemap for nayisamakhya.org.
 *
 * Geo URL pattern (verified against App Router):
 *   /districts/[district]           → src/app/districts/[district]/page.tsx
 *   /districts/[district]/[mandal]  → src/app/districts/[district]/[mandal]/page.tsx
 *
 * Alternate portals also exist at /[district] and /[district]/[slug]; those are
 * not duplicated here to avoid soft-duplicate indexing. Catch-all entity desks
 * still emit their own canonicals + JSON-LD.
 *
 * Skipped (noindex or non-indexable): /admin/**, /api/**, /twa, /coordinator-card
 * Skipped (no public hub / ephemeral ids): /verify, /verify/[id]
 */

const POLICY_SLUGS = ["privacy", "terms", "hyperlinking"] as const;

function url(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticHigh: MetadataRoute.Sitemap = [
    "/",
    "/representation",
    "/survey",
    "/sprint",
    "/reels",
    "/quiz",
    "/districts",
    "/poster",
    "/announce",
    "/feed",
  ].map((path) => ({
    url: url(path),
    lastModified,
    changeFrequency: "daily" as const,
    priority: path === "/" ? 1 : 0.9,
  }));

  const staticSecondary: MetadataRoute.Sitemap = [
    "/history",
    "/newsletter",
    "/mandals",
    "/sitemap",
    "/verticals/gallery",
    "/verticals/matrimonial",
  ].map((path) => ({
    url: url(path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const verticalRoutes: MetadataRoute.Sitemap = verticals
    .map((v) => v.slug)
    .filter(isUsablePlaceSlug)
    .filter((slug) => slug !== "gallery" && slug !== "matrimonial")
    .map((slug) => ({
      url: url(`/verticals/${slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const policyRoutes: MetadataRoute.Sitemap = POLICY_SLUGS.map((slug) => ({
    url: url(`/policies/${slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  const districts = listGeoDistricts().filter((d) =>
    isUsablePlaceSlug(d.slug),
  );

  const districtRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
    url: url(`/districts/${d.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const mandalRoutes: MetadataRoute.Sitemap = districts.flatMap((d) =>
    d.mandals
      .filter((m) => isUsablePlaceSlug(m.slug))
      .map((m) => ({
        url: url(`/districts/${d.slug}/${m.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  );

  return [
    ...staticHigh,
    ...staticSecondary,
    ...verticalRoutes,
    ...policyRoutes,
    ...districtRoutes,
    ...mandalRoutes,
  ];
}
