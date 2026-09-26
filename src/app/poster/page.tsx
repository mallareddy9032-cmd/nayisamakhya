"use client";

import { Printer, ShieldCheck, QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PosterPage() {
  const botUrl = "https://t.me/NayiSamakhyaDeskBot";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(botUrl)}&margin=10`;

  return (
    <div className="flex min-h-dvh flex-col items-center bg-slate-950 p-4 text-slate-100 antialiased md:p-8">
      <div className="mb-6 flex w-full max-w-md items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-telugu text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {"\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c32\u0c4d\u200c\u0c15\u0c41 \u0c24\u0c3f\u0c30\u0c3f\u0c17\u0c3f \u0c35\u0c46\u0c33\u0c4d\u0c32\u0c02\u0c21\u0c3f"}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg transition-all hover:bg-amber-400"
        >
          <Printer className="h-4 w-4" aria-hidden />
          <span className="font-telugu">{"\u0c2a\u0c4b\u0c38\u0c4d\u0c1f\u0c30\u0c4d \u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f (Print A4)"}</span>
        </button>
      </div>

      <div className="relative flex w-full max-w-[480px] flex-col items-center justify-between overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-slate-900 p-8 text-center shadow-2xl print:w-full print:max-w-none print:rounded-none print:border-4 print:border-black print:bg-white print:p-10 print:text-black">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl print:hidden"
          aria-hidden
        />

        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 print:border-black print:text-black">
            <ShieldCheck className="h-4 w-4 text-amber-500 print:text-black" aria-hidden />
            <span className="font-telugu">{"\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23"}</span>
          </div>
          <h1 className="font-telugu text-2xl font-black tracking-tight text-white md:text-3xl print:text-black">
            {"\u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d"}
          </h1>
          <p className="mx-auto mt-1 max-w-xs font-telugu text-xs text-slate-400 md:text-sm print:text-slate-700">
            {"\u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c41 & \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c47\u0c26\u0c3f\u0c15"}
          </p>
        </div>

        <div className="my-8 rounded-2xl border-4 border-amber-500/30 bg-white p-5 shadow-xl print:border-black print:shadow-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="Telegram Desk QR Code"
            className="mx-auto h-56 w-56 object-contain md:h-64 md:w-64"
          />
          <p className="mt-2 flex items-center justify-center gap-1 font-telugu text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <QrCode className="h-3.5 w-3.5 text-amber-600 print:text-black" aria-hidden />
            {"\u0c15\u0c46\u0c2e\u0c46\u0c30\u0c3e \u0c32\u0c47\u0c26\u0c3e \u0c17\u0c42\u0c17\u0c41\u0c32\u0c4d \u0c32\u0c46\u0c28\u0c4d\u0c38\u0c4d\u200c\u0c24\u0c4b \u0c38\u0c4d\u0c15\u0c3e\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f"}
          </p>
        </div>

        <div className="mb-6 w-full space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left text-xs print:border-black print:bg-slate-100 print:text-black">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500 print:bg-black" aria-hidden />
            <span className="font-telugu">{"\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c24\u0c2f\u0c3e\u0c30\u0c40 (Representation Maker)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500 print:bg-black" aria-hidden />
            <span className="font-telugu">{"\u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c38\u0c4d\u0c2f\u0c32\u0c41 & \u0c2b\u0c4b\u0c1f\u0c4b\u0c32 \u0c28\u0c2e\u0c4b\u0c26\u0c41"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500 print:bg-black" aria-hidden />
            <span className="font-telugu">{"\u0c2e\u0c02\u0c21\u0c32 \u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24\u0c32\u0c41 & \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41"}</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-500 print:border-black print:text-slate-800">
          <span>Telegram: @NayiSamakhyaDeskBot</span>
          <span className="font-semibold text-slate-400 print:text-black">
            nayisamakhya.org
          </span>
        </div>
      </div>
    </div>
  );
}
