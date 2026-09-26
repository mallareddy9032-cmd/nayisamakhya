"use client";

import { useMemo, useState } from "react";
import { listDistricts } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";
import {
  AUTHORITIES,
  SUBJECT_OPTIONS,
  type Language,
} from "@/lib/data/representationLetterOptions";
import { listStaticUlbsForDistrict } from "@/lib/data/urbanDirectory";
import { cn } from "@/lib/utils";

type AreaType = "rural" | "urban";

function fieldClass(te: boolean) {
  return cn(
    "tap w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
    te && "font-telugu",
  );
}

export function RepresentationLetterPage() {
  const [lang, setLang] = useState<Language>("te");
  const te = lang === "te";

  const districts = useMemo(() => listDistricts(), []);
  const [districtSlug, setDistrictSlug] = useState(
    districts[0]?.slug || "adilabad",
  );
  const [areaType, setAreaType] = useState<AreaType>("rural");
  const [areaSlug, setAreaSlug] = useState("");
  const [authorityId, setAuthorityId] = useState(AUTHORITIES[0].id);
  const [subjectId, setSubjectId] = useState(SUBJECT_OPTIONS[0].id);
  const [customNotes, setCustomNotes] = useState("");
  const [signatoryName, setSignatoryName] = useState("\u0c2e\u0c41\u0c28\u0c41\u0c17\u0c4b\u0c1f\u0c3f \u0c30\u0c3e\u0c2e\u0c41");
  const [signatoryRole, setSignatoryRole] = useState("\u0c2e\u0c02\u0c21\u0c32 \u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24");
  const [signatoryPhone, setSignatoryPhone] = useState("9032654111");

  const areas = useMemo(() => {
    if (areaType === "urban") {
      return listStaticUlbsForDistrict(districtSlug).map((u) => ({
        slug: u.slug,
        name_en: u.name_en,
        name_te: u.name_te,
      }));
    }
    return listMandalsForDistrict(districtSlug).map((m) => ({
      slug: m.slug,
      name_en: m.name_en,
      name_te: m.name_te,
    }));
  }, [areaType, districtSlug]);

  const selectedAreaSlug =
    areaSlug && areas.some((a) => a.slug === areaSlug)
      ? areaSlug
      : areas[0]?.slug || "";

  const currentDist = districts.find((d) => d.slug === districtSlug);
  const currentArea = areas.find((a) => a.slug === selectedAreaSlug);
  const currentAuthority =
    AUTHORITIES.find((a) => a.id === authorityId) || AUTHORITIES[0];
  const currentSubject =
    SUBJECT_OPTIONS.find((s) => s.id === subjectId) || SUBJECT_OPTIONS[0];

  const distName = te
    ? currentDist?.name_te || currentDist?.name_en || ""
    : currentDist?.name_en || "";
  const areaName = te
    ? currentArea?.name_te || currentArea?.name_en || ""
    : currentArea?.name_en || "";

  const todayDate = new Date().toLocaleDateString(te ? "te-IN" : "en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="no-print space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <h1
                className={cn(
                  "text-xl font-bold text-slate-900",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c24\u0c2f\u0c3e\u0c30\u0c40 (Representation Generator)" : "Official Representation Letter Builder"}
              </h1>
              <p
                className={cn(
                  "mt-1 text-xs text-slate-500",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c05\u0c02\u0c26\u0c1c\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c2b\u0c3e\u0c30\u0c4d\u0c2e\u0c3e\u0c1f\u0c4d\u200c\u0c32\u0c4b \u0c32\u0c47\u0c16\u0c28\u0c41 \u0c30\u0c42\u0c2a\u0c4a\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f." : "Generate standardized formal letters to government and municipal authorities."}
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setLang("te")}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition font-telugu",
                  te
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                \u0c24\u0c46\u0c32\u0c41\u0c17\u0c41 (Default)
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition",
                  !te
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e \u0c0e\u0c02\u0c1a\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f" : "Select District"}
              </label>
              <select
                value={districtSlug}
                onChange={(e) => {
                  setDistrictSlug(e.target.value);
                  setAreaSlug("");
                }}
                className={fieldClass(te)}
              >
                {districts.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {te && d.name_te
                      ? `${d.name_te} (${d.name_en})`
                      : d.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c02 \u0c30\u0c15\u0c02" : "Area Type"}
              </label>
              <select
                value={areaType}
                onChange={(e) => {
                  setAreaType(e.target.value as AreaType);
                  setAreaSlug("");
                }}
                className={fieldClass(te)}
              >
                <option value="rural">
                  {te ? "\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c40\u0c23 \u0c2e\u0c02\u0c21\u0c32\u0c02 (Rural Mandal)" : "Rural Mandal"}
                </option>
                <option value="urban">
                  {te ? "\u0c2a\u0c1f\u0c4d\u0c1f\u0c23 \u0c2a\u0c41\u0c30\u0c2a\u0c3e\u0c32\u0c15 \u0c38\u0c02\u0c18\u0c02 (Urban ULB)" : "Urban Municipality / Corp"}
                </option>
              </select>
            </div>
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {areaType === "rural"
                  ? te
                    ? "\u0c2e\u0c02\u0c21\u0c32\u0c02"
                    : "Mandal"
                  : te
                    ? "\u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c3e\u0c32\u0c3f\u0c1f\u0c40 / \u0c15\u0c3e\u0c30\u0c4d\u0c2a\u0c4a\u0c30\u0c47\u0c37\u0c28\u0c4d"
                    : "Municipality / Corp"}
              </label>
              <select
                value={selectedAreaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                className={fieldClass(te)}
              >
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {te && a.name_te
                      ? `${a.name_te} (${a.name_en})`
                      : a.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c0e\u0c35\u0c30\u0c3f\u0c15\u0c3f \u0c2a\u0c02\u0c2a\u0c41\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c30\u0c41 (Addressing Authority)" : "Addressing Authority"}
              </label>
              <select
                value={authorityId}
                onChange={(e) => setAuthorityId(e.target.value)}
                className={fieldClass(te)}
              >
                {AUTHORITIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {te ? a.title_te : a.title_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c35\u0c3f\u0c28\u0c24\u0c3f \u0c05\u0c02\u0c36\u0c02 (Subject Matter - Top 10)" : "Subject Matter (Top 10 Selected)"}
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className={fieldClass(te)}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {te ? s.subj_te : s.subj_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className={cn(
                "mb-1 block text-xs font-semibold text-slate-700",
                te && "font-telugu",
              )}
            >
              {te ? "\u0c38\u0c4d\u0c25\u0c3e\u0c28\u0c3f\u0c15 \u0c05\u0c26\u0c28\u0c2a\u0c41 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 / \u0c38\u0c2e\u0c38\u0c4d\u0c2f \u0c24\u0c40\u0c35\u0c4d\u0c30\u0c24 (Optional Specific Notes)" : "Specific Local Ground Details / Shop Locations (Optional)"}
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={
                te ? "\u0c09\u0c26\u0c3e: \u0c32\u0c21\u0c15\u0c4d \u0c2c\u0c1c\u0c3e\u0c30\u0c4d \u0c2e\u0c46\u0c2f\u0c3f\u0c28\u0c4d \u0c30\u0c4b\u0c21\u0c4d\u0c21\u0c41 \u0c35\u0c26\u0c4d\u0c26 \u0c30\u0c48\u0c32\u0c4d\u0c35\u0c47 \u0c17\u0c47\u0c1f\u0c4d \u0c2a\u0c15\u0c4d\u0c15\u0c28 2 \u0c26\u0c41\u0c15\u0c3e\u0c23\u0c3e\u0c32 \u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c41\u0c24\u0c4d \u0c2e\u0c40\u0c1f\u0c30\u0c4d\u0c32\u0c15\u0c41 \u0c38\u0c02\u0c2c\u0c02\u0c27\u0c3f\u0c02\u0c1a\u0c3f..." : "e.g., Specific to 2 shops located near the railway gate on Ladak Bazar road..."
              }
              className={cn(fieldClass(te), "p-3")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 \u0c2a\u0c47\u0c30\u0c41" : "Signatory Name"}
              </label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className={fieldClass(te)}
              />
            </div>
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c39\u0c4b\u0c26\u0c3e" : "Designation"}
              </label>
              <input
                type="text"
                value={signatoryRole}
                onChange={(e) => setSignatoryRole(e.target.value)}
                className={fieldClass(te)}
              />
            </div>
            <div>
              <label
                className={cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c2b\u0c4b\u0c28\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d" : "Contact Phone"}
              </label>
              <input
                type="text"
                value={signatoryPhone}
                onChange={(e) => setSignatoryPhone(e.target.value)}
                className={fieldClass(false)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {te ? "\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d / \u0c21\u0c4c\u0c28\u0c4d\u200c\u0c32\u0c4b\u0c21\u0c4d (PDF)" : "Print / Download Official PDF"}
            </button>
          </div>
        </div>

        <div className="printable-card print-document rounded-2xl border border-slate-200 bg-white p-8 font-serif leading-relaxed text-slate-900 shadow-md sm:p-10">
          <div className="mb-6 border-b-2 border-slate-900 pb-4 text-center">
            <div
              className={cn(
                "text-xl font-bold tracking-tight text-slate-900 sm:text-2xl",
                te && "font-telugu",
              )}
            >
              {te ? "\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f - \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23" : "NAYI SAMAKHYA - TELANGANA"}
            </div>
            <div
              className={cn(
                "mt-1 font-sans text-xs uppercase tracking-widest text-slate-600",
                te && "font-telugu normal-case tracking-normal",
              )}
            >
              {te ? "\u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02 \u2022 \u0c38\u0c3e\u0c2e\u0c3e\u0c1c\u0c3f\u0c15 \u0c38\u0c3e\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c24 \u2022 \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c2a\u0c30\u0c2e\u0c48\u0c28 \u0c39\u0c15\u0c4d\u0c15\u0c41\u0c32 \u0c2a\u0c30\u0c3f\u0c30\u0c15\u0c4d\u0c37\u0c23 \u0c35\u0c47\u0c26\u0c3f\u0c15" : "State Platform for Welfare, Civic Rights & Occupational Empowerment"}
            </div>
            <div className="mt-1 font-sans font-telugu text-[11px] text-slate-500">
              \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c46\u0c2c\u0c4d\u200c\u0c38\u0c48\u0c1f\u0c4d: www.nayisamakhya.org | \u0c38\u0c47\u0c35 \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d \u0c39\u0c46\u0c32\u0c4d\u0c2a\u0c4d\u200c\u0c32\u0c48\u0c28\u0c4d: 1800-NAYI-SEVA
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between font-sans text-sm text-slate-700">
            <div className={te ? "font-telugu" : undefined}>
              {te ? "\u0c38\u0c4d\u0c25\u0c32\u0c02" : "Place"}: 
              <b>
                {areaName}, {distName}
              </b>
            </div>
            <div className={te ? "font-telugu" : undefined}>
              {te ? "\u0c24\u0c47\u0c26\u0c40" : "Date"}: 
              <b>{todayDate}</b>
            </div>
          </div>

          <div
            className={cn(
              "mb-6 space-y-1 font-sans text-sm",
              te && "font-telugu",
            )}
          >
            <div className="font-semibold">
              {te ? "\u0c38\u0c4d\u0c35\u0c40\u0c15\u0c30\u0c4d\u0c24 (To):" : "To:"}
            </div>
            <div className="text-base font-bold text-slate-950">
              {te ? currentAuthority.title_te : currentAuthority.title_en}
            </div>
            <div className="text-slate-800">
              {te ? currentAuthority.dept_te : currentAuthority.dept_en}
            </div>
            <div className="font-medium text-slate-800">
              {areaName}, {distName} \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e, \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c2e\u0c41.
            </div>
          </div>

          <div className="mb-6 space-y-2 border-l-4 border-slate-900 bg-slate-50 p-3.5 font-sans text-sm">
            <div className={te ? "font-telugu" : undefined}>
              <span className="font-bold text-slate-900">
                {te ? "\u0c35\u0c3f\u0c37\u0c2f\u0c2e\u0c41:" : "Subject:"}
              </span> 
              <span className="font-semibold text-slate-900">
                {te ? currentSubject.subj_te : currentSubject.subj_en}
              </span>
            </div>
            <div
              className={cn("text-xs text-slate-700", te && "font-telugu")}
            >
              <span className="font-bold">
                {te ? "\u0c09\u0c32\u0c4d\u0c32\u0c47\u0c16\u0c28 (Ref):" : "Reference:"}
              </span> 
              {te ? currentSubject.ref_te : currentSubject.ref_en}
            </div>
          </div>

          <div
            className={cn(
              "mb-4 font-sans text-sm font-bold",
              te && "font-telugu",
            )}
          >
            {te ? "\u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f \u0c17\u0c3e\u0c30\u0c3f\u0c15\u0c3f," : "Respected Sir/Madam,"}
          </div>

          <div
            className={cn(
              "mb-8 space-y-4 text-justify font-sans text-sm leading-relaxed sm:text-base",
              te && "font-telugu",
            )}
          >
            <p>
              {te ? (
                <>
                  \u0c2e\u0c3e 
                  {areaName}
                   \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b\u0c28\u0c3f \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c38\u0c3e\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c26\u0c41\u0c15\u0c3e\u0c23\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c38\u0c47\u0c35\u0c3e \u0c2a\u0c4d\u0c30\u0c24\u0c3f\u0c28\u0c3f\u0c27\u0c41\u0c32 \u0c24\u0c30\u0c2a\u0c41\u0c28 \u0c2a\u0c48 \u0c2a\u0c47\u0c30\u0c4d\u0c15\u0c4a\u0c28\u0c4d\u0c28 \u0c05\u0c02\u0c36\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c02\u0c2c\u0c02\u0c27\u0c3f\u0c02\u0c1a\u0c3f \u0c24\u0c2e\u0c30\u0c3f \u0c26\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c15\u0c3f \u0c08 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.
                </>
              ) : (
                <>
                  On behalf of traditional salon operators and community
                  coordinators of {areaName} ({distName} District), we
                  respectfully submit this formal representation regarding the
                  subject cited above.
                </>
              )}
            </p>
            <p>
              {te
                ? currentSubject.default_body_te
                : currentSubject.default_body_en}
            </p>
            {customNotes ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-1 text-xs font-bold uppercase text-slate-700">
                  {te ? "\u0c2a\u0c4d\u0c30\u0c24\u0c4d\u0c2f\u0c47\u0c15 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 / \u0c38\u0c4d\u0c25\u0c3e\u0c28\u0c3f\u0c15 \u0c35\u0c3f\u0c1c\u0c4d\u0c1e\u0c2a\u0c4d\u0c24\u0c3f:" : "Specific Field Details / Local Request:"}
                </div>
                <div className="whitespace-pre-line font-sans text-sm text-slate-900">
                  {customNotes}
                </div>
              </div>
            ) : null}
            <p>{te ? "\u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c2e\u0c3e \u0c35\u0c3f\u0c28\u0c4d\u0c28\u0c2a\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c30\u0c3f\u0c36\u0c40\u0c32\u0c3f\u0c02\u0c1a\u0c3f, \u0c24\u0c4d\u0c35\u0c30\u0c3f\u0c24\u0c17\u0c24\u0c3f\u0c28 \u0c38\u0c2e\u0c38\u0c4d\u0c2f \u0c2a\u0c30\u0c3f\u0c37\u0c4d\u0c15\u0c3e\u0c30\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c24\u0c17\u0c3f\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c1a\u0c30\u0c4d\u0c2f\u0c32\u0c41 \u0c1a\u0c47\u0c2a\u0c1f\u0c4d\u0c1f\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c30\u0c2a\u0c41\u0c28 \u0c38\u0c35\u0c3f\u0c28\u0c2f\u0c02\u0c17\u0c3e \u0c05\u0c2d\u0c4d\u0c2f\u0c30\u0c4d\u0c25\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41." : "Therefore, we humbly urge your good office to favorably examine our genuine representation and initiate prompt administrative action to redress this issue."}</p>
          </div>

          <div className="flex items-end justify-between pt-8 font-sans">
            <div
              className={cn(
                "text-xs text-slate-500",
                te && "font-telugu",
              )}
            >
              {te ? "\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c30\u0c3f\u0c1c\u0c3f\u0c38\u0c4d\u0c1f\u0c4d\u0c30\u0c40 \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c1c\u0c3e\u0c30\u0c40 \u0c1a\u0c47\u0c2f\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f" : "Issued via Nayi Samakhya Digital Desk"}
            </div>
            <div className="space-y-1 text-right">
              <div
                className={cn(
                  "text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}
              >
                {te ? "\u0c2d\u0c35\u0c26\u0c40\u0c2f\u0c41\u0c21\u0c41 / \u0c07\u0c1f\u0c4d\u0c32\u0c41," : "Yours faithfully,"}
              </div>
              <div
                className={cn(
                  "pt-8 text-base font-bold text-slate-950",
                  te && "font-telugu",
                )}
              >
                {signatoryName}
              </div>
              <div
                className={cn(
                  "text-xs font-semibold text-slate-800",
                  te && "font-telugu",
                )}
              >
                {signatoryRole}
              </div>
              <div
                className={cn("text-xs text-slate-600", te && "font-telugu")}
              >
                {areaName}, {distName}
              </div>
              <div className="text-xs text-slate-700">
                {te ? "\u0c2b\u0c4b\u0c28\u0c4d" : "Ph"}: 
                {signatoryPhone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
