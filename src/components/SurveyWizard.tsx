"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Send,
  RotateCcw,
} from "lucide-react";

type GpOption = { id: string; nameTe: string; nameEn: string };

type Member = {
  id: string;
  name: string;
  age: string;
  gender: "M" | "F" | "O";
  educationRole: string;
  isVoter: boolean;
};

type Props = {
  districtSlug: string;
  mandalSlug: string;
  districtNameTe: string;
  mandalNameTe: string;
  districtNameEn?: string;
  mandalNameEn?: string;
  gramPanchayats?: GpOption[];
};

const WINGS = [
  { id: "nayi", te: "నాయి బ్రాహ్మణ", en: "Nayi Brahmin" },
  { id: "bajantri", te: "భజంత్రి", en: "Bajantri" },
  { id: "other", te: "ఇతర", en: "Other" },
] as const;

const OCCUPATIONS = [
  { id: "salon-owner", te: "సెలూన్ యజమాని", en: "Salon Owner", branch: "salon" as const },
  { id: "salon-worker", te: "సెలూన్ కార్మికుడు", en: "Salon Worker", branch: "salon" as const },
  { id: "bajantri", te: "భజంత్రి కళాకారుడు", en: "Bajantri Artist", branch: "bajantri" as const },
  { id: "student", te: "విద్యార్థి", en: "Student", branch: "skip" as const },
  { id: "other", te: "ఇతరం", en: "Other", branch: "skip" as const },
];

const PREMISES = [
  { id: "rented", te: "అద్దె", en: "Rented" },
  { id: "owned", te: "స్వంతం", en: "Owned" },
];

const POWER = [
  { id: "active", te: "క్రియాశీలం", en: "Active" },
  { id: "pending", te: "పెండింగ్", en: "Pending" },
  { id: "none", te: "దరఖాస్తు చేయలేదు", en: "Not Applied" },
  { id: "meter", te: "మీటర్ పేరు సమస్య", en: "Meter Name Issue" },
];

const ENGAGEMENTS = [
  { id: "temple", te: "దేవాలయ ఒప్పందం", en: "Temple Contract" },
  { id: "seasonal", te: "కాలానుగుణ పండుగలు", en: "Seasonal Festivals" },
  { id: "weddings", te: "పెళ్లిళ్లు", en: "Weddings" },
];

const PENSIONS = [
  { id: "active", te: "క్రియాశీలం", en: "Active" },
  { id: "applied", te: "దరఖాస్తు చేశారు", en: "Applied" },
  { id: "none", te: "లేదు", en: "None" },
];

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#EBE8E0] bg-white px-4 py-3 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#C2410C]/50 focus:outline-none";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyMember(): Member {
  return {
    id: uid(),
    name: "",
    age: "",
    gender: "M",
    educationRole: "",
    isVoter: false,
  };
}

