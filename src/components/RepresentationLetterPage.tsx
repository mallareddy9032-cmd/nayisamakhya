"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  AUTHORITIES,
  SUBJECT_OPTIONS,
} from "@/lib/data/representationLetterOptions";
import {
  PDF_LOADING_TE,
  OPEN_EXTERNAL_BROWSER_LABEL,
  downloadPetitionPdf,
  isTelegramWebApp,
  openCurrentPageExternally,
  shouldUsePdfFallback,
} from "@/lib/twa/printPetitionPdf";

interface TemplateOption {
  id: string;
  title: string;
  category: string;
  subject: string;
  body: string;
}

/** Civic presets + SUBJECT_OPTIONS (incl. free_power for TWA deep links). */
const TEMPLATES: TemplateOption[] = [
  {
    id: "modern_salon_space",
    title: "\u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c37\u0c3e\u0c2a\u0c41\u0c32 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c38\u0c4d\u0c25\u0c32 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c2a\u0c41",
    category: "\u0c2e\u0c4c\u0c32\u0c3f\u0c15 \u0c35\u0c38\u0c24\u0c41\u0c32\u0c41 (Infrastructure)",
    subject: "\u0c17\u0c4d\u0c30\u0c3e\u0c2e/\u0c2a\u0c1f\u0c4d\u0c1f\u0c23 \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c15\u0c3e\u0c02\u0c2a\u0c4d\u0c32\u0c46\u0c15\u0c4d\u0c38\u0c4d \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c4d\u0c25\u0c32\u0c02 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c1a\u0c41\u0c1f \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f \u0c35\u0c3f\u0c28\u0c24\u0c3f.",
    body: "\u0c2e\u0c3e \u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c02\u0c32\u0c4b \u0c05\u0c28\u0c47\u0c15 \u0c38\u0c02\u0c35\u0c24\u0c4d\u0c38\u0c30\u0c3e\u0c32\u0c41\u0c17\u0c3e \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c05\u0c26\u0c4d\u0c26\u0c46 \u0c37\u0c3e\u0c2a\u0c41\u0c32\u0c32\u0c4b \u0c05\u0c27\u0c3f\u0c15 \u0c05\u0c26\u0c4d\u0c26\u0c46\u0c32\u0c41 \u0c1a\u0c46\u0c32\u0c4d\u0c32\u0c3f\u0c02\u0c1a\u0c32\u0c47\u0c15 \u0c24\u0c40\u0c35\u0c4d\u0c30 \u0c06\u0c30\u0c4d\u0c25\u0c3f\u0c15 \u0c07\u0c2c\u0c4d\u0c2c\u0c02\u0c26\u0c41\u0c32\u0c41 \u0c0e\u0c26\u0c41\u0c30\u0c4d\u0c15\u0c4a\u0c02\u0c1f\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c30\u0c41. \u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c38\u0c4d\u0c25\u0c3e\u0c28\u0c3f\u0c15 \u0c17\u0c4d\u0c30\u0c3e\u0c2e \u0c2a\u0c02\u0c1a\u0c3e\u0c2f\u0c24\u0c40/\u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c3e\u0c32\u0c3f\u0c1f\u0c40 \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b\u0c28\u0c3f \u0c05\u0c28\u0c41\u0c35\u0c48\u0c28 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c4d\u0c25\u0c32\u0c02\u0c32\u0c4b \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d\u0c32 \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3e\u0c23\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c4d\u0c25\u0c32\u0c02 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c1a\u0c3f, \u0c38\u0c39\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.",
  },
  ...SUBJECT_OPTIONS.map((opt) => ({
    id: opt.id,
    title: opt.subj_te.length > 48 ? `${opt.subj_te.slice(0, 48)}\u2026` : opt.subj_te,
    category: opt.ref_te.length > 40 ? `${opt.ref_te.slice(0, 40)}\u2026` : opt.ref_te,
    subject: opt.subj_te,
    body: opt.default_body_te,
  })),
  {
    id: "id_cards_welfare",
    title: "\u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41",
    category: "\u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 & \u0c30\u0c15\u0c4d\u0c37\u0c23 (Civic Rights)",
    subject: "\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2c\u0c4b\u0c30\u0c4d\u0c21\u0c41 \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c05\u0c30\u0c4d\u0c39\u0c41\u0c32\u0c48\u0c28 \u0c38\u0c3e\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c02\u0c26\u0c30\u0c3f\u0c15\u0c40 \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c1c\u0c3e\u0c30\u0c40 \u0c1a\u0c47\u0c2f\u0c41\u0c1f \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f.",
    body: "\u0c2e\u0c3e \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c2a\u0c48 \u0c06\u0c27\u0c3e\u0c30\u0c2a\u0c21\u0c3f \u0c1c\u0c40\u0c35\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28 \u0c15\u0c3e\u0c30\u0c4d\u0c2e\u0c3f\u0c15\u0c41\u0c32\u0c15\u0c41 \u0c0e\u0c1f\u0c41\u0c35\u0c02\u0c1f\u0c3f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c32\u0c47\u0c15\u0c2a\u0c4b\u0c35\u0c21\u0c02 \u0c35\u0c32\u0c4d\u0c32 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41, \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c2c\u0c40\u0c2e\u0c3e \u0c05\u0c02\u0c26\u0c21\u0c02 \u0c32\u0c47\u0c26\u0c41. \u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c38\u0c30\u0c4d\u0c35\u0c47 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c3f\u0c02\u0c1a\u0c3f \u0c05\u0c30\u0c4d\u0c39\u0c41\u0c32\u0c48\u0c28 \u0c2a\u0c4d\u0c30\u0c24\u0c3f \u0c12\u0c15\u0c4d\u0c15\u0c30\u0c3f\u0c15\u0c40 \u0c24\u0c15\u0c4d\u0c37\u0c23\u0c2e\u0c47 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c05\u0c02\u0c26\u0c1c\u0c47\u0c2f\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.",
  },
];

