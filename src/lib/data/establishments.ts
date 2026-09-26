import {
  getStaticUlb,
  listStaticUlbsForDistrict,
  type StaticUlb,
} from "@/lib/data/urbanDirectory";

export type EstablishmentListing = {
  id: string;
  name_en: string;
  name_te: string;
  owner_en?: string | null;
  owner_te?: string | null;
  area_en: string;
  area_te: string;
  phone?: string | null;
  photo_url?: string | null;
  verified?: boolean;
  category_en?: string;
  category_te?: string;
};

/** Sample rural mandal establishments (static until Supabase seed). */
const RURAL_ESTABLISHMENTS: Record<string, EstablishmentListing[]> = {
  "suryapet/kodad": [
    {
      id: "kodad-market-salon",
      name_en: "Kodad Market Salon",
      name_te: "కోడాడ్ మార్కెట్ సెలూన్",
      owner_en: "Ramesh",
      owner_te: "రమేశ్",
      area_en: "Kodad Bazaar",
      area_te: "కోడాడ్ బజార్",
      phone: "9032654111",
      photo_url:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80",
      verified: true,
      category_en: "Salon",
      category_te: "సెలూన్",
    },
    {
      id: "anjaneya-seva-shop",
      name_en: "Anjaneya Seva Shop",
      name_te: "ఆంజనేయ సేవా షాప్",
      owner_en: "Suresh",
      owner_te: "సురేశ్",
      area_en: "Main Road",
      area_te: "మెయిన్ రోడ్",
      phone: "9032654111",
      photo_url:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80",
      verified: true,
      category_en: "Salon",
      category_te: "సెలూన్",
    },
  ],
  "adilabad/ichoda": [
    {
      id: "ichoda-cross-salon",
      name_en: "Ichoda Cross Salon",
      name_te: "ఇచ్చోడ క్రాస్ సెలూన్",
      owner_en: "Venkat",
      owner_te: "వెంకట్",
      area_en: "Ichoda Centre",
      area_te: "ఇచ్చోడ కేంద్రం",
      phone: "9032654111",
      photo_url:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
      verified: true,
      category_en: "Salon",
      category_te: "సెలూన్",
    },
  ],
};

function fromUlbEst(
  ulb: StaticUlb,
  est: StaticUlb["establishments"][number],
  idx: number,
): EstablishmentListing {
  return {
    id: `${ulb.slug}-${idx}-${est.name_en}`,
    name_en: est.name_en,
    name_te: est.name_te,
    owner_en: est.owner_en,
    owner_te: est.owner_te,
    area_en: est.area_en || ulb.name_en,
    area_te: est.area_te || ulb.name_te,
    phone: est.phone,
    photo_url: est.photo_url,
    verified: est.verified !== false,
    category_en: est.category_en,
    category_te: est.category_te,
  };
}

export function listEstablishmentsForUlb(
  districtSlug: string,
  ulbSlug: string,
): EstablishmentListing[] {
  const ulb = getStaticUlb(districtSlug, ulbSlug);
  if (!ulb) return [];
  return ulb.establishments.map((e, i) => fromUlbEst(ulb, e, i));
}

export function listEstablishmentsForMandal(
  districtSlug: string,
  mandalSlug: string,
): EstablishmentListing[] {
  return RURAL_ESTABLISHMENTS[`${districtSlug}/${mandalSlug}`] || [];
}

export function listEstablishmentsForDistrictUlbs(
  districtSlug: string,
): EstablishmentListing[] {
  return listStaticUlbsForDistrict(districtSlug).flatMap((ulb) =>
    ulb.establishments.map((e, i) => fromUlbEst(ulb, e, i)),
  );
}

export function toEstablishmentListings(
  items: Array<{
    name_en: string;
    name_te: string;
    owner_en?: string | null;
    owner_te?: string | null;
    area_en?: string | null;
    area_te?: string | null;
    phone?: string | null;
    photo_url?: string | null;
    verified?: boolean;
    category_en?: string;
    category_te?: string;
  }>,
  fallbackArea: { en: string; te: string },
): EstablishmentListing[] {
  return items.map((e, i) => ({
    id: `listing-${i}-${e.name_en}`,
    name_en: e.name_en,
    name_te: e.name_te,
    owner_en: e.owner_en,
    owner_te: e.owner_te,
    area_en: e.area_en || fallbackArea.en,
    area_te: e.area_te || fallbackArea.te,
    phone: e.phone,
    photo_url: e.photo_url,
    verified: e.verified !== false,
    category_en: e.category_en,
    category_te: e.category_te,
  }));
}
