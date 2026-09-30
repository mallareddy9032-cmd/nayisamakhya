import {
  getAdminEntity,
  listGeoDistricts,
  listRuralEntities,
  listUrbanEntities,
  type AdminEntity,
  type DistrictInfo,
} from "@/data/telanganaGeo";
import { getMandal } from "@/lib/data/mandals";
import { getDirectoryMandal } from "@/lib/data/mandalRepository";
import { isBlockedGramPanchayatName } from "@/lib/data/gramPanchayatNames";
import type { AreaType } from "@/types/survey";

export type SubUnitOption = {
  id: string;
  nameTe: string;
  nameEn: string;
};

export function surveyDistricts(): DistrictInfo[] {
  return listGeoDistricts().slice().sort((a, b) =>
    a.nameEn.localeCompare(b.nameEn, "en"),
  );
}

export function surveyEntitiesForDistrict(
  districtSlug: string,
  areaType: AreaType,
): AdminEntity[] {
  if (!districtSlug) return [];
  return areaType === "urban"
    ? listUrbanEntities(districtSlug)
    : listRuralEntities(districtSlug);
}

function stripRuralSuffix(slug: string): string {
  return slug.replace(/-rural$|-mandal$/i, "");
}

function gpsFromStatic(
  districtSlug: string,
  mandalSlug: string,
): SubUnitOption[] {
  const raw = stripRuralSuffix(mandalSlug);
  const rich =
    getMandal(districtSlug, raw) ||
    getMandal(districtSlug, mandalSlug) ||
    getDirectoryMandal(districtSlug, raw) ||
    getDirectoryMandal(districtSlug, mandalSlug);

  if (!rich?.gramPanchayats?.length) return [];

  return rich.gramPanchayats
    .filter(
      (gp) =>
        gp &&
        (gp.name.en || gp.name.te) &&
        !isBlockedGramPanchayatName(gp.name.en || "", gp.name.te || ""),
    )
    .map((gp) => ({
      id: gp.id,
      nameTe: gp.name.te || gp.name.en,
      nameEn: gp.name.en || gp.name.te,
    }));
}

/** Ward (urban) or Gram Panchayat (rural) options — MT garbage filtered. */
export function surveySubUnits(
  districtSlug: string,
  mandalSlug: string,
  areaType: AreaType,
): SubUnitOption[] {
  if (!districtSlug || !mandalSlug) return [];

  const entity = getAdminEntity(districtSlug, mandalSlug);
  if (areaType === "urban" && entity?.subUnitsList?.length) {
    return entity.subUnitsList
      .filter(
        (u) =>
          u &&
          (u.nameEn || u.nameTe) &&
          !isBlockedGramPanchayatName(u.nameEn || "", u.nameTe || ""),
      )
      .map((u) => ({
        id: String(u.id),
        nameTe: u.nameTe || u.nameEn,
        nameEn: u.nameEn || u.nameTe,
      }));
  }

  return gpsFromStatic(districtSlug, mandalSlug);
}

export function formatSubUnitLabel(opt: SubUnitOption): string {
  if (opt.nameTe && opt.nameEn && opt.nameTe !== opt.nameEn) {
    return `${opt.nameTe} (${opt.nameEn})`;
  }
  return opt.nameTe || opt.nameEn;
}
