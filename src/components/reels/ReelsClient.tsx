"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  Film,
  Loader2,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { getGeoDistrict } from "@/data/telanganaGeo";
import {
  REEL_CATEGORIES,
  type ReelCategory,
  type ReelSubmission,
  reelCategoryLabel,
} from "@/types/reels";
import {
  districtOptions,
  incrementLocalShares,
  isValidVideoUrl,
  mandalOptions,
  readLocalReels,
  uid,
  upsertLocalReel,
  whatsAppShareHref,
} from "@/lib/reels/store";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass =
  "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

type FormState = {
  creatorName: string;
  phone: string;
  districtSlug: string;
  mandalSlug: string;
  category: ReelCategory | "";
  videoUrl: string;
  title: string;
};

type GalleryFilter = "all" | ReelCategory;

function placeLabel(districtSlug: string, mandalSlug: string): string {
  const d = getGeoDistrict(districtSlug);
  if (!d) return districtSlug || "—";
  const m = d.mandals.find((x) => x.slug === mandalSlug);
  const mandal = m?.nameTe || m?.nameEn || mandalSlug;
  return `${mandal}, ${d.nameTe || d.nameEn}`;
}

export function ReelsClient() {
  const [form, setForm] = useState<FormState>({
    creatorName: "",
    phone: "",
    districtSlug: "",
    mandalSlug: "",
    category: "",
    videoUrl: "",
    title: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<ReelSubmission | null>(null);
  const [mockNote, setMockNote] = useState(false);
  const [gallery, setGallery] = useState<ReelSubmission[]>([]);
  const [myPending, setMyPending] = useState<ReelSubmission[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [sharingId, setSharingId] = useState<string | null>(null);

  const districts = useMemo(() => districtOptions(), []);
  const mandals = useMemo(
    () => mandalOptions(form.districtSlug),
    [form.districtSlug],
  );

  const loadGallery = useCallback(async (cat: GalleryFilter) => {
    setGalleryLoading(true);
    setGalleryError("");
    try {
      const qs =
        cat === "all" ? "" : `?category=${encodeURIComponent(cat)}`;
      const res = await fetch(`/api/reels${qs}`);
      const data = (await res.json()) as {
        success?: boolean;
        reels?: ReelSubmission[];
        error?: string;
      };
      if (!res.ok || !data.success) {
        setGalleryError(data.error || "గ్యాలరీ లోడ్ కాలేదు");
        setGallery([]);
      } else {
        setGallery(Array.isArray(data.reels) ? data.reels : []);
      }
    } catch {
      setGalleryError("నెట్‌వర్క్ లోపం — మళ్లీ ప్రయత్నించండి");
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    const local = readLocalReels();
    setMyPending(local.filter((r) => r.status === "pending"));
    void loadGallery(filter);
  }, [filter, loadGallery]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "districtSlug" ? { mandalSlug: "" } : {}),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(null);

    const creatorName = form.creatorName.trim();
    const phone = form.phone.replace(/\D/g, "");
    const title = form.title.trim();
    const videoUrl = form.videoUrl.trim();

    if (creatorName.length < 2) {
      setError("పూర్తి పేరు నమోదు చేయండి");
      return;
    }
    if (phone.length !== 10) {
      setError("10 అంకెల వాట్సాప్ నంబర్ అవసరం");
      return;
    }
    if (!form.districtSlug || !form.mandalSlug) {
      setError("జిల్లా & మండలం ఎంచుకోండి");
      return;
    }
    if (!form.category) {
      setError("విభాగం ఎంచుకోండి");
      return;
    }
    if (title.length < 3) {
      setError("శీర్షిక కనీసం 3 అక్షరాలు");
      return;
    }
    if (!isValidVideoUrl(videoUrl)) {
      setError(
        "Instagram Reel / YouTube Shorts / Google Drive లింక్ మాత్రమే",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName,
          phone,
          districtSlug: form.districtSlug,
          mandalSlug: form.mandalSlug,
          category: form.category,
          videoUrl,
          title,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        reel?: ReelSubmission;
        mock?: boolean;
        error?: string;
      };

      let next: ReelSubmission;
      if (res.ok && data.success && data.reel) {
        next = data.reel;
        setMockNote(Boolean(data.mock));
      } else if (data.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      } else {
        next = {
          id: uid(),
          createdAt: new Date().toISOString(),
          creatorName,
          phone,
          districtSlug: form.districtSlug,
          mandalSlug: form.mandalSlug,
          category: form.category,
          videoUrl,
          title,
          sharesCount: 0,
          status: "pending",
        };
        setMockNote(true);
      }

      upsertLocalReel(next);
      setMyPending((prev) => {
        const without = prev.filter((r) => r.id !== next.id);
        return [next, ...without];
      });
      setSuccess(next);
      setForm({
        creatorName: "",
        phone: "",
        districtSlug: "",
        mandalSlug: "",
        category: "",
        videoUrl: "",
        title: "",
      });
    } catch {
      const next: ReelSubmission = {
        id: uid(),
        createdAt: new Date().toISOString(),
        creatorName,
        phone,
        districtSlug: form.districtSlug,
        mandalSlug: form.mandalSlug,
        category: form.category as ReelCategory,
        videoUrl,
        title,
        sharesCount: 0,
        status: "pending",
      };
      upsertLocalReel(next);
      setMyPending((prev) => [next, ...prev]);
      setSuccess(next);
      setMockNote(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function onShare(reel: ReelSubmission) {
    setSharingId(reel.id);
    try {
      const local = incrementLocalShares(reel.id);
      if (local) {
        setGallery((prev) =>
          prev.map((r) => (r.id === reel.id ? local : r)),
        );
      } else {
        setGallery((prev) =>
          prev.map((r) =>
            r.id === reel.id
              ? { ...r, sharesCount: (r.sharesCount || 0) + 1 }
              : r,
          ),
        );
      }
      void fetch("/api/reels/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reel.id }),
      }).catch(() => undefined);
      window.open(whatsAppShareHref(reel), "_blank", "noopener,noreferrer");
    } finally {
      setSharingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Rules */}
      <section className="rounded-xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] px-4 py-4">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
          <Clapperboard className="h-3 w-3" aria-hidden />
          60-Second Rules
        </p>
        <h2 className="mt-1 font-display-te text-xl font-normal text-[#0F172A]">
          నియమాలు · Community Pride
        </h2>
        <ul className="mt-3 space-y-2 font-telugu text-sm leading-relaxed text-[#334155]">
          <li>• రీల్ గరిష్టం <strong className="text-[#B45309]">60 సెకన్లు</strong> — మొబైల్‌లో చిత్రీకరించండి.</li>
          <li>• థీమ్: మన కళ, సంప్రదాయం, ఆత్మగౌరవం — సెలూన్ / నాదస్వరం / యువ విద్యా.</li>
          <li>• Instagram Reel, YouTube Shorts లేదా Google Drive లింక్ సమర్పించండి.</li>
          <li>• సమర్పణలు సమీక్ష తర్వాత గ్యాలరీలో కనిపిస్తాయి.</li>
        </ul>
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-telugu text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <p className="font-display-te text-lg font-normal text-[#0F172A]">
                సమర్పణ విజయవంతం
              </p>
              <p className="mt-1 font-telugu text-sm text-[#334155]">
                “{success.title}” సమీక్షలో ఉంది. ఆమోదం తర్వాత గ్యాలరీలో
                కనిపిస్తుంది.
              </p>
              {mockNote ? (
                <p className="mt-2 text-xs text-[#64748B]">
                  Local reels_db — Supabase sync when configured
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Entry form */}
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
            Competition 2 · Entry
          </p>
          <h2 className="mt-1 font-display-te text-xl font-normal text-[#0F172A]">
            రీల్ సమర్పణ
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Submit your 60-second community pride reel
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-name">
            పూర్తి పేరు
          </label>
          <input
            id="reel-name"
            className={inputClass}
            value={form.creatorName}
            onChange={(e) => setField("creatorName", e.target.value)}
            placeholder="ఉదా: రాము"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-phone">
            వాట్సాప్ (10 అంకెలు)
          </label>
          <input
            id="reel-phone"
            className={inputClass}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={form.phone}
            onChange={(e) =>
              setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="9876543210"
            autoComplete="tel"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-district">
            జిల్లా
          </label>
          <select
            id="reel-district"
            className={inputClass}
            value={form.districtSlug}
            onChange={(e) => setField("districtSlug", e.target.value)}
            required
          >
            <option value="">జిల్లా ఎంచుకోండి</option>
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.nameTe} · {d.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-mandal">
            మండలం / ULB
          </label>
          <select
            id="reel-mandal"
            className={inputClass}
            value={form.mandalSlug}
            onChange={(e) => setField("mandalSlug", e.target.value)}
            disabled={!form.districtSlug}
            required
          >
            <option value="">
              {form.districtSlug ? "మండలం ఎంచుకోండి" : "ముందు జిల్లా"}
            </option>
            {mandals.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.nameTe} · {m.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-category">
            విభాగం · Category
          </label>
          <select
            id="reel-category"
            className={inputClass}
            value={form.category}
            onChange={(e) =>
              setField("category", e.target.value as ReelCategory | "")
            }
            required
          >
            <option value="">విభాగం ఎంచుకోండి</option>
            {REEL_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.labelTe} · {c.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-title">
            శీర్షిక · Title
          </label>
          <input
            id="reel-title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="ఉదా: మా ఊరి నాదస్వరం"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="reel-url">
            వీడియో లింక్ (IG / YT Shorts / Drive)
          </label>
          <input
            id="reel-url"
            className={inputClass}
            type="url"
            value={form.videoUrl}
            onChange={(e) => setField("videoUrl", e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="tap inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.28)] transition hover:bg-[#92400E] disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Film className="h-4 w-4" />
          )}
          రీల్ సమర్పించండి · Submit
        </button>
      </form>

      {/* My pending (local / admin-only visibility) */}
      {myPending.length > 0 ? (
        <section className="rounded-2xl border border-dashed border-[#EAD7B5] bg-[#FFFDF9] p-5">
          <h2 className="font-display-te text-lg font-normal text-[#0F172A]">
            మీ సమర్పణలు · సమీక్షలో
          </h2>
          <p className="mt-1 text-xs text-[#64748B]">
            Pending entries stay on this device until approved
          </p>
          <ul className="mt-3 space-y-2">
            {myPending.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-3"
              >
                <p className="font-telugu text-sm font-semibold text-[#0F172A]">
                  {r.title}
                </p>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  {reelCategoryLabel(r.category)} · pending
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Gallery */}
      <section className="space-y-4">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
            <Sparkles className="h-3 w-3" aria-hidden />
            Public Gallery
          </p>
          <h2 className="mt-1 font-display-te text-xl font-normal text-[#0F172A]">
            ఆమోదిత రీల్స్
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`tap rounded-full border px-3 py-1.5 font-telugu text-xs font-bold transition ${
              filter === "all"
                ? "border-[#B45309] bg-[#B45309] text-white"
                : "border-[#E2E8F0] bg-white text-[#475569]"
            }`}
          >
            అన్నీ
          </button>
          {REEL_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={`tap rounded-full border px-3 py-1.5 font-telugu text-xs font-bold transition ${
                filter === c.value
                  ? "border-[#B45309] bg-[#B45309] text-white"
                  : "border-[#E2E8F0] bg-white text-[#475569]"
              }`}
            >
              {c.labelTe}
            </button>
          ))}
        </div>

        {galleryLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-10 text-sm text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin" />
            గ్యాలరీ లోడ్ అవుతోంది…
          </div>
        ) : null}

        {!galleryLoading && galleryError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-telugu text-sm text-red-800"
          >
            {galleryError}
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => void loadGallery(filter)}
            >
              Retry
            </button>
          </div>
        ) : null}

        {!galleryLoading && !galleryError && gallery.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white px-4 py-8 text-center">
            <Film className="mx-auto h-8 w-8 text-[#CBD5E1]" aria-hidden />
            <p className="mt-2 font-display-te text-lg font-normal text-[#0F172A]">
              ఇంకా రీల్స్ లేవు
            </p>
            <p className="mt-1 font-telugu text-sm text-[#64748B]">
              మొదటి ఆమోదిత ఎంట్రీలు ఇక్కడ కనిపిస్తాయి. మీ సమర్పణను పంపండి!
            </p>
          </div>
        ) : null}

        {!galleryLoading && gallery.length > 0 ? (
          <ul className="space-y-3">
            {gallery.map((reel) => (
              <li
                key={reel.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {reel.status === "featured" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                        Featured
                      </span>
                    ) : null}
                    <h3 className="mt-1 font-display-te text-lg font-normal leading-snug text-[#0F172A]">
                      {reel.title}
                    </h3>
                    <p className="mt-1 font-telugu text-sm text-[#475569]">
                      {reel.creatorName} ·{" "}
                      {placeLabel(reel.districtSlug, reel.mandalSlug)}
                    </p>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {reelCategoryLabel(reel.category)} · {reel.sharesCount}{" "}
                      shares
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="tap inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-3 py-2 font-telugu text-xs font-bold text-[#0F172A] hover:border-[#B45309]/40"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    వీడియో చూడండి
                  </a>
                  <button
                    type="button"
                    onClick={() => void onShare(reel)}
                    disabled={sharingId === reel.id}
                    className="tap inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-[#128C7E] px-3 py-2 font-telugu text-xs font-bold text-white hover:bg-[#0E7A6E] disabled:opacity-60"
                  >
                    {sharingId === reel.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <MessageCircle className="h-3.5 w-3.5" />
                    )}
                    <Share2 className="h-3.5 w-3.5" />
                    WhatsApp షేర్
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
