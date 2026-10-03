"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  Printer,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { BrandCrest } from "@/components/brand/BrandCrest";
import { AUTHORITIES } from "@/lib/data/representationLetterOptions";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";
import {
  PDF_LOADING_TE,
  IN_APP_PRINT_BANNER_TE,
  OPEN_IN_BROWSER_BTN_TE,
  PETITION_HELPLINE_URL,
  PETITION_HELPLINE_WA,
  downloadPetitionPdf,
  isInAppWebView,
  isTelegramWebApp,
  openCurrentPageExternally,
  petitionPdfFilename,
  shouldUsePdfFallback,
} from "@/lib/twa/printPetitionPdf";
import {
  formatStatutoryBlock,
  getCitationForPreset,
  isMunicipalRepresentationType,
  LEGAL_CITATIONS,
} from "@/config/legalCitations";
import {
  buildDocketRef,
  formatTeluguOfficialDate,
  verifyUrlForDocket,
} from "@/lib/representation/docket";
import {
  DocketHeader,
  ReceivingStampBlock,
} from "@/components/representation/DocketHeader";
import { CommunityHubsSection } from "@/components/CommunityHubsSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  ui,
  uiStep,
  type RepUiLang,
} from "@/lib/data/representationUiCopy";
import { cn } from "@/lib/utils";

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
    title: "విద్యుత్ సబ్సిడీ (జి.ఓ. 23)",
    subject: getCitationForPreset("go23_free_power").subjectRefTe,
    body: "మా ప్రాంతంలో నాయీబ్రాహ్మణ సెలూన్ వృత్తిదారులు అధిక వాణిజ్య విద్యుత్ బిల్లులు మరియు మీటర్ వర్గీకరణ సమస్యలు ఎదుర్కొంటున్నారు. కావున జి.ఓ. Ms. No. 23 ప్రకారం ఉచిత 250 యూనిట్ల విద్యుత్ సదుపాయం అమలు చేసి, రీడింగ్ సర్దుబాటు చేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "modern_salon_space",
    title: "స్థల కేటాయింపు & కమ్యూనిటీ భవనం",
    subject: getCitationForPreset("modern_salon_space").subjectRefTe,
    body: "మా ప్రాంతంలో అనేక సంవత్సరాలుగా నాయి బ్రాహ్మణ, మంగలి వృత్తిదారులు అద్దె షాపులలో అధిక ఆర్థిక ఇబ్బందులు ఎదుర్కొంటున్నారు. కావున స్థానిక గ్రామ పంచాయతీ/మున్సిపాలిటీ పరిధిలోని అనువైన ప్రభుత్వ స్థలంలో ఆత్మగౌరవ భవనం మరియు వృత్తి నైపుణ్య శిక్షణ కేంద్రం నిర్మాణానికి స్థలం మంజూరు చేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "trade_license_fee",
    title: "ట్రేడ్ లైసెన్స్ మినహాయింపు",
    subject: getCitationForPreset("trade_license_fee").subjectRefTe,
    body: "గ్రామీణ మరియు పట్టణ పరిధిలో సాంప్రదాయ సేవా సెలూన్లపై అదనపు వాణిజ్య ట్రేడ్ లైసెన్స్ ఫీజులు భారంగా ఉన్నాయి. కావున తెలంగాణ మున్సిపాలిటీల చట్టం 2019 మరియు పంచాయత్ రాజ్ నిబంధనల ప్రకారం రుసుము రద్దు / మినహాయింపు జారీ చేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "community_welfare_funds",
    title: "కమ్యూనిటీ భవనం & సంక్షేమ నిధులు",
    subject: getCitationForPreset("community_welfare_funds").subjectRefTe,
    body: "మా ప్రాంతంలో నాయి బ్రాహ్మణ, మంగలి మరియు సాంప్రదాయ వృత్తిదారులకు సమావేశాలు, శిక్షణ మరియు సంక్షేమ కార్యక్రమాలకు తగిన కమ్యూనిటీ భవనం లేదు. కావున బీసీ సంక్షేమ మార్గదర్శకాల ప్రకారం ప్రభుత్వ భూమి/నిధులతో ఆత్మగౌరవ భవన నిర్మాణం చేపట్టి, సంక్షేమ నిధులు విడుదల చేయవలసిందిగా కోరుచున్నాము.",
  },
];

