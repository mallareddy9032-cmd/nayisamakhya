/** Canonical public site origin for metadata, sitemap, and JSON-LD. */
export const SITE_ORIGIN = "https://www.nayisamakhya.org";
export const SITE_NAME = "Nayi Samakhya";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
