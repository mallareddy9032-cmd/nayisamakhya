"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Copy,
  IdCard,
  Loader2,
  MessageCircle,
  RefreshCw,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import {
  SPRINT_CERT_THRESHOLD,
  type Volunteer,
} from "@/types/volunteer";
import {
  coordinatorCardDownloadUrl,
  deriveStatus,
  districtHubJoinUrl,
  districtOptions,
  findLocalByPhone,
  generateSarathiRefCode,
  mandalOptions,
  surveyShareUrl,
  uid,
  upsertLocalVolunteer,
  whatsAppShareHref,
  writeSprintSession,
  readSprintSession,
} from "@/lib/sprint/volunteers";
import { getGeoDistrict } from "@/data/telanganaGeo";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass =
  "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

type FormState = {
  name: string;
  phone: string;
  district: string;
  mandal: string;
};

type Mode = "register" | "tracker";

export function SprintClient() {
  const [mode, setMode] = useState<Mode>("register");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    district: "",
    mandal: "",
  });
  const [lookupPhone, setLookupPhone] = useState("");
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mockNote, setMockNote] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const districts = useMemo(() => districtOptions(), []);
  const mandals = useMemo(
    () => mandalOptions(form.district),
    [form.district],
  );

  useEffect(() => {
    const session = readSprintSession();
    if (!session?.phone) {
      setHydrated(true);
      return;
    }
    const local = findLocalByPhone(session.phone);
    if (local) {
      setVolunteer(local);
      setLookupPhone(local.phone);
      setMode("tracker");
    }
    setHydrated(true);
  }, []);

  const shareUrl = volunteer ? surveyShareUrl(volunteer.refCode) : "";
  const completed = volunteer?.completedCount ?? 0;
  const progressPct = Math.min(
    100,
    Math.round((completed / SPRINT_CERT_THRESHOLD) * 100),
  );
  const certified = completed >= SPRINT_CERT_THRESHOLD;
  const remaining = Math.max(0, SPRINT_CERT_THRESHOLD - completed);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "district" ? { mandal: "" } : {}),
    }));
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    if (name.length < 2) {
      setError("పూర్తి పేరు నమోదు చేయండి");
      return;
    }
    if (phone.length !== 10) {
      setError("10 అంకెల వాట్సాప్ నంబర్ అవసరం");
      return;
    }
    if (!form.district || !form.mandal) {
      setError("జిల్లా & మండలం ఎంచుకోండి");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          district: form.district,
          mandal: form.mandal,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        volunteer?: Volunteer;
        mock?: boolean;
        error?: string;
      };

      let next: Volunteer;
      if (res.ok && data.success && data.volunteer) {
        next = {
          ...data.volunteer,
          completedCount: data.volunteer.completedCount ?? 0,
        };
        setMockNote(Boolean(data.mock));
      } else {
        const now = new Date().toISOString();
        next = {
          id: uid(),
          name,
          phone,
          district: form.district,
          mandal: form.mandal,
          refCode: generateSarathiRefCode(form.district),
          completedCount: 0,
          status: deriveStatus(0),
          createdAt: now,
          updatedAt: now,
        };
        setMockNote(true);
      }

      upsertLocalVolunteer(next);
      writeSprintSession({ phone: next.phone, refCode: next.refCode });
      setVolunteer(next);
      setLookupPhone(next.phone);
      setMode("tracker");
    } catch {
      const now = new Date().toISOString();
      const next: Volunteer = {
        id: uid(),
        name,
        phone,
        district: form.district,
        mandal: form.mandal,
        refCode: generateSarathiRefCode(form.district),
        completedCount: 0,
        status: deriveStatus(0),
        createdAt: now,
        updatedAt: now,
      };
      upsertLocalVolunteer(next);
      writeSprintSession({ phone: next.phone, refCode: next.refCode });
      setVolunteer(next);
      setLookupPhone(next.phone);
      setMockNote(true);
      setMode("tracker");
    } finally {
      setSubmitting(false);
    }
  }

  async function onLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phone = lookupPhone.replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("10 అంకెల ఫోన్ నంబర్ ఇవ్వండి");
      return;
    }
    setLookingUp(true);
    try {
      const res = await fetch(
        `/api/volunteers?phone=${encodeURIComponent(phone)}`,
      );
      const data = (await res.json()) as {
        success?: boolean;
        volunteer?: Volunteer | null;
        mock?: boolean;
      };

      if (data.volunteer) {
        upsertLocalVolunteer(data.volunteer);
        writeSprintSession({
          phone: data.volunteer.phone,
          refCode: data.volunteer.refCode,
        });
        setVolunteer(data.volunteer);
        setMockNote(Boolean(data.mock));
        return;
      }

      const local = findLocalByPhone(phone);
      if (local) {
        setVolunteer(local);
        writeSprintSession({ phone: local.phone, refCode: local.refCode });
        setMockNote(true);
        return;
      }

      setVolunteer(null);
      setError("ఈ నంబర్‌తో సారథి నమోదు కనపడలేదు — ముందుగా రిజిస్టర్ అవ్వండి");
    } catch {
      const local = findLocalByPhone(phone);
      if (local) {
        setVolunteer(local);
        setMockNote(true);
      } else {
        setError("లుక్అప్ విఫలమైంది — మళ్లీ ప్రయత్నించండి");
      }
    } finally {
      setLookingUp(false);
    }
  }

  async function refreshProgress() {
    if (!volunteer?.phone) return;
    setLookingUp(true);
    try {
      const res = await fetch(
        `/api/volunteers?phone=${encodeURIComponent(volunteer.phone)}`,
      );
      const data = (await res.json()) as { volunteer?: Volunteer | null };
      if (data.volunteer) {
        upsertLocalVolunteer(data.volunteer);
        setVolunteer(data.volunteer);
        setMockNote(false);
      } else {
        const local = findLocalByPhone(volunteer.phone);
        if (local) setVolunteer(local);
      }
    } finally {
      setLookingUp(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#B45309]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-[#E2E8F0] bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`tap flex-1 rounded-lg px-3 py-2.5 font-telugu text-sm font-bold transition ${
            mode === "register"
              ? "bg-[#B45309] text-white"
              : "text-[#475569] hover:bg-[#FBFBFA]"
          }`}
        >
          నమోదు
        </button>
        <button
          type="button"
          onClick={() => setMode("tracker")}
          className={`tap flex-1 rounded-lg px-3 py-2.5 font-telugu text-sm font-bold transition ${
            mode === "tracker"
              ? "bg-[#B45309] text-white"
              : "text-[#475569] hover:bg-[#FBFBFA]"
          }`}
        >
          ప్రోగ్రెస్ ట్రాకర్
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-telugu text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {mode === "register" ? (
        <form
          onSubmit={onRegister}
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              Competition 1 · Field Champion
            </p>
            <h2 className="mt-1 font-display-te text-xl font-normal text-[#0F172A]">
              సారథి నమోదు
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              15 సర్వేలు పూర్తి చేస్తే సర్టిఫైడ్ మండల కోఆర్డినేటర్
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="sprint-name">
              పూర్తి పేరు
            </label>
            <input
              id="sprint-name"
              className={inputClass}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="ఉదా: రాము"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="sprint-phone">
              వాట్సాప్ (10 అంకెలు)
            </label>
            <input
              id="sprint-phone"
              className={inputClass}
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              autoComplete="tel"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="sprint-district">
              జిల్లా
            </label>
            <select
              id="sprint-district"
              className={inputClass}
              value={form.district}
              onChange={(e) => setField("district", e.target.value)}
              required
            >
              <option value="">జిల్లా ఎంచుకోండి</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.nameTe} · {d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="sprint-mandal">
              మండలం / ULB
            </label>
            <select
              id="sprint-mandal"
              className={inputClass}
              value={form.mandal}
              onChange={(e) => setField("mandal", e.target.value)}
              disabled={!form.district}
              required
            >
              <option value="">
                {form.district ? "మండలం ఎంచుకోండి" : "ముందు జిల్లా"}
              </option>
              {mandals.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.nameTe} · {m.nameEn}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="tap inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.28)] transition hover:bg-[#92400E] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trophy className="h-4 w-4" />
            )}
            సారథి అవ్వండి · Get Ref Code
          </button>
        </form>
      ) : null}

      {mode === "tracker" ? (
        <div className="space-y-4">
          <form
            onSubmit={onLookup}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs"
          >
            <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
              ప్రోగ్రెస్ చూడండి
            </h2>
            <p className="mt-1 mb-4 text-sm text-[#64748B]">
              నమోదు చేసిన వాట్సాప్ నంబర్‌తో లుక్అప్
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className={inputClass}
                inputMode="numeric"
                maxLength={10}
                value={lookupPhone}
                onChange={(e) =>
                  setLookupPhone(
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                placeholder="9876543210"
                aria-label="Lookup phone"
              />
              <button
                type="submit"
                disabled={lookingUp}
                className="tap inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#B45309]/30 bg-[#B45309]/10 px-4 font-telugu text-sm font-bold text-[#B45309] disabled:opacity-60"
              >
                {lookingUp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                లుక్అప్
              </button>
            </div>
          </form>

          {!volunteer ? (
            <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#FBFBFA] px-5 py-10 text-center">
              <p className="font-telugu text-sm text-[#64748B]">
                ఇంకా సారథి కనపడలేదు — నమోదు టాబ్‌లో రిజిస్టర్ అవ్వండి
              </p>
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
              {mockNote ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Local volunteers_db — Supabase sync when configured
                </p>
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
                    Ref Code
                  </p>
                  <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-[#0F172A]">
                    {volunteer.refCode}
                  </p>
                  <p className="mt-1 font-telugu text-sm text-[#475569]">
                    {volunteer.name} ·{" "}
                    {getGeoDistrict(volunteer.district)?.nameTe ||
                      volunteer.district}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshProgress}
                  className="tap inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#FBFBFA]"
                  aria-label="Refresh progress"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${lookingUp ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-telugu text-sm font-semibold text-[#0F172A]">
                    {completed} / {SPRINT_CERT_THRESHOLD} పూర్తి అయ్యాయి
                  </span>
                  <span className="font-mono text-xs font-bold text-[#B45309]">
                    {progressPct}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#F4F2EB]">
                  <div
                    className="h-full rounded-full bg-[#B45309] transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                  Shareable survey link
                </p>
                <p className="break-all font-mono text-xs text-[#0F172A]">
                  {shareUrl}
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="tap mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 font-telugu text-xs font-bold text-[#0F172A]"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "కాపీ అయింది" : "లింక్ కాపీ"}
                </button>
              </div>

              <a
                href={whatsAppShareHref(volunteer.refCode)}
                target="_blank"
                rel="noreferrer"
                className="tap inline-flex w-full min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#128C7E] px-4 py-4 font-telugu text-base font-bold text-white shadow-[0_10px_28px_rgb(18_140_126_/0.35)] transition hover:bg-[#0E7A6E]"
              >
                <MessageCircle className="h-5 w-5" />
                వాట్సాప్ ద్వారా ప్రచారం ప్రారంభించండి
              </a>

              {certified ? (
                <div className="space-y-3 rounded-2xl border border-[#B45309]/35 bg-gradient-to-b from-[#FFFDF9] to-[#FBF7ED] p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-[#B45309]" />
                    <div>
                      <p className="font-telugu text-sm font-bold text-[#B45309]">
                        🏆 సర్టిఫైడ్ సేవా సారథి
                      </p>
                      <p className="text-xs text-[#64748B]">
                        15+ సర్వేలు · District hub unlocked
                      </p>
                    </div>
                    <CheckCircle2 className="ml-auto h-5 w-5 text-[#0E7A6E]" />
                  </div>
                  <Link
                    href={coordinatorCardDownloadUrl(volunteer)}
                    className="tap inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white"
                  >
                    <IdCard className="h-4 w-4" />
                    కోఆర్డినేటర్ కార్డు డౌన్‌లోడ్
                  </Link>
                  <a
                    href={districtHubJoinUrl(volunteer.district)}
                    target="_blank"
                    rel="noreferrer"
                    className="tap inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl border border-[#0E7A6E]/30 bg-[#0E7A6E]/10 px-4 font-telugu text-sm font-bold text-[#0E7A6E]"
                  >
                    <Share2 className="h-4 w-4" />
                    జిల్లా వాట్సాప్ గ్రూప్‌లో చేరండి
                  </a>
                </div>
              ) : (
                <p className="rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] px-4 py-3 font-telugu text-sm leading-relaxed text-[#0F172A]">
                  ఇంకా <span className="font-bold text-[#B45309]">{remaining}</span>{" "}
                  సర్వేలు పూర్తి చేస్తే సర్టిఫైడ్ బ్యాడ్జ్ అన్‌లాక్ అవుతుంది. మీ షేర్
                  లింక్ ద్వారా సోదరులు సర్వే పంపితే కౌంట్ పెరుగుతుంది.
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