/** Urban municipal desk deep-links (type=municipal_* | power_subsidy_urban). */
const MUNICIPAL_PRESETS: GrievancePreset[] = [
  {
    id: "municipal_trade",
    title: "మున్సిపల్ ట్రేడ్ లైసెన్స్ (సె§ 118 & 120)",
    subject: LEGAL_CITATIONS.municipal_trade.subjectRefTe,
    body: "పురపాలక / నగరపాలక పరిధిలో సాంప్రదాయ నాయీబ్రాహ్మణ సెలూన్ వృత్తిదారులపై అదనపు ట్రేడ్ లైసెన్స్ రుసుములు భారంగా ఉన్నాయి. తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 సెక్షన్లు 118 & 120 ప్రకారం రుసుము మినహాయింపు / సౌలభ్యం జారీ చేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "municipal_lease",
    title: "మున్సిపల్ లీజు (సె§ 54)",
    subject: LEGAL_CITATIONS.municipal_lease.subjectRefTe,
    body: "సాంప్రదాయ సెలూన్ / వృత్తి నైపుణ్య కేంద్రాలకు పురపాలక ఆస్తి లీజు లేదా స్థల కేటాయింపు అవసరం. తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 సెక్షన్ 54 ప్రకారం అనువైన స్థలం లీజు / కేటాయింపు చేయవలసిందిగా కోరుచున్నాము.",
  },
  {
    id: "power_subsidy_urban",
    title: "పట్టణ విద్యుత్ సబ్సిడీ (జి.ఓ. 23)",
    subject: LEGAL_CITATIONS.power_subsidy_urban.subjectRefTe,
    body: "పట్టణ పురపాలక / నగరపాలక పరిధిలో నాయీబ్రాహ్మణ సెలూన్ వృత్తిదారులు అధిక వాణిజ్య విద్యుత్ బిల్లులు ఎదుర్కొంటున్నారు. జి.ఓ. Ms. No. 23 ప్రకారం ఉచిత 250 యూనిట్ల విద్యుత్ సదుపాయం అమలు చేసి, రీడింగ్ సర్దుబాటు చేయవలసిందిగా కోరుచున్నాము.",
  },
];

