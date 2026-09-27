"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
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
} from "lucide-react";

interface FeedItem {
  id: string;
  created_at: string;
  photo_url: string;
  photo_urls: string[];
  raw_caption: string;
  panchayat_name?: string;
  districts?: { id: string; name_en: string; name_te: string } | null;
  mandals?: { id: string; name_en: string; name_te: string } | null;
}

export default function CivicFeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedMandal, setSelectedMandal] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeed() {
      setError("");
      try {
        const res = await fetch("/api/feed", { cache: "no-store" });
        const data = (await res.json()) as { feed?: FeedItem[]; error?: string };
        if (!res.ok) {
          setError(data.error || `HTTP ${res.status}`);
          setItems([]);
          return;
        }
        setItems(data.feed || []);
      } catch (err) {
        console.error("Failed to load civic feed:", err);
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    }
    void loadFeed();
  }, []);

  const districts = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item.districts?.id) {
        map.set(
          item.districts.id,
          item.districts.name_te || item.districts.name_en,
        );
      }
    });
    return Array.from(map.entries());
  }, [items]);

  const mandals = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (
        item.mandals?.id &&
        (selectedDistrict === "all" || item.districts?.id === selectedDistrict)
      ) {
        map.set(item.mandals.id, item.mandals.name_te || item.mandals.name_en);
      }
    });
    return Array.from(map.entries());
  }, [items, selectedDistrict]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedDistrict !== "all" && item.districts?.id !== selectedDistrict) {
        return false;
      }
      if (selectedMandal !== "all" && item.mandals?.id !== selectedMandal) {
        return false;
      }
      return true;
    });
  }, [items, selectedDistrict, selectedMandal]);

  return (
    <div className="min-h-screen bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
      <div className="border-b border-slate-700/50 bg-civic-navy px-4 py-1.5 text-center text-[11px] text-slate-200">
        <span className="font-telugu">{"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c38\u0c2e\u0c40\u0c15\u0c4d\u0c37 \u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c32\u0c4d \u2014 33 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32 \u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c38\u0c2e\u0c3e\u0c1a\u0c3e\u0c30\u0c02"}</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-civic-border bg-white shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
              title={"\u0c39\u0c4b\u0c2e\u0c4d\u200c\u0c2a\u0c47\u0c1c\u0c40\u0c15\u0c3f \u0c35\u0c46\u0c33\u0c4d\u0c32\u0c02\u0c21\u0c3f"}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-civic-bronze" />
                <h1 className="font-telugu text-base font-bold tracking-tight text-civic-ink md:text-lg">
                  {"\u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c35\u0c4d\u0c2f\u0c3e\u0c2a\u0c4d\u0c24 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c38\u0c2e\u0c40\u0c15\u0c4d\u0c37 \u0c2b\u0c40\u0c21\u0c4d"}
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
              {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40"}
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-civic-bronze px-3.5 py-1.5 font-telugu text-xs font-semibold text-white shadow-xs transition-all hover:bg-civic-bronze-hover"
            >
              {"\u0c2b\u0c4b\u0c1f\u0c4b \u0c28\u0c2e\u0c4b\u0c26\u0c41"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-civic-border bg-civic-subtle/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <Filter className="h-3.5 w-3.5 text-civic-bronze" />
            <span className="font-telugu">{"\u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c02 \u0c35\u0c3e\u0c30\u0c40\u0c17\u0c3e \u0c2b\u0c3f\u0c32\u0c4d\u0c1f\u0c30\u0c4d:"}</span>
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedMandal("all");
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-telugu text-civic-ink shadow-xs focus:border-civic-bronze focus:outline-none focus:ring-1 focus:ring-civic-bronze"
          >
            <option value="all">{"\u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32\u0c41 (All Districts)"}</option>
            {districts.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedMandal}
            onChange={(e) => setSelectedMandal(e.target.value)}
            disabled={mandals.length === 0}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-telugu text-civic-ink shadow-xs focus:border-civic-bronze focus:outline-none focus:ring-1 focus:ring-civic-bronze disabled:opacity-50"
          >
            <option value="all">{"\u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c2e\u0c02\u0c21\u0c32\u0c3e\u0c32\u0c41 (All Mandals)"}</option>
            {mandals.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          {(selectedDistrict !== "all" || selectedMandal !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict("all");
                setSelectedMandal("all");
              }}
              className="ml-auto font-telugu font-semibold text-civic-bronze hover:underline"
            >
              {"\u0c30\u0c40\u0c38\u0c46\u0c1f\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f"}
            </button>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error ? (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            <p className="font-telugu text-center text-xs text-slate-500">
              {
                "\u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c28\u0c3f\u0c35\u0c47\u0c26\u0c3f\u0c15\u0c32\u0c41 \u0c32\u0c4b\u0c21\u0c41\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2f\u0c3f\u2026"
              }{" "}
              (Loading verified field records…)
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-xl border border-civic-border bg-white p-4 shadow-xs"
                />
              ))}
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-2xl border border-civic-border bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex rounded-xl border border-civic-bronze/20 bg-civic-bronze/10 p-2.5 text-civic-bronze">
                  <ImageIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-telugu text-base font-bold text-civic-ink">
                    {
                      "\u0c07\u0c02\u0c15\u0c3e \u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c28\u0c3f\u0c35\u0c47\u0c26\u0c3f\u0c15\u0c32\u0c41 \u0c32\u0c47\u0c35\u0c41"
                    }
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    No verified field photos published yet
                  </p>
                </div>
              </div>

              <p className="mt-4 font-telugu text-sm leading-relaxed text-civic-navy">
                {
                  "\u0c07\u0c26\u0c3f \u0c2b\u0c40\u0c21\u0c4d\u0c32\u0c4b \u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c06\u0c2e\u0c4b\u0c26\u0c02 \u0c24\u0c30\u0c4d\u0c35\u0c3e\u0c24 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41 \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47 \u0c15\u0c28\u0c3f\u0c2a\u0c3f\u0c38\u0c4d\u0c24\u0c3e\u0c2f\u0c3f \u2014 \u0c37\u0c3e\u0c2a\u0c41\u0c32\u0c41, \u0c38\u0c2e\u0c3e\u0c35\u0c47\u0c36\u0c3e\u0c32\u0c41, \u0c38\u0c02\u0c18 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c4d\u0c30\u0c2e\u0c3e\u0c32\u0c41."
                }
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                This feed shows verified field photos after admin approval —
                shops, meetings, and community activities across Telangana.
              </p>

              <ol className="mt-5 space-y-3 border-t border-civic-border pt-5">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-civic-navy font-telugu text-[11px] font-bold text-white">
                    1
                  </span>
                  <div>
                    <p className="font-telugu text-sm font-semibold text-civic-ink">
                      {
                        "\u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c2b\u0c4b\u0c1f\u0c4b \u0c24\u0c40\u0c2f\u0c02\u0c21\u0c3f"
                      }
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Take a clear field photo (shop, meeting, or activity)
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-civic-navy font-telugu text-[11px] font-bold text-white">
                    2
                  </span>
                  <div>
                    <p className="font-telugu text-sm font-semibold text-civic-ink">
                      {
                        "Telegram @NayiSamakhyaDeskBot \u0c15\u0c41 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e / \u0c2e\u0c02\u0c21\u0c32\u0c02 / \u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c02 \u0c24\u0c4b \u0c2a\u0c02\u0c2a\u0c02\u0c21\u0c3f"
                      }
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Send it to the desk bot with district, mandal, and village
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-civic-navy font-telugu text-[11px] font-bold text-white">
                    3
                  </span>
                  <div>
                    <p className="font-telugu text-sm font-semibold text-civic-ink">
                      {
                        "\u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c23\u0c15\u0c41 \u0c35\u0c47\u0c1a\u0c3f \u0c09\u0c02\u0c21\u0c02\u0c21\u0c3f"
                      }
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Wait for admin verification — approved photos appear here
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-civic-bronze font-telugu text-[11px] font-bold text-white">
                    4
                  </span>
                  <div>
                    <p className="font-telugu text-sm font-semibold text-civic-ink">
                      {
                        "\u0c06\u0c2e\u0c4b\u0c26\u0c02 \u0c24\u0c30\u0c4d\u0c35\u0c3e\u0c24 \u0c2b\u0c40\u0c21\u0c4d\u0c32\u0c4b \u0c15\u0c28\u0c3f\u0c2a\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f"
                      }
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Your entry is listed on this statewide civic feed
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <a
                  href="https://t.me/NayiSamakhyaDeskBot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-civic-bronze px-4 py-2.5 font-telugu text-sm font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover sm:w-auto"
                >
                  {
                    "Telegram \u0c2c\u0c3e\u0c1f\u0c4d\u0c15\u0c41 \u0c24\u0c46\u0c30\u0c41\u0c35\u0c02\u0c21\u0c3f"
                  }
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Link
                  href="/representation"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-4 py-2.5 font-telugu text-sm font-semibold text-civic-ink shadow-xs transition-colors hover:bg-civic-subtle sm:w-auto"
                >
                  <FileText className="h-3.5 w-3.5 text-civic-bronze" />
                  {
                    "\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40"
                  }
                </Link>
              </div>
            </div>

            {/* Structure-only sample — clearly labeled, not fake approved data */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-civic-subtle/60 p-4 sm:p-5">
              <p className="mb-3 font-telugu text-[11px] font-bold uppercase tracking-wide text-slate-500">
                {
                  "\u0c28\u0c2e\u0c42\u0c28\u0c3e \u0c2a\u0c4d\u0c30\u0c40\u0c35\u0c4d\u0c2f\u0c42 / Sample preview"
                }{" "}
                — structure only, not approved data
              </p>
              <article className="overflow-hidden rounded-xl border border-civic-border bg-white opacity-80 shadow-xs">
                <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <ImageIcon className="h-10 w-10 text-slate-400" />
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-slate-300 bg-white/95 px-2.5 py-1 font-telugu text-[11px] font-semibold text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {
                      "\u0c28\u0c2e\u0c42\u0c28\u0c3e \u0c38\u0c40\u0c32\u0c4d"
                    }
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-1.5 font-telugu text-xs font-semibold text-civic-bronze/70">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>
                      {
                        "\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c02, \u0c2e\u0c02\u0c21\u0c32\u0c02, \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e"
                      }
                    </span>
                  </div>
                  <div className="h-2.5 w-[80%] rounded bg-slate-200" />
                  <div className="h-2.5 w-[60%] rounded bg-slate-100" />
                </div>
              </article>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
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
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-civic-border bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-100 text-left"
                    onClick={() => setPreviewImage(gallery[0])}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gallery[0]}
                      alt="Field record"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-emerald-300 bg-white/95 px-2.5 py-1 font-telugu text-[11px] font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {"\u0c27\u0c4d\u0c30\u0c41\u0c35\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41"}
                    </div>

                    {gallery.length > 1 ? (
                      <div className="absolute bottom-2.5 right-2.5 rounded-md bg-civic-ink/80 px-2 py-0.5 font-telugu text-[10px] font-medium text-white backdrop-blur-xs">
                        +{gallery.length - 1} {"\u0c2e\u0c30\u0c3f\u0c28\u0c4d\u0c28\u0c3f \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41"}
                      </div>
                    ) : null}
                  </button>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 font-telugu text-xs font-semibold text-civic-bronze">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {locationLabel || "\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c02"}
                        </span>
                      </div>

                      <p className="line-clamp-3 font-telugu text-xs leading-relaxed text-civic-navy">
                        {item.raw_caption || "\u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c38\u0c30\u0c4d\u0c35\u0c47 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c28\u0c3f\u0c35\u0c47\u0c26\u0c3f\u0c15 \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-civic-border pt-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleDateString("te-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      <Link
                        href={`/representation?mandal=${encodeURIComponent(mandalName)}&district=${encodeURIComponent(districtName)}&locality=${encodeURIComponent(item.panchayat_name || "")}`}
                        className="inline-flex items-center gap-1 font-telugu font-bold text-civic-bronze transition-colors hover:text-civic-bronze-hover"
                      >
                        {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {previewImage ? (
        <button
          type="button"
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
          aria-label="Close image preview"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Enlarged intake"
            className="max-h-[90vh] max-w-full rounded-xl border border-slate-700 object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </div>
  );
}
