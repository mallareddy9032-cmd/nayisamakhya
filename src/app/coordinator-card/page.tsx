"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Printer,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  IdCard,
} from "lucide-react";
import { HubJoinLinks } from "@/components/comms/HubJoinLinks";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";

export default function CoordinatorCardPage() {
  const [name, setName] = useState(
    "\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 \u0c2a\u0c47\u0c30\u0c41",
  );
  const [role, setRole] = useState(
    "\u0c2e\u0c02\u0c21\u0c32 \u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 (Mandal Coordinator)",
  );
  const [mandal, setMandal] = useState("\u0c15\u0c4b\u0c26\u0c3e\u0c21");
  const [district, setDistrict] = useState(
    "\u0c38\u0c42\u0c30\u0c4d\u0c2f\u0c3e\u0c2a\u0c47\u0c1f",
  );
  const [phone, setPhone] = useState("");

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
                  {
                    "\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41"
                  }
                </h1>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                Executive Civic ID — Print / Laminate Ready
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-civic-bronze px-3.5 py-2.5 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover sm:w-auto sm:py-2"
          >
            <Printer className="h-4 w-4" />
            {
              "\u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d / PDF \u0c38\u0c47\u0c35\u0c4d"
            }
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-8 print:m-0 print:max-w-none print:p-0">
        <section className="no-print w-full rounded-2xl border border-civic-border bg-white p-5 shadow-xs print:hidden">
          <h2 className="mb-3 flex items-center gap-2 font-telugu text-sm font-bold text-civic-ink">
            <ShieldCheck className="h-4 w-4 text-civic-bronze" />
            {
              "\u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f"
            }
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-telugu font-medium text-slate-600">
                {"\u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c2a\u0c47\u0c30\u0c41"}{" "}
                (Full Name):
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
                {
                  "\u0c2c\u0c3e\u0c27\u0c4d\u0c2f\u0c24 / \u0c39\u0c4b\u0c26\u0c3e"
                }{" "}
                (Designation):
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
                  {"\u0c2e\u0c02\u0c21\u0c32\u0c02"} (Mandal):
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
                  {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e"} (District):
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
                {
                  "\u0c2e\u0c4a\u0c2c\u0c48\u0c32\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d"
                }{" "}
                (Mobile Phone):
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
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-civic-bronze" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-civic-bronze/10 blur-2xl" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-telugu text-sm font-bold tracking-wide text-civic-bronze">
                <ShieldCheck className="h-4 w-4" />
                {
                  "\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23"
                }
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

          <div className="my-auto">
            <h3 className="font-telugu text-base font-bold tracking-tight text-civic-ink">
              {name}
            </h3>
            <p className="font-telugu text-[11px] font-semibold text-civic-bronze">
              {role}
            </p>
            <div className="mt-1.5 flex items-center gap-1 font-telugu text-[11px] text-civic-navy">
              <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span>
                {mandal} {"\u0c2e\u0c02\u0c21\u0c32\u0c02"}, {district}{" "}
                {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-civic-border pt-2 text-[10px] text-slate-500">
            <div className="flex items-center gap-1 font-semibold text-civic-ink">
              <Phone className="h-3 w-3 text-civic-bronze" />
              +91 {phone || "—"}
            </div>
            <span className="text-[9px] tracking-wide text-slate-500">
              nayisamakhya.org
            </span>
          </div>
        </div>

        <p className="no-print max-w-md text-center font-telugu text-[11px] leading-relaxed text-slate-500 print:hidden">
          {
            "\u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d \u0c24\u0c40\u0c38\u0c41\u0c15\u0c41\u0c28\u0c4d\u0c28\u0c2a\u0c4d\u0c2a\u0c41\u0c21\u0c41 \u0c15\u0c47\u0c35\u0c32 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41 \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47 \u0c35\u0c3f\u0c2d\u0c1c\u0c28\u0c2a\u0c21\u0c41\u0c24\u0c41\u0c02\u0c26\u0c3f. QR \u0c38\u0c4d\u0c15\u0c3e\u0c28\u0c4d \u0c1a\u0c47\u0c38\u0c4d\u0c24\u0c47 \u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d \u0c2c\u0c3e\u0c1f\u0c4d\u0c15\u0c41 \u0c24\u0c46\u0c30\u0c41\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f."
          }
        </p>

        <div className="no-print w-full max-w-md print:hidden">
          <HubJoinLinks districtHint={districtSlugHint} />
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