const ALL_PRESETS: GrievancePreset[] = [
  ...GRIEVANCE_PRESETS,
  ...MUNICIPAL_PRESETS,
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

export function RepresentationLetterPage() {
  const { language, setLanguage } = useLanguage();
  const lang = (language === "en" ? "en" : "te") as RepUiLang;
  const searchParams = useSearchParams();
  const initialMandal = searchParams.get("mandal") || "";
  const initialDistRaw =
    searchParams.get("dist") ||
    searchParams.get("district") ||
    "";
  const initialLocality = searchParams.get("locality") || "";
  const initialAuthority = searchParams.get("authority");
  const initialSubject = searchParams.get("subject");
  const initialType = searchParams.get("type") || "";
  const initialTown =
    searchParams.get("town") ||
    searchParams.get("townEn") ||
    "";
  const isMunicipalDesk = isMunicipalRepresentationType(initialType);

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

  const initialPresetId = (() => {
    if (isMunicipalRepresentationType(initialType)) return initialType;
    if (initialSubject && ALL_PRESETS.some((p) => p.id === initialSubject)) {
      return initialSubject;
    }
    return isMunicipalDesk
      ? MUNICIPAL_PRESETS[0].id
      : GRIEVANCE_PRESETS[0].id;
  })();

  const commissionerTitle =
    "కమిషనర్, పురపాలక సంఘం / నగరపాలక సంస్థ";

  const [step, setStep] = useState<WizardStep>(1);
  const [applicantName, setApplicantName] = useState(
    "సమన్వయకర్త / వృత్తిదారుని పేరు",
  );
  const [applicantPhone, setApplicantPhone] = useState("");
  const [districtSlug, setDistrictSlug] = useState(defaultDistrictSlug);
  const [mandalSlug, setMandalSlug] = useState(() =>
    resolveMandalSlug(
      defaultDistrictSlug,
      searchParams.get("townSlug") || initialMandal,
    ),
  );
  const [locality, setLocality] = useState(initialLocality || "గాంధీ నగర్");
  const [townName, setTownName] = useState(initialTown);
  const [recipientOfficer, setRecipientOfficer] = useState<string>(
    isMunicipalDesk
      ? commissionerTitle
      : resolveAuthorityTitle(initialAuthority),
  );
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId);
  const [customBody, setCustomBody] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [issuedAt] = useState(() => new Date());
  const [teluguDate] = useState(() => formatTeluguOfficialDate(issuedAt));
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [inAppWebView, setInAppWebView] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const docketRegistered = useRef(false);

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
  const displayTown = townName || mandal;
  const municipalMode = isMunicipalRepresentationType(selectedPresetId);

  // Deep-link sync when ?dist= / ?mandal= / ?type= changes (deferred to avoid sync setState-in-effect).
  useEffect(() => {
    const t = window.setTimeout(() => {
      const raw =
        searchParams.get("dist") || searchParams.get("district") || "";
      const next = matchDistrictFromQuery(raw);
      const nextSlug = next?.slug;
      if (nextSlug) setDistrictSlug(nextSlug);

      const nextMandal =
        searchParams.get("townSlug") || searchParams.get("mandal") || "";
      if (nextMandal || nextSlug) {
        setMandalSlug(
          resolveMandalSlug(nextSlug || defaultDistrictSlug, nextMandal),
        );
      }
      const nextLocality = searchParams.get("locality") || "";
      if (nextLocality) setLocality(nextLocality);
      const nextTown =
        searchParams.get("town") || searchParams.get("townEn") || "";
      if (nextTown) setTownName(nextTown);
      const nextType = searchParams.get("type") || "";
      if (isMunicipalRepresentationType(nextType)) {
        setSelectedPresetId(nextType);
        setUseCustom(false);
        setRecipientOfficer(commissionerTitle);
      } else {
        const nextAuthority = searchParams.get("authority");
        if (nextAuthority) {
          setRecipientOfficer(resolveAuthorityTitle(nextAuthority));
        }
        const nextSubject = searchParams.get("subject");
        if (nextSubject && ALL_PRESETS.some((p) => p.id === nextSubject)) {
          setSelectedPresetId(nextSubject);
          setUseCustom(false);
        }
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

  const visiblePresets = municipalMode ? MUNICIPAL_PRESETS : GRIEVANCE_PRESETS;

  const activePreset =
    ALL_PRESETS.find((p) => p.id === selectedPresetId) ||
    visiblePresets[0] ||
    GRIEVANCE_PRESETS[0];

  const citation = useMemo(
    () => getCitationForPreset(activePreset.id),
    [activePreset.id],
  );

  const docket = useMemo(
    () =>
      buildDocketRef({
        districtSlug,
        mandalSlug: effectiveMandalSlug,
        presetId: activePreset.id,
        seed: `${districtSlug}|${effectiveMandalSlug}|${activePreset.id}|${issuedAt.getTime()}`,
        year: issuedAt.getFullYear(),
      }),
    [districtSlug, effectiveMandalSlug, activePreset.id, issuedAt],
  );

  const verifyUrl = useMemo(
    () => verifyUrlForDocket(docket.docketId),
    [docket.docketId],
  );

  const letterSubject = useCustom && customBody.trim()
    ? activePreset.subject
    : citation.subjectRefTe;
  const letterBody =
    useCustom && customBody.trim()
      ? customBody.trim()
      : activePreset.body;
  const statutoryBlock = formatStatutoryBlock(citation);

  const registerDocket = useCallback(async () => {
    if (docketRegistered.current) return;
    docketRegistered.current = true;
    try {
      await fetch("/api/petitions/docket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docket_id: docket.docketId,
          category_id: citation.id,
          category_te: citation.categoryTe,
          district_slug: districtSlug,
          district_te: district,
          mandal_slug: effectiveMandalSlug,
          mandal_te: mandal,
          statutory_te: statutoryBlock,
          subject_te: letterSubject,
          applicant_name: applicantName,
          issued_at: issuedAt.toISOString(),
        }),
      });
    } catch (err) {
      console.error("[PetitionDocket:ClientRegister]", err);
      docketRegistered.current = false;
    }
  }, [
    docket.docketId,
    citation.id,
    citation.categoryTe,
    districtSlug,
    district,
    effectiveMandalSlug,
    mandal,
    statutoryBlock,
    letterSubject,
    applicantName,
    issuedAt,
  ]);

  // Persist docket when user reaches preview (QR becomes meaningful).
  useEffect(() => {
    docketRegistered.current = false;
  }, [docket.docketId]);

  useEffect(() => {
    if (step !== 3) return;
    void registerDocket();
  }, [step, registerDocket]);

  const handlePrintOrPdf = useCallback(async () => {
    setPdfError(null);
    await registerDocket();

    // Standard desktop / mobile Safari / Chrome → native print dialog.
    if (!shouldUsePdfFallback()) {
      window.print();
      return;
    }

    const el = letterRef.current;
    if (!el) {
      setPdfError(
        `పీడీఎఫ్ సిద్ధం కాలేదు. బ్రౌజర్‌లో తెరవండి లేదా వాట్సాప్ ${PETITION_HELPLINE_WA} కు సంప్రదించండి.`,
      );
      return;
    }

    const filename = petitionPdfFilename(districtSlug || districtMeta.name_en);

    // Immediate visual feedback before the async canvas/jspdf work.
    setPdfBusy(true);
    try {
      // Ensure letter is in DOM (step 3) and measurable for capture.
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await downloadPetitionPdf(el, filename);
    } catch (err) {
      console.error("petition PDF generation failed", err);
      setPdfError(
        `పీడీఎఫ్ తయారు విఫలమైంది. క్రోమ్/సఫారీలో తెరవండి లేదా హెల్ప్‌లైన్ ${PETITION_HELPLINE_WA} కు వాట్సాప్ చేయండి.`,
      );
      try {
        window.alert(
          `పీడీఎఫ్ డౌన్‌లోడ్ కాలేదు.\n\nదయచేసి WhatsApp హెల్ప్‌లైన్ ${PETITION_HELPLINE_WA} కు సంప్రదించి వినతిపత్రం అందుకోండి.`,
        );
      } catch {
        /* alert may be blocked in some webviews */
      }
    } finally {
      setPdfBusy(false);
    }
  }, [registerDocket, districtSlug, districtMeta.name_en]);

  const canAdvanceStep1 = Boolean(districtSlug && (mandalSlug || mandal));
  const canAdvanceStep2 = useCustom
    ? customBody.trim().length >= 20
    : Boolean(selectedPresetId);

  return (
    <div
      translate="no"
      lang="te"
      className="min-h-[100dvh] w-full bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white print:bg-white print:text-black"
    >
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => {
          setInAppWebView(isInAppWebView() || isTelegramWebApp());
        }}
      />

      {/* Sticky in-app breakout banner — Executive Civic navy + bronze + warm paper */}
      {inAppWebView ? (
        <div
          className="no-print sticky top-0 z-50 border-b border-[#B45309] bg-[#1E293B] print:hidden"
          role="region"
          aria-label="Open in browser for PDF"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="min-w-0 flex-1 font-telugu text-[11px] font-semibold leading-relaxed text-[#FBFBFA] sm:text-xs">
              {IN_APP_PRINT_BANNER_TE}
            </p>
            <button
              type="button"
              onClick={() => openCurrentPageExternally()}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-3 font-telugu text-xs font-bold text-[#FBFBFA] shadow-sm transition-colors hover:bg-[#92400E]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
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
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-[#FBFBFA] px-6 py-5 text-center shadow-xl">
            <Loader2 className="h-7 w-7 animate-spin text-[#B45309]" aria-hidden />
            <p className="font-telugu text-sm font-semibold leading-relaxed text-[#1E293B]">
              {PDF_LOADING_TE}
            </p>
            <p className="text-[11px] text-slate-500">
              {petitionPdfFilename(districtSlug || districtMeta.name_en)}
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
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <BrandCrest size="xs" />
                <h1
                  className={cn(
                    "truncate text-base font-bold leading-relaxed text-civic-ink md:text-lg",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  {ui(lang, "title")}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">{ui(lang, "subtitle")}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="inline-flex rounded-lg border border-civic-border bg-civic-subtle p-0.5"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={cn(
                  "min-h-10 rounded-md px-2.5 py-1.5 font-telugu text-[11px] font-bold",
                  lang === "te"
                    ? "bg-civic-bronze text-white"
                    : "text-slate-600 hover:bg-white",
                )}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "min-h-10 rounded-md px-2.5 py-1.5 text-[11px] font-bold",
                  lang === "en"
                    ? "bg-civic-bronze text-white"
                    : "text-slate-600 hover:bg-white",
                )}
              >
                English
              </button>
            </div>

            {step === 3 ? (
              <button
                type="button"
                onClick={() => void handlePrintOrPdf()}
                disabled={pdfBusy}
                className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-civic-bronze px-3 py-3 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover hover:shadow-md disabled:cursor-wait disabled:opacity-70 sm:px-4"
              >
                {pdfBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Printer className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {pdfBusy ? PDF_LOADING_TE : ui(lang, "printShort")}
                </span>
                <span className="sm:hidden">{pdfBusy ? "…" : "PDF"}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Step indicator */}
        <div className="mx-auto flex max-w-6xl gap-1 px-4 pb-3">
          {([0, 1, 2] as const).map((i) => {
            const n = (i + 1) as WizardStep;
            const active = step === n;
            const done = step > n;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (
                    n < step ||
                    (n === 2 && canAdvanceStep1) ||
                    (n === 3 && canAdvanceStep1 && canAdvanceStep2)
                  ) {
                    setStep(n);
                  }
                }}
                className={`flex min-h-12 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-center transition-colors ${
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
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-snug sm:text-[11px]",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  {uiStep(lang, i)}
                </span>
              </button>
            );
          })}
        </div>

        {pdfError ? (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2.5 text-center font-telugu text-xs font-medium leading-relaxed text-red-800">
            {pdfError}{" "}
            <button
              type="button"
              className="font-bold underline"
              onClick={() => openCurrentPageExternally()}
            >
              {OPEN_IN_BROWSER_BTN_TE}
            </button>
            {" · "}
            <a
              href={PETITION_HELPLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              WhatsApp {PETITION_HELPLINE_WA}
            </a>
          </div>
        ) : null}
      </header>

      <main
        className={`mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] print:m-0 print:block print:max-w-none print:p-0 ${
          step === 3 ? "lg:grid-cols-12" : "lg:grid-cols-1"
        }`}
      >
        {/* ——— Wizard controls (steps 1–2 always; step 3 as sidebar on lg) ——— */}
        <section
          className={`no-print w-full min-w-0 space-y-5 print:hidden ${
            step === 3 ? "lg:col-span-5" : "mx-auto max-w-xl"
          }`}
        >
          {step === 1 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2
                className={cn(
                  "mb-1 text-sm font-bold leading-relaxed text-civic-ink",
                  lang === "te" ? "font-telugu" : "font-sans",
                )}
              >
                {ui(lang, "step1Title")}
              </h2>
              <p className="mb-4 text-[11px] text-slate-500">
                {ui(lang, "step1Hint")}
              </p>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "district")}
                  </label>
                  <select
                    value={districtSlug}
                    onChange={(e) => {
                      setDistrictSlug(e.target.value);
                      setMandalSlug("");
                    }}
                    aria-label="District"
                    className="min-h-12 w-full appearance-auto rounded-lg border border-slate-300 bg-white p-3 font-sans text-sm leading-relaxed text-[#0F172A] focus:border-civic-bronze focus:outline-none"
                  >
                    {TELANGANA_DISTRICTS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name_en} — {d.name_te}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "mandal")}
                  </label>
                  <select
                    value={effectiveMandalSlug}
                    onChange={(e) => setMandalSlug(e.target.value)}
                    aria-label="Mandal"
                    className="min-h-12 w-full appearance-auto rounded-lg border border-slate-300 bg-white p-3 font-sans text-sm leading-relaxed text-[#0F172A] focus:border-civic-bronze focus:outline-none"
                  >
                    {mandals.length === 0 ? (
                      <option value="">Select mandal</option>
                    ) : (
                      mandals.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {m.name_en} — {m.name_te}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "locality")}
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "authority")}
                  </label>
                  <select
                    value={recipientOfficer}
                    onChange={(e) => setRecipientOfficer(e.target.value)}
                    aria-label="Authority"
                    className="min-h-12 w-full appearance-auto rounded-lg border border-slate-300 bg-white p-3 font-sans text-sm leading-relaxed text-[#0F172A] focus:border-civic-bronze focus:outline-none"
                  >
                    {AUTHORITIES.map((a) => (
                      <option key={a.id} value={a.title_te}>
                        {a.title_en} — {a.title_te}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={!canAdvanceStep1}
                onClick={() => setStep(2)}
                className={cn(
                  "mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50",
                  lang === "te" ? "font-telugu" : "font-sans",
                )}
              >
                {ui(lang, "nextTopic")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2
                className={cn(
                  "mb-1 text-sm font-bold leading-relaxed text-civic-ink",
                  lang === "te" ? "font-telugu" : "font-sans",
                )}
              >
                {ui(lang, "step2Title")}
              </h2>
              <p
                className={cn(
                  "mb-4 text-[11px] leading-relaxed text-slate-500",
                  lang === "te" ? "font-telugu" : "font-sans",
                )}
              >
                {ui(lang, "step2Hint")}
              </p>

              <div className="space-y-2" role="listbox" aria-label="Grievance presets">
                {visiblePresets.map((preset) => {
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
                        if (isMunicipalRepresentationType(preset.id)) {
                          setRecipientOfficer(commissionerTitle);
                        }
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
                <label
                  className={cn(
                    "mb-1.5 flex items-center gap-2 text-xs font-bold leading-relaxed text-civic-ink",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={useCustom}
                    onChange={(e) => setUseCustom(e.target.checked)}
                    className="rounded border-slate-300 text-civic-bronze focus:ring-civic-bronze"
                  />
                  {ui(lang, "customToggle")}
                </label>
                <textarea
                  value={customBody}
                  onChange={(e) => {
                    setCustomBody(e.target.value);
                    if (e.target.value.trim()) setUseCustom(true);
                  }}
                  rows={4}
                  placeholder={ui(lang, "customPh")}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-3 font-telugu text-sm leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={cn(
                    "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-3.5 text-sm font-bold text-civic-ink",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {ui(lang, "back")}
                </button>
                <button
                  type="button"
                  disabled={!canAdvanceStep2}
                  onClick={() => setStep(3)}
                  className={cn(
                    "inline-flex min-h-12 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  {ui(lang, "preview")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
              <h2
                className={cn(
                  "mb-3 text-sm font-bold leading-relaxed text-civic-ink",
                  lang === "te" ? "font-telugu" : "font-sans",
                )}
              >
                {ui(lang, "step3Title")}
              </h2>
              <p className="mb-3 text-[10px] leading-relaxed text-slate-500">
                {ui(lang, "letterNote")}
              </p>
              <div className="space-y-3.5 text-xs">
                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "applicant")}
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu leading-relaxed text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1 block font-medium leading-relaxed text-slate-600",
                      lang === "te" ? "font-telugu" : "font-sans",
                    )}
                  >
                    {ui(lang, "phone")}
                  </label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <dl
                  className={cn(
                    "rounded-lg bg-civic-paper px-3 py-2.5 text-[11px] leading-relaxed text-slate-600",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  <div className="flex justify-between gap-2">
                    <dt>{ui(lang, "summaryDistrict")}</dt>
                    <dd className="font-semibold text-civic-ink">{district}</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-2">
                    <dt>{ui(lang, "summaryMandal")}</dt>
                    <dd className="font-semibold text-civic-ink">{mandal}</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-2">
                    <dt>{ui(lang, "summaryTopic")}</dt>
                    <dd className="max-w-[60%] text-right font-semibold text-civic-ink">
                      {useCustom ? ui(lang, "customTopic") : activePreset.title}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 flex flex-col gap-2 pb-[env(safe-area-inset-bottom,0px)]">
                <button
                  type="button"
                  onClick={() => void handlePrintOrPdf()}
                  disabled={pdfBusy}
                  className={cn(
                    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-3.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-70",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  {pdfBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Printer className="h-4 w-4" />
                  )}
                  {pdfBusy ? PDF_LOADING_TE : ui(lang, "printPdf")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={cn(
                    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-3 text-xs font-bold text-civic-ink",
                    lang === "te" ? "font-telugu" : "font-sans",
                  )}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {ui(lang, "changeTopic")}
                </button>
              </div>

              <div className="no-print mt-5 print:hidden">
                <CommunityHubsSection
                  highlightDistrict={districtSlug}
                  pulseHubId={
                    districtSlug === "suryapet" || districtSlug === "kodad"
                      ? "south-telangana"
                      : undefined
                  }
                />
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
            id="petition-document"
            data-print-id="representation-letter-print"
            translate="no"
            lang="te"
            className="print-only-document print-document printable-card representation-letter-print flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between overflow-hidden rounded-lg border border-slate-300 bg-white p-10 shadow-xl md:p-14 print:m-0 print:h-auto print:max-h-[277mm] print:min-h-0 print:w-full print:max-w-none print:overflow-hidden print:rounded-none print:border-none print:p-0 print:shadow-none"
          >
            <div className="print:space-y-2">
              <DocketHeader
                refLabel={docket.refLabel}
                teluguDate={teluguDate}
                mandalTe={displayTown}
                districtTe={district}
                recipientLine={
                  municipalMode
                    ? `గౌరవనీయులైన కమిషనర్ గారు, పురపాలక సంఘం / నగరపాలక సంస్థ, ${displayTown}`
                    : `గౌరవనీయులైన ${recipientOfficer} గారి సమక్షంలోకి:\n${mandal} / సర్కిల్, ${district} జిల్లా, తెలంగాణ రాష్ట్రం.`
                }
                verifyUrl={verifyUrl}
                docketId={docket.docketId}
              />

              <div className="mb-4 font-telugu text-xs leading-relaxed text-slate-700 print:mb-1 print:text-[11px]">
                <p>
                  <strong>ప్రదేశం:</strong> {locality}
                </p>
              </div>

              <div className="mb-4 border-l-4 border-civic-ink bg-slate-50 p-3 font-telugu text-xs font-bold leading-relaxed text-civic-ink md:text-sm print:mb-2 print:p-2 print:text-sm print:leading-snug">
                విషయం: {letterSubject}
              </div>

              <div className="mb-4 rounded border border-slate-300 bg-white p-3 font-telugu text-[11px] leading-relaxed text-slate-800 print:mb-2 print:p-2 print:text-[10px]">
                <p className="font-bold text-civic-ink">చట్టబద్ధమైన ఆధారం / Statutory Grounds:</p>
                <p className="mt-1 whitespace-pre-wrap">{statutoryBlock}</p>
              </div>

              <div className="space-y-4 text-justify font-telugu text-xs leading-relaxed text-slate-900 md:text-sm print:space-y-2 print:text-sm print:leading-snug">
                <p>
                  <strong>అయ్యా / ఆర్యా,</strong>
                </p>
                <p>
                  {municipalMode ? (
                    <>
                      మేము {district} జిల్లా, {displayTown} పురపాలక / నగరపాలక పరిధి,{" "}
                      {locality} ప్రాంతానికి చెందిన నాయి బ్రాహ్మణ, మంగలి మరియు సాంప్రదాయ
                      వృత్తిదారులము. మా కమ్యూనిటీ జీవనోపాధి మరియు సంక్షేమానికి సంబంధించి క్రింది
                      ముఖ్యమైన అంశాన్ని తమరి దృష్టికి తీసుకువస్తున్నాము.
                    </>
                  ) : (
                    <>
                      మేము {district} జిల్లా, {mandal} మండలం, {locality}{" "}
                      ప్రాంతానికి చెందిన నాయి బ్రాహ్మణ, మంగలి మరియు సాంప్రదాయ వృత్తిదారులము. మా కమ్యూనిటీ
                      జీవనోపాధి మరియు సంక్షేమానికి సంబంధించి క్రింది ముఖ్యమైన అంశాన్ని తమరి దృష్టికి
                      తీసుకువస్తున్నాము.
                    </>
                  )}
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

            <div className="print-signature-block print-seal-block mt-6 break-inside-avoid border-t border-slate-300 pt-8 font-telugu text-xs leading-relaxed md:text-sm print:mt-3 print:pt-3 print:text-sm">
              <div className="flex items-end justify-between gap-4">
                <div className="print-coordinator-ref">
                  <p className="font-sans text-[10px] font-semibold text-slate-600 print:text-[8px]">
                    డిజిటల్ వెరిఫికేషన్ కోడ్ | Scan to verify official record
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500 print:text-[8px]">
                    {docket.refLabel}
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

              <ReceivingStampBlock />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