function resolveAuthorityTitle(authorityId: string | null): string {
  if (!authorityId) return AUTHORITIES[0].title_te;
  const match = AUTHORITIES.find((a) => a.id === authorityId);
  return match?.title_te || AUTHORITIES[0].title_te;
}

function resolveTemplateId(subjectId: string | null): string {
  if (!subjectId) return TEMPLATES[0].id;
  const match = TEMPLATES.find((t) => t.id === subjectId);
  return match?.id || TEMPLATES[0].id;
}

export function RepresentationLetterPage() {
  const searchParams = useSearchParams();
  const initialMandal = searchParams.get("mandal") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialLocality = searchParams.get("locality") || "";
  const initialAuthority = searchParams.get("authority");
  const initialSubject = searchParams.get("subject");

  const [applicantName, setApplicantName] = useState("\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 / \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c28\u0c3f \u0c2a\u0c47\u0c30\u0c41");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [district, setDistrict] = useState(initialDistrict || "\u0c38\u0c42\u0c30\u0c4d\u0c2f\u0c3e\u0c2a\u0c47\u0c1f");
  const [mandal, setMandal] = useState(initialMandal || "\u0c15\u0c4b\u0c26\u0c3e\u0c21");
  const [locality, setLocality] = useState(initialLocality || "\u0c17\u0c3e\u0c02\u0c27\u0c40 \u0c28\u0c17\u0c30\u0c4d");
  const [recipientOfficer, setRecipientOfficer] = useState<string>(
    resolveAuthorityTitle(initialAuthority),
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    resolveTemplateId(initialSubject),
  );
  const [recordId, setRecordId] = useState("------");
  const [letterDate, setLetterDate] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [inTelegram, setInTelegram] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextDistrict = searchParams.get("district") || "";
    const nextMandal = searchParams.get("mandal") || "";
    const nextLocality = searchParams.get("locality") || "";
    const nextAuthority = searchParams.get("authority");
    const nextSubject = searchParams.get("subject");
    if (nextDistrict) setDistrict(nextDistrict);
    if (nextMandal) setMandal(nextMandal);
    if (nextLocality) setLocality(nextLocality);
    if (nextAuthority) setRecipientOfficer(resolveAuthorityTitle(nextAuthority));
    if (nextSubject) setSelectedTemplateId(resolveTemplateId(nextSubject));
  }, [searchParams]);

  useEffect(() => {
    setRecordId(Date.now().toString().slice(-6));
    setLetterDate(new Date().toLocaleDateString("te-IN"));
  }, []);

  useEffect(() => {
    const sync = () => {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      setInTelegram(isTelegramWebApp() || /Telegram/i.test(ua));
    };
    sync();
    // Telegram injects WebApp shortly after script load.
    const t = window.setTimeout(sync, 400);
    return () => window.clearTimeout(t);
  }, []);

  const handlePrintOrPdf = useCallback(async () => {
    setPdfError(null);
    if (!shouldUsePdfFallback()) {
      window.print();
      return;
    }
    const el = letterRef.current;
    if (!el) {
      setPdfError(
        "\u0c2a\u0c40\u0c21\u0c40\u0c0e\u0c2b\u0c4d \u0c38\u0c3f\u0c26\u0c4d\u0c27\u0c02 \u0c15\u0c3e\u0c28\u0c30\u0c41. \u0c2e\u0c33\u0c4d\u0c32\u0c40 \u0c2a\u0c4d\u0c30\u0c2f\u0c24\u0c4d\u0c28\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f \u0c32\u0c47\u0c26\u0c3e External Browser \u0c32\u0c4b \u0c24\u0c46\u0c30\u0c35\u0c02\u0c21\u0c3f.",
      );
      return;
    }
    setPdfBusy(true);
    try {
      await downloadPetitionPdf(
        el,
        `nayi-samakhya-vinathipatra-${recordId || "letter"}.pdf`,
      );
    } catch (err) {
      console.error("petition PDF generation failed", err);
      setPdfError(
        "\u0c2a\u0c40\u0c21\u0c40\u0c0e\u0c2b\u0c4d \u0c24\u0c2f\u0c3e\u0c30\u0c41 \u0c35\u0c3f\u0c2b\u0c32\u0c2e\u0c48\u0c02\u0c26\u0c3f. External Browser \u0c32\u0c4b \u0c24\u0c46\u0c30\u0c3f\u0c1a\u0c3f \u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.",
      );
    } finally {
      setPdfBusy(false);
    }
  }, [recordId]);

  const officerOptions = useMemo(
    () =>
      AUTHORITIES.map((a) => ({
        value: a.title_te,
        label: `${a.title_te} (${a.title_en})`,
      })),
    [],
  );

  const activeTemplate =
    TEMPLATES.find((tmpl) => tmpl.id === selectedTemplateId) || TEMPLATES[0];

  return (
    <div className="min-h-screen bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white print:bg-white print:text-black">
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => {
          const ua = navigator.userAgent || "";
          setInTelegram(isTelegramWebApp() || /Telegram/i.test(ua));
        }}
      />
      {inTelegram ? (
        <div className="no-print fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-[max(0.5rem,env(safe-area-inset-top))] print:hidden">
          <button
            type="button"
            onClick={() => openCurrentPageExternally()}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-civic-bronze/40 bg-civic-ink px-4 py-2.5 font-telugu text-xs font-bold text-white shadow-lg shadow-slate-900/30"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{OPEN_EXTERNAL_BROWSER_LABEL}</span>
          </button>
        </div>
      ) : null}

      {pdfBusy ? (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 print:hidden"
          role="status"
          aria-live="polite"
        >
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
            <Loader2 className="h-7 w-7 animate-spin text-civic-bronze" />
            <p className="font-telugu text-sm font-semibold text-civic-ink">
              {PDF_LOADING_TE}
            </p>
          </div>
        </div>
      ) : null}

      <header
        className={`no-print sticky z-20 border-b border-civic-border bg-white shadow-xs print:hidden ${
          inTelegram ? "top-14" : "top-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-civic-bronze" />
                <h1 className="font-telugu text-base font-bold text-civic-ink md:text-lg">
                  {"\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40 \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02"}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                Official Representation &amp; Citizen Petition Generator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handlePrintOrPdf()}
            disabled={pdfBusy}
            className="inline-flex items-center gap-2 rounded-xl bg-civic-bronze px-4 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover hover:shadow-md disabled:cursor-wait disabled:opacity-70"
          >
            {pdfBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d / PDF \u0c38\u0c47\u0c35\u0c4d"}
          </button>
        </div>
        {pdfError ? (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center font-telugu text-xs font-medium text-red-800">
            {pdfError}{" "}
            <button
              type="button"
              className="underline"
              onClick={() => openCurrentPageExternally()}
            >
              {OPEN_EXTERNAL_BROWSER_LABEL}
            </button>
          </div>
        ) : null}
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12 print:m-0 print:block print:p-0">
        <section className="no-print space-y-5 print:hidden lg:col-span-5">
          <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
            <h2 className="mb-3 flex items-center gap-2 font-telugu text-sm font-bold text-civic-ink">
              <Sparkles className="h-4 w-4 text-civic-bronze" />
              {"\u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f"}
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c26\u0c30\u0c16\u0c3e\u0c38\u0c4d\u0c24\u0c41\u0c26\u0c3e\u0c30\u0c41\u0c28\u0c3f \u0c2a\u0c47\u0c30\u0c41 / \u0c38\u0c02\u0c18\u0c02 \u0c2a\u0c47\u0c30\u0c41:"}
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c3f\u0c02\u0c1a\u0c3e\u0c32\u0c4d\u0c38\u0c3f\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f (To Authority):"}
                </label>
                <select
                  value={recipientOfficer}
                  onChange={(e) => setRecipientOfficer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                >
                  {officerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-telugu font-medium text-slate-600">
                    {"\u0c2e\u0c02\u0c21\u0c32\u0c02 (Mandal):"}
                  </label>
                  <input
                    type="text"
                    value={mandal}
                    onChange={(e) => setMandal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-telugu font-medium text-slate-600">
                    {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e (District):"}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c02 / \u0c15\u0c3e\u0c32\u0c28\u0c40 (Locality):"}
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c2a\u0c41 \u0c28\u0c02\u0c2c\u0c30\u0c4d (Phone):"}
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
            <p className="mb-3 block font-telugu text-xs font-bold text-civic-ink">
              {"\u0c35\u0c3f\u0c28\u0c24\u0c3f \u0c05\u0c02\u0c36\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c0e\u0c02\u0c1a\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f (Select Matter):"}
            </p>
            <div className="max-h-[28rem] space-y-2 overflow-y-auto" role="listbox" aria-label="Petition templates">
              {TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full cursor-pointer rounded-xl border p-3 text-left text-xs transition-all ${
                      isSelected
                        ? "border-civic-bronze bg-civic-bronze/5 ring-1 ring-civic-bronze"
                        : "border-civic-border bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between font-telugu font-bold text-civic-ink">
                      <span>{tmpl.title}</span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-civic-bronze" />
                      ) : null}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {tmpl.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex justify-center lg:col-span-7 print:block print:w-full">
          <div
            ref={letterRef}
            id="representation-letter-print"
            translate="no"
            lang="te"
            className="print-only-document print-document printable-card flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between rounded-lg border border-slate-300 bg-white p-10 shadow-xl md:p-14 print:m-0 print:min-h-0 print:w-full print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none"
          >
            <div className="print:space-y-2">
              <div className="mb-8 border-b-2 border-civic-ink pb-6 text-center print:mb-2 print:pb-2">
                <h2 className="font-telugu text-xl font-black tracking-wide text-civic-ink md:text-2xl print:text-base">
                  {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 (REPRESENTATION)"}
                </h2>
                <p className="mt-1 font-telugu text-xs font-semibold text-slate-600 print:mt-0.5 print:text-[10px]">
                  {"\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c39\u0c15\u0c4d\u0c15\u0c41\u0c32 \u0c2a\u0c30\u0c3f\u0c30\u0c15\u0c4d\u0c37\u0c23 \u0c35\u0c47\u0c26\u0c3f\u0c15"}
                </p>
                <div className="mt-0.5 font-telugu text-[11px] text-slate-500 print:text-[9px]">
                  {"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02 | \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41 \u0c10\u0c21\u0c40: NS-TEL-"}{recordId}
                </div>
              </div>

              <div className="mb-8 flex items-start justify-between font-telugu text-xs leading-relaxed md:text-sm print:mb-2 print:text-sm print:leading-snug">
                <div>
                  <p className="font-bold text-civic-ink">{"\u0c38\u0c4d\u0c35\u0c40\u0c15\u0c30\u0c4d\u0c24 (To):"}</p>
                  <p className="font-semibold text-slate-800">{recipientOfficer},</p>
                  <p className="text-slate-700">
                    {mandal} {"\u0c2e\u0c02\u0c21\u0c32 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c3e\u0c32\u0c2f\u0c02,"}
                  </p>
                  <p className="text-slate-700">
                    {district} {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e, \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02."}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-slate-700">
                    <strong>{"\u0c24\u0c47\u0c26\u0c40:"}</strong>{" "}
                    {letterDate || "\u2014"}
                  </p>
                  <p className="text-slate-700">
                    <strong>{"\u0c2a\u0c4d\u0c30\u0c26\u0c47\u0c36\u0c02:"}</strong> {locality}
                  </p>
                </div>
              </div>

              <div className="mb-6 border-l-4 border-civic-ink bg-slate-50 p-3 font-telugu text-xs font-bold leading-relaxed text-civic-ink md:text-sm print:mb-2 print:p-2 print:text-sm print:leading-snug">
                {"\u0c35\u0c3f\u0c37\u0c2f\u0c02:"} {activeTemplate.subject}
              </div>

              <div className="space-y-4 text-justify font-telugu text-xs leading-loose text-slate-900 md:text-sm print:space-y-2 print:text-sm print:leading-snug">
                <p>
                  <strong>{"\u0c05\u0c2f\u0c4d\u0c2f\u0c3e / \u0c06\u0c30\u0c4d\u0c2f\u0c3e,"}</strong>
                </p>
                <p>
                  {"\u0c2e\u0c47\u0c2e\u0c41"} {district} {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e,"}{" "}
                  {mandal} {"\u0c2e\u0c02\u0c21\u0c32\u0c02,"} {locality}{" "}
                  {"\u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c1a\u0c46\u0c02\u0c26\u0c3f\u0c28 \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c3e\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c2e\u0c41. \u0c2e\u0c3e \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c1c\u0c40\u0c35\u0c28\u0c4b\u0c2a\u0c3e\u0c27\u0c3f \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c02\u0c2c\u0c02\u0c27\u0c3f\u0c02\u0c1a\u0c3f \u0c15\u0c4d\u0c30\u0c3f\u0c02\u0c26\u0c3f \u0c2e\u0c41\u0c16\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c05\u0c02\u0c36\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c24\u0c2e\u0c30\u0c3f \u0c26\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c15\u0c3f \u0c24\u0c40\u0c38\u0c41\u0c15\u0c41\u0c35\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41."}
                </p>
                <p className="rounded-md border border-civic-border bg-civic-paper p-3 font-medium text-slate-800 print:p-2">
                  {activeTemplate.body}
                </p>
                <p>{"\u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c38\u0c4d\u0c2a\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c3f, \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23 \u0c1a\u0c47\u0c2a\u0c1f\u0c4d\u0c1f\u0c3f \u0c2e\u0c3e \u0c28\u0c4d\u0c2f\u0c3e\u0c2f\u0c2e\u0c48\u0c28 \u0c05\u0c2d\u0c4d\u0c2f\u0c30\u0c4d\u0c25\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c3f\u0c37\u0c4d\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41."}</p>
              </div>
            </div>

            <div className="print-signature-block mt-8 flex break-inside-avoid items-end justify-between border-t border-slate-300 pt-12 font-telugu text-xs md:text-sm print:mt-3 print:pt-4 print:text-sm">
              <div>
                <p className="font-sans text-[11px] text-slate-500 print:text-[9px]">
                  Verification Stamp / Ref: nayisamakhya.org
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {"\u0c2b\u0c4b\u0c28\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d:"} +91 {applicantPhone || "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-slate-700">{"\u0c2d\u0c35\u0c26\u0c40\u0c2f\u0c41\u0c21\u0c41 / \u0c07\u0c1f\u0c4d\u0c32\u0c41,"}</p>
                <div className="flex h-12 items-end justify-end print:h-8">
                  <span className="font-sans text-[11px] italic text-slate-400 print:text-[9px]">
                    {"( \u0c38\u0c02\u0c24\u0c15\u0c02 / Signature )"}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-civic-ink">{applicantName}</p>
                <p className="text-xs text-slate-600 print:text-[10px]">
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
