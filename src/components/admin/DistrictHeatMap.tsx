"use client";

import React, { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import {
  HEATMAP_TOKENS,
  slugFromGeoDistrictName,
  tierFill,
  tierLabel,
  type DistrictSaturation,
  type SaturationTier,
} from "@/lib/analytics/saturation";

type TopoDistrictProps = {
  district?: string;
  dt_code?: string;
  slug?: string;
};

type Props = {
  districts: DistrictSaturation[];
  loading?: boolean;
  notes?: string[];
  verifiedSource?: string;
};

const TIER_ORDER: SaturationTier[] = ["high", "active", "critical"];

export default function DistrictHeatMap({
  districts,
  loading,
  notes,
  verifiedSource,
}: Props) {
  const [geo, setGeo] = useState<FeatureCollection<
    Geometry,
    TopoDistrictProps
  > | null>(null);
  const [geoError, setGeoError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);

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
      return { slug, name, d, tier, sat };
    });
  }, [geo, bySlug]);

  const tierCounts = useMemo(() => {
    const c: Record<SaturationTier, number> = {
      high: 0,
      active: 0,
      critical: 0,
    };
    for (const d of districts) c[d.tier] += 1;
    return c;
  }, [districts]);

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
        style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}
      >
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: HEATMAP_TOKENS.gold }}
          >
            Module 1 · Saturation Index
          </p>
          <h2
            className="mt-1 font-telugu text-sm font-semibold"
            style={{ color: HEATMAP_TOKENS.deepSlate }}
          >
            {"\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30 \u0C39\u0C40\u0C1F\u0C4D \u0C2E\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D"}{" "}
            (Statewide Heat Map)
          </h2>
          <p className="mt-1 max-w-xl text-xs" style={{ color: "#475569" }}>
            Index = (Active Submissions + Verified Coordinators) ÷ Mandals.
            Click a district for detail.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {TIER_ORDER.map((tier) => (
            <span
              key={tier}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium"
              style={{
                background:
                  tier === "high"
                    ? "rgb(16 185 129 / 0.15)"
                    : tier === "active"
                      ? "rgb(180 83 9 / 0.12)"
                      : "rgb(100 116 139 / 0.18)",
                color:
                  tier === "high"
                    ? HEATMAP_TOKENS.emerald
                    : tier === "active"
                      ? HEATMAP_TOKENS.gold
                      : HEATMAP_TOKENS.navy,
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

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          {geoError ? (
            <div className="p-8 text-center text-sm text-rose-700">
              {geoError}
            </div>
          ) : !geo || loading ? (
            <div
              className="flex h-[320px] items-center justify-center text-xs sm:h-[420px]"
              style={{ color: "#64748B" }}
            >
              Loading Telangana districts…
            </div>
          ) : (
            <svg
              viewBox="0 0 640 520"
              role="img"
              aria-label="Telangana district saturation choropleth"
              className="h-auto w-full"
            >
              <rect
                width="640"
                height="520"
                fill={HEATMAP_TOKENS.warmPaper}
              />
              {paths.map((p) => {
                const isFocus = focus?.slug === p.slug;
                return (
                  <path
                    key={p.slug}
                    d={p.d}
                    fill={tierFill(p.tier)}
                    fillOpacity={isFocus ? 1 : 0.88}
                    stroke={
                      isFocus ? HEATMAP_TOKENS.deepSlate : HEATMAP_TOKENS.stroke
                    }
                    strokeWidth={isFocus ? 1.8 : 0.7}
                    className="cursor-pointer transition-[fill-opacity,stroke-width] duration-150"
                    onMouseEnter={() => setHoverSlug(p.slug)}
                    onMouseLeave={() => setHoverSlug(null)}
                    onClick={() =>
                      setSelectedSlug((prev) =>
                        prev === p.slug ? null : p.slug,
                      )
                    }
                  >
                    <title>
                      {p.sat
                        ? `${p.sat.name_en}: index ${p.sat.index.toFixed(2)} · ${tierLabel(p.sat.tier)}`
                        : p.name}
                    </title>
                  </path>
                );
              })}
            </svg>
          )}
        </div>

        <aside
          className="border-t p-5 lg:col-span-5 lg:border-l lg:border-t-0"
          style={{ borderColor: "#E2E8F0", background: "#FFFFFF" }}
        >
          {focus ? (
            <div className="space-y-4">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: HEATMAP_TOKENS.gold }}
                >
                  {tierLabel(focus.tier)}
                </p>
                <h3
                  className="mt-1 font-telugu text-lg font-semibold"
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
                  className="mt-1 text-3xl font-bold tabular-nums"
                  style={{
                    color:
                      focus.tier === "high"
                        ? HEATMAP_TOKENS.emerald
                        : focus.tier === "active"
                          ? HEATMAP_TOKENS.gold
                          : HEATMAP_TOKENS.critical,
                  }}
                >
                  {focus.index.toFixed(2)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <dt style={{ color: "#64748B" }}>Active submissions</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.active_submissions}
                  </dd>
                </div>
                <div
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <dt style={{ color: "#64748B" }}>Verified coordinators</dt>
                  <dd
                    className="mt-1 text-lg font-semibold tabular-nums"
                    style={{ color: HEATMAP_TOKENS.deepSlate }}
                  >
                    {focus.verified_coordinators}
                  </dd>
                </div>
                <div
                  className="col-span-2 rounded-lg border px-3 py-2"
                  style={{ borderColor: "#E2E8F0" }}
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
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] flex-col justify-center text-center text-xs" style={{ color: "#64748B" }}>
              <p className="font-medium" style={{ color: HEATMAP_TOKENS.navy }}>
                Hover or select a district
              </p>
              <p className="mt-2 leading-relaxed">
                Emerald = High Engagement · Gold = Active Rollout · Slate =
                Critical Outreach Needed
              </p>
            </div>
          )}

          {(notes && notes.length > 0) || verifiedSource ? (
            <div
              className="mt-6 space-y-1 border-t pt-4 text-[10px] leading-relaxed"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
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

      <div className="overflow-x-auto border-t" style={{ borderColor: "#E2E8F0" }}>
        <table className="w-full text-left text-xs" style={{ color: "#334155" }}>
          <thead
            className="text-[10px] uppercase tracking-wider"
            style={{ background: "#F1F5F9", color: "#64748B" }}
          >
            <tr>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3 text-center">Index</th>
              <th className="px-4 py-3 text-center">Active</th>
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
                style={{ borderColor: "#E2E8F0" }}
                onClick={() => setSelectedSlug(row.slug)}
                onMouseEnter={() => setHoverSlug(row.slug)}
                onMouseLeave={() => setHoverSlug(null)}
              >
                <td className="px-4 py-2.5 font-medium" style={{ color: HEATMAP_TOKENS.deepSlate }}>
                  <span className="font-telugu">{row.name_te}</span>
                  <span className="ml-2 text-[10px] font-normal text-slate-500">
                    {row.name_en}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center font-semibold tabular-nums">
                  {row.index.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.active_submissions}
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.verified_coordinators}
                </td>
                <td className="px-4 py-2.5 text-center tabular-nums">
                  {row.total_mandals}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background:
                        row.tier === "high"
                          ? "rgb(16 185 129 / 0.15)"
                          : row.tier === "active"
                            ? "rgb(180 83 9 / 0.12)"
                            : "rgb(100 116 139 / 0.18)",
                      color:
                        row.tier === "high"
                          ? HEATMAP_TOKENS.emerald
                          : row.tier === "active"
                            ? HEATMAP_TOKENS.gold
                            : HEATMAP_TOKENS.navy,
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
