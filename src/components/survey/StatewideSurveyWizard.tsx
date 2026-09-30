"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Plus,
  RotateCcw,
  Send,
} from "lucide-react";
import { FamilyMemberCard } from "@/components/survey/FamilyMemberCard";
import { SurveyProgress } from "@/components/survey/SurveyProgress";
import {
  formatSubUnitLabel,
  surveyDistricts,
  surveyEntitiesForDistrict,
  surveySubUnits,
} from "@/lib/survey/geoCascade";
import {
  hasMatrimonialInFamily,
  validateFamilyMembers,
  withDerivedMatrimonial,
  deriveMatrimonialFromFamily,
} from "@/lib/survey/familyMembers";
import {
  AREA_TYPE_OPTIONS,
  DESIRED_ACTION_OPTIONS,
  GO23_STATUS_OPTIONS,
  needsMonthlyRent,
  PROFESSION_OPTIONS,
  SHOP_TENANCY_OPTIONS,
  SUB_CASTE_OPTIONS,
  TRADE_LICENSE_OPTIONS,
  WELFARE_SCHEME_OPTIONS,
} from "@/lib/survey/options";
import {
  creditLocalRef,
  isValidSarathiRef,
  normalizeRefCode,
  upsertLocalVolunteer,
} from "@/lib/sprint/volunteers";
import type {
  AreaType,
  FamilyMember,
  Go23Status,
  Profession,
  ShopTenancy,
  SubCaste,
  SurveySubmission,
} from "@/types/survey";
import { SURVEY_STORAGE_KEY } from "@/types/survey";
import type { Volunteer } from "@/types/volunteer";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass =
  "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyMember(relation: FamilyMember["relation"] = "other"): FamilyMember {
  return {
    id: uid(),
    fullName: "",
    relation,
    gender: "male",
    age: "",
    maritalStatus: "unmarried",
    education: "school",
    occupation: "other",
    isMatrimonialCandidate: false,
  };
}

type FormState = {
  fullName: string;
  phone: string;
  subCaste: SubCaste | "";
  districtSlug: string;
  areaType: AreaType;
  mandalSlug: string;
  wardOrPanchayat: string;
  totalFamilyMembers: string;
  studentsCount: string;
  familyMembers: FamilyMember[];
  primaryProfession: Profession | "";
  shopTenancy: ShopTenancy | "";
  monthlyRent: string;
  tradeLicenseStatus: "valid" | "expired" | "none" | "na_rural" | "";
  uscno: string;
  go23Status: Go23Status | "";
  welfareReceived: string[];
  immediateGrievance: string;
  desiredAction: "petition" | "coordinator_visit" | "whatsapp_updates" | "";
  declarationAccepted: boolean;
};

function initialForm(): FormState {
  return {
    fullName: "",
    phone: "",
    subCaste: "",
    districtSlug: "",
    areaType: "rural",
    mandalSlug: "",
    wardOrPanchayat: "",
    totalFamilyMembers: "1",
    studentsCount: "0",
    familyMembers: [emptyMember("self")],
    primaryProfession: "",
    shopTenancy: "",
    monthlyRent: "",
    tradeLicenseStatus: "",
    uscno: "",
    go23Status: "",
    welfareReceived: [],
    immediateGrievance: "",
    desiredAction: "",
    declarationAccepted: false,
  };
}

function persistLocal(
  submission: SurveySubmission & { refCode?: string; referenceId?: string },
) {
  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as SurveySubmission[]) : [];
    const next = Array.isArray(prev) ? [...prev, submission] : [submission];
    localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(next.slice(-200)));
  } catch {
    /* quota / private mode — non-fatal */
  }
}

