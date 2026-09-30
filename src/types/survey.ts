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
  hasMatrimonialCandidate: boolean;
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
