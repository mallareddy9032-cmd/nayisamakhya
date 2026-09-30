"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileText,
  GraduationCap,
  IdCard,
  MapPinned,
  MessageCircle,
  Music2,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type OutputId = "petition" | "card" | "whatsapp";

type InputNode = {
  id: string;
  title: string;
  blurb: string;
  icon: typeof Scissors;
  related: OutputId[];
  ctaHref: string;
  ctaLabel: string;
};

const WA_DESK =
  "https://wa.me/919032654111?text=" +
  encodeURIComponent("నమస్కారం నాయి సమాఖ్య డెస్క్ — సివిక్ ఇంజిన్ నుండి సహాయం కావాలి.");

const INPUTS: InputNode[] = [
  {
    id: "vocation",
    title: "సెలూన్ & వృత్తి",
    blurb: "జి.ఓ. 23 · ట్రేడ్ లైసెన్స్ · మున్సిపల్ షాప్ నోటీసులు",
    icon: Scissors,
    related: ["petition", "whatsapp"],
    ctaHref: "/representation?subject=go23_free_power",
    ctaLabel: "వినతిపత్రం తెరవండి",
  },
  {
    id: "youth",
    title: "యువత & విద్యార్థి అవసరాలు",
    blurb: "స్కాలర్‌షిప్ · నైపుణ్య శిక్షణ · వృత్తి హక్కులు",
    icon: GraduationCap,
    related: ["petition", "card"],
    ctaHref: "/representation?subject=community_welfare_funds",
    ctaLabel: "వినతి డాకెట్",
  },
  {
    id: "arts",
    title: "నాదస్వరం & కళాకార సంక్షేమం",
    blurb: "కళాకార గుర్తింపు · సంక్షేమ నిధులు · సాంస్కృతిక రక్షణ",
    icon: Music2,
    related: ["petition", "whatsapp"],
    ctaHref: "/representation?subject=community_welfare_funds",
    ctaLabel: "సంక్షేమ వినతి",
  },
  {
    id: "districts",
    title: "33 జిల్లాలు & వార్డ్ సమస్యలు",
    blurb: "జిల్లా డెస్క్ · పట్టణ/గ్రామీణ · మండల రూటింగ్",
    icon: MapPinned,
    related: ["card", "whatsapp"],
    ctaHref: "/districts",
    ctaLabel: "జిల్లా డైరెక్టరీ",
  },
];

const OUTPUTS: {
  id: OutputId;
  title: string;
  blurb: string;
  href: string;
  icon: typeof FileText;
  external?: boolean;
}[] = [
  {
    id: "petition",
    title: "లీగల్ పిటిషన్",
    blurb: "Prefill · stamped A4 docket",
    href: "/representation",
    icon: FileText,
  },
  {
    id: "card",
    title: "కోఆర్డినేటర్ కార్డు",
    blurb: "QR identity · lamination-ready",
    href: "/coordinator-card",
    icon: IdCard,
  },
  {
    id: "whatsapp",
    title: "WhatsApp డెస్క్",
    blurb: "24/7 helpline · instant chat",
    href: WA_DESK,
    icon: MessageCircle,
    external: true,
  },
];

const ENGINE_BADGES = [
  "G.O. 23 verification",
  "Municipal Act 2019",
  "589 mandal routing",
  "Legal cell docketing",
] as const;

/** Desktop bezier midpoints — viewBox 1000×420, left ~220 → center 500 → right ~780 */
const IN_PATHS: Record<string, string> = {
  vocation: "M 220 72 C 330 72, 400 150, 470 210",
  youth: "M 220 162 C 330 162, 410 190, 470 210",
  arts: "M 220 252 C 330 252, 410 230, 470 210",
  districts: "M 220 342 C 330 342, 400 270, 470 210",
};

const OUT_PATHS: Record<OutputId, string> = {
  petition: "M 530 210 C 620 210, 700 90, 780 90",
  card: "M 530 210 C 620 210, 700 210, 780 210",
  whatsapp: "M 530 210 C 620 210, 700 330, 780 330",
};

