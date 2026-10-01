export type SubCaste =
  | "nayi_brahmin"
  | "mangali"
  | "bajantri"
  | "srikrishna"
  | "allied";

export type AreaType = "urban" | "rural";

export type Profession =
  | "salon_owner"
  | "stylist"
  | "artist"
  | "student"
  | "employee"
  | "other";

export type ShopTenancy =
  | "owned"
  | "rented_private"
  | "municipal_complex"
  | "mobile_home"
  | "na";

export type Go23Status =
  | "receiving"
  | "pending"
  | "rejected_commercial"
  | "not_applied"
  | "na";

export type RelationType =
  | "self"
  | "spouse"
  | "son"
  | "daughter"
  | "father"
  | "mother"
  | "other";

export type MemberEducation =
  | "school"
  | "inter_diploma"
  | "graduate"
  | "post_graduate"
  | "none";

export type MemberOccupation =
  | "student"
  | "hair_stylist"
  | "private_job"
  | "govt_job"
  | "homemaker"
  | "unemployed"
  | "other";

export interface FamilyMember {
  id: string;
  fullName: string;
  relation: RelationType;
  gender: "male" | "female" | "other";
  age: number | "";
  maritalStatus: "unmarried" | "married" | "divorced" | "widowed";
  education: MemberEducation;
  occupation: MemberOccupation;
  isMatrimonialCandidate: boolean;
  height?: string;
  gothram?: string;
  workingLocation?: string;
  guardianPhone?: string;
}

/** Legacy single-candidate shape — derived from familyMembers for API compat. */
export interface MatrimonialProfile {
  candidateName: string;
  gender: "groom" | "bride";
  dob: string;
  height: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  gothram: string;
  education: string;
  occupation: string;
  workingLocation: string;
  annualIncome?: string;
  guardianPhone: string;
  verifiedOnly: boolean;
}

export interface SurveySubmission {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  subCaste: SubCaste;
  districtSlug: string;
  areaType: AreaType;
  mandalSlug: string;
  wardOrPanchayat: string;
  totalFamilyMembers: number;
  studentsCount: number;
  /** Source of truth for household roster + matrimonial flags. */
  familyMembers: FamilyMember[];
  /** Derived from familyMembers — kept for backward-compatible readers. */
  hasMatrimonialCandidate: boolean;
  /** Derived from first matrimonial family member when present. */
  matrimonialData?: MatrimonialProfile;
  primaryProfession: Profession;
  shopTenancy: ShopTenancy;
  monthlyRent?: number;
  tradeLicenseStatus: "valid" | "expired" | "none" | "na_rural";
  uscno?: string;
  go23Status: Go23Status;
  welfareReceived: string[];
  immediateGrievance: string;
  desiredAction: "petition" | "coordinator_visit" | "whatsapp_updates";
  declarationAccepted: boolean;
}

/** Browser localStorage key — array of SurveySubmission (+ optional refCode/referenceId). */
export const SURVEY_STORAGE_KEY = "nayi_statewide_survey_submissions_v1";

/** In-progress survey wizard draft (auto-save). */
export const SURVEY_DRAFT_KEY = "nayi_statewide_survey_draft_v1";
