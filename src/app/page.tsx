"use client";

import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Layers,
  Send,
  Sparkles,
  QrCode,
  Users,
} from "lucide-react";
import { CivicStalwarts } from "@/components/CivicStalwarts";

export default function HomePage() {
  return (
    <div className="bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200">
        <span className="font-telugu">{"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c28\u0c46\u0c1f\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c15\u0c4d \u2014 33 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32\u0c41 & 589 \u0c2e\u0c02\u0c21\u0c32\u0c3e\u0c32 \u0c38\u0c47\u0c35\u0c3e \u0c35\u0c47\u0c26\u0c3f\u0c15"}</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-civic-border bg-white shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl border border-civic-bronze/20 bg-civic-bronze/10 p-2 text-civic-bronze">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <span className="font-telugu text-base font-black tracking-tight text-civic-ink md:text-lg">
                {"\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23"}
              </span>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Official Civic Welfare Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/newsletter"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-telugu text-xs font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle sm:inline-flex"
            >
              సమాచార పత్రిక
            </Link>
            <Link
              href="/representation"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-telugu text-xs font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle md:inline-flex"
            >
              <FileText className="h-3.5 w-3.5 text-civic-bronze" />
              {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02"}
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-civic-bronze px-3.5 py-1.5 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              <Send className="h-3.5 w-3.5" />
              {"\u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d \u0c2c\u0c3e\u0c1f\u0c4d"}
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-civic-border bg-gradient-to-b from-white to-civic-paper px-4 pb-16 pt-12">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-civic-bronze/20 bg-civic-bronze/10 px-3 py-1 font-telugu text-xs font-bold text-civic-bronze">
            <Sparkles className="h-3.5 w-3.5" />
            {"\u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c35\u0c4d\u0c2f\u0c3e\u0c2a\u0c4d\u0c24 \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c3e\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c24 & \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02"}
          </div>

          <h1 className="font-telugu text-3xl font-black leading-tight tracking-tight text-civic-ink md:text-5xl md:leading-snug">
            {"\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f"} <br />
            <span className="text-civic-bronze">{"\u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c38\u0c47\u0c35\u0c3e \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02"}</span>
          </h1>

          <p className="mx-auto max-w-2xl font-telugu text-sm leading-relaxed text-slate-600 md:text-base">
            {"\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c23, \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c38\u0c4d\u0c2f\u0c32 \u0c2a\u0c30\u0c3f\u0c37\u0c4d\u0c15\u0c3e\u0c30\u0c02, \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c2e\u0c02\u0c21\u0c32 \u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24\u0c32 \u0c05\u0c28\u0c41\u0c38\u0c02\u0c27\u0c3e\u0c28\u0c02 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c30\u0c42\u0c2a\u0c4a\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c05\u0c27\u0c40\u0c15\u0c43\u0c24 \u0c35\u0c47\u0c26\u0c3f\u0c15."}
          </p>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 pt-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/representation"
              className="group flex flex-col justify-between rounded-xl border border-civic-border bg-white p-4 transition-all hover:border-civic-bronze hover:shadow-md"
            >
              <div>
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-civic-bronze/10 text-civic-bronze">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="font-telugu text-xs font-bold text-civic-ink">
                  {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40"}
                </h3>
                <p className="mt-0.5 font-telugu text-[11px] text-slate-500">
                  {"MRO / \u0c15\u0c32\u0c46\u0c15\u0c4d\u0c1f\u0c30\u0c4d\u0c32\u0c15\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c32\u0c47\u0c16\u0c32\u0c41"}
                </p>
              </div>
              <span className="mt-3 flex items-center gap-1 font-telugu text-[11px] font-bold text-civic-bronze transition-transform group-hover:translate-x-0.5">
                {"\u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f \u2192"}
              </span>
            </Link>

            <Link
              href="/feed"
              className="group flex flex-col justify-between rounded-xl border border-civic-border bg-white p-4 transition-all hover:border-civic-bronze hover:shadow-md"
            >
              <div>
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-telugu text-xs font-bold text-civic-ink">
                  {"\u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c38\u0c2e\u0c40\u0c15\u0c4d\u0c37 \u0c2b\u0c40\u0c21\u0c4d"}
                </h3>
                <p className="mt-0.5 font-telugu text-[11px] text-slate-500">
                  {"\u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41"}
                </p>
              </div>
              <span className="mt-3 flex items-center gap-1 font-telugu text-[11px] font-bold text-civic-bronze transition-transform group-hover:translate-x-0.5">
                {"\u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f \u2192"}
              </span>
            </Link>

            <Link
              href="/coordinators/card"
              className="group flex flex-col justify-between rounded-xl border border-civic-border bg-white p-4 transition-all hover:border-civic-bronze hover:shadow-md"
            >
              <div>
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-civic-navy/10 text-civic-navy">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-telugu text-xs font-bold text-civic-ink">
                  {"\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41"}
                </h3>
                <p className="mt-0.5 font-telugu text-[11px] text-slate-500">
                  {"\u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 & QR \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41"}
                </p>
              </div>
              <span className="mt-3 flex items-center gap-1 font-telugu text-[11px] font-bold text-civic-bronze transition-transform group-hover:translate-x-0.5">
                {"\u0c24\u0c2f\u0c3e\u0c30\u0c41\u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f \u2192"}
              </span>
            </Link>

            <Link
              href="/poster"
              className="group flex flex-col justify-between rounded-xl border border-civic-border bg-white p-4 transition-all hover:border-civic-bronze hover:shadow-md"
            >
              <div>
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <QrCode className="h-4 w-4" />
                </div>
                <h3 className="font-telugu text-xs font-bold text-civic-ink">
                  {"\u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c2a\u0c4b\u0c38\u0c4d\u0c1f\u0c30\u0c4d (QR)"}
                </h3>
                <p className="mt-0.5 font-telugu text-[11px] text-slate-500">
                  {"\u0c37\u0c3e\u0c2a\u0c41 \u0c05\u0c26\u0c4d\u0c26\u0c3e\u0c32\u0c2a\u0c48 A4 \u0c2a\u0c4b\u0c38\u0c4d\u0c1f\u0c30\u0c4d"}
                </p>
              </div>
              <span className="mt-3 flex items-center gap-1 font-telugu text-[11px] font-bold text-civic-bronze transition-transform group-hover:translate-x-0.5">
                {"\u0c21\u0c4c\u0c28\u0c4d\u200c\u0c32\u0c4b\u0c21\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f \u2192"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-civic-border bg-white px-4 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div>
            <div className="text-2xl font-black text-civic-ink md:text-3xl">33</div>
            <div className="mt-0.5 font-telugu text-xs font-semibold text-slate-500">
              {"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32\u0c41"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-civic-ink md:text-3xl">589</div>
            <div className="mt-0.5 font-telugu text-xs font-semibold text-slate-500">
              {"\u0c2e\u0c02\u0c21\u0c32\u0c3e\u0c32\u0c41"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-civic-ink md:text-3xl">142</div>
            <div className="mt-0.5 font-telugu text-xs font-semibold text-slate-500">
              {"\u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c3e\u0c32\u0c3f\u0c1f\u0c40\u0c32\u0c41 / \u0c15\u0c3e\u0c30\u0c4d\u0c2a\u0c4a\u0c30\u0c47\u0c37\u0c28\u0c4d\u0c32\u0c41"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 md:text-3xl">100%</div>
            <div className="mt-0.5 font-telugu text-xs font-semibold text-slate-500">
              {"\u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c28\u0c46\u0c1f\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c15\u0c4d"}
            </div>
          </div>
        </div>
      </section>

      <CivicStalwarts />
    </div>
  );
}
