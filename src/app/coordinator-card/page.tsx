"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Printer,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  IdCard,
} from "lucide-react";
import { CommunityHubsSection } from "@/components/CommunityHubsSection";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";

const STORAGE_KEY = "ns.coordinator-card.v1";

type CardDraft = {
  name: string;
  role: string;
  mandal: string;
  district: string;
  phone: string;
};

const DEFAULTS: CardDraft = {
  name: "సమన్వయకర్త పేరు",
  role: "మండల సమన్వయకర్త (Mandal Coordinator)",
  mandal: "కోదాడ",
  district: "సూర్యాపేట",
  phone: "",
};

function readStoredDraft(): CardDraft {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<CardDraft>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : DEFAULTS.name,
      role: typeof parsed.role === "string" ? parsed.role : DEFAULTS.role,
      mandal: typeof parsed.mandal === "string" ? parsed.mandal : DEFAULTS.mandal,
      district:
        typeof parsed.district === "string" ? parsed.district : DEFAULTS.district,
      phone: typeof parsed.phone === "string" ? parsed.phone : DEFAULTS.phone,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Fine-line civic guilloche — SVG pattern overlay to deter casual card tampering. */
function GuillocheOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="ns-guilloche"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 24c8-16 16-16 24 0s16 16 24 0M0 0c8 16 16 16 24 0s16-16 24 0M0 48c8-16 16-16 24 0s16 16 24 0"
            fill="none"
            stroke="#0F172A"
            strokeWidth="0.55"
          />
          <circle
            cx="24"
            cy="24"
            r="10"
            fill="none"
            stroke="#B45309"
            strokeWidth="0.4"
            opacity="0.7"
          />
          <circle
            cx="24"
            cy="24"
            r="4"
            fill="none"
            stroke="#0F172A"
            strokeWidth="0.35"
          />
        </pattern>
        <radialGradient id="ns-guilloche-fade" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#ns-guilloche)" />
      <rect width="100%" height="100%" fill="url(#ns-guilloche-fade)" />
    </svg>
  );
}

