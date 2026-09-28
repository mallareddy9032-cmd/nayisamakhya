"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Phone, ShieldAlert, Loader2 } from "lucide-react";
import { parseDocketId } from "@/lib/representation/docket";
import { formatTeluguOfficialDate } from "@/lib/representation/docket";

type DocketPayload = {
  docket_id: string;
  category_id?: string;
  category_te?: string;
  district_slug?: string;
  district_te?: string;
  mandal_slug?: string;
  mandal_te?: string;
  statutory_te?: string;
  subject_te?: string;
  issued_at?: string;
  district_code?: string;
  year?: number;
};

type FetchState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ok"; found: boolean; docket: DocketPayload };

const HELPLINE = "+91 9032654111";
const HELPLINE_WA = "https://wa.me/919032654111";

export function VerifyDocketClient({ docketId: rawId }: { docketId: string }) {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    const id = rawId.trim().toUpperCase();
    const parsed = parseDocketId(id);
    if (!parsed) {
      setState({ status: "invalid" });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/petitions/docket/${encodeURIComponent(parsed.docketId)}`, {
          cache: "no-store",
        });
        const json = (await res.json().catch(() => null)) as {
          found?: boolean;
          docket?: DocketPayload;
        } | null;
        if (cancelled) return;
        setState({
          status: "ok",
          found: Boolean(json?.found),
          docket: json?.docket || {
            docket_id: parsed.docketId,
            district_code: parsed.districtCode,
            year: parsed.year,
          },
        });
      } catch {
        if (cancelled) return;
        setState({
          status: "ok",
          found: false,
          docket: {
            docket_id: parsed.docketId,
            district_code: parsed.districtCode,
            year: parsed.year,
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rawId]);

  if (state.status === "loading") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <p className="flex items-center gap-2 font-telugu text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          రికార్డు ధృవీకరిస్తున్నాము…
        </p>
      </main>
    );
  }

  if (state.status === "invalid") {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-600" aria-hidden />
          <h1 className="mt-3 font-telugu text-lg font-bold text-slate-900">
            చెల్లని డాకెట్ ఐడీ
          </h1>
          <p className="mt-2 font-telugu text-sm text-slate-600">
            ఈ రిఫరెన్స్ సంఖ్య అధికారిక ఫార్మాట్‌కు సరిపోలడం లేదు. దయచేసి QR కోడ్‌ను మళ్లీ స్కాన్ చేయండి.
          </p>
          <a
            href={HELPLINE_WA}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-telugu text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" aria-hidden />
            సహాయవాణి {HELPLINE}
          </a>
        </div>
      </main>
    );
  }

  const d = state.docket;
  const issuedLabel = d.issued_at
    ? formatTeluguOfficialDate(new Date(d.issued_at))
    : formatTeluguOfficialDate(new Date());

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
      {/* Security watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, transparent, transparent 40px, #0f172a 40px, #0f172a 41px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 -rotate-12 text-center font-telugu text-4xl font-black tracking-widest text-slate-900 opacity-[0.03] sm:text-6xl"
      >
        నాయీ సమఖ్య · VERIFIED
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <header className="text-center">
          <p className="font-telugu text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Nayi Samakhya Telangana
          </p>
          <h1 className="mt-2 font-telugu text-xl font-black leading-snug text-slate-900 sm:text-2xl">
            నాయీ సమఖ్య తెలంగాణ — అధికారిక వినతిపత్ర రికార్డు ధృవీకరణ
          </h1>
        </header>

        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1.5 font-telugu text-sm font-bold text-emerald-900 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            ధృవీకరించబడిన రికార్డు (Officially Verified Record)
          </span>
        </div>

        {!state.found && (
          <p className="mt-3 text-center font-telugu text-xs text-slate-500">
            డాకెట్ ఫార్మాట్ ధృవీకరించబడింది. పూర్తి మెటాడేటా సర్వర్‌లో నమోదు కాకపోతే స్థానిక జనరేటర్ రికార్డు.
          </p>
        )}

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm">
          <table className="w-full border-collapse text-left font-telugu text-sm">
            <tbody>
              <MetaRow label="డాకెట్ ఐడీ (Docket ID)" value={d.docket_id} mono />
              <MetaRow
                label="సమస్య వర్గం (Issue Category)"
                value={d.category_te || "—"}
              />
              <MetaRow
                label="జిల్లా / మండలం"
                value={
                  [d.district_te, d.mandal_te].filter(Boolean).join(" · ") ||
                  (d.district_code ? `కోడ్ ${d.district_code}` : "—")
                }
              />
              <MetaRow label="జారీ చేసిన తేదీ" value={issuedLabel} />
              <MetaRow
                label="చట్టబద్ధమైన జీవో సూచిక"
                value={d.statutory_te || "—"}
              />
              {d.subject_te ? (
                <MetaRow label="విషయం" value={d.subject_te} />
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center font-telugu text-xs leading-relaxed text-slate-600">
          ఈ రికార్డు అధికారిక పౌర డిజిటల్ సిస్టమ్ ద్వారా రూపొందించబడింది. ఏవైనా సందేహాలుంటే{" "}
          <strong>{HELPLINE}</strong> కు సంప్రదించవచ్చు.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={HELPLINE_WA}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-telugu text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            <Phone className="h-4 w-4" aria-hidden />
            సహాయవాణి / WhatsApp
          </a>
          <Link
            href="/representation"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-telugu text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            కొత్త వినతిపత్రం
          </Link>
        </div>
      </div>
    </main>
  );
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <th
        scope="row"
        className="w-[38%] bg-slate-50 px-3 py-3 align-top text-xs font-semibold text-slate-600 sm:px-4"
      >
        {label}
      </th>
      <td
        className={`px-3 py-3 align-top text-slate-900 sm:px-4 ${
          mono ? "font-mono text-xs font-bold tracking-wide" : "text-sm leading-relaxed"
        }`}
      >
        {value}
      </td>
    </tr>
  );
}
