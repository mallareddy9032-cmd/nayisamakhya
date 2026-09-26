"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Filter,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface FeedItem {
  id: string;
  created_at: string;
  photo_url: string;
  photo_urls: string[];
  raw_caption: string;
  panchayat_name?: string;
  admin_notes?: string;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-amber-400">
                <Layers className="h-4 w-4" />
              </span>
              <h1 className="text-base font-bold tracking-tight text-white md:text-lg">
                {"\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C24 \u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37 \u0C2B\u0C40\u0C21\u0C4D"}{" "}
                (Civic Field Feed)
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C38\u0C47\u0C35\u0C3E \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C28\u0C2E\u0C4B\u0C26\u0C48\u0C28 \u0C27\u0C4D\u0C30\u0C41\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/representation"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              {"\u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C24\u0C2F\u0C3E\u0C30\u0C40"}
            </Link>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition-colors hover:bg-amber-400"
            >
              {"\u0C2B\u0C4B\u0C1F\u0C4B \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-800/60 bg-slate-900/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="h-3.5 w-3.5 text-amber-500" />
            <span>{"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D"}:</span>
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedMandal("all");
            }}
            className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-200 focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">
              {"\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E\u0C32\u0C41"} (All Districts)
            </option>
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
            className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-200 focus:border-amber-500/50 focus:outline-none disabled:opacity-50"
          >
            <option value="all">
              {"\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C2E\u0C02\u0C21\u0C32\u0C3E\u0C32\u0C41"} (All Mandals)
            </option>
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
              className="ml-auto text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              {"\u0C30\u0C40\u0C38\u0C46\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F"}
            </button>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error ? (
          <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-800/60 bg-slate-900/20 py-20 text-center">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-slate-600" />
            <p className="text-sm font-medium text-slate-300">
              {"\u0C0E\u0C32\u0C3E\u0C02\u0C1F\u0C3F \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41"}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
              {"\u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28 \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C02\u0C32\u0C4B \u0C07\u0C02\u0C15\u0C3E \u0C27\u0C4D\u0C30\u0C41\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C15\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41. \u0C2C\u0C3E\u0C1F\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C2A\u0C02\u0C2A\u0C35\u0C1A\u0C4D\u0C1A\u0C41."}
            </p>
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              @NayiSamakhyaDeskBot {"\u0C32\u0C4B \u0C2B\u0C4B\u0C1F\u0C4B \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F"} →
            </a>
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
              const locationLabel = [item.panchayat_name, mandalName, districtName]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-lg shadow-black/20 transition-all hover:border-slate-700/80"
                >
                  <button
                    type="button"
                    className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-950 text-left"
                    onClick={() => setPreviewImage(gallery[0])}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gallery[0]}
                      alt="Field record"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 text-[11px] font-medium text-emerald-400 backdrop-blur-md">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {"\u0C27\u0C4D\u0C30\u0C41\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F"}
                    </div>

                    {gallery.length > 1 ? (
                      <div className="absolute bottom-2 right-2 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-md">
                        +{gallery.length - 1}{" "}
                        {"\u0C2E\u0C30\u0C3F\u0C28\u0C4D\u0C28\u0C3F \u0C2B\u0C4A\u0C1F\u0C4B\u0C32\u0C41"}
                      </div>
                    ) : null}
                  </button>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {locationLabel ||
                            "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23 \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C02"}
                        </span>
                      </div>

                      <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                        {item.raw_caption ||
                          "\u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C38\u0C30\u0C4D\u0C35\u0C47 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C15 \u0C28\u0C2E\u0C4B\u0C26\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F."}
                      </p>

                      {item.admin_notes ? (
                        <div className="rounded border border-slate-800/80 bg-slate-950/60 p-2 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-500">
                            {"\u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D \u0C28\u0C4B\u0C1F\u0C4D"}:
                          </span>{" "}
                          {item.admin_notes}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleDateString("te-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      <Link
                        href={`/representation?mandal=${encodeURIComponent(mandalName)}&district=${encodeURIComponent(districtName)}&locality=${encodeURIComponent(item.panchayat_name || "")}`}
                        className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
                      >
                        {"\u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C24\u0C2F\u0C3E\u0C30\u0C41\u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F"}
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
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          aria-label="Close image preview"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Enlarged intake"
            className="max-h-[90vh] max-w-full rounded-lg border border-slate-800 object-contain"
          />
        </button>
      ) : null}
    </div>
  );
}
