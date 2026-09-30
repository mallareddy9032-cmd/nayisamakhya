import { absoluteUrl, SITE_NAME, SITE_ORIGIN } from "@/lib/seo/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "నాయి సమాఖ్య",
    url: SITE_ORIGIN,
    logo: absoluteUrl("/api/og"),
    inLanguage: ["te", "en"],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Telangana",
      addressCountry: "IN",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "నాయి సమాఖ్య",
    url: SITE_ORIGIN,
    inLanguage: ["te", "en"],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };
}

export function administrativeAreaJsonLd(input: {
  nameEn: string;
  nameTe: string;
  path: string;
  containedInName?: string;
  containedInPath?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: input.nameEn,
    alternateName: input.nameTe,
    url: absoluteUrl(input.path),
    addressCountry: "IN",
  };
  if (input.containedInName) {
    data.containedInPlace = {
      "@type": "AdministrativeArea",
      name: input.containedInName,
      ...(input.containedInPath
        ? { url: absoluteUrl(input.containedInPath) }
        : {}),
    };
  }
  return data;
}

export function placeJsonLd(input: {
  nameEn: string;
  nameTe: string;
  path: string;
  districtNameEn: string;
  districtPath: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: input.nameEn,
    alternateName: input.nameTe,
    url: absoluteUrl(input.path),
    addressCountry: "IN",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: input.districtNameEn,
      url: absoluteUrl(input.districtPath),
    },
  };
}
