"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  MessageCircle,
  Search,
  ShoppingCart,
  Zap,
  Music2,
  Camera,
} from "lucide-react";
import type { Mandal } from "@/lib/types";
import { loc } from "@/lib/i18n/dictionary";
import { useLanguageStore } from "@/lib/store/preferences";
import { NodalOfficersRoster } from "@/components/officers/NodalOfficersRoster";

const actionIcons = {
  cartel: ShoppingCart,
  power: Zap,
  artisans: Music2,
} as const;

type Props = {
  mandal: Mandal;
};

export function MandalPortalView({ mandal: m }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const [gpQuery, setGpQuery] = useState("");
  const te = lang === "te";

  const metrics = [
    {
      id: "hh",
      label: te ? "మండలంలో మొత్తం కుటుంబాలు" : "Total households in mandal",
      value: String(m.summary.households),
    },
    {
      id: "salons",
      label: te ? "క్రియాశీల సెలూన్లు" : "Active salons",
      value: `${m.summary.salons}`,
      meta: te
        ? `(${m.summary.freePowerPct}% ఉచిత విద్యుత్ లబ్ధి)`
        : `(${m.summary.freePowerPct}% free-power coverage)`,
    },
    {
      id: "bajantri",
      label: te ? "నమోదైన భజంత్రి కళాకారులు" : "Registered Bajantri artistes",
      value: String(m.summary.bajantri),
    },
    {
      id: "survey",
      label: te ? "సమగ్ర సర్వే పూర్తి" : "Comprehensive survey complete",
      value: `${m.summary.surveyPct}%`,
    },
  ];

  const filtered = m.gramPanchayats.filter((gp) => {
    const q = gpQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      gp.name.en.toLowerCase().includes(q) ||
      gp.name.te.includes(gpQuery.trim()) ||
      gp.id.includes(q)
    );
  });

  const shortMandal = loc(m.mandal, lang).replace(/ మండలం| Mandal/gi, "");

  return (
    <div className="bg-[#FBFBF9]">
      {/* Localized civic hero */}
      <section className="relative overflow-hidden border-b border-[#EBE8E0]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 0%, rgb(194 65 12 / 0.08), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgb(194 65 12 / 0.05), transparent 50%), linear-gradient(180deg, #FFF7ED 0%, #FBFBF9 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
          <Link
            href="/mandals"
            className={`text-xs text-[#71717A] transition-colors hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}
          >
            {te ? "← అన్ని మండలాలు" : "← All mandals"}
          </Link>

          <p
            className={`mt-4 inline-flex flex-wrap items-center gap-x-1.5 rounded-full border border-[#EBE8E0] bg-white/90 px-3.5 py-1.5 text-xs text-[#71717A] shadow-sm backdrop-blur-sm ${te ? "font-telugu" : ""}`}
          >
            <span>{loc(m.state, lang)}</span>
            <span className="text-[#C2410C]" aria-hidden>
              •
            </span>
            <span>{loc(m.district, lang)}</span>
            <span className="text-[#C2410C]" aria-hidden>
              •
            </span>
            <span className="font-medium text-[#18181B]">{loc(m.mandal, lang)}</span>
          </p>

          <h1
            className={`mt-4 max-w-3xl text-2xl font-bold tracking-tight text-[#18181B] sm:text-3xl md:text-4xl ${te ? "font-telugu leading-relaxed" : ""}`}
          >
            {loc(m.portalHeadline, lang)}
          </h1>
          <p
            className={`mt-3 max-w-2xl text-sm leading-relaxed text-[#71717A] sm:text-base ${te ? "font-telugu" : ""}`}
          >
            {loc(m.portalSub, lang)}
          </p>

          {/* Glassmorphic live ticker */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/60 bg-white/55 p-3 shadow-[0_8px_32px_rgb(24_24_27/0.06)] backdrop-blur-md sm:grid-cols-4 sm:gap-3 sm:p-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-xl border border-[#EBE8E0]/80 bg-white/70 px-3 py-2.5"
              >
                <p
                  className={`text-[10px] font-medium uppercase tracking-wide text-[#71717A] sm:text-[11px] ${te ? "font-telugu normal-case tracking-normal" : ""}`}
                >
                  {metric.label}
                </p>
                <p className="metric-tnum mt-1 text-lg font-bold text-[#C2410C] sm:text-xl">
                  {metric.value}
                  {metric.meta ? (
                    <span className="ml-1 text-[10px] font-medium text-[#71717A] sm:text-xs">
                      {metric.meta}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>

          {/* Dual local CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={m.surveyPath}
              className={`tap inline-flex items-center justify-center gap-2 rounded-full bg-[#C2410C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#9A3412] ${te ? "font-telugu" : ""}`}
            >
              <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
              {te
                ? `${shortMandal} మండల సర్వే నమోదు ప్రారంభించండి →`
                : `Start ${shortMandal} mandal survey →`}
            </Link>
            <a
              href={m.whatsappGroup}
              target="_blank"
              rel="noreferrer"
              className={`tap inline-flex items-center justify-center gap-2 rounded-full border border-[#EBE8E0] bg-white px-5 py-3 text-sm font-semibold text-[#18181B] transition-colors hover:border-[#C2410C]/40 hover:bg-[#FFF7ED] ${te ? "font-telugu" : ""}`}
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#C2410C]" aria-hidden />
              {te
                ? "మండల అధికారిక వాట్సాప్ గ్రూప్‌లో చేరండి"
                : "Join mandal official WhatsApp group"}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <NodalOfficersRoster
          officers={m.officers ?? []}
          surveyPath={m.surveyPath}
          mandalNameTe={loc(m.mandal, "te")}
          mandalNameEn={loc(m.mandal, "en")}
        />

        {/* Three action modules */}
        <section aria-labelledby="modules-heading">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
            {te ? "స్థానిక సేవా మాడ్యూల్స్" : "Local service modules"}
          </p>
          <h2
            id="modules-heading"
            className={`mt-1 text-xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
          >
            {te ? "మూడు విస్తృత స్థానిక చర్యలు" : "Three expanded local actions"}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {m.actions.map((action) => {
              const Icon =
                actionIcons[action.id as keyof typeof actionIcons] ?? ClipboardList;
              const className =
                "tap group flex h-full flex-col rounded-2xl border border-[#EBE8E0] bg-white p-5 shadow-sm transition-all hover:border-[#C2410C]/35 hover:shadow-md";
              const body = (
                <>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE8E0] bg-[#FFF7ED] text-[#C2410C]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3
                    className={`mt-3 text-base font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}
                  >
                    {loc(action.title, lang)}
                  </h3>
                  <p
                    className={`mt-2 flex-1 text-sm leading-relaxed text-[#71717A] ${te ? "font-telugu" : ""}`}
                  >
                    {loc(action.description, lang)}
                  </p>
                  <span
                    className={`mt-4 inline-flex text-sm font-semibold text-[#C2410C] group-hover:underline ${te ? "font-telugu" : ""}`}
                  >
                    {loc(action.cta, lang)} →
                  </span>
                </>
              );
              return action.external ? (
                <a
                  key={action.id}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {body}
                </a>
              ) : (
                <Link key={action.id} href={action.href} className={className}>
                  {body}
                </Link>
              );
            })}
          </div>
        </section>

        {/* GP explorer */}
        <section aria-labelledby="gp-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
                {te ? "పంచాయతీ ఎక్స్‌ప్లోరర్" : "Panchayat explorer"}
              </p>
              <h2
                id="gp-heading"
                className={`mt-1 text-xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
              >
                {te
                  ? "గ్రామ పంచాయతీ & వార్డు ఎక్స్‌ప్లోరర్"
                  : "Gram Panchayat & Ward Explorer"}
              </h2>
            </div>
            <label className="relative w-full sm:w-80">
              <span className="sr-only">
                {te
                  ? "పంచాయతీ లేదా వార్డు పేరును వెతకండి"
                  : "Search panchayat or ward name"}
              </span>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]"
                aria-hidden
              />
              <input
                type="search"
                value={gpQuery}
                onChange={(e) => setGpQuery(e.target.value)}
                placeholder={
                  te
                    ? "పంచాయతీ లేదా వార్డు పేరును వెతకండి..."
                    : "Search panchayat or ward name..."
                }
                className={`tap w-full rounded-full border border-[#EBE8E0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#C2410C]/40 focus:outline-none ${te ? "font-telugu" : ""}`}
              />
            </label>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <li
                className={`col-span-full rounded-2xl border border-[#EBE8E0] bg-white p-8 text-center text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
              >
                {te ? "సరిపోలిన పంచాయతీలు లేవు." : "No matching panchayats."}
              </li>
            ) : (
              filtered.map((gp) => (
                <li
                  key={gp.id}
                  className="rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}
                    >
                      {loc(gp.name, lang)}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        gp.surveyPct >= 70
                          ? "bg-[#C2410C]/10 text-[#C2410C]"
                          : gp.surveyPct >= 55
                            ? "bg-[#F4F2EB] text-[#71717A]"
                            : "border border-[#EBE8E0] bg-white text-[#A1A1AA]"
                      }`}
                    >
                      {gp.surveyPct}%{" "}
                      {te ? "సర్వే పూర్తి" : "survey"}
                    </span>
                  </div>
                  <p
                    className={`mt-2 metric-tnum text-xs text-[#71717A] ${te ? "font-telugu" : ""}`}
                  >
                    {gp.households}{" "}
                    {te ? "కుటుంబాలు" : "households"}
                    {" • "}
                    {gp.surveyPct}%{" "}
                    {te ? "సర్వే పూర్తి" : "survey complete"}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F4F2EB]">
                    <div
                      className="h-full rounded-full bg-[#C2410C]"
                      style={{ width: `${gp.surveyPct}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Local notices & photo feed */}
        <section aria-labelledby="notices-heading">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#C2410C]" aria-hidden />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
                {te ? "స్థానిక నోటీసులు" : "Local notices"}
              </p>
              <h2
                id="notices-heading"
                className={`text-xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
              >
                {te
                  ? "నోటీసులు & కార్యక్రమ ఫోటో ఫీడ్"
                  : "Notices & event photo feed"}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {m.notices.map((notice) => (
              <article
                key={notice.id}
                className="group overflow-hidden rounded-2xl border border-[#EBE8E0] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={notice.image}
                    alt={loc(notice.title, lang)}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={/supabase\.co\//i.test(notice.image)}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {notice.date}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3
                      className={`text-sm font-semibold leading-snug text-white ${te ? "font-telugu" : ""}`}
                    >
                      {loc(notice.title, lang)}
                    </h3>
                    {te ? (
                      <p className="mt-0.5 text-[11px] text-white/75">
                        {loc(notice.title, "en")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
