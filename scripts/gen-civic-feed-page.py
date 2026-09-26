#!/usr/bin/env python3
"""Generate src/app/feed/page.tsx with ASCII-safe Telugu escapes."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/app/feed/page.tsx"


def esc(s: str) -> str:
    out: list[str] = []
    for c in s:
        o = ord(c)
        if c == "\\":
            out.append("\\\\")
        elif c == '"':
            out.append('\\"')
        elif o < 32 or o > 126:
            out.append(f"\\u{o:04x}")
        else:
            out.append(c)
    return "".join(out)


def t(s: str) -> str:
    return f'"{esc(s)}"'


def te(*cps: int) -> str:
    return "".join(chr(c) for c in cps)


def main() -> None:
    # Build Telugu strings from code points to avoid source corruption.
    # తెలంగాణ నాయి సమాఖ్య అధికారిక క్షేత్ర సమీక్ష పోర్టల్ — 33 జిల్లాల ధ్రువీకరించబడిన సమాచారం
    ribbon = (
        te(0x0C24, 0x0C46, 0x0C32, 0x0C02, 0x0C17, 0x0C3E, 0x0C23)
        + " "
        + te(0x0C28, 0x0C3E, 0x0C2F, 0x0C3F)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C3E, 0x0C16, 0x0C4D, 0x0C2F)
        + " "
        + te(0x0C05, 0x0C27, 0x0C3F, 0x0C15, 0x0C3E, 0x0C30, 0x0C3F, 0x0C15)
        + " "
        + te(0x0C15, 0x0C4D, 0x0C37, 0x0C47, 0x0C24, 0x0C4D, 0x0C30)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C40, 0x0C15, 0x0C4D, 0x0C37)
        + " "
        + te(0x0C2A, 0x0C4B, 0x0C30, 0x0C4D, 0x0C1F, 0x0C32, 0x0C4D)
        + " \u2014 33 "
        + te(0x0C1C, 0x0C3F, 0x0C32, 0x0C4D, 0x0C32, 0x0C3E, 0x0C32)
        + " "
        + te(
            0x0C27,
            0x0C4D,
            0x0C30,
            0x0C41,
            0x0C35,
            0x0C40,
            0x0C15,
            0x0C30,
            0x0C3F,
            0x0C02,
            0x0C1A,
            0x0C2C,
            0x0C21,
            0x0C3F,
            0x0C28,
        )
        + " "
        + te(0x0C38, 0x0C2E, 0x0C3E, 0x0C1A, 0x0C3E, 0x0C30, 0x0C02)
    )
    # హోమ్‌పేజీకి వెళ్లండి
    home_title = (
        te(0x0C39, 0x0C4B, 0x0C2E, 0x0C4D)
        + "\u200C"
        + te(0x0C2A, 0x0C47, 0x0C1C, 0x0C40, 0x0C15, 0x0C3F)
        + " "
        + te(0x0C35, 0x0C46, 0x0C33, 0x0C4D, 0x0C32, 0x0C02, 0x0C21, 0x0C3F)
    )
    # రాష్ట్రవ్యాప్త క్షేత్ర సమీక్ష ఫీడ్
    heading = (
        te(
            0x0C30,
            0x0C3E,
            0x0C37,
            0x0C4D,
            0x0C1F,
            0x0C4D,
            0x0C30,
            0x0C35,
            0x0C4D,
            0x0C2F,
            0x0C3E,
            0x0C2A,
            0x0C4D,
            0x0C24,
        )
        + " "
        + te(0x0C15, 0x0C4D, 0x0C37, 0x0C47, 0x0C24, 0x0C4D, 0x0C30)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C40, 0x0C15, 0x0C4D, 0x0C37)
        + " "
        + te(0x0C2B, 0x0C40, 0x0C21, 0x0C4D)
    )
    # వినతిపత్రం తయారీ
    cta_rep = (
        te(0x0C35, 0x0C3F, 0x0C28, 0x0C24, 0x0C3F, 0x0C2A, 0x0C24, 0x0C4D, 0x0C30, 0x0C02)
        + " "
        + te(0x0C24, 0x0C2F, 0x0C3E, 0x0C30, 0x0C40)
    )
    # ఫోటో నమోదు
    cta_photo = (
        te(0x0C2B, 0x0C4B, 0x0C1F, 0x0C4B)
        + " "
        + te(0x0C28, 0x0C2E, 0x0C4B, 0x0C26, 0x0C41)
    )
    # filter label: region-wise filter
    filter_label = (
        te(0x0C2A, 0x0C4D, 0x0C30, 0x0C3E, 0x0C02, 0x0C24, 0x0C02)
        + " "
        + te(0x0C35, 0x0C3E, 0x0C30, 0x0C40, 0x0C17, 0x0C3E)
        + " "
        + te(0x0C2B, 0x0C3F, 0x0C32, 0x0C4D, 0x0C1F, 0x0C30, 0x0C4D)
        + ":"
    )
    all_districts = (
        te(0x0C05, 0x0C28, 0x0C4D, 0x0C28, 0x0C3F)
        + " "
        + te(0x0C1C, 0x0C3F, 0x0C32, 0x0C4D, 0x0C32, 0x0C3E, 0x0C32, 0x0C41)
        + " (All Districts)"
    )
    all_mandals = (
        te(0x0C05, 0x0C28, 0x0C4D, 0x0C28, 0x0C3F)
        + " "
        + te(0x0C2E, 0x0C02, 0x0C21, 0x0C32, 0x0C3E, 0x0C32, 0x0C41)
        + " (All Mandals)"
    )
    # రీసెట్ చేయండి
    reset = (
        te(0x0C30, 0x0C40, 0x0C38, 0x0C46, 0x0C1F, 0x0C4D)
        + " "
        + te(0x0C1A, 0x0C47, 0x0C2F, 0x0C02, 0x0C21, 0x0C3F)
    )
    # ఎలాంటి వివరాలు కనుగొనబడలేదు
    empty_title = (
        te(0x0C0E, 0x0C32, 0x0C3E, 0x0C02, 0x0C1F, 0x0C3F)
        + " "
        + te(0x0C35, 0x0C3F, 0x0C35, 0x0C30, 0x0C3E, 0x0C32, 0x0C41)
        + " "
        + te(
            0x0C15,
            0x0C28,
            0x0C41,
            0x0C17,
            0x0C4A,
            0x0C28,
            0x0C2C,
            0x0C21,
            0x0C32,
            0x0C47,
            0x0C26,
            0x0C41,
        )
    )
    # ఎంచుకున్న ప్రాంతంలో ఇంకా ధ్రువీకరించబడిన నివేదికలు లేవు. బాట్ ద్వారా నేరుగా సమాచారం పంపవచ్చు.
    empty_body = (
        te(0x0C0E, 0x0C02, 0x0C1A, 0x0C41, 0x0C15, 0x0C41, 0x0C28, 0x0C4D, 0x0C28)
        + " "
        + te(0x0C2A, 0x0C4D, 0x0C30, 0x0C3E, 0x0C02, 0x0C24, 0x0C02, 0x0C32, 0x0C4B)
        + " "
        + te(0x0C07, 0x0C02, 0x0C15, 0x0C3E)
        + " "
        + te(
            0x0C27,
            0x0C4D,
            0x0C30,
            0x0C41,
            0x0C35,
            0x0C40,
            0x0C15,
            0x0C30,
            0x0C3F,
            0x0C02,
            0x0C1A,
            0x0C2C,
            0x0C21,
            0x0C3F,
            0x0C28,
        )
        + " "
        + te(0x0C28, 0x0C3F, 0x0C35, 0x0C47, 0x0C26, 0x0C3F, 0x0C15, 0x0C32, 0x0C41)
        + " "
        + te(0x0C32, 0x0C47, 0x0C35, 0x0C41)
        + ". "
        + te(0x0C2C, 0x0C3E, 0x0C1F, 0x0C4D)
        + " "
        + te(0x0C26, 0x0C4D, 0x0C35, 0x0C3E, 0x0C30, 0x0C3E)
        + " "
        + te(0x0C28, 0x0C47, 0x0C30, 0x0C41, 0x0C17, 0x0C3E)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C3E, 0x0C1A, 0x0C3E, 0x0C30, 0x0C02)
        + " "
        + te(0x0C2A, 0x0C02, 0x0C2A, 0x0C35, 0x0C1A, 0x0C4D, 0x0C1A, 0x0C41)
        + "."
    )
    empty_cta = "@NayiSamakhyaDeskBot " + te(0x0C32, 0x0C4B) + " " + te(
        0x0C2B, 0x0C4B, 0x0C1F, 0x0C4B
    ) + " " + te(0x0C2A, 0x0C02, 0x0C2A, 0x0C02, 0x0C21, 0x0C3F) + " \u2192"
    # ధ్రువీకరించబడిన రికార్డు
    verified = (
        te(
            0x0C27,
            0x0C4D,
            0x0C30,
            0x0C41,
            0x0C35,
            0x0C40,
            0x0C15,
            0x0C30,
            0x0C3F,
            0x0C02,
            0x0C1A,
            0x0C2C,
            0x0C21,
            0x0C3F,
            0x0C28,
        )
        + " "
        + te(0x0C30, 0x0C3F, 0x0C15, 0x0C3E, 0x0C30, 0x0C4D, 0x0C21, 0x0C41)
    )
    # మరిన్ని ఫోటోలు
    more_photos = (
        te(0x0C2E, 0x0C30, 0x0C3F, 0x0C28, 0x0C4D, 0x0C28, 0x0C3F)
        + " "
        + te(0x0C2B, 0x0C4B, 0x0C1F, 0x0C4B, 0x0C32, 0x0C41)
    )
    # తెలంగాణ ప్రాంతం
    fallback_loc = (
        te(0x0C24, 0x0C46, 0x0C32, 0x0C02, 0x0C17, 0x0C3E, 0x0C23)
        + " "
        + te(0x0C2A, 0x0C4D, 0x0C30, 0x0C3E, 0x0C02, 0x0C24, 0x0C02)
    )
    # క్షేత్ర సర్వే మరియు కమ్యూనిటీ నివేదిక నమోదు చేయబడింది.
    fallback_caption = (
        te(0x0C15, 0x0C4D, 0x0C37, 0x0C47, 0x0C24, 0x0C4D, 0x0C30)
        + " "
        + te(0x0C38, 0x0C30, 0x0C4D, 0x0C35, 0x0C47)
        + " "
        + te(0x0C2E, 0x0C30, 0x0C3F, 0x0C2F, 0x0C41)
        + " "
        + te(
            0x0C15,
            0x0C2E,
            0x0C4D,
            0x0C2F,
            0x0C42,
            0x0C28,
            0x0C3F,
            0x0C1F,
            0x0C40,
        )
        + " "
        + te(0x0C28, 0x0C3F, 0x0C35, 0x0C47, 0x0C26, 0x0C3F, 0x0C15)
        + " "
        + te(0x0C28, 0x0C2E, 0x0C4B, 0x0C26, 0x0C41)
        + " "
        + te(
            0x0C1A,
            0x0C47,
            0x0C2F,
            0x0C2C,
            0x0C21,
            0x0C3F,
            0x0C02,
            0x0C26,
            0x0C3F,
        )
        + "."
    )
    # డెస్క్ సమీక్ష:
    desk_review = (
        te(0x0C21, 0x0C46, 0x0C38, 0x0C4D, 0x0C15, 0x0C4D)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C40, 0x0C15, 0x0C4D, 0x0C37)
        + ":"
    )
    make_rep = cta_rep

    content = f'''"use client";

import React, {{ useEffect, useMemo, useState }} from "react";
import Link from "next/link";
import {{
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
}} from "lucide-react";

interface FeedItem {{
  id: string;
  created_at: string;
  photo_url: string;
  photo_urls: string[];
  raw_caption: string;
  panchayat_name?: string;
  admin_notes?: string;
  districts?: {{ id: string; name_en: string; name_te: string }} | null;
  mandals?: {{ id: string; name_en: string; name_te: string }} | null;
}}

export default function CivicFeedPage() {{
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedMandal, setSelectedMandal] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {{
    async function loadFeed() {{
      setError("");
      try {{
        const res = await fetch("/api/feed", {{ cache: "no-store" }});
        const data = (await res.json()) as {{ feed?: FeedItem[]; error?: string }};
        if (!res.ok) {{
          setError(data.error || `HTTP ${{res.status}}`);
          setItems([]);
          return;
        }}
        setItems(data.feed || []);
      }} catch (err) {{
        console.error("Failed to load civic feed:", err);
        setError(err instanceof Error ? err.message : "Failed to load feed");
      }} finally {{
        setLoading(false);
      }}
    }}
    void loadFeed();
  }}, []);

  const districts = useMemo(() => {{
    const map = new Map<string, string>();
    items.forEach((item) => {{
      if (item.districts?.id) {{
        map.set(
          item.districts.id,
          item.districts.name_te || item.districts.name_en,
        );
      }}
    }});
    return Array.from(map.entries());
  }}, [items]);

  const mandals = useMemo(() => {{
    const map = new Map<string, string>();
    items.forEach((item) => {{
      if (
        item.mandals?.id &&
        (selectedDistrict === "all" || item.districts?.id === selectedDistrict)
      ) {{
        map.set(item.mandals.id, item.mandals.name_te || item.mandals.name_en);
      }}
    }});
    return Array.from(map.entries());
  }}, [items, selectedDistrict]);

  const filteredItems = useMemo(() => {{
    return items.filter((item) => {{
      if (selectedDistrict !== "all" && item.districts?.id !== selectedDistrict) {{
        return false;
      }}
      if (selectedMandal !== "all" && item.mandals?.id !== selectedMandal) {{
        return false;
      }}
      return true;
    }});
  }}, [items, selectedDistrict, selectedMandal]);

  return (
    <div className="min-h-screen bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200">
        <span className="font-telugu">{{{t(ribbon)}}}</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-civic-border bg-white shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
              title={{{t(home_title)}}}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-civic-bronze" />
                <h1 className="font-telugu text-base font-bold tracking-tight text-civic-ink md:text-lg">
                  {{{t(heading)}}}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                Verified Civic Records &amp; Field Observations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/representation"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-telugu text-xs font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5 text-civic-bronze" />
              {{{t(cta_rep)}}}
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-civic-bronze px-3.5 py-1.5 font-telugu text-xs font-semibold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              {{{t(cta_photo)}}}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-civic-border bg-civic-subtle/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <Filter className="h-3.5 w-3.5 text-civic-bronze" />
            <span className="font-telugu">{{{t(filter_label)}}}</span>
          </div>

          <select
            value={{selectedDistrict}}
            onChange={{(e) => {{
              setSelectedDistrict(e.target.value);
              setSelectedMandal("all");
            }}}}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-telugu text-civic-ink shadow-xs focus:border-civic-bronze focus:outline-none focus:ring-1 focus:ring-civic-bronze"
          >
            <option value="all">{{{t(all_districts)}}}</option>
            {{districts.map(([id, name]) => (
              <option key={{id}} value={{id}}>
                {{name}}
              </option>
            ))}}
          </select>

          <select
            value={{selectedMandal}}
            onChange={{(e) => setSelectedMandal(e.target.value)}}
            disabled={{mandals.length === 0}}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-telugu text-civic-ink shadow-xs focus:border-civic-bronze focus:outline-none focus:ring-1 focus:ring-civic-bronze disabled:opacity-50"
          >
            <option value="all">{{{t(all_mandals)}}}</option>
            {{mandals.map(([id, name]) => (
              <option key={{id}} value={{id}}>
                {{name}}
              </option>
            ))}}
          </select>

          {{(selectedDistrict !== "all" || selectedMandal !== "all") && (
            <button
              type="button"
              onClick={{() => {{
                setSelectedDistrict("all");
                setSelectedMandal("all");
              }}}}
              className="ml-auto font-telugu font-semibold text-civic-bronze hover:underline"
            >
              {{{t(reset)}}}
            </button>
          )}}
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {{error ? (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {{error}}
          </div>
        ) : null}}

        {{loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {{[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={{n}}
                className="h-80 animate-pulse rounded-xl border border-civic-border bg-white p-4 shadow-xs"
              />
            ))}}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-civic-border bg-white py-20 text-center shadow-xs">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-slate-400" />
            <p className="font-telugu text-sm font-bold text-civic-ink">
              {{{t(empty_title)}}}
            </p>
            <p className="mx-auto mt-1 max-w-xs font-telugu text-xs leading-relaxed text-slate-500">
              {{{t(empty_body)}}}
            </p>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-telugu text-xs font-bold text-civic-bronze hover:text-civic-bronze-hover"
            >
              {{{t(empty_cta)}}}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {{filteredItems.map((item) => {{
              const gallery = item.photo_urls?.length
                ? item.photo_urls
                : [item.photo_url];
              const districtName =
                item.districts?.name_te || item.districts?.name_en || "";
              const mandalName =
                item.mandals?.name_te || item.mandals?.name_en || "";
              const locationLabel = [
                item.panchayat_name,
                mandalName,
                districtName,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={{item.id}}
                  className="group flex flex-col overflow-hidden rounded-xl border border-civic-border bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-100 text-left"
                    onClick={{() => setPreviewImage(gallery[0])}}
                  >
                    {{/* eslint-disable-next-line @next/next/no-img-element */}}
                    <img
                      src={{gallery[0]}}
                      alt="Field record"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-emerald-300 bg-white/95 px-2.5 py-1 font-telugu text-[11px] font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {{{t(verified)}}}
                    </div>

                    {{gallery.length > 1 ? (
                      <div className="absolute bottom-2.5 right-2.5 rounded-md bg-civic-ink/80 px-2 py-0.5 font-telugu text-[10px] font-medium text-white backdrop-blur-xs">
                        +{{gallery.length - 1}} {{{t(more_photos)}}}
                      </div>
                    ) : null}}
                  </button>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 font-telugu text-xs font-semibold text-civic-bronze">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {{locationLabel || {t(fallback_loc)}}}
                        </span>
                      </div>

                      <p className="line-clamp-3 font-telugu text-xs leading-relaxed text-civic-navy">
                        {{item.raw_caption || {t(fallback_caption)}}}
                      </p>

                      {{item.admin_notes ? (
                        <div className="rounded-lg border border-civic-border bg-civic-subtle p-2.5 font-telugu text-[11px] text-slate-700">
                          <span className="font-bold text-civic-ink">
                            {{{t(desk_review)}}}
                          </span>{" "}
                          {{item.admin_notes}}
                        </div>
                      ) : null}}
                    </div>

                    <div className="flex items-center justify-between border-t border-civic-border pt-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {{new Date(item.created_at).toLocaleDateString("te-IN", {{
                          month: "short",
                          day: "numeric",
                        }})}}
                      </span>

                      <Link
                        href={{`/representation?mandal=${{encodeURIComponent(mandalName)}}&district=${{encodeURIComponent(districtName)}}&locality=${{encodeURIComponent(item.panchayat_name || "")}}`}}
                        className="inline-flex items-center gap-1 font-telugu font-bold text-civic-bronze transition-colors hover:text-civic-bronze-hover"
                      >
                        {{{t(make_rep)}}}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            }})}}
          </div>
        )}}
      </main>

      {{previewImage ? (
        <button
          type="button"
          onClick={{() => setPreviewImage(null)}}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
          aria-label="Close image preview"
        >
          {{/* eslint-disable-next-line @next/next/no-img-element */}}
          <img
            src={{previewImage}}
            alt="Enlarged intake"
            className="max-h-[90vh] max-w-full rounded-xl border border-slate-700 object-contain shadow-2xl"
          />
        </button>
      ) : null}}
    </div>
  );
}}
'''
    OUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUT}")
    # Sanity: decode a few strings
    print("heading:", heading)
    print("ribbon ok:", "నాయి" in ribbon)


if __name__ == "__main__":
    main()
