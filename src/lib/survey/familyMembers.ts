import type {
  FamilyMember,
  MatrimonialProfile,
  SurveySubmission,
} from "@/types/survey";

/** Map first matrimonial family member → legacy MatrimonialProfile. */
export function deriveMatrimonialFromFamily(
  members: FamilyMember[],
): MatrimonialProfile | undefined {
  const m = members.find((x) => x.isMatrimonialCandidate);
  if (!m) return undefined;
  return {
    candidateName: m.fullName.trim(),
    gender: m.gender === "female" ? "bride" : "groom",
    dob: "",
    height: (m.height || "").trim(),
    maritalStatus:
      m.maritalStatus === "married"
        ? "unmarried"
        : (m.maritalStatus as MatrimonialProfile["maritalStatus"]),
    gothram: (m.gothram || "").trim(),
    education: m.education,
    occupation: m.occupation,
    workingLocation: (m.workingLocation || "").trim(),
    guardianPhone: (m.guardianPhone || "").replace(/\D/g, ""),
    verifiedOnly: true,
  };
}

export function hasMatrimonialInFamily(members: FamilyMember[]): boolean {
  return members.some((m) => m.isMatrimonialCandidate);
}

export function validateFamilyMembers(members: FamilyMember[]): string | null {
  if (!Array.isArray(members) || members.length === 0) {
    return "At least one family member (self) is required";
  }
  if (!members.some((m) => m.relation === "self")) {
    return "One member must be marked as Self";
  }
  for (const m of members) {
    if (!m.fullName?.trim()) return "Each family member needs a full name";
    if (m.age === "" || !Number.isFinite(Number(m.age)) || Number(m.age) < 0) {
      return "Each family member needs a valid age";
    }
    if (!m.relation || !m.gender || !m.maritalStatus || !m.education || !m.occupation) {
      return "Complete relation, gender, marital status, education, and occupation for each member";
    }
    if (m.isMatrimonialCandidate) {
      const phone = String(m.guardianPhone || "").replace(/\D/g, "");
      if (phone.length !== 10) {
        return `Guardian phone (10 digits) required for matrimonial candidate ${m.fullName || ""}`.trim();
      }
      if (!(m.height || "").trim() || !(m.gothram || "").trim()) {
        return "Height and gothram are required for matrimonial candidates";
      }
    }
  }
  return null;
}

/** Ensure submission carries derived legacy matrimonial fields from familyMembers. */
export function withDerivedMatrimonial(
  submission: SurveySubmission,
): SurveySubmission {
  const familyMembers = submission.familyMembers || [];
  return {
    ...submission,
    familyMembers,
    hasMatrimonialCandidate: hasMatrimonialInFamily(familyMembers),
    matrimonialData: deriveMatrimonialFromFamily(familyMembers),
  };
}
