/** G.O. Ms. No. 23 Grievance Docket — intake + War Room payload types. */

export type GrievanceTypeId =
  | "subsidy_not_applied"
  | "commercial_overbilling"
  | "meter_defect"
  | "unlawful_disconnection";

export type DiscomId = "TGSPDCL" | "TGNPDCL";

export type GrievanceTypeOption = {
  id: GrievanceTypeId;
  option: "A" | "B" | "C" | "D";
  titleTe: string;
  titleEn: string;
  subjectTe: string;
  bodyFocusTe: string;
};

export type GrievanceFormState = {
  fullName: string;
  shopName: string;
  mobile: string;
  districtSlug: string;
  mandalSlug: string;
  discom: DiscomId;
  uscno: string;
  connectedLoad: string;
  avgMonthlyUnits: string;
  grievanceType: GrievanceTypeId;
  narrative: string;
};

export type GrievanceNotifyPayload = {
  type: "grievance";
  fullName: string;
  shopName: string;
  uscno: string;
  mandal: string;
  district: string;
  grievanceType: string;
  grievanceTypeId: GrievanceTypeId;
  discom: DiscomId;
  mobile?: string;
  connectedLoad?: string;
  avgMonthlyUnits?: string;
  narrative?: string;
  districtSlug?: string;
  mandalSlug?: string;
};

export type GrievanceRecord = GrievanceFormState & {
  id: string;
  referenceId: string;
  createdAt: string;
  districtTe: string;
  mandalTe: string;
  grievanceLabelTe: string;
};

export const GRIEVANCE_STORAGE_KEY = "nayi_grievance_dockets_v1";

export const GRIEVANCE_TYPES: GrievanceTypeOption[] = [
  {
    id: "subsidy_not_applied",
    option: "A",
    titleTe: "250 యూనిట్ల ఉచిత విద్యుత్ నమోదు కాకపోవడం",
    titleEn: "Free 250 Units Subsidy Not Applied",
    subjectTe:
      "నాయీబ్రాహ్మణుల సెలూన్ సర్వీస్ నం. {USCNO} కి ప్రభుత్వం జారీ చేసిన జీవో నం. 23 ప్రకారం 250 యూనిట్ల ఉచిత విద్యుత్ వర్తింపజేయడం గురించి వినతి.",
    bodyFocusTe:
      "అర్హతగల సెలూన్ సర్వీస్‌పై జీవో ఎం.ఎస్. నం. 23 ప్రకారం నెలకు 250 యూనిట్ల ఉచిత విద్యుత్ సబ్సిడీ నమోదు కాలేదు. బిల్లింగ్ వర్గం / సబ్సిడీ ఫ్లాగ్ సరిదిద్ది, గత బిల్లులపై క్రెడిట్ సర్దుబాటు చేయవలసిందిగా కోరుచున్నాను.",
  },
  {
    id: "commercial_overbilling",
    option: "B",
    titleTe: "ఆర్బిట్రరీ కమర్షియల్ బిల్లింగ్ / అధిక బిల్లు రావడం",
    titleEn: "Arbitrary Commercial Billing / Cat-II Overbilling",
    subjectTe:
      "నాయీబ్రాహ్మణుల సెలూన్ సర్వీస్ నం. {USCNO} పై అనధికార కమర్షియల్ / క్యాటగిరీ-II అధిక బిల్లింగ్ రద్దు చేసి జీవో నం. 23 ప్రకారం సరైన వర్గీకరణ చేయడం గురించి వినతి.",
    bodyFocusTe:
      "సాంప్రదాయ కుటీర వృత్తి సెలూన్‌ను అనవసరంగా కమర్షియల్ / క్యాటగిరీ-IIగా బిల్లింగ్ చేస్తూ అధిక బిల్లులు వసూలు చేస్తున్నారు. జీవో ఎం.ఎస్. నం. 23 మరియు సంబంధిత DISCOM సర్క్యులర్ల ప్రకారం వర్గీకరణ సరిదిద్ది, అధిక వసూళ్లపై క్రెడిట్ ఇవ్వవలసిందిగా కోరుచున్నాను.",
  },
  {
    id: "meter_defect",
    option: "C",
    titleTe: "మీటర్ మార్పిడి లేదా సాంకేతిక లోపం",
    titleEn: "Meter Defect / Burnt Meter Delay",
    subjectTe:
      "నాయీబ్రాహ్మణుల సెలూన్ సర్వీస్ నం. {USCNO} కి లోపభూయిష్ట / కాలిన మీటర్ మార్పిడి మరియు సాంకేతిక సర్దుబాటు గురించి వినతి.",
    bodyFocusTe:
      "మీటర్ లోపం / కాలిన మీటర్ కారణంగా సరైన రీడింగ్ లేకుండా అంచనా బిల్లులు వస్తున్నాయి లేదా మార్పిడి ఆలస్యమైంది. తక్షణ మీటర్ పరీక్ష / మార్పిడి చేసి, జీవో ఎం.ఎస్. నం. 23 సబ్సిడీ కొనసాగింపు నిర్ధారించవలసిందిగా కోరుచున్నాను.",
  },
  {
    id: "unlawful_disconnection",
    option: "D",
    titleTe: "అనవసర డిస్‌కనెక్షన్ నోటీస్",
    titleEn: "Unlawful Disconnection Threat",
    subjectTe:
      "నాయీబ్రాహ్మణుల సెలూన్ సర్వీస్ నం. {USCNO} పై అనవసర డిస్‌కనెక్షన్ నోటీస్ / బెదిరింపు ఉపసంహరించడం గురించి వినతి.",
    bodyFocusTe:
      "వివాదాస్పద బిల్లు / సబ్సిడీ నమోదు లోపం ఉండగానే డిస్‌కనెక్షన్ నోటీస్ జారీ చేశారు. విద్యుత్ చట్టం 2003 మరియు జీవో ఎం.ఎస్. నం. 23 హక్కుల క్రింద బలవంతపు డిస్‌కనెక్షన్ నివారించి, వినతి పరిష్కారం వరకు సరఫరా కొనసాగించవలసిందిగా కోరుచున్నాను.",
  },
];

export function getGrievanceType(
  id: GrievanceTypeId,
): GrievanceTypeOption {
  return (
    GRIEVANCE_TYPES.find((t) => t.id === id) || GRIEVANCE_TYPES[0]
  );
}

export function subjectForUscno(
  type: GrievanceTypeOption,
  uscno: string,
): string {
  const n = uscno.trim() || "____________";
  return type.subjectTe.replace("{USCNO}", n);
}
