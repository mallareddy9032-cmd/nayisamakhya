#!/usr/bin/env python3
"""Generate RepresentationLetterPage.tsx from UI JSON (ASCII-safe unicode escapes)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI_PATH = ROOT / "src/lib/data/representation-letter-ui.json"
OUT_PATH = ROOT / "src/components/RepresentationLetterPage.tsx"


def esc(s: str) -> str:
    out: list[str] = []
    for c in s:
        o = ord(c)
        if c == "\\":
            out.append("\\\\")
        elif c == '"':
            out.append('\\"')
        elif c == "\n":
            out.append("\\n")
        elif o < 32 or o > 126:
            out.append(f"\\u{o:04x}")
        else:
            out.append(c)
    return "".join(out)


def main() -> None:
    ui = json.loads(UI_PATH.read_text(encoding="utf-8"))
    required = [
        "title_te",
        "title_en",
        "sub_te",
        "sub_en",
        "te_btn",
        "dist_te",
        "dist_en",
        "area_type_te",
        "area_type_en",
        "rural_te",
        "rural_en",
        "urban_te",
        "urban_en",
        "mandal_te",
        "mandal_en",
        "ulb_te",
        "ulb_en",
        "auth_te",
        "auth_en",
        "subj_te",
        "subj_en",
        "notes_te",
        "notes_en",
        "notes_ph_te",
        "notes_ph_en",
        "sign_name_te",
        "sign_name_en",
        "sign_role_te",
        "sign_role_en",
        "sign_phone_te",
        "sign_phone_en",
        "print_te",
        "print_en",
        "brand_te",
        "brand_en",
        "tag_te",
        "tag_en",
        "webline",
        "place_te",
        "place_en",
        "date_te",
        "date_en",
        "to_te",
        "to_en",
        "district_suffix",
        "subj_label_te",
        "subj_label_en",
        "ref_label_te",
        "ref_label_en",
        "sal_te",
        "sal_en",
        "intro_te_prefix",
        "intro_te_suffix",
        "closing_te",
        "closing_en",
        "field_te",
        "field_en",
        "issued_te",
        "issued_en",
        "yours_te",
        "yours_en",
        "phone_te",
        "phone_en",
        "default_name",
        "default_role",
    ]
    missing = [k for k in required if k not in ui]
    if missing:
        raise SystemExit(f"Missing UI keys: {missing}")

    def q(key: str) -> str:
        return esc(ui[key])

    def qs(key: str) -> str:
        """JS string literal including surrounding quotes."""
        return '"' + esc(ui[key]) + '"'

    tsx = f'''"use client";

import {{ useMemo, useState }} from "react";
import {{ listDistricts }} from "@/lib/data/districts";
import {{ listMandalsForDistrict }} from "@/lib/data/mandalsDirectory";
import {{
  AUTHORITIES,
  SUBJECT_OPTIONS,
  type Language,
}} from "@/lib/data/representationLetterOptions";
import {{ listStaticUlbsForDistrict }} from "@/lib/data/urbanDirectory";
import {{ cn }} from "@/lib/utils";

type AreaType = "rural" | "urban";

function fieldClass(te: boolean) {{
  return cn(
    "tap w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
    te && "font-telugu",
  );
}}

export function RepresentationLetterPage() {{
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
  const [signatoryName, setSignatoryName] = useState("{q("default_name")}");
  const [signatoryRole, setSignatoryRole] = useState("{q("default_role")}");
  const [signatoryPhone, setSignatoryPhone] = useState("9032654111");

  const areas = useMemo(() => {{
    if (areaType === "urban") {{
      return listStaticUlbsForDistrict(districtSlug).map((u) => ({{
        slug: u.slug,
        name_en: u.name_en,
        name_te: u.name_te,
      }}));
    }}
    return listMandalsForDistrict(districtSlug).map((m) => ({{
      slug: m.slug,
      name_en: m.name_en,
      name_te: m.name_te,
    }}));
  }}, [areaType, districtSlug]);

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

  const todayDate = new Date().toLocaleDateString(te ? "te-IN" : "en-IN", {{
    day: "2-digit",
    month: "long",
    year: "numeric",
  }});

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="no-print space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <h1
                className={{cn(
                  "text-xl font-bold text-slate-900",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("title_te")}" : "{q("title_en")}"}}
              </h1>
              <p
                className={{cn(
                  "mt-1 text-xs text-slate-500",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("sub_te")}" : "{q("sub_en")}"}}
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={{() => setLang("te")}}
                className={{cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition font-telugu",
                  te
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                )}}
              >
                {{{qs("te_btn")}}}
              </button>
              <button
                type="button"
                onClick={{() => setLang("en")}}
                className={{cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition",
                  !te
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                )}}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("dist_te")}" : "{q("dist_en")}"}}
              </label>
              <select
                value={{districtSlug}}
                onChange={{(e) => {{
                  setDistrictSlug(e.target.value);
                  setAreaSlug("");
                }}}}
                className={{fieldClass(te)}}
              >
                {{districts.map((d) => (
                  <option key={{d.slug}} value={{d.slug}}>
                    {{te && d.name_te
                      ? `${{d.name_te}} (${{d.name_en}})`
                      : d.name_en}}
                  </option>
                ))}}
              </select>
            </div>
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("area_type_te")}" : "{q("area_type_en")}"}}
              </label>
              <select
                value={{areaType}}
                onChange={{(e) => {{
                  setAreaType(e.target.value as AreaType);
                  setAreaSlug("");
                }}}}
                className={{fieldClass(te)}}
              >
                <option value="rural">
                  {{te ? "{q("rural_te")}" : "{q("rural_en")}"}}
                </option>
                <option value="urban">
                  {{te ? "{q("urban_te")}" : "{q("urban_en")}"}}
                </option>
              </select>
            </div>
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{areaType === "rural"
                  ? te
                    ? "{q("mandal_te")}"
                    : "{q("mandal_en")}"
                  : te
                    ? "{q("ulb_te")}"
                    : "{q("ulb_en")}"}}
              </label>
              <select
                value={{selectedAreaSlug}}
                onChange={{(e) => setAreaSlug(e.target.value)}}
                className={{fieldClass(te)}}
              >
                {{areas.map((a) => (
                  <option key={{a.slug}} value={{a.slug}}>
                    {{te && a.name_te
                      ? `${{a.name_te}} (${{a.name_en}})`
                      : a.name_en}}
                  </option>
                ))}}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("auth_te")}" : "{q("auth_en")}"}}
              </label>
              <select
                value={{authorityId}}
                onChange={{(e) => setAuthorityId(e.target.value)}}
                className={{fieldClass(te)}}
              >
                {{AUTHORITIES.map((a) => (
                  <option key={{a.id}} value={{a.id}}>
                    {{te ? a.title_te : a.title_en}}
                  </option>
                ))}}
              </select>
            </div>
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("subj_te")}" : "{q("subj_en")}"}}
              </label>
              <select
                value={{subjectId}}
                onChange={{(e) => setSubjectId(e.target.value)}}
                className={{fieldClass(te)}}
              >
                {{SUBJECT_OPTIONS.map((s) => (
                  <option key={{s.id}} value={{s.id}}>
                    {{te ? s.subj_te : s.subj_en}}
                  </option>
                ))}}
              </select>
            </div>
          </div>

          <div>
            <label
              className={{cn(
                "mb-1 block text-xs font-semibold text-slate-700",
                te && "font-telugu",
              )}}
            >
              {{te ? "{q("notes_te")}" : "{q("notes_en")}"}}
            </label>
            <textarea
              rows={{3}}
              value={{customNotes}}
              onChange={{(e) => setCustomNotes(e.target.value)}}
              placeholder={{
                te ? "{q("notes_ph_te")}" : "{q("notes_ph_en")}"
              }}
              className={{cn(fieldClass(te), "p-3")}}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("sign_name_te")}" : "{q("sign_name_en")}"}}
              </label>
              <input
                type="text"
                value={{signatoryName}}
                onChange={{(e) => setSignatoryName(e.target.value)}}
                className={{fieldClass(te)}}
              />
            </div>
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("sign_role_te")}" : "{q("sign_role_en")}"}}
              </label>
              <input
                type="text"
                value={{signatoryRole}}
                onChange={{(e) => setSignatoryRole(e.target.value)}}
                className={{fieldClass(te)}}
              />
            </div>
            <div>
              <label
                className={{cn(
                  "mb-1 block text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("sign_phone_te")}" : "{q("sign_phone_en")}"}}
              </label>
              <input
                type="text"
                value={{signatoryPhone}}
                onChange={{(e) => setSignatoryPhone(e.target.value)}}
                className={{fieldClass(false)}}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={{() => window.print()}}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {{te ? "{q("print_te")}" : "{q("print_en")}"}}
            </button>
          </div>
        </div>

        <div className="printable-card print-document rounded-2xl border border-slate-200 bg-white p-8 font-serif leading-relaxed text-slate-900 shadow-md sm:p-10">
          <div className="mb-6 border-b-2 border-slate-900 pb-4 text-center">
            <div
              className={{cn(
                "text-xl font-bold tracking-tight text-slate-900 sm:text-2xl",
                te && "font-telugu",
              )}}
            >
              {{te ? "{q("brand_te")}" : "{q("brand_en")}"}}
            </div>
            <div
              className={{cn(
                "mt-1 font-sans text-xs uppercase tracking-widest text-slate-600",
                te && "font-telugu normal-case tracking-normal",
              )}}
            >
              {{te ? "{q("tag_te")}" : "{q("tag_en")}"}}
            </div>
            <div className="mt-1 font-sans font-telugu text-[11px] text-slate-500">
              {{{qs("webline")}}}
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between font-sans text-sm text-slate-700">
            <div className={{te ? "font-telugu" : undefined}}>
              {{te ? "{q("place_te")}" : "{q("place_en")}"}}:{" "}
              <b>
                {{areaName}}, {{distName}}
              </b>
            </div>
            <div className={{te ? "font-telugu" : undefined}}>
              {{te ? "{q("date_te")}" : "{q("date_en")}"}}:{" "}
              <b>{{todayDate}}</b>
            </div>
          </div>

          <div
            className={{cn(
              "mb-6 space-y-1 font-sans text-sm",
              te && "font-telugu",
            )}}
          >
            <div className="font-semibold">
              {{te ? "{q("to_te")}" : "{q("to_en")}"}}
            </div>
            <div className="text-base font-bold text-slate-950">
              {{te ? currentAuthority.title_te : currentAuthority.title_en}}
            </div>
            <div className="text-slate-800">
              {{te ? currentAuthority.dept_te : currentAuthority.dept_en}}
            </div>
            <div className="font-medium text-slate-800">
              {{areaName}}, {{distName}} {{{qs("district_suffix")}}}
            </div>
          </div>

          <div className="mb-6 space-y-2 border-l-4 border-slate-900 bg-slate-50 p-3.5 font-sans text-sm">
            <div className={{te ? "font-telugu" : undefined}}>
              <span className="font-bold text-slate-900">
                {{te ? "{q("subj_label_te")}" : "{q("subj_label_en")}"}}
              </span>{" "}
              <span className="font-semibold text-slate-900">
                {{te ? currentSubject.subj_te : currentSubject.subj_en}}
              </span>
            </div>
            <div
              className={{cn("text-xs text-slate-700", te && "font-telugu")}}
            >
              <span className="font-bold">
                {{te ? "{q("ref_label_te")}" : "{q("ref_label_en")}"}}
              </span>{" "}
              {{te ? currentSubject.ref_te : currentSubject.ref_en}}
            </div>
          </div>

          <div
            className={{cn(
              "mb-4 font-sans text-sm font-bold",
              te && "font-telugu",
            )}}
          >
            {{te ? "{q("sal_te")}" : "{q("sal_en")}"}}
          </div>

          <div
            className={{cn(
              "mb-8 space-y-4 text-justify font-sans text-sm leading-relaxed sm:text-base",
              te && "font-telugu",
            )}}
          >
            <p>
              {{te
                ? `{q("intro_te_prefix")}${{areaName}}{q("intro_te_suffix")}`
                : `On behalf of traditional salon operators and community coordinators of ${{areaName}} (${{distName}} District), we respectfully submit this formal representation regarding the subject cited above.`}}
            </p>
            <p>
              {{te
                ? currentSubject.default_body_te
                : currentSubject.default_body_en}}
            </p>
            {{customNotes ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-1 text-xs font-bold uppercase text-slate-700">
                  {{te ? "{q("field_te")}" : "{q("field_en")}"}}
                </div>
                <div className="whitespace-pre-line font-sans text-sm text-slate-900">
                  {{customNotes}}
                </div>
              </div>
            ) : null}}
            <p>{{te ? "{q("closing_te")}" : "{q("closing_en")}"}}</p>
          </div>

          <div className="flex items-end justify-between pt-8 font-sans">
            <div
              className={{cn(
                "text-xs text-slate-500",
                te && "font-telugu",
              )}}
            >
              {{te ? "{q("issued_te")}" : "{q("issued_en")}"}}
            </div>
            <div className="space-y-1 text-right">
              <div
                className={{cn(
                  "text-xs font-semibold text-slate-700",
                  te && "font-telugu",
                )}}
              >
                {{te ? "{q("yours_te")}" : "{q("yours_en")}"}}
              </div>
              <div
                className={{cn(
                  "pt-8 text-base font-bold text-slate-950",
                  te && "font-telugu",
                )}}
              >
                {{signatoryName}}
              </div>
              <div
                className={{cn(
                  "text-xs font-semibold text-slate-800",
                  te && "font-telugu",
                )}}
              >
                {{signatoryRole}}
              </div>
              <div
                className={{cn("text-xs text-slate-600", te && "font-telugu")}}
              >
                {{areaName}}, {{distName}}
              </div>
              <div className="text-xs text-slate-700">
                {{te ? "{q("phone_te")}" : "{q("phone_en")}"}}:{" "}
                {{signatoryPhone}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}}
'''

    OUT_PATH.write_text(tsx, encoding="utf-8")
    text = OUT_PATH.read_text(encoding="utf-8")
    if "\ufffd" in text:
        raise SystemExit("Generated file contains replacement characters")
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
