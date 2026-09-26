"use client";

import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { listDistricts } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";
import {
  AUTHORITIES,
  SUBJECTS,
  UI,
  type AuthorityId,
  type SubjectId,
} from "@/lib/data/representationCopy";
import { listStaticUlbsForDistrict } from "@/lib/data/urbanDirectory";
import { useLanguageStore } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

type AreaType = "rural" | "urban";

function todayIso() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fieldClass(te: boolean) {
  return cn(
    "tap w-full rounded-xl border border-[#EBE8E0] bg-white px-3 py-2.5 text-sm text-[#18181B] focus:border-[#C2410C]/40 focus:outline-none",
    te && "font-telugu",
  );
}

export function RepresentationGenerator() {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const districts = useMemo(() => listDistricts(), []);

  const [districtSlug, setDistrictSlug] = useState(
    districts[0]?.slug || "adilabad",
  );
  const [areaType, setAreaType] = useState<AreaType>("rural");
  const [areaSlug, setAreaSlug] = useState("");
  const [authority, setAuthority] = useState<AuthorityId>("mro");
  const [subject, setSubject] = useState<SubjectId>("power");
  const [notes, setNotes] = useState("");
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryPhone, setSignatoryPhone] = useState("");

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

  const effectiveAreaSlug =
    areaSlug && areas.some((a) => a.slug === areaSlug)
      ? areaSlug
      : areas[0]?.slug || "";

  const district = districts.find((d) => d.slug === districtSlug);
  const area = areas.find((a) => a.slug === effectiveAreaSlug);
  const subjectMeta = SUBJECTS[subject];
  const authorityMeta = AUTHORITIES[authority];

  const refNo = useMemo(() => {
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    return `NS/REP/${(districtSlug || "TG").toUpperCase()}/${stamp}`;
  }, [districtSlug]);

  const canPrint = Boolean(
    district && area && signatoryName.trim() && signatoryPhone.trim(),
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9]">
      <section className="no-print border-b border-[#EBE8E0] bg-gradient-to-b from-[#FFF7ED] to-[#FBFBF9]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
            {te ? UI.eyebrow_te : "Official representation generator"}
          </p>
          <h1
            className={`mt-2 text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl ${te ? "font-telugu" : ""}`}
          >
            {te ? UI.title_te : "Petition & representation letter"}
          </h1>
          <p
            className={`mt-2 max-w-2xl text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
          >
            {te
              ? UI.lead_te
              : "Self-service formal letters for Mandal and Town Coordinators — bilingual, print-ready."}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <form
          className="no-print space-y-4 rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm sm:p-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.district_te : "District"}
            </span>
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
                  {te ? d.name_te : d.name_en}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-2">
            <legend
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.areaType_te : "Area type"}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["rural", te ? UI.rural_te : "Rural Mandal"],
                  ["urban", te ? UI.urban_te : "Urban Municipality"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setAreaType(id);
                    setAreaSlug("");
                    setAuthority(id === "urban" ? "commissioner" : "mro");
                  }}
                  className={cn(
                    "tap inline-flex min-h-[40px] items-center rounded-full border px-3.5 text-sm font-semibold",
                    areaType === id
                      ? "border-[#C2410C] bg-[#C2410C] text-white"
                      : "border-[#EBE8E0] bg-white text-[#18181B]",
                    te && "font-telugu",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.areaName_te : "Area name"}
            </span>
            <select
              value={effectiveAreaSlug}
              onChange={(e) => setAreaSlug(e.target.value)}
              className={fieldClass(te)}
              disabled={areas.length === 0}
            >
              {areas.length === 0 ? (
                <option value="">
                  {te ? UI.noUlb_te : "No ULBs seeded for this district"}
                </option>
              ) : (
                areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {te ? a.name_te : a.name_en}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.authority_te : "Addressing authority"}
            </span>
            <select
              value={authority}
              onChange={(e) => setAuthority(e.target.value as AuthorityId)}
              className={fieldClass(te)}
            >
              {(Object.keys(AUTHORITIES) as AuthorityId[]).map((id) => (
                <option key={id} value={id}>
                  {te ? AUTHORITIES[id].te : AUTHORITIES[id].en}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.subject_te : "Subject matter"}
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className={fieldClass(te)}
            >
              {(Object.keys(SUBJECTS) as SubjectId[]).map((id) => (
                <option key={id} value={id}>
                  {te ? SUBJECTS[id].te : SUBJECTS[id].en}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.notes_te : "Key details / notes"}
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={fieldClass(te)}
              placeholder={
                te ? UI.notesPh_te : "Facts, shop names, dates, request..."
              }
            />
          </label>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.signatory_te : "Signatory name"}
            </span>
            <input
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className={fieldClass(te)}
              placeholder={te ? UI.signatoryPh_te : "Coordinator name"}
            />
          </label>

          <label className="block space-y-1.5">
            <span
              className={`text-xs font-semibold text-[#71717A] ${te ? "font-telugu" : ""}`}
            >
              {te ? UI.phone_te : "Phone number"}
            </span>
            <input
              value={signatoryPhone}
              onChange={(e) => setSignatoryPhone(e.target.value)}
              inputMode="tel"
              className={fieldClass(false)}
              placeholder="9032654111"
            />
          </label>

          <button
            type="button"
            disabled={!canPrint}
            onClick={() => window.print()}
            className={cn(
              "tap inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white",
              canPrint
                ? "bg-[#C2410C] hover:bg-[#9A3412]"
                : "cursor-not-allowed bg-[#A1A1AA]",
              te && "font-telugu",
            )}
          >
            <Printer className="h-4 w-4" aria-hidden />
            {te ? UI.print_te : "Print / Download PDF"}
          </button>
          {!canPrint ? (
            <p className={`text-xs text-[#A1A1AA] ${te ? "font-telugu" : ""}`}>
              {te
                ? UI.needFields_te
                : "Select an area and enter signatory name & phone to print."}
            </p>
          ) : null}
        </form>

        <article className="print-document rounded-2xl border border-[#EBE8E0] bg-white p-5 shadow-sm sm:p-8">
          <header className="border-b-2 border-[#18181B] pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-telugu text-xl font-bold text-[#18181B]">
                  {UI.brand_te}
                </p>
                <p className="text-sm font-semibold tracking-wide text-[#C2410C]">
                  NAYI SAMAKHYA
                </p>
                <p className="mt-1 text-xs text-[#71717A]">
                  Civic coordination desk · Telangana
                </p>
              </div>
              <div className="text-right text-xs text-[#71717A]">
                <p>
                  <span className="font-semibold text-[#18181B]">Ref:</span>{" "}
                  {refNo}
                </p>
                <p>
                  <span className="font-semibold text-[#18181B]">Date:</span>{" "}
                  {todayIso()}
                </p>
              </div>
            </div>
          </header>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#18181B]">
            <p>
              <span className="font-semibold">To</span>
              <br />
              <span className="font-telugu">{authorityMeta.te}</span>
              <br />
              {authorityMeta.en}
              <br />
              <span className="font-telugu">
                {district?.name_te}
                {area ? ` · ${area.name_te}` : ""}
              </span>
              <br />
              {district?.name_en}
              {area ? ` · ${area.name_en}` : ""}
            </p>

            <p>
              <span className="font-semibold">Subject / </span>
              <span className="font-telugu font-semibold">
                {UI.subjectLabel_te}:
              </span>{" "}
              <span className="font-telugu">{subjectMeta.te}</span>
              {" — "}
              {subjectMeta.en}
            </p>

            <p className="text-xs text-[#71717A]">
              <span className="font-telugu">{subjectMeta.ref_te}</span>
              <br />
              {subjectMeta.ref_en}
            </p>

            <p className="font-telugu whitespace-pre-line">{UI.body_te}</p>

            <p>
              Respected Sir / Madam,
              <br />
              On behalf of Nayi Samakhya field coordination in the above area, we
              respectfully submit this representation regarding the subject
              cited. Kindly examine the matter and favour necessary
              administrative action.
            </p>

            {notes.trim() ? (
              <div className="rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] p-4">
                <p
                  className={`text-xs font-semibold uppercase tracking-wide text-[#C2410C] ${te ? "font-telugu" : ""}`}
                >
                  {te ? UI.keyDetails_te : "Key details"}
                </p>
                <p
                  className={`mt-2 whitespace-pre-wrap ${te ? "font-telugu" : ""}`}
                >
                  {notes.trim()}
                </p>
              </div>
            ) : null}

            <p className="font-telugu whitespace-pre-line">{UI.regards_te}</p>
            <p>
              With respectful regards,
              <br />
              Nayi Samakhya
            </p>

            <div className="mt-8 border-t border-[#EBE8E0] pt-4">
              <p className="font-semibold">{signatoryName || "—"}</p>
              <p className="font-telugu text-sm text-[#71717A]">
                {areaType === "urban"
                  ? UI.townCoord_te
                  : UI.mandalCoord_te}
              </p>
              <p className="text-sm text-[#71717A]">
                {area ? (te ? area.name_te : area.name_en) : ""}
                {district
                  ? ` · ${te ? district.name_te : district.name_en}`
                  : ""}
              </p>
              <p className="text-sm text-[#71717A]">
                Ph: {signatoryPhone || "—"}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
