"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  Printer,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { AUTHORITIES } from "@/lib/data/representationLetterOptions";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";
import {
  PDF_LOADING_TE,
  IN_APP_PRINT_BANNER_TE,
  OPEN_IN_BROWSER_BTN_TE,
  PETITION_PDF_FILENAME,
  downloadPetitionPdf,
  isInAppWebView,
  isTelegramWebApp,
  openCurrentPageExternally,
  shouldUsePdfFallback,
} from "@/lib/twa/printPetitionPdf";

type WizardStep = 1 | 2 | 3;

interface GrievancePreset {
  id: string;
  title: string;
  subject: string;
  body: string;
}

/** Exactly four one-tap Telugu grievance presets for low-friction filing. */
const GRIEVANCE_PRESETS: GrievancePreset[] = [
  {
    id: "go23_free_power",
    title: "జి.ఓ. 23 ఉచిత విద్యుత్",
    subject:
      "నాయి బ్రాహ్మణ వృత్తిదారులకు జి.ఓ. 23 ప్రకారం ఉచిత విద్యుత్ సదుపాయం అమలు చేయగలరని వినతి.",
    body: "మా ప్రాంతంలో నాయి బ్రాహ్మణ, మంగలి వృత్తిదారులు అద్దె షాపులలో అధిక ఆర్థిక ఇబ్బందులు ఎదుర్కొంటున్నారు. కావున స్థానిక గ్రామ పంచాయతీ/మున్సిపాలిటీ పరిధిలోని అనువైన ప్రభుత్వ స్థలంలో కమ్యూనిటీ ఆధునిక సెలూన్‌ల నిర్మాణానికి స్థలం కేటాయించి, జి.ఓ. 23 ప్రకారం ఉచిత విద్యుత్ సదుపాయం అందజేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "modern_salon_space",
    title: "ఆధునిక సెలూన్ షాపుల కొరకు స్థల కేటాయింపు",
    subject:
      "గ్రామ/పట్టణ పరిధిలో నాయి బ్రాహ్మణ వృత్తిదారులకు ఆధునిక సెలూన్ కాంప్లెక్స్ కొరకు ప్రభుత్వ స్థలం కేటాయించుట గురించి వినతి.",
    body: "మా ప్రాంతంలో అనేక సంవత్సరాలుగా నాయి బ్రాహ్మణ, మంగలి వృత్తిదారులు అద్దె షాపులలో అధిక ఆర్థిక ఇబ్బందులు ఎదుర్కొంటున్నారు. కావున స్థానిక గ్రామ పంచాయతీ/మున్సిపాలిటీ పరిధిలోని అనువైన ప్రభుత్వ స్థలంలో కమ్యూనిటీ ఆధునిక సెలూన్‌ల నిర్మాణానికి స్థలం కేటాయించి, సహకరించవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "trade_license_fee",
    title: "ట్రేడ్ లైసెన్స్ రుసుము మినహాయింపు",
    subject:
      "నాయి బ్రాహ్మణ సంక్షేమ బోర్డు ద్వారా అర్హులైన సాంప్రదాయ వృత్తిదారులందరికీ ట్రేడ్ లైసెన్స్ రుసుము మినహాయింపు జారీ చేయుట గురించి.",
    body: "మా పరిధిలో సెలూన్ వృత్తిపై ఆధారపడి జీవిస్తున్న కార్మికులకు ఎటువంటి అధికారిక సంక్షేమ గుర్తింపు కార్డులు లేకపోవడం వల్ల ప్రభుత్వ సంక్షేమ పథకాలు, ప్రమాద బీమా అందడం లేదు. కావున సర్వే నిర్వహించి అర్హులైన ప్రతి ఒక్కరికీ ట్రేడ్ లైసెన్స్ రుసుము మినహాయింపు అందజేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "community_welfare_funds",
    title: "కమ్యూనిటీ భవనం & సంక్షేమ నిధులు",
    subject:
      "నాయి బ్రాహ్మణ సంఘం కమ్యూనిటీ భవనం నిర్మాణం మరియు సంక్షేమ నిధుల కేటాయింపు గురించి వినతి.",
    body: "మా ప్రాంతంలో నాయి బ్రాహ్మణ, మంగలి మరియు సాంప్రదాయ వృత్తిదారులకు సమావేశాలు, శిక్షణ మరియు సంక్షేమ కార్యక్రమాలకు తగిన కమ్యూనిటీ భవనం లేదు. కావున ప్రభుత్వ భూమి/నిధులతో కమ్యూనిటీ భవనం నిర్మాణం చేపట్టి, సంక్షేమ నిధులు విడుదల చేయవలసిందిగా కోరుచున్నాము.",
  },
];

