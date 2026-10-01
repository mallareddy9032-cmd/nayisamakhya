"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Landmark,
  Loader2,
  Printer,
  Scale,
  Zap,
} from "lucide-react";
import {
  GRIEVANCE_TYPES,
  getGrievanceType,
  subjectForUscno,
  type DiscomId,
  type GrievanceFormState,
  type GrievanceTypeId,
} from "@/types/grievance";
import {
  buildLocalRecord,
  defaultFormState,
  districtLabel,
  districtOptions,
  formatOfficialDate,
  grievanceTypeLabel,
  isValidMobile,
  isValidUscno,
  mandalLabel,
  mandalOptions,
  persistLocalGrievance,
  suggestDiscom,
} from "@/lib/grievance/store";
import { cn } from "@/lib/utils";

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block font-telugu text-xs font-semibold text-slate-700"
    >
      {children}
      {required ? (
        <span className="ml-0.5 text-[#B45309]" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-telugu text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20";

export function GrievanceDocketClient() {
  const [form, setForm] = useState<GrievanceFormState>(() => defaultFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dispatching, setDispatching] = useState(false);
  const [dispatchNote, setDispatchNote] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const districts = useMemo(() => districtOptions(), []);
  const mandals = useMemo(
    () => mandalOptions(form.districtSlug),
    [form.districtSlug],
  );

  const grievance = getGrievanceType(form.grievanceType);
  const districtTe = districtLabel(form.districtSlug, true);
  const mandalTe = mandalLabel(form.districtSlug, form.mandalSlug, true);
  const subject = subjectForUscno(grievance, form.uscno);
  const officialDate = formatOfficialDate();

  useEffect(() => {
    if (!mandals.some((m) => m.slug === form.mandalSlug)) {
      setForm((prev) => ({
        ...prev,
        mandalSlug: mandals[0]?.slug || "",
      }));
    }
  }, [mandals, form.mandalSlug]);

  function patch<K extends keyof GrievanceFormState>(
    key: K,
    value: GrievanceFormState[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "districtSlug") {
        const slug = String(value);
        next.discom = suggestDiscom(slug);
        const nextMandals = mandalOptions(slug);
        next.mandalSlug = nextMandals[0]?.slug || "";
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const copy = { ...prev };
      delete copy[key as string];
      return copy;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "పూర్తి పేరు అవసరం";
    if (!form.shopName.trim()) next.shopName = "షాపు పేరు అవసరం";
    if (!isValidMobile(form.mobile)) {
      next.mobile = "10 అంకెల ఫోన్ నంబర్ ఇవ్వండి";
    }
    if (!form.districtSlug) next.districtSlug = "జిల్లా ఎంచుకోండి";
    if (!form.mandalSlug) next.mandalSlug = "మండలం ఎంచుకోండి";
    if (!isValidUscno(form.uscno)) {
      next.uscno = "10–12 అంకెల USCNO ఇవ్వండి";
    }
    if (!form.connectedLoad.trim()) {
      next.connectedLoad = "కనెక్టెడ్ లోడ్ అవసరం";
    }
    if (!form.avgMonthlyUnits.trim()) {
      next.avgMonthlyUnits = "సగటు యూనిట్లు అవసరం";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function dispatchWarRoom(refId: string) {
    setDispatching(true);
    setDispatchNote(null);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "grievance",
          fullName: form.fullName.trim(),
          shopName: form.shopName.trim(),
          uscno: form.uscno.replace(/\D/g, ""),
          mandal: mandalTe,
          district: districtTe,
          grievanceType: grievanceTypeLabel(form.grievanceType),
          grievanceTypeId: form.grievanceType,
          discom: form.discom,
          mobile: form.mobile.replace(/\D/g, ""),
          connectedLoad: form.connectedLoad.trim(),
          avgMonthlyUnits: form.avgMonthlyUnits.trim(),
          narrative: form.narrative.trim(),
          districtSlug: form.districtSlug,
          mandalSlug: form.mandalSlug,
          referenceId: refId,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        telegram?: { ok?: boolean; skipped?: boolean };
        database?: { persisted?: boolean };
      } | null;
      if (!res.ok || !data?.ok) {
        setDispatchNote("వార్ రూమ్ అలర్ట్ పంపలేకపోయాం — లేఖ ప్రింట్ అయింది.");
        return;
      }
      const bits: string[] = [];
      if (data.telegram?.ok) bits.push("టెలిగ్రామ్ అలర్ట్");
      else if (data.telegram?.skipped) bits.push("టెలిగ్రామ్ స్కిప్");
      if (data.database?.persisted) bits.push("డేటాబేస్");
      else bits.push("లోకల్ సేవ్");
      setDispatchNote(`War Room sync: ${bits.join(" · ")}`);
    } catch {
      setDispatchNote("నెట్‌వర్క్ లోపం — లేఖ ప్రింట్ అయింది; లోకల్‌లో సేవ్.");
    } finally {
      setDispatching(false);
    }
  }

  async function handlePrint() {
    if (!validate()) {
      setDispatchNote("దయచేసి అవసరమైన ఫీల్డ్‌లు పూరించండి.");
      return;
    }

    const record = buildLocalRecord({
      ...form,
      uscno: form.uscno.replace(/\D/g, ""),
      mobile: form.mobile.replace(/\D/g, ""),
    });
    persistLocalGrievance(record);
    setReferenceId(record.referenceId);

    // Fire-and-forget War Room; print must not wait on Telegram/Supabase.
    void dispatchWarRoom(record.referenceId);

    window.setTimeout(() => {
      window.print();
    }, 120);
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="tap inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-telugu text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          హోమ్
        </Link>
        <Link
          href="/representation?subject=go23_free_power"
          className="tap inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-2 font-telugu text-xs font-semibold text-[#B45309] hover:bg-[#B45309]/15"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden />
          సాధారణ వినతిపత్రం
        </Link>
      </div>

      <header className="no-print max-w-3xl print:hidden">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-1 font-telugu text-xs font-semibold text-[#B45309]">
          <Scale className="h-3.5 w-3.5" aria-hidden />
          G.O. Ms. No. 23 · BC Welfare · DISCOM ADE Docket
        </p>
        <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-slate-900 sm:text-4xl">
          జీవో 23 ఫిర్యాదు డాకెట్
        </h1>
        <p className="mt-2 text-lg text-[#B45309]">
          Grievance Docket Generator · Formal Statutory Representation
        </p>
        <p className="mt-3 font-telugu text-sm leading-relaxed text-slate-600 sm:text-base">
          సెలూన్ USCNO, లోడ్, యూనిట్లు నమోదు చేసి ADEకి అధికారిక తెలుగు
          ప్రాతినిధ్య లేఖను A4లో ప్రింట్ / PDFగా సేవ్ చేయండి. వార్ రూమ్‌కు
          ఆటోమేటిక్ అలర్ట్ వెళ్తుంది.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* LEFT — Intake */}
        <section
          className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 print:hidden"
          aria-labelledby="grievance-intake-heading"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="h-5 w-5 text-[#B45309]" aria-hidden />
            <h2
              id="grievance-intake-heading"
              className="font-display-te text-xl font-normal text-slate-900"
            >
              వినతి నమోదు · Intake
            </h2>
          </div>

          <div className="space-y-4">
            <fieldset>
              <legend className="mb-2 font-telugu text-xs font-semibold text-slate-700">
                ఫిర్యాదు రకం · Grievance Type *
              </legend>
              <div className="grid gap-2">
                {GRIEVANCE_TYPES.map((opt) => {
                  const selected = form.grievanceType === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-xl border px-3 py-3 transition",
                        selected
                          ? "border-[#B45309] bg-[#B45309]/5 ring-1 ring-[#B45309]/30"
                          : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="grievanceType"
                        className="mt-1"
                        checked={selected}
                        onChange={() =>
                          patch("grievanceType", opt.id as GrievanceTypeId)
                        }
                      />
                      <span className="min-w-0">
                        <span className="block font-telugu text-sm font-semibold text-slate-900">
                          Option {opt.option}: {opt.titleTe}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {opt.titleEn}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <FieldLabel htmlFor="fullName" required>
                Applicant Full Name (పూర్తి పేరు)
              </FieldLabel>
              <input
                id="fullName"
                className={inputClass}
                value={form.fullName}
                onChange={(e) => patch("fullName", e.target.value)}
                placeholder="ఉదా: రాము మునుగోటి"
                autoComplete="name"
              />
              {errors.fullName ? (
                <p className="mt-1 font-telugu text-xs text-red-600">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <FieldLabel htmlFor="shopName" required>
                Barber Shop / Salon Name (షాపు పేరు)
              </FieldLabel>
              <input
                id="shopName"
                className={inputClass}
                value={form.shopName}
                onChange={(e) => patch("shopName", e.target.value)}
                placeholder="ఉదా: శ్రీ నాయి సెలూన్"
              />
              {errors.shopName ? (
                <p className="mt-1 font-telugu text-xs text-red-600">
                  {errors.shopName}
                </p>
              ) : null}
            </div>

            <div>
              <FieldLabel htmlFor="mobile" required>
                Mobile / WhatsApp Number (ఫోన్ నంబర్)
              </FieldLabel>
              <input
                id="mobile"
                className={inputClass}
                inputMode="numeric"
                maxLength={14}
                value={form.mobile}
                onChange={(e) => patch("mobile", e.target.value)}
                placeholder="10 అంకెలు"
              />
              {errors.mobile ? (
                <p className="mt-1 font-telugu text-xs text-red-600">
                  {errors.mobile}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="district" required>
                  District (జిల్లా)
                </FieldLabel>
                <select
                  id="district"
                  className={inputClass}
                  value={form.districtSlug}
                  onChange={(e) => patch("districtSlug", e.target.value)}
                >
                  {districts.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.nameTe} ({d.nameEn})
                    </option>
                  ))}
                </select>
                {errors.districtSlug ? (
                  <p className="mt-1 font-telugu text-xs text-red-600">
                    {errors.districtSlug}
                  </p>
                ) : null}
              </div>
              <div>
                <FieldLabel htmlFor="mandal" required>
                  Mandal (మండలం)
                </FieldLabel>
                <select
                  id="mandal"
                  className={inputClass}
                  value={form.mandalSlug}
                  onChange={(e) => patch("mandalSlug", e.target.value)}
                >
                  {mandals.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.nameTe} ({m.nameEn})
                    </option>
                  ))}
                </select>
                {errors.mandalSlug ? (
                  <p className="mt-1 font-telugu text-xs text-red-600">
                    {errors.mandalSlug}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="discom" required>
                DISCOM
              </FieldLabel>
              <select
                id="discom"
                className={inputClass}
                value={form.discom}
                onChange={(e) => patch("discom", e.target.value as DiscomId)}
              >
                <option value="TGSPDCL">TGSPDCL (South / Central)</option>
                <option value="TGNPDCL">TGNPDCL (North)</option>
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="uscno" required>
                Electricity Service Number / USCNO
              </FieldLabel>
              <input
                id="uscno"
                className={cn(inputClass, "font-mono tracking-wide")}
                inputMode="numeric"
                maxLength={14}
                value={form.uscno}
                onChange={(e) => patch("uscno", e.target.value)}
                placeholder="10–12 digit USCNO"
              />
              {errors.uscno ? (
                <p className="mt-1 font-telugu text-xs text-red-600">
                  {errors.uscno}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="connectedLoad" required>
                  Connected Load (kW / HP)
                </FieldLabel>
                <input
                  id="connectedLoad"
                  className={inputClass}
                  value={form.connectedLoad}
                  onChange={(e) => patch("connectedLoad", e.target.value)}
                  placeholder="1 kW"
                />
                {errors.connectedLoad ? (
                  <p className="mt-1 font-telugu text-xs text-red-600">
                    {errors.connectedLoad}
                  </p>
                ) : null}
              </div>
              <div>
                <FieldLabel htmlFor="avgUnits" required>
                  Avg Monthly Units
                </FieldLabel>
                <input
                  id="avgUnits"
                  className={inputClass}
                  value={form.avgMonthlyUnits}
                  onChange={(e) => patch("avgMonthlyUnits", e.target.value)}
                  placeholder="180"
                />
                {errors.avgMonthlyUnits ? (
                  <p className="mt-1 font-telugu text-xs text-red-600">
                    {errors.avgMonthlyUnits}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="narrative">
                Specific Grievance Details (సమస్య వివరాలు)
              </FieldLabel>
              <textarea
                id="narrative"
                rows={4}
                className={inputClass}
                value={form.narrative}
                onChange={(e) => patch("narrative", e.target.value)}
                placeholder="బిల్లు నెల, నోటీస్ తేదీ, మీటర్ సమస్య వివరాలు…"
              />
            </div>

            <button
              type="button"
              onClick={() => void handlePrint()}
              disabled={dispatching}
              className="tap no-print flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 font-telugu text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-70 print:hidden sm:text-base"
            >
              {dispatching ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              ) : (
                <Printer className="h-5 w-5" aria-hidden />
              )}
              📄 అధికారిక లేఖ ప్రింట్ / సేవ్ చేయండి (Print Representation Letter)
            </button>

            {dispatchNote ? (
              <p
                className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-telugu text-xs text-slate-700"
                role="status"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <span>
                  {dispatchNote}
                  {referenceId ? (
                    <>
                      {" "}
                      · Ref: <span className="font-mono">{referenceId}</span>
                    </>
                  ) : null}
                </span>
              </p>
            ) : null}
          </div>
        </section>

        {/* RIGHT — Printable A4 Docket */}
        <section className="lg:sticky lg:top-4">
          <p className="no-print mb-3 font-telugu text-xs font-semibold uppercase tracking-wide text-slate-500 print:hidden">
            A4 Preview · అధికారిక ప్రాతినిధ్య దరఖాస్తు
          </p>
          <article
            id="grievance-docket-print"
            data-print-id="grievance-docket-print"
            className="print-only-document print-document printable-card civic-watermark mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col overflow-hidden rounded-lg border border-slate-300 bg-white p-6 shadow-xl sm:p-8 print:m-0 print:h-auto print:max-h-none print:min-h-0 print:w-full print:max-w-none print:overflow-visible print:rounded-none print:border-none print:p-0 print:shadow-none"
            aria-label="Formal statutory representation letter"
          >
            <header className="print-docket-header border-b-2 border-slate-900 pb-3 text-center">
              <p className="font-mono text-[10px] font-bold tracking-wide text-slate-600">
                Ref: {referenceId || "NS-GO23-DRAFT"} ·{" "}
                {form.discom} · nayisamakhya.org/grievance
              </p>
              <h2 className="mt-2 font-display-te text-xl font-normal leading-snug text-slate-900 sm:text-2xl print:text-[18pt]">
                రాతపూర్వక ప్రాతినిధ్య దరఖాస్తు
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                FORMAL STATUTORY REPRESENTATION
              </p>
              <p className="mt-2 font-telugu text-sm font-semibold leading-relaxed text-slate-800 print:text-[11pt]">
                జీవో ఎం.ఎస్. నం. 23 (బి.సి. సంక్షేమ శాఖ) ప్రకారం 250 యూనిట్ల
                ఉచిత విద్యుత్ హక్కు రక్షణార్థం
              </p>
              <p className="mt-1 font-telugu text-xs text-slate-500">
                తేదీ: {officialDate} · నాయీ సమాఖ్య తెలంగాణ డిజిటల్ డెస్క్
              </p>
            </header>

            <div className="mt-4 space-y-1 font-telugu text-sm leading-relaxed text-slate-900 print:text-[11pt] print:leading-snug">
              <p className="font-semibold">గౌరవనీయులైన,</p>
              <p>
                సహాయ డివిజనల్ ఇంజనీర్ (ADE - Operations), విద్యుత్ పంపిణీ సంస్థ (
                {form.discom}), {mandalTe} / డివిజన్, {districtTe} జిల్లా,
                తెలంగాణ రాష్ట్రం.
              </p>
              <p className="mt-3 font-semibold text-slate-700">కాపీ:</p>
              <p>
                జిల్లా బీసీ సంక్షేమాధికారి (DBCWO), {districtTe} కలెక్టరేట్.
              </p>
            </div>

            <div className="mt-4 rounded border border-slate-300 bg-slate-50 px-3 py-2 font-telugu text-sm leading-relaxed text-slate-900 print:text-[10.5pt]">
              <p>
                <span className="font-bold">విషయం:</span> {subject}
              </p>
            </div>

            <div className="mt-4 flex-1 space-y-3 font-telugu text-sm leading-relaxed text-slate-900 print:text-[10.5pt] print:leading-snug">
              <p>మాన్యులైన అధికారి గారికి,</p>
              <p>
                తెలంగాణ రాష్ట్ర ప్రభుత్వం బి.సి. సంక్షేమ శాఖ ద్వారా జారీ చేసిన{" "}
                <strong>జీవో ఎం.ఎస్. నం. 23 (G.O. Ms. No. 23)</strong> ప్రకారం
                అర్హతగల హెయిర్ కటింగ్ సెలూన్లకు నెలకు{" "}
                <strong>250 యూనిట్ల ఉచిత విద్యుత్</strong> మంజూరు చేయబడింది. ఈ
                సౌకర్యం కులాధారిత స్వయం ఉపాధి మరియు కుటీర వృత్తి జీవనోపాధికి
                అవసరమైన ప్రాథమిక హక్కు.
              </p>
              <p>
                నేను <strong>{form.fullName.trim() || "____________"}</strong>,{" "}
                <strong>{form.shopName.trim() || "____________"}</strong>{" "}
                యజమానిని. నా విద్యుత్ సర్వీస్ నంబర్ (USCNO):{" "}
                <strong className="font-mono">
                  {form.uscno.replace(/\D/g, "") || "____________"}
                </strong>
                . ప్రస్తుత కనెక్టెడ్ లోడ్:{" "}
                <strong>{form.connectedLoad.trim() || "—"}</strong>. సగటు నెలవారీ
                వినియోగం:{" "}
                <strong>{form.avgMonthlyUnits.trim() || "—"} యూనిట్లు</strong>.
                ప్రాంతం: {mandalTe}, {districtTe} · DISCOM: {form.discom}. సంప్రదింపు:{" "}
                {form.mobile.replace(/\D/g, "") || "—"}.
              </p>
              <p>
                <strong>ఫిర్యాదు సారాంశం (Option {grievance.option}):</strong>{" "}
                {grievance.titleTe}. {grievance.bodyFocusTe}
              </p>
              {form.narrative.trim() ? (
                <p>
                  <strong>అదనపు వివరాలు:</strong> {form.narrative.trim()}
                </p>
              ) : null}
              <p>
                కావున గౌరవపూర్వకంగా కోరేది ఏమనగా — (1) బిల్లింగ్ కేటగిరీ / సబ్సిడీ
                ఫ్లాగ్‌ను జీవో 23 ప్రకారం సరిదిద్దవలసినది; (2) గత అధిక వసూళ్లపై
                క్రెడిట్ సర్దుబాటు చేయవలసినది; (3) వినతి పరిష్కారం వరకు బలవంతపు
                డిస్‌కనెక్షన్ నివారించవలసినది.
              </p>
              <p>ధన్యవాదములతో,</p>
            </div>

            <footer className="print-signature-block mt-6 grid grid-cols-2 gap-4 border-t border-slate-300 pt-4 font-telugu text-xs text-slate-800 print:mt-4 print:text-[9pt]">
              <div>
                <p className="font-semibold">దరఖాస్తుదారు సంతకం</p>
                <p className="mt-8 tracking-widest text-slate-400">
                  ____________________
                </p>
                <p className="mt-2">{form.fullName.trim() || "పేరు"}</p>
                <p>{form.shopName.trim() || "షాపు పేరు"}</p>
                <p className="mt-1">తేదీ: {officialDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">స్టాంప్ / ముద్ర స్థలం</p>
                <div className="mt-2 ml-auto flex h-20 w-28 items-center justify-center rounded border border-dashed border-slate-400 text-[10px] text-slate-400">
                  <Landmark className="mr-1 h-3 w-3" aria-hidden />
                  Stamp
                </div>
              </div>
            </footer>

            <section
              aria-label="రసీదు"
              className="print-receiving-stamp print-seal-block mt-5 break-inside-avoid border-2 border-slate-800 print:mt-3"
            >
              <p className="border-b border-slate-800 bg-slate-100 px-2 py-1 text-center font-telugu text-[10px] font-bold tracking-wide text-slate-900 print:text-[9px]">
                రసీదు · Acknowledgement Receipt (DISCOM సబ్-స్టేషన్ క్లర్క్)
              </p>
              <div className="grid grid-cols-1 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="min-h-[4rem] p-3 font-telugu text-[11px] leading-relaxed print:min-h-[3rem] print:p-2 print:text-[9px]">
                  <p className="font-semibold">
                    స్వీకరించిన అధికారి సంతకం &amp; కార్యాలయ ముద్ర:
                  </p>
                  <p className="mt-6 tracking-widest text-slate-400 print:mt-4">
                    ____________________
                  </p>
                </div>
                <div className="min-h-[4rem] p-3 font-telugu text-[11px] leading-relaxed print:min-h-[3rem] print:p-2 print:text-[9px]">
                  <p className="font-semibold">స్వీకరించిన తేదీ:</p>
                  <p className="mt-1 tracking-wider">____/____/20__</p>
                  <p className="mt-3 font-semibold">డైరీ / కంప్యూటర్ నంబర్:</p>
                  <p className="mt-1 tracking-widest text-slate-400">
                    ____________
                  </p>
                </div>
              </div>
            </section>
          </article>
        </section>
      </div>
    </div>
  );
}
