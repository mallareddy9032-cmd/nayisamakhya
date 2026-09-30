import type {
  AreaType,
  Go23Status,
  Profession,
  ShopTenancy,
  SubCaste,
} from "@/types/survey";

export type Bilingual = { te: string; en: string };

export const SUB_CASTE_OPTIONS: { id: SubCaste; label: Bilingual }[] = [
  { id: "nayi_brahmin", label: { te: "నాయి బ్రాహ్మణ", en: "Nayi Brahmin" } },
  { id: "mangali", label: { te: "మంగలి", en: "Mangali" } },
  { id: "bajantri", label: { te: "భజంత్రి", en: "Bajantri" } },
  { id: "srikrishna", label: { te: "శ్రీకృష్ణ", en: "Srikrishna" } },
  { id: "allied", label: { te: "అనుబంధ సమాజం", en: "Allied" } },
];

export const AREA_TYPE_OPTIONS: { id: AreaType; label: Bilingual }[] = [
  { id: "urban", label: { te: "పట్టణ / ULB", en: "Urban / ULB" } },
  { id: "rural", label: { te: "గ్రామీణ / మండలం", en: "Rural / Mandal" } },
];

export const PROFESSION_OPTIONS: { id: Profession; label: Bilingual }[] = [
  { id: "salon_owner", label: { te: "సెలూన్ యజమాని", en: "Salon Owner" } },
  { id: "stylist", label: { te: "స్టైలిస్ట్ / కార్మికుడు", en: "Stylist / Worker" } },
  { id: "artist", label: { te: "కళాకారుడు / భజంత్రి", en: "Artist / Bajantri" } },
  { id: "student", label: { te: "విద్యార్థి", en: "Student" } },
  { id: "employee", label: { te: "ఉద్యోగి", en: "Employee" } },
  { id: "other", label: { te: "ఇతరం", en: "Other" } },
];

export const SHOP_TENANCY_OPTIONS: { id: ShopTenancy; label: Bilingual }[] = [
  { id: "owned", label: { te: "స్వంతం", en: "Owned" } },
  { id: "rented_private", label: { te: "ప్రైవేట్ అద్దె", en: "Rented (Private)" } },
  {
    id: "municipal_complex",
    label: { te: "మున్సిపల్ కాంప్లెక్స్", en: "Municipal Complex" },
  },
  { id: "mobile_home", label: { te: "మొబైల్ / హోమ్ సర్వీస్", en: "Mobile / Home" } },
  { id: "na", label: { te: "వర్తించదు", en: "N/A" } },
];

export const TRADE_LICENSE_OPTIONS: {
  id: "valid" | "expired" | "none" | "na_rural";
  label: Bilingual;
}[] = [
  { id: "valid", label: { te: "చెల్లుబాటు", en: "Valid" } },
  { id: "expired", label: { te: "గడువు ముగిసింది", en: "Expired" } },
  { id: "none", label: { te: "లేదు", en: "None" } },
  { id: "na_rural", label: { te: "గ్రామీణ / వర్తించదు", en: "Rural / N/A" } },
];

export const GO23_STATUS_OPTIONS: { id: Go23Status; label: Bilingual }[] = [
  { id: "receiving", label: { te: "పొందుతున్నారు", en: "Receiving" } },
  { id: "pending", label: { te: "పెండింగ్", en: "Pending" } },
  {
    id: "rejected_commercial",
    label: { te: "కమర్షియల్‌గా తిరస్కరణ", en: "Rejected (Commercial)" },
  },
  { id: "not_applied", label: { te: "దరఖాస్తు చేయలేదు", en: "Not Applied" } },
  { id: "na", label: { te: "వర్తించదు", en: "N/A" } },
];

export const WELFARE_SCHEME_OPTIONS: { id: string; label: Bilingual }[] = [
  {
    id: "go23_power",
    label: { te: "G.O. 23 — 250 యూనిట్ల ఉచిత విద్యుత్", en: "G.O. 23 — 250 Units" },
  },
  {
    id: "bc_corp_loan",
    label: { te: "BC కార్పొరేషన్ రుణం", en: "BC Corporation Loan" },
  },
  {
    id: "pm_vishwakarma",
    label: { te: "PM విశ్వకర్మ", en: "PM Vishwakarma" },
  },
  {
    id: "aasara_pension",
    label: { te: "ఆసరా పెన్షన్", en: "Aasara Pension" },
  },
  {
    id: "cultural_pension",
    label: { te: "సాంస్కృతిక పెన్షన్", en: "Cultural Pension" },
  },
  {
    id: "scholarship",
    label: { te: "విద్యా స్కాలర్‌షిప్", en: "Education Scholarship" },
  },
  { id: "none", label: { te: "ఏదీ కాదు", en: "None" } },
];

export const DESIRED_ACTION_OPTIONS: {
  id: "petition" | "coordinator_visit" | "whatsapp_updates";
  label: Bilingual;
}[] = [
  {
    id: "petition",
    label: { te: "వినతిపత్రం / Petition", en: "File a Petition" },
  },
  {
    id: "coordinator_visit",
    label: {
      te: "సమన్వయకర్త సందర్శన",
      en: "Coordinator Visit",
    },
  },
  {
    id: "whatsapp_updates",
    label: {
      te: "WhatsApp నవీకరణలు",
      en: "WhatsApp Updates",
    },
  },
];

export const SURVEY_STEPS: { id: number; te: string; en: string }[] = [
  { id: 1, te: "గుర్తింపు & స్థానం", en: "Identity & Location" },
  { id: 2, te: "జీవనోపాధి", en: "Livelihood" },
  { id: 3, te: "సంక్షేమం & G.O. 23", en: "Welfare & G.O. 23" },
  { id: 4, te: "ఫిర్యాదు & సమర్పణ", en: "Grievance & Submit" },
];

export function needsMonthlyRent(tenancy: ShopTenancy): boolean {
  return tenancy === "rented_private" || tenancy === "municipal_complex";
}
