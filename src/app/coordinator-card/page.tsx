"use client";

import React, { useState } from "react";
import { Printer, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function CoordinatorCardPage() {
  const [name, setName] = useState(
    "\u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 \u0C2A\u0C47\u0C30\u0C41",
  );
  const [role, setRole] = useState(
    "\u0C2E\u0C02\u0C21\u0C32 \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 (Mandal Coordinator)",
  );
  const [mandal, setMandal] = useState("\u0C15\u0C4B\u0C26\u0C3E\u0C21");
  const [district, setDistrict] = useState(
    "\u0C38\u0C42\u0C30\u0C4D\u0C2F\u0C3E\u0C2A\u0C47\u0C1F",
  );
  const [phone, setPhone] = useState("9876543210");

  const botUrl = `https://t.me/NayiSamakhyaDeskBot?start=ref_${encodeURIComponent(mandal)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(botUrl)}`;

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-4 text-slate-100 md:p-8">
      {/* Controls - Hidden during Print */}
      <div className="mb-8 w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl print:hidden">
        <h2 className="mb-3 text-sm font-bold text-white">
          {"\u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41 \u0C24\u0C2F\u0C3E\u0C30\u0C40"}
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block text-slate-400">
              {"\u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F \u0C2A\u0C47\u0C30\u0C41"} (Full Name):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-400">
              {"\u0C2C\u0C3E\u0C27\u0C4D\u0C2F\u0C24 / \u0C39\u0C4B\u0C26\u0C3E"} (Designation):
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-slate-400">
                {"\u0C2E\u0C02\u0C21\u0C32\u0C02"} (Mandal):
              </label>
              <input
                type="text"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-400">
                {"\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E"} (District):
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-slate-400">
              {"\u0C2E\u0C4A\u0C2C\u0C48\u0C32\u0C4D \u0C28\u0C02\u0C2C\u0C30\u0C4D"} (Mobile Phone):
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 font-bold text-slate-950 transition-colors hover:bg-amber-400"
          >
            <Printer className="h-4 w-4" />
            {"\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41 \u0C2A\u0C4D\u0C30\u0C3F\u0C02\u0C1F\u0C4D / \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F"}{" "}
            (Print ID Card)
          </button>
        </div>
      </div>

      {/* Printable card — ~3.5in × 2in visual ratio */}
      <div
        id="coordinator-print-card"
        className="relative flex h-[220px] w-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-5 shadow-2xl print:m-0 print:border-black print:shadow-none"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-amber-500/10 blur-xl" />

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-amber-400">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F \u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"}
            </div>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Official Coordinator Desk
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-white p-1 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="Bot QR"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="my-auto">
          <h3 className="text-base font-bold tracking-tight text-white">
            {name}
          </h3>
          <p className="text-[11px] font-medium text-amber-400">{role}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-300">
            <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
            <span>
              {mandal} {"\u0C2E\u0C02\u0C21\u0C32\u0C02"}, {district}{" "}
              {"\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 font-semibold text-slate-200">
            <Phone className="h-3 w-3 text-amber-400" />
            +91 {phone}
          </div>
          <span className="text-[9px] text-slate-400">nayisamakhya.org</span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
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