function TelemetryRing({ active }: { active: boolean }) {
  const gradId = useId();
  return (
    <div
      className={cn(
        "relative mx-auto flex h-28 w-28 items-center justify-center transition-transform duration-500",
        active && "scale-[1.03]",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgb(180 83 9 / 0.15)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="264"
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
          className={cn(
            "transition-[filter] duration-300",
            active && "drop-shadow-[0_0_6px_rgb(180_83_9_/0.55)]",
          )}
        />
      </svg>
      <div className="relative z-[1] px-2 text-center">
        <p className="font-sans text-lg font-black tracking-tight text-[#1E293B]">
          100%
        </p>
        <p className="font-telugu text-[9px] font-bold leading-tight text-[#B45309]">
          ఉచిత ప్రజా వేదిక
        </p>
      </div>
    </div>
  );
}

function EngineCard({ lit }: { lit: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 via-[#FFFDF9]/90 to-[#FBF7ED]/95 p-4 shadow-[0_18px_48px_rgb(15_23_42_/0.1)] backdrop-blur-sm transition-all duration-300 sm:p-5",
        lit && "shadow-[0_20px_56px_rgb(180_83_9_/0.18)]",
      )}
      style={{
        boxShadow: lit
          ? "0 0 0 2px #FBFBFA, 0 0 0 4px #B45309, 0 0 0 8px rgb(180 83 9 / 0.28), 0 18px 48px rgb(15 23 42 / 0.12)"
          : "0 0 0 2px #FBFBFA, 0 0 0 3px #B45309, 0 0 0 6px rgb(180 83 9 / 0.2), 0 14px 40px rgb(15 23 42 / 0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#B45309]"
        aria-hidden
      />
      <div className="mb-3 flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-sm">
          <ShieldCheck className="h-4 w-4 text-[#FBBF24]" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-display-te text-base font-normal leading-snug text-[#1E293B] sm:text-lg">
            నాయీ సమాఖ్య డిజిటల్ గవర్నెన్స్ ఇంజిన్
          </h3>
          <p className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Automated Statutory &amp; Civic Routing Core
          </p>
        </div>
      </div>

      <TelemetryRing active={lit} />

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {ENGINE_BADGES.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center rounded-md border border-[#B45309]/25 bg-white/80 px-2 py-1 font-sans text-[9px] font-bold tracking-wide text-[#1E293B]"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConnectorLayer({
  activeInput,
  related,
}: {
  activeInput: string | null;
  related: OutputId[];
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="cem-gold-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {INPUTS.map((node) => {
        const on = activeInput === node.id;
        const dim = activeInput != null && !on;
        return (
          <path
            key={`in-${node.id}`}
            d={IN_PATHS[node.id]}
            fill="none"
            stroke={on ? "#B45309" : "rgb(30 41 59 / 0.22)"}
            strokeWidth={on ? 2.4 : 1.4}
            strokeDasharray="6 7"
            strokeLinecap="round"
            opacity={dim ? 0.25 : 1}
            filter={on ? "url(#cem-gold-glow)" : undefined}
            className={cn(on && "cem-flow")}
          />
        );
      })}

      {(Object.keys(OUT_PATHS) as OutputId[]).map((id) => {
        const on = related.includes(id) && activeInput != null;
        const dim = activeInput != null && !on;
        return (
          <path
            key={`out-${id}`}
            d={OUT_PATHS[id]}
            fill="none"
            stroke={on ? "#B45309" : "rgb(30 41 59 / 0.22)"}
            strokeWidth={on ? 2.4 : 1.4}
            strokeDasharray="6 7"
            strokeLinecap="round"
            opacity={dim ? 0.25 : 1}
            filter={on ? "url(#cem-gold-glow)" : undefined}
            className={cn(on && "cem-flow")}
          />
        );
      })}
    </svg>
  );
}

function DesktopMap({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  const active = INPUTS.find((n) => n.id === activeId) ?? null;
  const related = active?.related ?? [];

  return (
    <div className="relative hidden lg:block">
      <div className="relative min-h-[420px]">
        <ConnectorLayer activeInput={activeId} related={related} />

        <div className="relative z-[1] grid grid-cols-[1fr_minmax(240px,300px)_1fr] items-center gap-4 xl:gap-6">
          {/* Left inputs */}
          <ul className="flex flex-col gap-3">
            {INPUTS.map((node) => {
              const Icon = node.icon;
              const on = activeId === node.id;
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveId(node.id)}
                    onFocus={() => setActiveId(node.id)}
                    onClick={() => setActiveId(node.id)}
                    className={cn(
                      "civic-focus-ring group flex w-full items-start gap-3 rounded-xl border bg-white/90 p-3 text-left shadow-xs transition-all duration-300",
                      on
                        ? "border-[#B45309] bg-[#FFFDF9] shadow-[0_0_0_3px_rgb(180_83_9_/0.2),0_12px_28px_rgb(15_23_42_/0.08)]"
                        : "border-[#EAD7B5]/80 hover:border-[#B45309]/50",
                    )}
                    aria-pressed={on}
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        on
                          ? "border-[#B45309]/40 bg-[#B45309]/15 text-[#B45309]"
                          : "border-slate-200 bg-[#FBFBFA] text-[#1E293B] group-hover:text-[#B45309]",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-telugu text-sm font-bold leading-snug text-[#1E293B]">
                        {node.title}
                      </span>
                      <span className="mt-0.5 block font-telugu text-[11px] leading-relaxed text-slate-600">
                        {node.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Center engine — wires terminate here; CTAs live below the graph */}
          <div className="px-1">
            <EngineCard lit={activeId != null} />
          </div>

          {/* Right outputs */}
          <ul className="flex flex-col gap-3">
            {OUTPUTS.map((out) => {
              const Icon = out.icon;
              const on = related.includes(out.id);
              const resolvedHref =
                out.id === "petition" &&
                active &&
                related.includes("petition") &&
                active.ctaHref.startsWith("/representation")
                  ? active.ctaHref
                  : out.href;
              const className = cn(
                "civic-focus-ring group flex w-full items-start gap-3 rounded-xl border bg-white/90 p-3 text-left shadow-xs transition-all duration-300",
                on
                  ? "border-[#B45309] bg-[#FFFDF9] shadow-[0_0_0_3px_rgb(180_83_9_/0.2),0_12px_28px_rgb(15_23_42_/0.08)]"
                  : "border-[#EAD7B5]/80 hover:border-[#B45309]/40",
                activeId != null && !on && "opacity-45",
              );
              const body = (
                <>
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      on
                        ? "border-[#B45309]/40 bg-[#B45309]/15 text-[#B45309]"
                        : "border-slate-200 bg-[#FBFBFA] text-[#1E293B]",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-telugu text-sm font-bold leading-snug text-[#1E293B]">
                        {out.title}
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-colors",
                          on ? "text-[#B45309]" : "text-slate-400",
                        )}
                        aria-hidden
                      />
                    </span>
                    <span className="mt-0.5 block font-telugu text-[11px] leading-relaxed text-slate-600">
                      {out.blurb}
                    </span>
                  </span>
                </>
              );

              return (
                <li key={out.id}>
                  {out.external ? (
                    <a
                      href={resolvedHref}
                      target="_blank"
                      rel="noreferrer"
                      className={className}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link href={resolvedHref} className={className}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* CTA band — separate amber petition + slate announce, never merged */}
      <div className="relative z-[2] mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={active?.ctaHref?.startsWith("/representation") ? active.ctaHref : "/representation"}
          className="civic-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-5 py-2.5 font-telugu text-xs font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.3)] transition hover:bg-[#92400E]"
        >
          {active?.ctaLabel ?? "వినతిపత్రం తెరవండి"}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          href="/announce"
          className="civic-focus-ring inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#1E293B] px-4 py-2.5 font-telugu text-[11px] font-bold text-white transition hover:bg-[#0F172A]"
        >
          మొబిలైజేషన్ అనౌన్స్
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function MobileJourney({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  const active = INPUTS.find((n) => n.id === activeId) ?? INPUTS[0];
  const related = active.related;

  return (
    <div className="space-y-4 lg:hidden">
      {/* Step 1 — మీ సమస్యను ఎంచుకోండి */}
      <div className="rounded-2xl border border-[#EAD7B5] bg-white/95 p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1E293B] font-sans text-xs font-bold text-white">
            1
          </span>
          <p className="font-telugu text-sm font-bold text-[#1E293B]">
            మీ సమస్యను ఎంచుకోండి
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INPUTS.map((node) => {
            const Icon = node.icon;
            const on = active.id === node.id;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(node.id)}
                  className={cn(
                    "civic-focus-ring flex min-h-12 w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                    on
                      ? "border-[#B45309] bg-[#FFFDF9] shadow-[0_0_0_2px_rgb(180_83_9_/0.18)]"
                      : "border-slate-200 bg-[#FBFBFA]",
                  )}
                  aria-pressed={on}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      on ? "text-[#B45309]" : "text-[#1E293B]",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block font-telugu text-xs font-bold text-[#1E293B]">
                      {node.title}
                    </span>
                    <span className="block font-telugu text-[10px] leading-snug text-slate-500">
                      {node.blurb}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Step 2 — చట్టబద్ధ ప్రాసెసింగ్ */}
      <div className="rounded-2xl border border-[#B45309]/30 bg-gradient-to-b from-[#FFFDF9] to-[#FBF7ED] p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#B45309] font-sans text-xs font-bold text-white">
            2
          </span>
          <p className="font-telugu text-sm font-bold text-[#1E293B]">
            చట్టబద్ధ ప్రాసెసింగ్
          </p>
        </div>
        <EngineCard lit />
        <div className="mt-3 flex items-center justify-center gap-2 font-telugu text-[11px] text-slate-600">
          <Building2 className="h-3.5 w-3.5 text-[#B45309]" aria-hidden />
          <span>ఎంపిక: {active.title}</span>
        </div>
      </div>

      {/* Step 3 — తక్షణ పత్రం డౌన్‌లోడ్ */}
      <div className="rounded-2xl border border-[#EAD7B5] bg-white/95 p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1E293B] font-sans text-xs font-bold text-white">
            3
          </span>
          <p className="font-telugu text-sm font-bold text-[#1E293B]">
            తక్షణ పత్రం డౌన్‌లోడ్
          </p>
        </div>

        <ul className="space-y-2">
          {OUTPUTS.map((out) => {
            const Icon = out.icon;
            const on = related.includes(out.id);
            const href =
              out.id === "petition" &&
              active.ctaHref.startsWith("/representation")
                ? active.ctaHref
                : out.href;

            if (out.external) {
              return (
                <li key={out.id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "civic-focus-ring flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
                      on
                        ? "border-[#B45309] bg-[#FFFDF9]"
                        : "border-slate-200 opacity-55",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        on ? "text-[#B45309]" : "text-slate-400",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-telugu text-xs font-bold text-[#1E293B]">
                        {out.title}
                      </span>
                      <span className="block font-telugu text-[10px] leading-snug text-slate-500">
                        {out.blurb}
                      </span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#B45309]" aria-hidden />
                  </a>
                </li>
              );
            }

            return (
              <li key={out.id}>
                <Link
                  href={href}
                  className={cn(
                    "civic-focus-ring flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
                    on
                      ? "border-[#B45309] bg-[#FFFDF9]"
                      : "border-slate-200 opacity-55",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      on ? "text-[#B45309]" : "text-slate-400",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-telugu text-xs font-bold text-[#1E293B]">
                      {out.title}
                    </span>
                    <span className="block font-telugu text-[10px] leading-snug text-slate-500">
                      {out.blurb}
                    </span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#B45309]" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/representation"
            className="civic-focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.3)] hover:bg-[#92400E]"
          >
            వినతిపత్రం తెరవండి
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/announce"
            className="civic-focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E293B] px-4 py-3 font-telugu text-xs font-bold text-white hover:bg-[#0F172A]"
          >
            మొబిలైజేషన్ అనౌన్స్
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CivicEngineMap() {
  const [activeId, setActiveId] = useState<string | null>("vocation");

  return (
    <section
      id="civic-engine-map"
      className="relative scroll-mt-24 overflow-x-hidden border-b border-civic-border bg-[#FBFBFA] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="civic-engine-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgb(180_83_9_/0.05),_transparent_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 max-w-3xl lg:mb-8">
          <span className="civic-eyebrow-pill">
            సేవా ప్రవాహం • CIVIC ENGINE
          </span>
          <h2
            id="civic-engine-heading"
            className="mt-3 font-display-te text-2xl font-normal leading-snug text-[#1E293B] sm:text-3xl"
          >
            డిజిటల్ గవర్నెన్స్ ఇంజిన్
          </h2>
          <p className="mt-1 font-sans text-sm font-medium tracking-wide text-slate-500">
            Statutory intake · automated routing · one-click civic outputs
          </p>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-slate-600">
            విభాగం ఎంచుకోండి — చట్టబద్ధ కోర్ గుండా పిటిషన్, కోఆర్డినేటర్ కార్డు లేదా
            WhatsApp డెస్క్‌కు రూట్ అవుతుంది.
          </p>
        </div>

        <DesktopMap activeId={activeId} setActiveId={setActiveId} />
        <MobileJourney activeId={activeId} setActiveId={setActiveId} />
      </div>

      </section>
  );
}