function resolveAuthorityTitle(authorityId: string | null): string {
  if (!authorityId) return AUTHORITIES[0].title_te;
  const match = AUTHORITIES.find((a) => a.id === authorityId);
  return match?.title_te || AUTHORITIES[0].title_te;
}

function matchDistrictFromQuery(raw: string) {
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  return (
    TELANGANA_DISTRICTS.find(
      (d) =>
        d.slug === key.replace(/\s+/g, "-") ||
        d.name_en.toLowerCase() === key ||
        d.name_te === raw.trim(),
    ) ?? null
  );
}

const STEP_LABELS = [
  "జిల్లా / మండలం",
  "వినతి అంశం",
  "ప్రివ్యూ & డౌన్‌లోడ్",
] as const;

export function RepresentationLetterPage() {
  const searchParams = useSearchParams();
  const initialMandal = searchParams.get("mandal") || "";
  const initialDistRaw =
    searchParams.get("dist") ||
    searchParams.get("district") ||
    "";
  const initialLocality = searchParams.get("locality") || "";
  const initialAuthority = searchParams.get("authority");
  const initialSubject = searchParams.get("subject");

  const matchedDist = matchDistrictFromQuery(initialDistRaw);
  const defaultDistrictSlug = matchedDist?.slug || "suryapet";

  const resolveMandalSlug = (distSlug: string, mandalRaw: string) => {
    const list = listMandalsForDistrict(distSlug);
    if (!mandalRaw) return list[0]?.slug || "";
    const m = list.find(
      (x) =>
        x.slug === mandalRaw ||
        x.name_te === mandalRaw ||
        x.name_en.toLowerCase() === mandalRaw.toLowerCase(),
    );
    return m?.slug || list[0]?.slug || "";
  };

  const [step, setStep] = useState<WizardStep>(1);
  const [applicantName, setApplicantName] = useState(
    "సమన్వయకర్త / వృత్తిదారుని పేరు",
  );
  const [applicantPhone, setApplicantPhone] = useState("");
  const [districtSlug, setDistrictSlug] = useState(defaultDistrictSlug);
  const [mandalSlug, setMandalSlug] = useState(() =>
    resolveMandalSlug(defaultDistrictSlug, initialMandal),
  );
  const [locality, setLocality] = useState(initialLocality || "గాంధీ నగర్");
  const [recipientOfficer, setRecipientOfficer] = useState<string>(
    resolveAuthorityTitle(initialAuthority),
  );
  const [selectedPresetId, setSelectedPresetId] = useState(
    initialSubject && GRIEVANCE_PRESETS.some((p) => p.id === initialSubject)
      ? initialSubject
      : GRIEVANCE_PRESETS[0].id,
  );
  const [customBody, setCustomBody] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [recordId] = useState(() => Date.now().toString().slice(-6));
  const [letterDate] = useState(() =>
    new Date().toLocaleDateString("te-IN"),
  );
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [inAppWebView, setInAppWebView] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  const districtMeta = useMemo(
    () =>
      TELANGANA_DISTRICTS.find((d) => d.slug === districtSlug) ||
      TELANGANA_DISTRICTS[0],
    [districtSlug],
  );

  const mandals = useMemo(
    () => listMandalsForDistrict(districtSlug),
    [districtSlug],
  );

  const effectiveMandalSlug = useMemo(() => {
    if (mandalSlug && mandals.some((m) => m.slug === mandalSlug)) {
      return mandalSlug;
    }
    return mandals[0]?.slug || "";
  }, [mandalSlug, mandals]);

  const mandalMeta = useMemo(
    () => mandals.find((m) => m.slug === effectiveMandalSlug) ?? null,
    [mandals, effectiveMandalSlug],
  );

  const district = districtMeta.name_te;
  const mandal = mandalMeta?.name_te || initialMandal || "కోదాడ";

  // Deep-link sync when ?dist= / ?mandal= changes (deferred to avoid sync setState-in-effect).
  useEffect(() => {
    const t = window.setTimeout(() => {
      const raw =
        searchParams.get("dist") || searchParams.get("district") || "";
      const next = matchDistrictFromQuery(raw);
      const nextSlug = next?.slug;
      if (nextSlug) setDistrictSlug(nextSlug);

      const nextMandal = searchParams.get("mandal") || "";
      if (nextMandal || nextSlug) {
        setMandalSlug(
          resolveMandalSlug(nextSlug || defaultDistrictSlug, nextMandal),
        );
      }
      const nextLocality = searchParams.get("locality") || "";
      if (nextLocality) setLocality(nextLocality);
      const nextAuthority = searchParams.get("authority");
      if (nextAuthority) {
        setRecipientOfficer(resolveAuthorityTitle(nextAuthority));
      }
      const nextSubject = searchParams.get("subject");
      if (nextSubject && GRIEVANCE_PRESETS.some((p) => p.id === nextSubject)) {
        setSelectedPresetId(nextSubject);
        setUseCustom(false);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [searchParams, defaultDistrictSlug]);

  useEffect(() => {
    const detect = () => setInAppWebView(isInAppWebView() || isTelegramWebApp());
    const t = window.setTimeout(detect, 0);
    const t2 = window.setTimeout(detect, 400);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  const activePreset =
    GRIEVANCE_PRESETS.find((p) => p.id === selectedPresetId) ||
    GRIEVANCE_PRESETS[0];

  const letterSubject = activePreset.subject;
  const letterBody =
    useCustom && customBody.trim()
      ? customBody.trim()
      : activePreset.body;

  const handlePrintOrPdf = useCallback(async () => {
    setPdfError(null);

    // Standard desktop / mobile Safari / Chrome → native print dialog.
    if (!shouldUsePdfFallback()) {
      window.print();
      return;
    }

    const el = letterRef.current;
    if (!el) {
      setPdfError(
        "పీడీఎఫ్ సిద్ధం కాలేదు. బ్రౌజర్‌లో తెరిచి మళ్లీ ప్రయత్నించండి.",
      );
      return;
    }

    // Immediate visual feedback before the async canvas/jspdf work.
    setPdfBusy(true);
    try {
      // Ensure letter is in DOM (step 3) and measurable for capture.
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await downloadPetitionPdf(el, PETITION_PDF_FILENAME);
    } catch (err) {
      console.error("petition PDF generation failed", err);
      setPdfError(
        "పీడీఎఫ్ తయారు విఫలమైంది. క్రోమ్ లేదా సఫారీలో తెరిచి ప్రింట్ చేయండి.",
      );
    } finally {
      setPdfBusy(false);
    }
  }, []);

  const canAdvanceStep1 = Boolean(districtSlug && (mandalSlug || mandal));
  const canAdvanceStep2 = useCustom
    ? customBody.trim().length >= 20
    : Boolean(selectedPresetId);

  return (
    <div className="min-h-[100dvh] bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white print:bg-white print:text-black">
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => {
          setInAppWebView(isInAppWebView() || isTelegramWebApp());
        }}
      />

      {/* Sticky in-app breakout banner — Executive Civic navy + gold */}
      {inAppWebView ? (
        <div
          className="no-print sticky top-0 z-50 border-b border-[#B45309]/40 bg-[#1E293B] text-white print:hidden"
          role="region"
          aria-label="Open in browser for PDF"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="min-w-0 flex-1 font-telugu text-[11px] font-semibold leading-relaxed sm:text-xs">
              {IN_APP_PRINT_BANNER_TE}
            </p>
            <button
              type="button"
              onClick={() => openCurrentPageExternally()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#B45309] px-4 py-2.5 font-telugu text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#92400E]"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {OPEN_IN_BROWSER_BTN_TE}
            </button>
          </div>
        </div>
      ) : null}

      {pdfBusy ? (
        <div
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 print:hidden"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
            <Loader2 className="h-7 w-7 animate-spin text-[#B45309]" aria-hidden />
            <p className="font-telugu text-sm font-semibold leading-relaxed text-[#0F172A]">
              {PDF_LOADING_TE}
            </p>
            <p className="text-[11px] text-slate-500">
              NayiSamakhya-Vinathipathram.pdf
            </p>
          </div>
        </div>
      ) : null}

      <header
        className="no-print sticky top-0 z-20 border-b border-civic-border bg-white shadow-xs print:hidden"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-civic-bronze" />
                <h1 className="truncate font-telugu text-base font-bold leading-relaxed text-civic-ink md:text-lg">
                  అధికారిక వినతిపత్రం తయారీ కేంద్రం
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                3-step Official Representation &amp; Citizen Petition
              </p>
            </div>
          </div>

          {step === 3 ? (
            <button
              type="button"
              onClick={() => void handlePrintOrPdf()}
              disabled={pdfBusy}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-civic-bronze px-3 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover hover:shadow-md disabled:cursor-wait disabled:opacity-70 sm:px-4"
            >
              {pdfBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">ప్రింట్ / PDF సేవ్</span>
              <span className="sm:hidden">PDF</span>
            </button>
          ) : null}
        </div>

        {/* Step indicator */}
        <div className="mx-auto flex max-w-6xl gap-1 px-4 pb-3">
          {STEP_LABELS.map((label, i) => {
            const n = (i + 1) as WizardStep;
            const active = step === n;
            const done = step > n;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (n < step || (n === 2 && canAdvanceStep1) || (n === 3 && canAdvanceStep1 && canAdvanceStep2)) {
                    setStep(n);
                  }
                }}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-center transition-colors ${
                  active
                    ? "bg-civic-bronze/10 text-civic-ink"
                    : done
                      ? "text-civic-bronze"
                      : "text-slate-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    active || done
                      ? "bg-civic-bronze text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
                </span>
                <span className="font-telugu text-[10px] font-semibold leading-snug sm:text-[11px]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {pdfError ? (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center font-telugu text-xs font-medium leading-relaxed text-red-800">
            {pdfError}{" "}
            <button
              type="button"
              className="font-bold underline"
              onClick={() => openCurrentPageExternally()}
            >
              {OPEN_IN_BROWSER_BTN_TE}
            </button>
          </div>
        ) : null}
      </header>

      <main
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] lg:grid-cols-12 print:m-0 print:block print:p-0 ${
          step < 3 ? "lg:grid-cols-1" : ""
        }`}
      >
        {/* ——— Wizard controls (steps 1–2 always; step 3 as sidebar on lg) ——— */}
        <section
          className={`no-print space-y-5 print:hidden ${
            step === 3 ? "lg:col-span-5" : "mx-auto w-full max-w-xl"
          }`}
        >
          {step === 1 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2 className="mb-1 font-telugu text-sm font-bold leading-relaxed text-civic-ink">
                స్టెప్ 1 — జిల్లా &amp; మండలం ఎంచుకోండి
              </h2>
              <p className="mb-4 text-[11px] text-slate-500">
                Deep-link:{" "}
                <code className="rounded bg-slate-100 px-1">?dist=</code>{" "}
                pre-selects your district.
              </p>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    జిల్లా (District)
                  </label>
                  <select
                    value={districtSlug}
                    onChange={(e) => {
                      setDistrictSlug(e.target.value);
                      setMandalSlug("");
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  >
                    {TELANGANA_DISTRICTS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name_te} — {d.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    మండలం (Mandal)
                  </label>
                  <select
                    value={effectiveMandalSlug}
                    onChange={(e) => setMandalSlug(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  >
                    {mandals.length === 0 ? (
                      <option value="">—</option>
                    ) : (
                      mandals.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {m.name_te} — {m.name_en}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    గ్రామం / కాలనీ (Locality)
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    సమర్పించాల్సిన అధికారి (To Authority)
                  </label>
                  <select
                    value={recipientOfficer}
                    onChange={(e) => setRecipientOfficer(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  >
                    {AUTHORITIES.map((a) => (
                      <option key={a.id} value={a.title_te}>
                        {a.title_te} ({a.title_en})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={!canAdvanceStep1}
                onClick={() => setStep(2)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3 font-telugu text-sm font-bold text-white disabled:opacity-50"
              >
                తరువాత — వినతి అంశం
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2 className="mb-1 font-telugu text-sm font-bold leading-relaxed text-civic-ink">
                స్టెప్ 2 — వినతి అంశం ఎంచుకోండి
              </h2>
              <p className="mb-4 font-telugu text-[11px] leading-relaxed text-slate-500">
                నాలుగు సాధారణ అంశాల్లో ఒకటి ట్యాప్ చేయండి, లేదా మీ స్వంత వచనం రాయండి.
              </p>

              <div className="space-y-2" role="listbox" aria-label="Grievance presets">
                {GRIEVANCE_PRESETS.map((preset) => {
                  const isSelected =
                    !useCustom && preset.id === selectedPresetId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setUseCustom(false);
                      }}
                      className={`w-full cursor-pointer rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-civic-bronze bg-civic-bronze/5 ring-1 ring-civic-bronze"
                          : "border-civic-border bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 font-telugu text-sm font-bold leading-relaxed text-civic-ink">
                        <span>{preset.title}</span>
                        {isSelected ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-civic-bronze" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="mb-1.5 flex items-center gap-2 font-telugu text-xs font-bold leading-relaxed text-civic-ink">
                  <input
                    type="checkbox"
                    checked={useCustom}
                    onChange={(e) => setUseCustom(e.target.checked)}
                    className="rounded border-slate-300 text-civic-bronze focus:ring-civic-bronze"
                  />
                  అదనపు / స్వంత వచనం (Custom)
                </label>
                <textarea
                  value={customBody}
                  onChange={(e) => {
                    setCustomBody(e.target.value);
                    if (e.target.value.trim()) setUseCustom(true);
                  }}
                  rows={4}
                  placeholder="మీ వినతి వివరాలు ఇక్కడ రాయండి…"
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-3 font-telugu text-sm font-bold text-civic-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  వెనక్కి
                </button>
                <button
                  type="button"
                  disabled={!canAdvanceStep2}
                  onClick={() => setStep(3)}
                  className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3 font-telugu text-sm font-bold text-white disabled:opacity-50"
                >
                  ప్రివ్యూ చూడండి
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2 className="mb-3 font-telugu text-sm font-bold leading-relaxed text-civic-ink">
                స్టెప్ 3 — వివరాలు &amp; డౌన్‌లోడ్
              </h2>
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    దరఖాస్తుదారుని పేరు / సంఘం పేరు
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-telugu font-medium leading-relaxed text-slate-600">
                    సంప్రదింపు నంబర్ (Phone)
                  </label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <dl className="rounded-lg bg-civic-paper px-3 py-2.5 font-telugu text-[11px] leading-relaxed text-slate-600">
                  <div className="flex justify-between gap-2">
                    <dt>జిల్లా</dt>
                    <dd className="font-semibold text-civic-ink">{district}</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-2">
                    <dt>మండలం</dt>
                    <dd className="font-semibold text-civic-ink">{mandal}</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-2">
                    <dt>అంశం</dt>
                    <dd className="max-w-[60%] text-right font-semibold text-civic-ink">
                      {useCustom ? "స్వంత వచనం" : activePreset.title}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => void handlePrintOrPdf()}
                  disabled={pdfBusy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3.5 font-telugu text-sm font-bold text-white disabled:opacity-70"
                >
                  {pdfBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Printer className="h-4 w-4" />
                  )}
                  వినతిపత్రం ప్రింట్ / PDF సేవ్
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-2.5 font-telugu text-xs font-bold text-civic-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  అంశం మార్చండి
                </button>
              </div>
            </div>
          ) : null}
        </section>

        {/* ——— A4 letter preview (visible on step 3; always in DOM for print) ——— */}
        <section
          className={`flex justify-center print:block print:w-full ${
            step === 3 ? "lg:col-span-7" : "hidden print:block"
          }`}
        >
          <div
            ref={letterRef}
            id="representation-letter-print"
            translate="no"
            lang="te"
            className="print-only-document print-document printable-card flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between overflow-hidden rounded-lg border border-slate-300 bg-white p-10 shadow-xl md:p-14 print:m-0 print:h-auto print:max-h-[277mm] print:min-h-0 print:w-full print:max-w-none print:overflow-hidden print:rounded-none print:border-none print:p-0 print:shadow-none"
          >
            <div className="print:space-y-2">
              <div className="mb-8 border-b-2 border-civic-ink pb-6 text-center print:mb-2 print:pb-2">
                <h2 className="font-telugu text-xl font-black leading-relaxed tracking-wide text-civic-ink md:text-2xl print:text-base">
                  వినతిపత్రం (REPRESENTATION)
                </h2>
                <p className="mt-1 font-telugu text-xs font-semibold leading-relaxed text-slate-600 print:mt-0.5 print:text-[10px]">
                  నాయి బ్రాహ్మణ, మంగలి &amp; బజంత్రి కమ్యూనిటీ సంక్షేమ మరియు హక్కుల పరిరక్షణ వేదిక
                </p>
                <div className="mt-0.5 font-telugu text-[11px] leading-relaxed text-slate-500 print:text-[9px]">
                  తెలంగాణ రాష్ట్రం | అధికారిక రికార్డు ఐడీ: NS-TEL-{recordId}
                </div>
              </div>

              <div className="mb-8 flex items-start justify-between font-telugu text-xs leading-relaxed md:text-sm print:mb-2 print:text-sm print:leading-snug">
                <div>
                  <p className="font-bold text-civic-ink">స్వీకర్త (To):</p>
                  <p className="font-semibold text-slate-800">
                    {recipientOfficer},
                  </p>
                  <p className="text-slate-700">
                    {mandal} మండల కార్యాలయం,
                  </p>
                  <p className="text-slate-700">
                    {district} జిల్లా, తెలంగాణ రాష్ట్రం.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-slate-700">
                    <strong>తేదీ:</strong> {letterDate || "—"}
                  </p>
                  <p className="text-slate-700">
                    <strong>ప్రదేశం:</strong> {locality}
                  </p>
                </div>
              </div>

              <div className="mb-6 border-l-4 border-civic-ink bg-slate-50 p-3 font-telugu text-xs font-bold leading-relaxed text-civic-ink md:text-sm print:mb-2 print:p-2 print:text-sm print:leading-snug">
                విషయం: {letterSubject}
              </div>

              <div className="space-y-4 text-justify font-telugu text-xs leading-relaxed text-slate-900 md:text-sm print:space-y-2 print:text-sm print:leading-snug">
                <p>
                  <strong>అయ్యా / ఆర్యా,</strong>
                </p>
                <p>
                  మేము {district} జిల్లా, {mandal} మండలం, {locality}{" "}
                  ప్రాంతానికి చెందిన నాయి బ్రాహ్మణ, మంగలి మరియు సాంప్రదాయ వృత్తిదారులము. మా కమ్యూనిటీ
                  జీవనోపాధి మరియు సంక్షేమానికి సంబంధించి క్రింది ముఖ్యమైన అంశాన్ని తమరి దృష్టికి
                  తీసుకువస్తున్నాము.
                </p>
                <p className="rounded-md border border-civic-border bg-civic-paper p-3 font-medium leading-relaxed text-slate-800 print:p-2">
                  {letterBody}
                </p>
                <p>
                  కావున గౌరవనీయులైన అధికారులు స్పందించి, క్షేత్రస్థాయి విచారణ చేపట్టి మా న్యాయమైన
                  అభ్యర్థనను పరిష్కరించవలసిందిగా కోరుచున్నాము.
                </p>
              </div>
            </div>

            <div className="print-signature-block print-seal-block mt-8 flex break-inside-avoid items-end justify-between border-t border-slate-300 pt-12 font-telugu text-xs leading-relaxed md:text-sm print:mt-3 print:pt-4 print:text-sm">
              <div className="print-coordinator-ref">
                <p className="font-sans text-[11px] text-slate-500 print:text-[9px]">
                  Verification Stamp / Ref: nayisamakhya.org
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  ఫోన్ నంబర్: +91 {applicantPhone || "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-slate-700">భవదీయుడు / ఇట్లు,</p>
                <div className="flex h-12 items-end justify-end print:h-8">
                  <span className="font-sans text-[11px] italic text-slate-400 print:text-[9px]">
                    ( సంతకం / Signature )
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-civic-ink">
                  {applicantName}
                </p>
                <p className="text-xs leading-relaxed text-slate-600 print:text-[10px]">
                  {locality}, {mandal}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
