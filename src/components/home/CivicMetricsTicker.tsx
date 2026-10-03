"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  id: string;
  /** Animated numeric end value (null = static label only). */
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Static hero figure shown before/alongside animation (e.g. "589/589"). */
  display?: string;
};

const METRICS: Metric[] = [
  {
    id: "mandals",
    value: 589,
    display: "589/589",
    label: "Mandals",
  },
  {
    id: "go23",
    value: 250,
    label: "Units G.O. 23",
  },
  {
    id: "helpline",
    value: null,
    display: "24/7",
    label: "Helpline",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function AnimatedFigure({
  metric,
  active,
  reduced,
}: {
  metric: Metric;
  active: boolean;
  reduced: boolean;
}) {
  const [n, setN] = useState(reduced || !metric.value ? metric.value ?? 0 : 0);

  useEffect(() => {
    if (metric.value == null) return;
    if (reduced || !active) {
      setN(metric.value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const target = metric.value;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, metric.value, reduced]);

  if (metric.display && metric.id === "mandals") {
    const num = active || reduced ? (reduced ? 589 : n) : n;
    return (
      <span className="metric-tnum tabular-nums text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
        {num}/589
      </span>
    );
  }

  if (metric.display && metric.value == null) {
    return (
      <span className="metric-tnum tabular-nums text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
        {metric.display}
      </span>
    );
  }

  return (
    <span className="metric-tnum tabular-nums text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
      {metric.prefix}
      {n}
      {metric.suffix}
    </span>
  );
}

export function CivicMetricsTicker() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Civic metrics"
      className="relative z-10 -mt-5 px-4 sm:-mt-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA] shadow-[0_8px_30px_rgb(15_23_42_/0.06)]">
        <div className="flex items-center justify-center gap-2 border-b border-[#E2E8F0] bg-white/70 px-4 py-2">
          <span className="h-0.5 w-6 rounded-full bg-[#B45309]" aria-hidden />
          <span className="live-pulse-dot" aria-hidden />
          <p className="font-sans text-[11px] font-semibold tracking-wide text-[#0F172A]">
            Live Civic Coverage
          </p>
          <span className="h-0.5 w-6 rounded-full bg-[#B45309]" aria-hidden />
        </div>

        <div className="grid grid-cols-3 gap-0 divide-x divide-[#E2E8F0]">
          {METRICS.map((metric) => (
            <div
              key={metric.id}
              className="flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 px-3 py-4 text-center sm:min-h-[6rem] sm:px-4 sm:py-5"
            >
              <AnimatedFigure
                metric={metric}
                active={active}
                reduced={reduced}
              />
              <p className="max-w-[9rem] text-balance font-sans text-[11px] font-semibold leading-snug text-slate-600 md:text-xs">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