export function StatewideSurveyWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [mockFallback, setMockFallback] = useState(false);
  const [submittedHouseholdSize, setSubmittedHouseholdSize] = useState(0);
  const [submittedMatrimonialCount, setSubmittedMatrimonialCount] = useState(0);
  const [referralRef, setReferralRef] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get("ref");
      if (raw && isValidSarathiRef(raw)) {
        setReferralRef(normalizeRefCode(raw));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const districts = useMemo(() => surveyDistricts(), []);

  const entities = useMemo(
    () => surveyEntitiesForDistrict(form.districtSlug, form.areaType),
    [form.districtSlug, form.areaType],
  );

  const subUnits = useMemo(
    () => surveySubUnits(form.districtSlug, form.mandalSlug, form.areaType),
    [form.districtSlug, form.mandalSlug, form.areaType],
  );

  // Seed self member name from household head when entering roster step
  useEffect(() => {
    if (step !== 2) return;
    setForm((prev) => {
      const members = [...prev.familyMembers];
      const selfIdx = members.findIndex((m) => m.relation === "self");
      if (selfIdx < 0) return prev;
      if (members[selfIdx].fullName.trim()) return prev;
      if (!prev.fullName.trim()) return prev;
      members[selfIdx] = { ...members[selfIdx], fullName: prev.fullName.trim() };
      return { ...prev, familyMembers: members };
    });
  }, [step]);

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function updateMember(id: string, next: FamilyMember) {
    setForm((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.map((m) => (m.id === id ? next : m)),
    }));
  }

  function removeMember(id: string) {
    setForm((prev) => {
      if (prev.familyMembers.length <= 1) return prev;
      const next = prev.familyMembers.filter((m) => m.id !== id);
      // Ensure at least one self remains
      if (!next.some((m) => m.relation === "self") && next[0]) {
        next[0] = { ...next[0], relation: "self" };
      }
      return {
        ...prev,
        familyMembers: next,
        totalFamilyMembers: String(next.length),
      };
    });
  }

  function addMember() {
    setForm((prev) => {
      const next = [...prev.familyMembers, emptyMember("other")];
      return {
        ...prev,
        familyMembers: next,
        totalFamilyMembers: String(next.length),
      };
    });
  }

  function syncRosterToCount() {
    const target = Math.max(1, Math.min(40, Number(form.totalFamilyMembers) || 1));
    setForm((prev) => {
      let members = [...prev.familyMembers];
      while (members.length < target) {
        members.push(emptyMember(members.length === 0 ? "self" : "other"));
      }
      if (members.length > target) {
        // Keep self; trim from end preferring non-self
        const self = members.find((m) => m.relation === "self");
        const others = members.filter((m) => m.relation !== "self");
        const keptOthers = others.slice(0, Math.max(0, target - 1));
        members = self
          ? [self, ...keptOthers].slice(0, target)
          : members.slice(0, target);
        if (members[0] && members[0].relation !== "self") {
          members[0] = { ...members[0], relation: "self" };
        }
      }
      return {
        ...prev,
        familyMembers: members,
        totalFamilyMembers: String(members.length),
      };
    });
  }

  function toggleWelfare(id: string) {
    setForm((prev) => {
      let next = prev.welfareReceived.includes(id)
        ? prev.welfareReceived.filter((x) => x !== id)
        : [...prev.welfareReceived, id];
      if (id === "none") next = ["none"];
      else next = next.filter((x) => x !== "none");
      return { ...prev, welfareReceived: next };
    });
  }

  function canStep1(): boolean {
    const phoneOk = /^\d{10}$/.test(form.phone.replace(/\D/g, ""));
    const family = Number(form.totalFamilyMembers);
    const students = Number(form.studentsCount);
    return Boolean(
      form.fullName.trim() &&
        phoneOk &&
        form.subCaste &&
        form.districtSlug &&
        form.mandalSlug &&
        form.wardOrPanchayat.trim() &&
        Number.isFinite(family) &&
        family >= 1 &&
        Number.isFinite(students) &&
        students >= 0 &&
        students <= family,
    );
  }

  function canStep2(): boolean {
    return validateFamilyMembers(form.familyMembers) === null;
  }

  function canStep3(): boolean {
    if (!form.primaryProfession || !form.shopTenancy || !form.tradeLicenseStatus) {
      return false;
    }
    if (needsMonthlyRent(form.shopTenancy)) {
      const rent = Number(form.monthlyRent);
      return Number.isFinite(rent) && rent >= 0;
    }
    return true;
  }

  function canStep4(): boolean {
    return Boolean(form.go23Status && form.welfareReceived.length > 0);
  }

  function canStep5(): boolean {
    return Boolean(
      form.immediateGrievance.trim().length >= 8 &&
        form.desiredAction &&
        form.declarationAccepted,
    );
  }

  function buildSubmission(): SurveySubmission {
    const id = uid();
    const timestamp = new Date().toISOString();
    const rentNeeded = needsMonthlyRent(form.shopTenancy as ShopTenancy);
    const familyMembers: FamilyMember[] = form.familyMembers.map((m) => ({
      ...m,
      fullName: m.fullName.trim(),
      age: m.age === "" ? "" : Number(m.age),
      height: m.isMatrimonialCandidate ? (m.height || "").trim() : undefined,
      gothram: m.isMatrimonialCandidate ? (m.gothram || "").trim() : undefined,
      workingLocation: m.isMatrimonialCandidate
        ? (m.workingLocation || "").trim() || undefined
        : undefined,
      guardianPhone: m.isMatrimonialCandidate
        ? (m.guardianPhone || "").replace(/\D/g, "")
        : undefined,
    }));

    const base: SurveySubmission = {
      id,
      timestamp,
      fullName: form.fullName.trim(),
      phone: form.phone.replace(/\D/g, ""),
      subCaste: form.subCaste as SubCaste,
      districtSlug: form.districtSlug,
      areaType: form.areaType,
      mandalSlug: form.mandalSlug,
      wardOrPanchayat: form.wardOrPanchayat.trim(),
      totalFamilyMembers: familyMembers.length,
      studentsCount: Number(form.studentsCount),
      familyMembers,
      hasMatrimonialCandidate: hasMatrimonialInFamily(familyMembers),
      matrimonialData: deriveMatrimonialFromFamily(familyMembers),
      primaryProfession: form.primaryProfession as Profession,
      shopTenancy: form.shopTenancy as ShopTenancy,
      monthlyRent: rentNeeded ? Number(form.monthlyRent) : undefined,
      tradeLicenseStatus:
        form.tradeLicenseStatus as SurveySubmission["tradeLicenseStatus"],
      uscno: form.uscno.trim() || undefined,
      go23Status: form.go23Status as Go23Status,
      welfareReceived: form.welfareReceived,
      immediateGrievance: form.immediateGrievance.trim(),
      desiredAction: form.desiredAction as SurveySubmission["desiredAction"],
      declarationAccepted: form.declarationAccepted,
    };
    return withDerivedMatrimonial(base);
  }

  async function onSubmit() {
    if (!canStep5() || submitting) return;
    setSubmitting(true);
    setError("");
    const submission = buildSubmission();

    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: "statewide_v1",
          submission,
          districtSlug: submission.districtSlug,
          mandalSlug: submission.mandalSlug,
          gramPanchayat: submission.wardOrPanchayat,
          headName: submission.fullName,
          whatsapp: submission.phone,
          communityWing: submission.subCaste,
          occupation: submission.primaryProfession,
          ...(referralRef ? { refCode: referralRef } : {}),
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        referenceId?: string;
        persisted?: boolean;
        mock?: boolean;
        error?: string;
        credited?: boolean;
        volunteer?: Volunteer | null;
        refCode?: string;
      };

      const finishSuccess = (refId: string, mock: boolean) => {
        persistLocal({
          ...submission,
          ...(referralRef ? { refCode: referralRef } : {}),
          referenceId: refId,
        });
        // Sync sprint tracker localStorage even when API credit was mock/offline
        if (referralRef) {
          if (data.volunteer) {
            upsertLocalVolunteer(data.volunteer);
          } else {
            creditLocalRef(referralRef);
          }
        }
        setReferenceId(refId);
        setMockFallback(mock);
        setSubmittedHouseholdSize(submission.familyMembers.length);
        setSubmittedMatrimonialCount(
          submission.familyMembers.filter((m) => m.isMatrimonialCandidate)
            .length,
        );
        setSubmitted(true);
      };

      if (res.ok && data.success && data.referenceId) {
        finishSuccess(
          data.referenceId,
          Boolean(data.mock) || data.persisted === false,
        );
        return;
      }

      const localRef = `#LOCAL-${submission.districtSlug.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      finishSuccess(data.referenceId || localRef, true);
    } catch {
      const localRef = `#LOCAL-${submission.districtSlug.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      persistLocal({
        ...submission,
        ...(referralRef ? { refCode: referralRef } : {}),
        referenceId: localRef,
      });
      if (referralRef) creditLocalRef(referralRef);
      setReferenceId(localRef);
      setMockFallback(true);
      setSubmittedHouseholdSize(submission.familyMembers.length);
      setSubmittedMatrimonialCount(
        submission.familyMembers.filter((m) => m.isMatrimonialCandidate).length,
      );
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setForm(initialForm());
    setStep(1);
    setSubmitted(false);
    setReferenceId("");
    setMockFallback(false);
    setSubmittedHouseholdSize(0);
    setSubmittedMatrimonialCount(0);
    setError("");
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-600" aria-hidden />
          <h2 className="mt-4 font-display-te text-2xl font-normal leading-snug text-[#0F172A]">
            కుటుంబం నమోదైంది
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Household recorded successfully
          </p>
          <p className="mt-3 max-w-sm font-telugu text-sm leading-relaxed text-[#1E293B]">
            {submittedHouseholdSize} మంది కుటుంబ సభ్యులు నమోదు
            {submittedMatrimonialCount > 0
              ? ` · ${submittedMatrimonialCount} వివాహ అభ్యర్థి${submittedMatrimonialCount === 1 ? "" : "లు"} ప్లాట్‌ఫామ్‌కు నమోదయ్యారు`
              : ""}
            .
          </p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#64748B]">
            {submittedHouseholdSize} household member
            {submittedHouseholdSize === 1 ? "" : "s"} documented
            {submittedMatrimonialCount > 0
              ? ` · ${submittedMatrimonialCount} matrimonial candidate${submittedMatrimonialCount === 1 ? "" : "s"} registered`
              : ""}
            .
          </p>

          <div className="mt-5 w-full rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-4 py-3">
            <p className="font-telugu text-xs text-[#64748B]">రిఫరెన్స్ నంబర్</p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wide text-[#B45309]">
              {referenceId}
            </p>
          </div>

          {mockFallback ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Saved locally as mock fallback (Supabase unavailable). Your device
              holds a copy until the desk syncs.
            </p>
          ) : null}

          <a
            href="https://wa.me/919032654111"
            target="_blank"
            rel="noreferrer"
            className="tap mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white hover:bg-[#1EBE57]"
          >
            <Send className="h-4 w-4" aria-hidden />
            WhatsApp సమాచారం · Updates
          </a>

          <button
            type="button"
            onClick={resetAll}
            className="tap mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 font-telugu text-sm font-semibold text-[#0F172A] hover:bg-[#F4F4F2]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            మరో సర్వే · Another response
          </button>
        </div>
      </div>
    );
  }

  const familyHint =
    Number(form.totalFamilyMembers) !== form.familyMembers.length
      ? `Count says ${form.totalFamilyMembers}; roster has ${form.familyMembers.length}`
      : null;

  return (
    <div className="space-y-4">
      <SurveyProgress step={step} total={5} />

      {step === 1 ? (
        <form
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canStep1()) return;
            syncRosterToCount();
            setStep(2);
          }}
        >
          <div>
            <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A]">
              గుర్తింపు & స్థానం
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">Identity & Location</p>
          </div>

          <label className="block">
            <span className={labelClass}>పూర్తి పేరు · Full name *</span>
            <input
              required
              value={form.fullName}
              onChange={(e) => patch({ fullName: e.target.value })}
              className={`${inputClass} font-telugu`}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className={labelClass}>మొబైల్ / WhatsApp *</span>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                patch({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
              }
              placeholder="10 అంకెలు"
              className={inputClass}
            />
          </label>

          <fieldset>
            <legend className={labelClass}>ఉప కులం · Sub-caste *</legend>
            <div className="space-y-2">
              {SUB_CASTE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 ${
                    form.subCaste === opt.id
                      ? "border-[#B45309] bg-[#B45309]/5"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="subCaste"
                    checked={form.subCaste === opt.id}
                    onChange={() => patch({ subCaste: opt.id })}
                    className="h-4 w-4 accent-[#B45309]"
                  />
                  <span className="font-telugu text-sm text-[#0F172A]">
                    {opt.label.te}
                    <span className="ml-1 text-xs text-[#64748B]">
                      ({opt.label.en})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className={labelClass}>జిల్లా · District *</span>
            <select
              required
              value={form.districtSlug}
              onChange={(e) =>
                patch({
                  districtSlug: e.target.value,
                  mandalSlug: "",
                  wardOrPanchayat: "",
                })
              }
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.nameTe} ({d.nameEn})
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className={labelClass}>ప్రాంతం · Area *</legend>
            <div className="grid grid-cols-2 gap-2">
              {AREA_TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center ${
                    form.areaType === opt.id
                      ? "border-[#B45309] bg-[#B45309]/5"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="areaType"
                    className="sr-only"
                    checked={form.areaType === opt.id}
                    onChange={() =>
                      patch({
                        areaType: opt.id,
                        mandalSlug: "",
                        wardOrPanchayat: "",
                      })
                    }
                  />
                  <span className="font-telugu text-sm font-medium text-[#0F172A]">
                    {opt.label.te}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className={labelClass}>
              {form.areaType === "urban"
                ? "ULB / పురపాలక సంస్థ *"
                : "మండలం · Mandal *"}
            </span>
            <select
              required
              disabled={!form.districtSlug}
              value={form.mandalSlug}
              onChange={(e) =>
                patch({ mandalSlug: e.target.value, wardOrPanchayat: "" })
              }
              className={`${inputClass} font-telugu disabled:opacity-50`}
            >
              <option value="">
                {!form.districtSlug ? "ముందు జిల్లా ఎంచుకోండి…" : "ఎంచుకోండి…"}
              </option>
              {entities.map((ent) => (
                <option key={ent.slug} value={ent.slug}>
                  {ent.nameTe} ({ent.nameEn})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>
              {form.areaType === "urban"
                ? "వార్డు · Ward *"
                : "గ్రామ పంచాయతీ · Gram Panchayat *"}
            </span>
            {subUnits.length > 0 ? (
              <select
                required
                disabled={!form.mandalSlug}
                value={form.wardOrPanchayat}
                onChange={(e) => patch({ wardOrPanchayat: e.target.value })}
                className={`${inputClass} font-telugu disabled:opacity-50`}
              >
                <option value="">ఎంచుకోండి…</option>
                {subUnits.map((u) => (
                  <option key={u.id} value={formatSubUnitLabel(u)}>
                    {formatSubUnitLabel(u)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                disabled={!form.mandalSlug}
                value={form.wardOrPanchayat}
                onChange={(e) => patch({ wardOrPanchayat: e.target.value })}
                placeholder={
                  form.areaType === "urban"
                    ? "Ward name / number"
                    : "Gram Panchayat name"
                }
                className={`${inputClass} font-telugu disabled:opacity-50`}
              />
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>కుటుంబ సభ్యులు *</span>
              <input
                required
                type="number"
                min={1}
                max={40}
                value={form.totalFamilyMembers}
                onChange={(e) => patch({ totalFamilyMembers: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>విద్యార్థులు *</span>
              <input
                required
                type="number"
                min={0}
                max={40}
                value={form.studentsCount}
                onChange={(e) => patch({ studentsCount: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canStep1()}
            className="tap inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#B45309] px-5 text-sm font-semibold text-white hover:bg-[#92400E] disabled:cursor-not-allowed disabled:opacity-40"
          >
            తదుపరి → Family
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A]">
              కుటుంబ సభ్యులు
            </h2>
            <p className="mt-1 font-telugu text-sm leading-relaxed text-[#1E293B]">
              మీ మొత్తం కుటుంబాన్ని దశలవారీగా నమోదు చేయండి. అర్హులైన వారిని
              వివాహ ప్లాట్‌ఫామ్‌కు వెంటనే నమోదు చేయవచ్చు.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              Document the entire household in this clean step. Mark eligible
              members to register them for the matrimonial platform on submit ·{" "}
              {form.familyMembers.length} member
              {form.familyMembers.length === 1 ? "" : "s"}
              {form.familyMembers.some((m) => m.isMatrimonialCandidate)
                ? ` · ${form.familyMembers.filter((m) => m.isMatrimonialCandidate).length} matrimonial`
                : ""}
            </p>
          </div>

          {familyHint ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {familyHint}. Use Add / Remove to align, or continue with the
              roster as source of truth.
            </p>
          ) : null}

          <div className="space-y-3">
            {form.familyMembers.map((member, idx) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                index={idx}
                canRemove={form.familyMembers.length > 1}
                onChange={(next) => updateMember(member.id, next)}
                onRemove={() => removeMember(member.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addMember}
            className="tap inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-[#B45309]/40 bg-[#B45309]/5 font-telugu text-sm font-bold text-[#B45309] hover:bg-[#B45309]/10"
          >
            <Plus className="h-4 w-4" aria-hidden />
            + సభ్యుడిని జతచేయండి · Add member
          </button>

          {validateFamilyMembers(form.familyMembers) ? (
            <p className="text-xs text-[#64748B]">
              {validateFamilyMembers(form.familyMembers)}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-telugu text-sm font-semibold text-[#0F172A]"
            >
              ← వెనుకకు
            </button>
            <button
              type="button"
              disabled={!canStep2()}
              onClick={() => {
                if (!canStep2()) return;
                patch({
                  totalFamilyMembers: String(form.familyMembers.length),
                });
                setStep(3);
              }}
              className="tap inline-flex min-h-[48px] flex-[1.4] items-center justify-center rounded-full bg-[#B45309] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              తదుపరి → Livelihood
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <form
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (canStep3()) setStep(4);
          }}
        >
          <div>
            <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A]">
              జీవనోపాధి
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">Livelihood</p>
          </div>

          <label className="block">
            <span className={labelClass}>ప్రాథమిక వృత్తి · Profession *</span>
            <select
              required
              value={form.primaryProfession}
              onChange={(e) =>
                patch({ primaryProfession: e.target.value as Profession | "" })
              }
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {PROFESSION_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te} ({o.label.en})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>దుకాణం హక్కు · Shop tenancy *</span>
            <select
              required
              value={form.shopTenancy}
              onChange={(e) =>
                patch({
                  shopTenancy: e.target.value as ShopTenancy | "",
                  monthlyRent: "",
                })
              }
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {SHOP_TENANCY_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te} ({o.label.en})
                </option>
              ))}
            </select>
          </label>

          {form.shopTenancy && needsMonthlyRent(form.shopTenancy) ? (
            <label className="block">
              <span className={labelClass}>నెలవారీ అద్దె (₹) *</span>
              <input
                required
                type="number"
                min={0}
                value={form.monthlyRent}
                onChange={(e) => patch({ monthlyRent: e.target.value })}
                className={inputClass}
              />
            </label>
          ) : null}

          <label className="block">
            <span className={labelClass}>ట్రేడ్ లైసెన్స్ · Trade license *</span>
            <select
              required
              value={form.tradeLicenseStatus}
              onChange={(e) =>
                patch({
                  tradeLicenseStatus: e.target
                    .value as FormState["tradeLicenseStatus"],
                })
              }
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {TRADE_LICENSE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te} ({o.label.en})
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-telugu text-sm font-semibold text-[#0F172A]"
            >
              ← వెనుకకు
            </button>
            <button
              type="submit"
              disabled={!canStep3()}
              className="tap inline-flex min-h-[48px] flex-[1.4] items-center justify-center rounded-full bg-[#B45309] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              తదుపరి → Welfare
            </button>
          </div>
        </form>
      ) : null}

      {step === 4 ? (
        <form
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (canStep4()) setStep(5);
          }}
        >
          <div>
            <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A]">
              సంక్షేమం & G.O. 23
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">Welfare & G.O. 23</p>
          </div>

          <label className="block">
            <span className={labelClass}>USC / మీటర్ నంబర్ (ఐచ్ఛికం)</span>
            <input
              value={form.uscno}
              onChange={(e) => patch({ uscno: e.target.value })}
              placeholder="Optional USCNO"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>G.O. 23 స్థితి *</span>
            <select
              required
              value={form.go23Status}
              onChange={(e) =>
                patch({ go23Status: e.target.value as Go23Status | "" })
              }
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {GO23_STATUS_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te} ({o.label.en})
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className={labelClass}>
              పొందిన సంక్షేమ పథకాలు · Welfare received *
            </legend>
            <div className="space-y-2">
              {WELFARE_SCHEME_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 ${
                    form.welfareReceived.includes(opt.id)
                      ? "border-[#B45309] bg-[#B45309]/5"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.welfareReceived.includes(opt.id)}
                    onChange={() => toggleWelfare(opt.id)}
                    className="h-4 w-4 accent-[#B45309]"
                  />
                  <span className="font-telugu text-sm text-[#0F172A]">
                    {opt.label.te}
                    <span className="ml-1 text-xs text-[#64748B]">
                      ({opt.label.en})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-telugu text-sm font-semibold text-[#0F172A]"
            >
              ← వెనుకకు
            </button>
            <button
              type="submit"
              disabled={!canStep4()}
              className="tap inline-flex min-h-[48px] flex-[1.4] items-center justify-center rounded-full bg-[#B45309] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              తదుపరి → Submit
            </button>
          </div>
        </form>
      ) : null}

      {step === 5 ? (
        <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A]">
              ఫిర్యాదు & ప్రకటన
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Grievance & Declaration
            </p>
          </div>

          <label className="block">
            <span className={labelClass}>
              తక్షణ ఫిర్యాదు · Immediate grievance *
            </span>
            <textarea
              required
              rows={4}
              value={form.immediateGrievance}
              onChange={(e) => patch({ immediateGrievance: e.target.value })}
              placeholder="కనీసం ఒక వాక్యం వ్రాయండి…"
              className={`${inputClass} min-h-[96px] resize-y font-telugu`}
            />
          </label>

          <fieldset>
            <legend className={labelClass}>
              కోరుకున్న చర్య · Desired action *
            </legend>
            <div className="space-y-2">
              {DESIRED_ACTION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 ${
                    form.desiredAction === opt.id
                      ? "border-[#B45309] bg-[#B45309]/5"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="desiredAction"
                    checked={form.desiredAction === opt.id}
                    onChange={() => patch({ desiredAction: opt.id })}
                    className="h-4 w-4 accent-[#B45309]"
                  />
                  <span className="font-telugu text-sm text-[#0F172A]">
                    {opt.label.te}
                    <span className="ml-1 text-xs text-[#64748B]">
                      ({opt.label.en})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex min-h-[52px] cursor-pointer items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-4 py-3">
            <input
              type="checkbox"
              checked={form.declarationAccepted}
              onChange={(e) =>
                patch({ declarationAccepted: e.target.checked })
              }
              className="mt-1 h-4 w-4 accent-[#B45309]"
            />
            <span className="font-telugu text-sm leading-relaxed text-[#0F172A]">
              నేను ఇచ్చిన సమాచారం నిజమని ప్రకటిస్తున్నాను. నాయీ సమాఖ్య సంక్షేమ &
              సమన్వయ ప్రయోజనాలకు దీనిని ఉపయోగించవచ్చు.
              <span className="mt-1 block text-xs text-[#64748B]">
                I declare the information is true and may be used for Nayi
                Samakhya welfare coordination.
              </span>
            </span>
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={submitting}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-telugu text-sm font-semibold text-[#0F172A] disabled:opacity-40"
            >
              ← వెనుకకు
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canStep5() || submitting}
              className="tap inline-flex min-h-[48px] flex-[1.6] items-center justify-center gap-2 rounded-full bg-[#B45309] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span className="font-telugu text-xs sm:text-sm">
                    సేవ్ అవుతోంది…
                  </span>
                </>
              ) : (
                <span className="font-telugu">సమర్పించండి · Submit</span>
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
