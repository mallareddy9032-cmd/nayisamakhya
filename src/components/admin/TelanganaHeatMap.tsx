"use client";

import React, { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import {
  HEATMAP_TOKENS,
  isSaturationSparse,
  mandalDensityFill,
  saturationRampFill,
  shortDistrictLabel,
  slugFromGeoDistrictName,
  tierFill,
  tierLabel,
  type DistrictSaturation,
  type PilotCorridorKpi,
  type SaturationTier,
} from "@/lib/analytics/saturation";

type TopoDistrictProps = {
  district?: string;
  dt_code?: string;
  slug?: string;
};

export type TelanganaHeatMapProps = {
  districts: DistrictSaturation[];
  pilotCorridors?: PilotCorridorKpi[];
  loading?: boolean;
  notes?: string[];
  verifiedSource?: string;
  /** Currently filtered district (controlled). */
  selectedSlug?: string | null;
  /** Click a district to filter the submission queue. */
  onDistrictSelect?: (slug: string | null) => void;
};

const TIER_ORDER: SaturationTier[] = ["high", "active", "critical"];

function HeatMapSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-5" aria-busy="true" aria-label="Loading heat map">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl"
            style={{ background: "#E2E8F0" }}
          />
        ))}
      </div>
      <div
        className="h-[320px] rounded-xl sm:h-[420px]"
        style={{ background: "#E2E8F0" }}
      />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 rounded-md"
            style={{ background: "#E2E8F0" }}
          />
        ))}
      </div>
    </div>
  );
}