export function SurveyWizard({
  districtSlug,
  mandalSlug,
  districtNameTe,
  mandalNameTe,
  districtNameEn,
  mandalNameEn,
  gramPanchayats = [],
}: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [error, setError] = useState("");

  const [gramPanchayat, setGramPanchayat] = useState("");
  const [headName, setHeadName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [communityWing, setCommunityWing] = useState("");
  const [occupation, setOccupation] = useState("");
  const [premiseType, setPremiseType] = useState("");
  const [powerStatus, setPowerStatus] = useState("");
  const [uscNumber, setUscNumber] = useState("");
  const [engagementType, setEngagementType] = useState("");
  const [pensionStatus, setPensionStatus] = useState("");
  const [members, setMembers] = useState<Member[]>([emptyMember()]);

  const branch = useMemo(() => {
    return OCCUPATIONS.find((o) => o.id === occupation)?.branch ?? "skip";
  }, [occupation]);

  const progressPct = (step / 3) * 100;

  function resetForNextHousehold() {
    const lockedGp = gramPanchayat;
    setStep(1);
    setSubmitted(false);
    setReferenceId("");
    setError("");
    setHeadName("");
    setWhatsapp("");
    setCommunityWing("");
    setOccupation("");
    setPremiseType("");
    setPowerStatus("");
    setUscNumber("");
    setEngagementType("");
    setPensionStatus("");
    setMembers([emptyMember()]);
    setGramPanchayat(lockedGp);
  }

  function canGoStep2() {
    const phoneOk = /^\d{10}$/.test(whatsapp.replace(/\D/g, ""));
    return Boolean(gramPanchayat.trim() && headName.trim() && phoneOk && communityWing);
  }

  function canGoStep3() {
    if (!occupation) return false;
    if (branch === "salon") return Boolean(premiseType && powerStatus);
    if (branch === "bajantri") return Boolean(engagementType && pensionStatus);
    return true;
  }

  function canSubmit() {
    return members.every(
      (m) => m.name.trim() && m.age.trim() && m.educationRole.trim(),
    );
  }

  async function onSubmit() {
    if (!canSubmit() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          districtSlug,
          mandalSlug,
          gramPanchayat,
          headName,
          whatsapp: whatsapp.replace(/\D/g, ""),
          communityWing,
          occupation,
          premiseType: branch === "salon" ? premiseType : undefined,
          powerStatus: branch === "salon" ? powerStatus : undefined,
          uscNumber: branch === "salon" ? uscNumber : undefined,
          engagementType: branch === "bajantri" ? engagementType : undefined,
          pensionStatus: branch === "bajantri" ? pensionStatus : undefined,
          members: members.map((m) => ({
            name: m.name.trim(),
            age: m.age,
            gender: m.gender,
            educationRole: m.educationRole.trim(),
            isVoter: m.isVoter,
          })),
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        referenceId?: string;
        persisted?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success || !data.referenceId || data.persisted === false) {
        throw new Error(data.error || "Submit failed");
      }
      setReferenceId(data.referenceId);
      setSubmitted(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "సమర్పణ విఫలమైంది. మళ్లీ ప్రయత్నించండి.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#EBE8E0] bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-600" aria-hidden />
          <h2 className="mt-4 font-telugu text-xl font-bold text-[#18181B]">
            సర్వే విజయవంతంగా నమోదైంది!
          </h2>
          <p className="mt-1 text-sm text-[#71717A]">Survey Submitted Successfully</p>

          <div className="mt-5 w-full rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] px-4 py-3">
            <p className="font-telugu text-xs text-[#71717A]">రిఫరెన్స్ నంబర్</p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wide text-[#C2410C]">
              {referenceId}
            </p>
          </div>

          <a
            href="https://t.me/nayi_samakhya"
            target="_blank"
            rel="noreferrer"
            className="tap mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#229ED9] px-5 text-sm font-semibold text-white hover:bg-[#1B8BC0]"
          >
            <Send className="h-4 w-4" aria-hidden />
            🚀 మండల టెలిగ్రామ్ అలర్ట్స్ గ్రూప్‌లో చేరండి
          </a>

          <button
            type="button"
            onClick={resetForNextHousehold}
            className="tap mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#EBE8E0] bg-white px-5 font-telugu text-sm font-semibold text-[#18181B] hover:bg-[#F4F2EB]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            🔄 తదుపరి సర్వే ప్రారంభించండి
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#71717A]">
          <span className="font-telugu font-semibold text-[#18181B]">
            దశ {step} / 3
          </span>
          <span>Step {step} of 3</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F4F2EB]">
          <div
            className="h-full rounded-full bg-[#C2410C] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 ? (
        <form
          className="space-y-4 rounded-2xl border border-[#EBE8E0] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (canGoStep2()) setStep(2);
          }}
        >
          <h2 className="font-telugu text-lg font-bold text-[#18181B]">
            ప్రాథమిక వివరాలు
          </h2>
          <p className="text-xs text-[#71717A]">Basic Details</p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-[36px] items-center rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 py-1.5 font-telugu text-xs font-medium text-[#18181B]">
              📍 {districtNameTe}
              {districtNameEn ? (
                <span className="ml-1 text-[#71717A]">({districtNameEn})</span>
              ) : null}
            </span>
            <span className="inline-flex min-h-[36px] items-center rounded-full border border-[#C2410C]/20 bg-[#C2410C]/10 px-3 py-1.5 font-telugu text-xs font-semibold text-[#C2410C]">
              {mandalNameTe}
              {mandalNameEn ? (
                <span className="ml-1 font-normal opacity-80">({mandalNameEn})</span>
              ) : null}
            </span>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-telugu text-sm font-medium text-[#18181B]">
              గ్రామ పంచాయతీ / వార్డు *
            </span>
            {gramPanchayats.length > 0 ? (
              <select
                required
                value={gramPanchayat}
                onChange={(e) => setGramPanchayat(e.target.value)}
                className={`${inputClass} font-telugu`}
              >
                <option value="">ఎంచుకోండి…</option>
                {gramPanchayats.map((gp) => (
                  <option key={gp.id} value={gp.nameTe}>
                    {gp.nameTe} ({gp.nameEn})
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                value={gramPanchayat}
                onChange={(e) => setGramPanchayat(e.target.value)}
                placeholder="పంచాయతీ / వార్డు పేరు"
                className={`${inputClass} font-telugu`}
              />
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block font-telugu text-sm font-medium text-[#18181B]">
              కుటుంబ పెద్ద పూర్తి పేరు *
            </span>
            <input
              required
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              placeholder="Full name"
              className={`${inputClass} font-telugu`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-telugu text-sm font-medium text-[#18181B]">
              వాట్సాప్ మొబైల్ నంబర్ *
            </span>
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10 అంకెలు"
              className={inputClass}
            />
          </label>

          <fieldset>
            <legend className="mb-2 font-telugu text-sm font-medium text-[#18181B]">
              కమ్యూనిటీ వింగ్ *
            </legend>
            <div className="space-y-2">
              {WINGS.map((w) => (
                <label
                  key={w.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 ${
                    communityWing === w.id
                      ? "border-[#C2410C] bg-[#C2410C]/5"
                      : "border-[#EBE8E0] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="wing"
                    required
                    checked={communityWing === w.id}
                    onChange={() => setCommunityWing(w.id)}
                    className="h-4 w-4 accent-[#C2410C]"
                  />
                  <span className="font-telugu text-sm text-[#18181B]">
                    {w.te}
                    <span className="ml-1 text-xs text-[#71717A]">({w.en})</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!canGoStep2()}
            className="tap inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#C2410C] px-5 text-sm font-semibold text-white hover:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-40"
          >
            తదుపరి → Livelihood
          </button>
        </form>
      ) : null}

      {/* STEP 2 */}
      {step === 2 ? (
        <form
          className="space-y-4 rounded-2xl border border-[#EBE8E0] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (canGoStep3()) setStep(3);
          }}
        >
          <h2 className="font-telugu text-lg font-bold text-[#18181B]">
            జీవనోపాధి & సంక్షేమం
          </h2>
          <p className="text-xs text-[#71717A]">Livelihood & Welfare</p>

          <label className="block">
            <span className="mb-1.5 block font-telugu text-sm font-medium text-[#18181B]">
              ప్రాథమిక వృత్తి *
            </span>
            <select
              required
              value={occupation}
              onChange={(e) => {
                setOccupation(e.target.value);
                setPremiseType("");
                setPowerStatus("");
                setUscNumber("");
                setEngagementType("");
                setPensionStatus("");
              }}
              className={`${inputClass} font-telugu`}
            >
              <option value="">ఎంచుకోండి…</option>
              {OCCUPATIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.te} ({o.en})
                </option>
              ))}
            </select>
          </label>

          {branch === "salon" ? (
            <div className="space-y-3 rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] p-4">
              <p className="font-telugu text-xs font-semibold text-[#C2410C]">
                సెలూన్ వివరాలు
              </p>
              <label className="block">
                <span className="mb-1.5 block font-telugu text-sm font-medium">
                  దుకాణం ప్రాంగణం *
                </span>
                <select
                  required
                  value={premiseType}
                  onChange={(e) => setPremiseType(e.target.value)}
                  className={`${inputClass} font-telugu`}
                >
                  <option value="">ఎంచుకోండి…</option>
                  {PREMISES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.te} ({p.en})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-telugu text-sm font-medium">
                  250 యూనిట్ల ఉచిత విద్యుత్ స్థితి *
                </span>
                <select
                  required
                  value={powerStatus}
                  onChange={(e) => setPowerStatus(e.target.value)}
                  className={`${inputClass} font-telugu`}
                >
                  <option value="">ఎంచుకోండి…</option>
                  {POWER.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.te} ({p.en})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-telugu text-sm font-medium">
                  USC / మీటర్ నంబర్ (ఐచ్ఛికం)
                </span>
                <input
                  value={uscNumber}
                  onChange={(e) => setUscNumber(e.target.value)}
                  placeholder="Optional"
                  className={inputClass}
                />
              </label>
            </div>
          ) : null}

          {branch === "bajantri" ? (
            <div className="space-y-3 rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] p-4">
              <p className="font-telugu text-xs font-semibold text-[#C2410C]">
                భజంత్రి వివరాలు
              </p>
              <label className="block">
                <span className="mb-1.5 block font-telugu text-sm font-medium">
                  ఎంగేజ్‌మెంట్ రకం *
                </span>
                <select
                  required
                  value={engagementType}
                  onChange={(e) => setEngagementType(e.target.value)}
                  className={`${inputClass} font-telugu`}
                >
                  <option value="">ఎంచుకోండి…</option>
                  {ENGAGEMENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.te} ({p.en})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-telugu text-sm font-medium">
                  సాంస్కృతిక పెన్షన్ స్థితి *
                </span>
                <select
                  required
                  value={pensionStatus}
                  onChange={(e) => setPensionStatus(e.target.value)}
                  className={`${inputClass} font-telugu`}
                >
                  <option value="">ఎంచుకోండి…</option>
                  {PENSIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.te} ({p.en})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#EBE8E0] bg-white font-telugu text-sm font-semibold text-[#18181B]"
            >
              ← వెనుకకు
            </button>
            <button
              type="submit"
              disabled={!canGoStep3()}
              className="tap inline-flex min-h-[48px] flex-[1.4] items-center justify-center rounded-full bg-[#C2410C] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              తదుపరి → Roster
            </button>
          </div>
        </form>
      ) : null}

      {/* STEP 3 */}
      {step === 3 ? (
        <div className="space-y-4 rounded-2xl border border-[#EBE8E0] bg-white p-5 shadow-sm">
          <h2 className="font-telugu text-lg font-bold text-[#18181B]">
            కుటుంబ సభ్యులు
          </h2>
          <p className="text-xs text-[#71717A]">Family Roster</p>

          <div className="space-y-3">
            {members.map((member, idx) => (
              <div
                key={member.id}
                className="rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-telugu text-sm font-semibold text-[#18181B]">
                    సభ్యుడు {idx + 1}
                  </p>
                  {members.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setMembers((prev) => prev.filter((m) => m.id !== member.id))
                      }
                      className="tap inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-[#71717A] hover:bg-white hover:text-red-600"
                      aria-label="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <div className="space-y-2.5">
                  <input
                    required
                    value={member.name}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((m) =>
                          m.id === member.id ? { ...m, name: e.target.value } : m,
                        ),
                      )
                    }
                    placeholder="పేరు / Name *"
                    className={`${inputClass} font-telugu`}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="number"
                      min={0}
                      max={120}
                      value={member.age}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id ? { ...m, age: e.target.value } : m,
                          ),
                        )
                      }
                      placeholder="వయస్సు / Age *"
                      className={inputClass}
                    />
                    <select
                      required
                      value={member.gender}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id
                              ? {
                                  ...m,
                                  gender: e.target.value as Member["gender"],
                                }
                              : m,
                          ),
                        )
                      }
                      className={inputClass}
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                  <input
                    required
                    value={member.educationRole}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((m) =>
                          m.id === member.id
                            ? { ...m, educationRole: e.target.value }
                            : m,
                        ),
                      )
                    }
                    placeholder="విద్య / పాత్ర (Education / Role) *"
                    className={`${inputClass} font-telugu`}
                  />
                  <label className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[#EBE8E0] bg-white px-4">
                    <input
                      type="checkbox"
                      checked={member.isVoter}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id
                              ? { ...m, isVoter: e.target.checked }
                              : m,
                          ),
                        )
                      }
                      className="h-4 w-4 accent-[#C2410C]"
                    />
                    <span className="font-telugu text-sm text-[#18181B]">
                      ఓటరు (Voter)
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMembers((prev) => [...prev, emptyMember()])}
            className="tap inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-[#C2410C]/40 bg-[#C2410C]/5 font-telugu text-sm font-bold text-[#C2410C] hover:bg-[#C2410C]/10"
          >
            <Plus className="h-4 w-4" aria-hidden />
            + కుటుంబ సభ్యుడిని జతచేయండి (Add Member)
          </button>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={submitting}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#EBE8E0] bg-white font-telugu text-sm font-semibold text-[#18181B] disabled:opacity-40"
            >
              ← వెనుకకు
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit() || submitting}
              className="tap inline-flex min-h-[48px] flex-[1.6] items-center justify-center gap-2 rounded-full bg-[#C2410C] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span className="font-telugu text-xs sm:text-sm">
                    డేటా సురక్షితంగా సేవ్ అవుతోంది…
                  </span>
                </>
              ) : (
                <span className="font-telugu">సమర్పించండి / Submit</span>
              )}
            </button>
          </div>
          {submitting ? (
            <p className="text-center text-[11px] text-[#71717A]">
              Saving securely…
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