export function CoordinatorCardClient() {
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState(DEFAULTS.name);
  const [role, setRole] = useState(DEFAULTS.role);
  const [mandal, setMandal] = useState(DEFAULTS.mandal);
  const [district, setDistrict] = useState(DEFAULTS.district);
  const [phone, setPhone] = useState(DEFAULTS.phone);

  // Instant offline restore from localStorage (no network required).
  // URL ?name=&role=&district=&mandal=&phone= from sprint cert / geo desks win after hydrate.
  useEffect(() => {
    const draft = readStoredDraft();
    const qName = searchParams.get("name")?.trim() || "";
    const qRole = searchParams.get("role")?.trim() || "";
    const qDistrict = searchParams.get("district")?.trim() || "";
    const qMandal =
      searchParams.get("mandal")?.trim() ||
      searchParams.get("zone")?.trim() ||
      "";
    const qPhone = searchParams.get("phone")?.trim() || "";

    setName(qName || draft.name);
    setRole(qRole || draft.role);
    setPhone(qPhone || draft.phone);
    setDistrict(qDistrict || draft.district);
    setMandal(qMandal || draft.mandal);
    setHydrated(true);
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: CardDraft = { name, role, mandal, district, phone };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* quota / private mode — card still works in-session */
    }
  }, [hydrated, name, role, mandal, district, phone]);

  const botUrl = useMemo(
    () =>
      `https://t.me/NayiSamakhyaDeskBot?start=ref_${encodeURIComponent(mandal || "desk")}`,
    [mandal],
  );
  const qrCodeUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(botUrl)}`,
    [botUrl],
  );

  /** Best-effort English slug for regional hub highlighting. */
  const districtSlugHint = useMemo(() => {
    const q = district.trim().toLowerCase();
    if (!q) return "";
    const hit = TELANGANA_DISTRICTS.find(
      (d) =>
        d.slug === q ||
        d.name_en.toLowerCase() === q ||
        d.name_te === district.trim(),
    );
    return hit?.slug || "";
  }, [district]);

  return (
    <div className="flex min-h-screen flex-col bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <header className="no-print sticky top-0 z-20 border-b border-civic-border bg-white shadow-xs print:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <Link
              href="/"
              className="mt-0.5 shrink-0 rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink sm:mt-0"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <IdCard className="h-4 w-4 shrink-0 text-civic-bronze" />
                <h1 className="font-telugu text-base font-bold leading-snug text-civic-ink md:text-lg">
                  {"సమన్వయకర్త డిజిటల్ కార్డు"}
                </h1>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                Executive Civic ID — Offline-ready · Guilloche secured
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-civic-bronze px-3.5 py-2.5 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover sm:w-auto sm:py-2"
          >
            <Printer className="h-4 w-4" />
            {"ప్రింట్ / PDF సేవ్"}
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-8 print:m-0 print:max-w-none print:p-0">
        <section className="no-print w-full rounded-2xl border border-civic-border bg-white p-5 shadow-xs print:hidden">
          <h2 className="mb-3 flex items-center gap-2 font-telugu text-sm font-bold text-civic-ink">
            <ShieldCheck className="h-4 w-4 text-civic-bronze" />
            {"వివరాలు నమోదు చేయండి"}
          </h2>
          <p className="mb-3 font-telugu text-[11px] text-slate-500">
            {"ఈ వివరాలు మీ ఫోన్‌లో సేవ్ అవుతాయి — నెట్‌వర్క్ లేకున్నా కార్డు కనిపిస్తుంది."}
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-telugu font-medium text-slate-600">
                {"పూర్తి పేరు"} (Full Name):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-telugu font-medium text-slate-600">
                {"బాధ్యత / హోదా"} (Designation):
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"మండలం"} (Mandal):
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
                  {"జిల్లా"} (District):
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
                {"మొబైల్ నంబర్"} (Mobile Phone):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 text-civic-ink focus:border-civic-bronze focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Print-isolated executive card (~CR80 visual ratio) */}
        <div
          id="coordinator-print-card"
          className="print-only-document print-document printable-card relative flex h-[220px] w-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-civic-border bg-white p-5 shadow-xl print:m-0 print:rounded-none print:border print:border-civic-ink print:shadow-none"
        >
          <GuillocheOverlay />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-1.5 bg-civic-bronze" />
          <div className="pointer-events-none absolute -right-10 -top-10 z-[1] h-28 w-28 rounded-full bg-civic-bronze/10 blur-2xl" />

          <div className="relative z-[2] flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-telugu text-sm font-bold tracking-wide text-civic-bronze">
                <ShieldCheck className="h-4 w-4" />
                {"నాయి సమాఖ్య తెలంగాణ"}
              </div>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                Official Coordinator Desk
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-civic-border bg-white p-1 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Desk bot QR"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="relative z-[2] my-auto">
            <h3 className="font-telugu text-base font-bold tracking-tight text-civic-ink">
              {name}
            </h3>
            <p className="font-telugu text-[11px] font-semibold text-civic-bronze">
              {role}
            </p>
            <div className="mt-1.5 flex items-center gap-1 font-telugu text-[11px] text-civic-navy">
              <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span>
                {mandal} {"మండలం"}, {district} {"జిల్లా"}
              </span>
            </div>
          </div>

          <div className="relative z-[2] flex items-center justify-between border-t border-civic-border pt-2 text-[10px] text-slate-500">
            <div className="flex items-center gap-1 font-semibold text-civic-ink">
              <Phone className="h-3 w-3 text-civic-bronze" />
              +91 {phone || "—"}
            </div>
            <span className="text-[9px] tracking-wide text-slate-500">
              nayisamakhya.org · SECURE
            </span>
          </div>
        </div>

        <p className="no-print max-w-md text-center font-telugu text-[11px] leading-relaxed text-slate-500 print:hidden">
          {
            "ప్రింట్ తీసుకున్నప్పుడు కేవలం కార్డు మాత్రమే విభజనపడుతుంది. QR స్కాన్ చేస్తే సేవా డెస్క్ బాట్‌కు తెరుస్తుంది. గిల్లోష్ ప్యాటర్న్ ట్యాంపరింగ్ నిరోధం కోసం."
          }
        </p>

        <div className="no-print w-full max-w-md print:hidden">
          <CommunityHubsSection
            highlightDistrict={districtSlugHint}
            pulseHubId={
              districtSlugHint === "suryapet" || districtSlugHint === "kodad"
                ? "south-telangana"
                : undefined
            }
          />
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: auto; margin: 10mm; }
          body * { visibility: hidden !important; }
          #coordinator-print-card,
          #coordinator-print-card * { visibility: visible !important; }
          #coordinator-print-card {
            position: absolute !important;
            left: 50% !important;
            top: 12mm !important;
            transform: translateX(-50%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}

export default function CoordinatorCardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-civic-paper font-telugu text-sm text-slate-500">
          కార్డు లోడ్ అవుతోంది…
        </div>
      }
    >
      <CoordinatorCardClient />
    </Suspense>
  );
}