/** Mobile-first ranked corridor cards (replaces SVG choropleth below md). */
function CivicCorridorCards({
  districts,
  selectedSlug,
  onSelect,
}: {
  districts: DistrictSaturation[];
  selectedSlug?: string | null;
  onSelect?: (slug: string | null) => void;
}) {
  const ranked = useMemo(
    () => [...districts].sort((a, b) => b.index - a.index),
    [districts],
  );

  return (
    <div className="block space-y-2.5 p-4 md:hidden" aria-label="Civic corridor cards">
      <p
        className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: HEATMAP_TOKENS.ceremonialGold }}
      >
        Civic Corridor Rank · Tap to filter
      </p>
      {ranked.map((row, i) => {
        const active = selectedSlug === row.slug;
        return (
          <button
            key={row.slug}
            type="button"
            onClick={() =>
              onSelect?.(selectedSlug === row.slug ? null : row.slug)
            }
            className="w-full rounded-xl border px-3.5 py-3 text-left transition-shadow"
            style={{
              borderColor: active
                ? HEATMAP_TOKENS.ceremonialGold
                : HEATMAP_TOKENS.border,
              background: active ? "rgb(180 83 9 / 0.06)" : "#FFFFFF",
              boxShadow: active
                ? "0 0 0 1px rgb(180 83 9 / 0.3)"
                : undefined,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tabular-nums text-slate-400">
                  #{i + 1}
                </p>
                <p
                  className="font-telugu text-sm font-bold leading-relaxed"
                  style={{ color: HEATMAP_TOKENS.deepSlate }}
                >
                  {row.name_te}
                </p>
                <p className="text-[11px] text-slate-500">{row.name_en}</p>
              </div>
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                style={{
                  background: `${tierFill(row.tier)}22`,
                  color: tierFill(row.tier),
                }}
              >
                SI {row.index}
              </span>
            </div>
            <div className="mt-2.5">
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: "#E2E8F0" }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        8,
                        row.index > 0
                          ? row.index
                          : (row.total_mandals / 45) * 100,
                      ),
                    )}%`,
                    background:
                      row.index > 0
                        ? saturationRampFill(row.index)
                        : mandalDensityFill(row.total_mandals, 10, 45),
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                <span>{tierLabel(row.tier)}</span>
                <span className="tabular-nums">
                  {row.total_mandals} mandals · {row.verified_uploads} uploads
                </span>
              </div>
            </div>
          </button>
        );
      })}
      {ranked.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-500">
          No saturation data
        </p>
      ) : null}
    </div>
  );
}

function PilotCorridorPanel({
  pilots,
  onSelect,
  selectedSlug,
}: {
  pilots: PilotCorridorKpi[];
  onSelect?: (slug: string | null) => void;
  selectedSlug?: string | null;
}) {
  if (pilots.length === 0) return null;

  return (
    <div
      className="border-b px-4 py-4 sm:px-5"
      style={{
        borderColor: HEATMAP_TOKENS.border,
        background:
          "linear-gradient(90deg, rgb(180 83 9 / 0.08), rgb(5 150 105 / 0.06), rgb(15 23 42 / 0.04))",
      }}
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: HEATMAP_TOKENS.ceremonialGold }}
          >
            Pilot Corridor Focus
          </p>
          <h3
            className="mt-0.5 font-telugu text-sm font-bold"
            style={{ color: HEATMAP_TOKENS.deepSlate }}
          >
            సూర్యాపేట · కోదాడ · రంగారెడ్డి
          </h3>
        </div>
        <p className="text-[11px]" style={{ color: "#64748B" }}>
          Pending · Rejected · Petitions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pilots.map((p) => {
          const active =
            selectedSlug === p.district_slug ||
            (p.mandal_slug && selectedSlug === p.district_slug);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                onSelect?.(
                  selectedSlug === p.district_slug ? null : p.district_slug,
                )
              }
              className="rounded-xl border px-3.5 py-3 text-left transition-shadow hover:shadow-md"
              style={{
                borderColor: active
                  ? HEATMAP_TOKENS.ceremonialGold
                  : HEATMAP_TOKENS.border,
                background: "#FFFFFF",
                boxShadow: active
                  ? "0 0 0 1px rgb(180 83 9 / 0.35)"
                  : undefined,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className="font-telugu text-sm font-bold"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {p.name_te}
                  </p>
                  <p className="text-[11px]" style={{ color: "#64748B" }}>
                    {p.name_en}
                    {p.scope === "mandal" ? " · mandal focus" : ""}
                  </p>
                </div>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                  style={{
                    background: `${tierFill(p.tier)}22`,
                    color: tierFill(p.tier),
                  }}
                >
                  SI {p.saturation_index}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dt className="text-[9px] uppercase tracking-wide text-amber-700">
                    Pending
                  </dt>
                  <dd
                    className="mt-0.5 text-lg font-bold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {p.pending}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-wide text-rose-700">
                    Rejected
                  </dt>
                  <dd
                    className="mt-0.5 text-lg font-bold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {p.rejected}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-wide text-slate-500">
                    Petitions
                  </dt>
                  <dd
                    className="mt-0.5 text-lg font-bold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {p.petitions}
                  </dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TelanganaHeatMap({
  districts,
  pilotCorridors = [],
  loading,
  notes,
  verifiedSource,
  selectedSlug: controlledSlug,
  onDistrictSelect,
}: TelanganaHeatMapProps) {
  const [geo, setGeo] = useState<FeatureCollection<
    Geometry,
    TopoDistrictProps
  > | null>(null);
  const [geoError, setGeoError] = useState("");
  const [internalSlug, setInternalSlug] = useState<string | null>(null);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    sat: DistrictSaturation;
  } | null>(null);

  const selectedSlug =
    controlledSlug !== undefined ? controlledSlug : internalSlug;

  const setSelectedSlug = (slug: string | null) => {
    if (controlledSlug === undefined) setInternalSlug(slug);
    onDistrictSelect?.(slug);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/geo/telangana-districts.topo.json", {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(`Map data HTTP ${res.status}`);
        const topo = (await res.json()) as Topology<{
          districts: GeometryCollection<TopoDistrictProps>;
        }>;
        const fc = feature(topo, topo.objects.districts) as FeatureCollection<
          Geometry,
          TopoDistrictProps
        >;
        if (!cancelled) setGeo(fc);
      } catch (err) {
        if (!cancelled) {
          setGeoError(
            err instanceof Error ? err.message : "Failed to load map",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bySlug = useMemo(() => {
    const m = new Map<string, DistrictSaturation>();
    for (const d of districts) m.set(d.slug, d);
    return m;
  }, [districts]);

  const selected = selectedSlug ? bySlug.get(selectedSlug) : null;
  const hovered = hoverSlug ? bySlug.get(hoverSlug) : null;
  const focus = hovered || selected;

  const paths = useMemo(() => {
    if (!geo) return [];
    const projection = geoMercator().fitSize([640, 520], geo);
    const path = geoPath(projection);
    return geo.features.map((f, i) => {
      const name = f.properties?.district || "";
      const slug =
        f.properties?.slug ||
        slugFromGeoDistrictName(name) ||
        `unknown-${i}`;
      const d = path(f) || "";
      const sat = bySlug.get(slug);
      const tier: SaturationTier = sat?.tier || "critical";
      const centroid = path.centroid(f) as [number, number];
      const bounds = path.bounds(f) as [[number, number], [number, number]];
      const width = bounds[1][0] - bounds[0][0];
      const height = bounds[1][1] - bounds[0][1];
      const area = path.area(f) || width * height;
      return { slug, name, d, tier, sat, centroid, width, height, area };
    });
  }, [geo, bySlug]);

  const sparse = useMemo(() => isSaturationSparse(districts), [districts]);

  const mandalRange = useMemo(() => {
    const counts = districts.map((d) => d.total_mandals);
    return {
      min: counts.length ? Math.min(...counts) : 0,
      max: counts.length ? Math.max(...counts) : 1,
    };
  }, [districts]);

  const districtFill = (sat: DistrictSaturation | undefined) => {
    if (!sat) return HEATMAP_TOKENS.slateMuted;
    if (sparse) {
      return mandalDensityFill(sat.total_mandals, mandalRange.min, mandalRange.max);
    }
    return saturationRampFill(sat.index);
  };

  /** Greedy centroid labels — largest districts first; skip collisions / tiny polys. */
  const labels = useMemo(() => {
    const MIN_AREA = 900;
    const PAD_X = 36;
    const PAD_Y = 16;
    const candidates = [...paths]
      .filter((p) => p.sat && p.area >= MIN_AREA && Number.isFinite(p.centroid[0]))
      .sort((a, b) => b.area - a.area);

    const placed: {
      slug: string;
      x: number;
      y: number;
      name: string;
      mandals: number;
      index: number;
      tiny: boolean;
    }[] = [];

    for (const p of candidates) {
      const [x, y] = p.centroid;
      if (x < 28 || x > 612 || y < 18 || y > 502) continue;
      const clash = placed.some(
        (q) => Math.abs(q.x - x) < PAD_X && Math.abs(q.y - y) < PAD_Y,
      );
      if (clash) continue;
      placed.push({
        slug: p.slug,
        x,
        y,
        name: shortDistrictLabel(p.sat!.name_en),
        mandals: p.sat!.total_mandals,
        index: p.sat!.index,
        tiny: p.area < 2200,
      });
    }
    return placed;
  }, [paths]);

  const tierCounts = useMemo(() => {
    const c: Record<SaturationTier, number> = {
      high: 0,
      active: 0,
      critical: 0,
    };
    for (const d of districts) c[d.tier] += 1;
    return c;
  }, [districts]);

  if (loading && districts.length === 0) {
    return (
      <section
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: HEATMAP_TOKENS.navy,
          background: HEATMAP_TOKENS.warmPaper,
        }}
      >
        <HeatMapSkeleton />
      </section>
    );
  }

  return (
    <section
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: HEATMAP_TOKENS.navy,
        background: HEATMAP_TOKENS.warmPaper,
        color: HEATMAP_TOKENS.deepSlate,
      }}
    >
      <div
        className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: HEATMAP_TOKENS.border, background: "#F8FAFC" }}
      >
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: HEATMAP_TOKENS.ceremonialGold }}
          >
            Module 1 · Saturation Index
          </p>
          <h2
            className="mt-1 font-telugu text-sm font-semibold"
            style={{ color: HEATMAP_TOKENS.deepSlate }}
          >
            {"\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30 \u0C39\u0C40\u0C1F\u0C4D \u0C2E\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D"}{" "}
            (33-District Heat Map)
          </h2>
          <p className="mt-1 max-w-xl text-xs" style={{ color: "#475569" }}>
            Score = min(100, round(((verified×1.5)+(coordinators×3))/mandals×10)).
            Click a district to filter the submission queue.
          </p>
          {sparse ? (
            <p
              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium"
              style={{
                background: "rgb(180 83 9 / 0.1)",
                color: HEATMAP_TOKENS.ceremonialGold,
              }}
            >
              Saturation pending — map tint shows mandal density until field data loads.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {sparse ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium"
              style={{ background: "#E2E8F0", color: HEATMAP_TOKENS.navy }}
            >
              <span
                className="inline-block h-2.5 w-8 rounded-sm"
                style={{
                  background:
                    "linear-gradient(90deg, #CBD5E1, #94A3B8)",
                }}
              />
              Mandal density
            </span>
          ) : null}
          {TIER_ORDER.map((tier) => (
            <span
              key={tier}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium"
              style={{
                background: `${tierFill(tier)}22`,
                color:
                  tier === "critical"
                    ? HEATMAP_TOKENS.navy
                    : tierFill(tier),
                opacity: sparse ? 0.55 : 1,
              }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: tierFill(tier) }}
              />
              {tierLabel(tier)} ({tierCounts[tier]})
            </span>
          ))}
        </div>
      </div>

      <PilotCorridorPanel
        pilots={pilotCorridors}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
      />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          {/* Mobile: ranked Civic Corridor Cards */}
          <CivicCorridorCards
            districts={districts}
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
          />

          {/* Desktop/tablet: TopoJSON choropleth */}
          <div className="hidden md:block">
          {geoError ? (
            <div className="p-8 text-center text-sm text-rose-700">
              {geoError}
            </div>
          ) : !geo ? (
            <div
              className="flex h-[320px] items-center justify-center text-xs sm:h-[420px]"
              style={{ color: "#64748B" }}
            >
              Loading Telangana districts…
            </div>
          ) : (
            <div className="relative">
              <svg
                viewBox="0 0 640 520"
                role="img"
                aria-label="Telangana district saturation choropleth with district labels"
                className="h-auto w-full"
              >
                <defs>
                  <filter id="heat-selected-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="0"
                      dy="1"
                      stdDeviation="2.2"
                      floodColor={HEATMAP_TOKENS.ceremonialGold}
                      floodOpacity="0.45"
                    />
                  </filter>
                </defs>
                <rect
                  width="640"
                  height="520"
                  fill={HEATMAP_TOKENS.warmPaper}
                />
                {paths.map((p) => {
                  const isFocus = focus?.slug === p.slug;
                  const isSelected = selectedSlug === p.slug;
                  return (
                    <path
                      key={p.slug}
                      d={p.d}
                      fill={districtFill(p.sat)}
                      fillOpacity={isFocus || isSelected ? 1 : 0.92}
                      stroke={
                        isSelected
                          ? HEATMAP_TOKENS.ceremonialGold
                          : isFocus
                            ? HEATMAP_TOKENS.deepSlate
                            : "#FFFFFF"
                      }
                      strokeWidth={isSelected ? 2.4 : isFocus ? 1.5 : 0.85}
                      filter={isSelected ? "url(#heat-selected-glow)" : undefined}
                      className="cursor-pointer transition-[fill-opacity,stroke-width,filter] duration-200"
                      onMouseEnter={(e) => {
                        setHoverSlug(p.slug);
                        if (p.sat) {
                          const rect = (
                            e.currentTarget.ownerSVGElement as SVGSVGElement
                          ).getBoundingClientRect();
                          setTooltip({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                            sat: p.sat,
                          });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (!p.sat) return;
                        const rect = (
                          e.currentTarget.ownerSVGElement as SVGSVGElement
                        ).getBoundingClientRect();
                        setTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                          sat: p.sat,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverSlug(null);
                        setTooltip(null);
                      }}
                      onClick={() =>
                        setSelectedSlug(
                          selectedSlug === p.slug ? null : p.slug,
                        )
                      }
                    />
                  );
                })}

                {/* District name + mandal count at centroids (collision-aware) */}
                {labels.map((lb) => {
                  const isFocus =
                    focus?.slug === lb.slug || selectedSlug === lb.slug;
                  return (
                    <g
                      key={`label-${lb.slug}`}
                      transform={`translate(${lb.x}, ${lb.y})`}
                      pointerEvents="none"
                      opacity={isFocus ? 1 : 0.92}
                    >
                      <rect
                        x={-34}
                        y={lb.tiny ? -8 : -12}
                        width={68}
                        height={lb.tiny ? 20 : 26}
                        rx={3}
                        fill="rgb(255 255 255 / 0.72)"
                        stroke={
                          isFocus
                            ? HEATMAP_TOKENS.ceremonialGold
                            : "rgb(15 23 42 / 0.08)"
                        }
                        strokeWidth={isFocus ? 1 : 0.5}
                      />
                      <text
                        textAnchor="middle"
                        y={lb.tiny ? 0 : -1}
                        className="select-none"
                        style={{
                          fontSize: lb.tiny ? 7.5 : 8.5,
                          fontWeight: 700,
                          fill: HEATMAP_TOKENS.deepSlate,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                        }}
                      >
                        {lb.name}
                      </text>
                      <text
                        textAnchor="middle"
                        y={lb.tiny ? 9 : 11}
                        className="select-none"
                        style={{
                          fontSize: 7,
                          fontWeight: 600,
                          fill: "#475569",
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                        }}
                      >
                        {lb.mandals} mandals
                        {!sparse ? ` · SI ${lb.index}` : ""}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {tooltip ? (
                <div
                  className="pointer-events-none absolute z-10 max-w-[240px] rounded-lg border px-3 py-2 text-[11px] shadow-lg"
                  style={{
                    left: Math.min(tooltip.x + 12, 400),
                    top: Math.max(8, tooltip.y - 8),
                    borderColor: HEATMAP_TOKENS.border,
                    background: "#FFFFFF",
                    color: HEATMAP_TOKENS.deepSlate,
                  }}
                >
                  <p className="font-telugu text-sm font-bold leading-relaxed">
                    {tooltip.sat.name_te}
                  </p>
                  <p className="text-slate-500">{tooltip.sat.name_en}</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>
                      <dt className="text-[9px] uppercase text-slate-400">
                        Mandals
                      </dt>
                      <dd className="font-semibold tabular-nums">
                        {tooltip.sat.total_mandals}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase text-slate-400">
                        Saturation
                      </dt>
                      <dd
                        className="font-bold tabular-nums"
                        style={{ color: saturationRampFill(tooltip.sat.index) }}
                      >
                        {tooltip.sat.index}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase text-slate-400">
                        Representations
                      </dt>
                      <dd className="font-semibold tabular-nums">
                        {tooltip.sat.total_representations}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase text-slate-400">
                        Coordinators
                      </dt>
                      <dd className="font-semibold tabular-nums">
                        {tooltip.sat.active_coordinators}
                      </dd>
                    </div>
                  </dl>
                  <p
                    className="mt-1.5 text-[10px] font-semibold"
                    style={{ color: tierFill(tooltip.sat.tier) }}
                  >
                    {sparse
                      ? "Mandal density view"
                      : tierLabel(tooltip.sat.tier)}
                  </p>
                </div>
              ) : null}
            </div>
          )}
          </div>
        </div>

        <aside
          className="hidden border-t p-5 md:block lg:col-span-5 lg:border-l lg:border-t-0"
          style={{ borderColor: HEATMAP_TOKENS.border, background: "#FFFFFF" }}
        >
          {focus ? (
            <div className="space-y-4">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: HEATMAP_TOKENS.ceremonialGold }}
                >
                  {sparse ? "Mandal density · pending SI" : tierLabel(focus.tier)}
                </p>
                <h3
                  className="mt-1 font-telugu text-lg font-semibold leading-relaxed"
                  style={{ color: HEATMAP_TOKENS.deepSlate }}
                >
                  {focus.name_te}
                </h3>
                <p className="text-sm" style={{ color: "#475569" }}>
                  {focus.name_en}
                </p>
              </div>

              <div
                className="rounded-lg px-4 py-3"
                style={{ background: HEATMAP_TOKENS.warmPaper }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "#64748B" }}
                >
                  Saturation Index
                </p>
                <p
                  className="mt-1 text-3xl font-bold tabular-nums transition-colors duration-300"
                  style={{ color: saturationRampFill(Math.max(focus.index, sparse ? 8 : 0)) }}
                >
                  {focus.index}
                </p>
                <p className="mt-1 text-[11px] tabular-nums text-slate-500">
                  {focus.total_mandals} mandals in this district
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: HEATMAP_TOKENS.border }}
                >
                  <dt style={{ color: "#64748B" }}>Total representations</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.total_representations}
                  </dd>
                </div>
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: HEATMAP_TOKENS.border }}
                >
                  <dt style={{ color: "#64748B" }}>Active coordinators</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.active_coordinators}
                  </dd>
                </div>
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: HEATMAP_TOKENS.border }}
                >
                  <dt style={{ color: "#64748B" }}>Verified uploads</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.verified_uploads}
                  </dd>
                </div>
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: HEATMAP_TOKENS.border }}
                >
                  <dt style={{ color: "#64748B" }}>Total mandals</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.total_mandals}
                  </dd>
                </div>
              </dl>

              {onDistrictSelect ? (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSlug(
                      selectedSlug === focus.slug ? null : focus.slug,
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-xs font-semibold text-white"
                  style={{ background: HEATMAP_TOKENS.ceremonialGold }}
                >
                  {selectedSlug === focus.slug
                    ? "Clear district filter"
                    : `Filter queue → ${focus.name_en}`}
                </button>
              ) : null}
            </div>
          ) : (
            <div
              className="flex h-full min-h-[200px] flex-col justify-center text-center text-xs"
              style={{ color: "#64748B" }}
            >
              <p className="font-medium" style={{ color: HEATMAP_TOKENS.navy }}>
                Hover or select a district
              </p>
              <p className="mt-2 leading-relaxed">
                Emerald ≥70 · Gold 30–69 · Slate &lt;30 — click filters the
                submission queue below.
              </p>
            </div>
          )}

          {(notes && notes.length > 0) || verifiedSource ? (
            <div
              className="mt-6 space-y-1 border-t pt-4 text-[10px] leading-relaxed"
              style={{ borderColor: HEATMAP_TOKENS.border, color: "#64748B" }}
            >
              {verifiedSource ? (
                <p>
                  Coordinators source:{" "}
                  <code className="rounded bg-slate-100 px-1">
                    {verifiedSource}
                  </code>
                </p>
              ) : null}
              {(notes || []).map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      <div
        className="hidden overflow-x-auto border-t md:block"
        style={{ borderColor: HEATMAP_TOKENS.border }}
      >
        <table className="w-full text-left text-xs" style={{ color: "#334155" }}>
          <thead
            className="text-[10px] uppercase tracking-wider"
            style={{ background: "#F1F5F9", color: "#64748B" }}
          >
            <tr>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Uploads</th>
              <th className="px-4 py-3 text-center">Coordinators</th>
              <th className="px-4 py-3 text-center">Mandals</th>
              <th className="px-4 py-3">Tier</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((row) => (
              <tr
                key={row.slug}
                className="cursor-pointer border-t transition-colors hover:bg-slate-50"
                style={{
                  borderColor: HEATMAP_TOKENS.border,
                  background:
                    selectedSlug === row.slug ? "rgb(180 83 9 / 0.06)" : undefined,
                }}
                onClick={() =>
                  setSelectedSlug(
                    selectedSlug === row.slug ? null : row.slug,
                  )
                }
                onMouseEnter={() => setHoverSlug(row.slug)}
                onMouseLeave={() => setHoverSlug(null)}
              >
                <td
                  className="px-4 py-2.5 font-medium"
                  style={{ color: HEATMAP_TOKENS.deepSlate }}
                >
                  <span className="font-telugu">{row.name_te}</span>
                  <span className="ml-2 text-[10px] font-normal text-slate-500">
                    {row.name_en}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center font-semibold tabular-nums">
                  {row.index}
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.verified_uploads}
                  <span className="text-slate-400">/{row.total_representations}</span>
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.active_coordinators}
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.total_mandals}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: `${tierFill(row.tier)}22`,
                      color:
                        row.tier === "critical"
                          ? HEATMAP_TOKENS.navy
                          : tierFill(row.tier),
                    }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: tierFill(row.tier) }}
                    />
                    {tierLabel(row.tier)}
                  </span>
                </td>
              </tr>
            ))}
            {districts.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No saturation data
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TelanganaHeatMap;
