"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  Film,
  Heart,
  Loader2,
  MessageCircle,
  Play,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { getGeoDistrict } from "@/data/telanganaGeo";
import {
  getRegionalCommunityHubs,
  resolveRegionalHubForDistrict,
} from "@/config/communityHubs";
import { HELPLINE_WA_URL } from "@/lib/data/mobilizationDispatcher";
import {
  REEL_CATEGORIES,
  type ReelCategory,
  type ReelSubmission,
  reelCategoryLabel,
} from "@/types/reels";
import {
  districtOptions,
  incrementLocalLikes,
  incrementLocalShares,
  isValidVideoUrl,
  mandalOptions,
  readLocalReels,
  uid,
  upsertLocalReel,
  whatsAppShareHref,
} from "@/lib/reels/store";
import { mergeShowcaseGallery } from "@/lib/reels/seed";

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
  caption: string;
};

type GalleryFilter = "all" | ReelCategory;

const emptyForm: FormState = {
  creatorName: "",
  phone: "",
  districtSlug: "",
  mandalSlug: "",
  category: "",
  videoUrl: "",
  caption: "",
};

function placeLabel(districtSlug: string, mandalSlug: string): string {
  const d = getGeoDistrict(districtSlug);
  if (!d) return districtSlug || "—";
  const m = d.mandals.find((x) => x.slug === mandalSlug);
  const mandal = m?.nameTe || m?.nameEn || mandalSlug;
  return `${mandal}, ${d.nameTe || d.nameEn}`;
}

function mediaDeskJoinUrl(): string {
  const hubs = getRegionalCommunityHubs();
  const south = hubs.find((h) => h.id === "south-telangana");
  if (south?.inviteUrl && !south.inviteUrl.includes("sample-")) {
    return south.inviteUrl;
  }
  if (south?.helplineUrl) return south.helplineUrl;
  return `${HELPLINE_WA_URL}?text=${encodeURIComponent(
    "నాయీ సమాఖ్య మీడియా డెస్క్ — రీల్ కాంటెస్ట్ గ్రూపులో చేరాలనుకుంటున్నాను",
  )}`;
}

function confirmationWaUrl(reel: ReelSubmission): string {
  const hub = resolveRegionalHubForDistrict(reel.districtSlug);
  const text =
    `నమస్కారం! నేను "${reel.caption}" రీల్ సమర్పించాను (మన కళ · మన ఆత్మగౌరవం). ` +
    `సమీక్ష / ఫీచర్ గురించి తెలియజేయండి.`;
  if (hub?.helplineUrl) {
    // Prefer hub helpline with our prefill when possible
    return `${HELPLINE_WA_URL}?text=${encodeURIComponent(text)}`;
  }
  return `${HELPLINE_WA_URL}?text=${encodeURIComponent(text)}`;
}

function categoryBadgeClass(category: ReelCategory): string {
  switch (category) {
    case "salon_craft":
      return "border-amber-500/35 bg-amber-500/15 text-amber-900";
    case "nadaswaram_music":
      return "border-sky-500/35 bg-sky-500/12 text-sky-900";
    case "youth_education":
      return "border-emerald-500/35 bg-emerald-500/12 text-emerald-900";
    default:
      return "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]";
  }
}

export function ReelsClient() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<ReelSubmission | null>(null);
  const [mockNote, setMockNote] = useState(false);
  const [gallery, setGallery] = useState<ReelSubmission[]>(() =>
    mergeShowcaseGallery([], []),
  );
  const [myPending, setMyPending] = useState<ReelSubmission[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const dialogRef = useRef<HTMLDialogElement>(null);

  const districts = useMemo(() => districtOptions(), []);
  const mandals = useMemo(
    () => mandalOptions(form.districtSlug),
    [form.districtSlug],
  );

  const filteredGallery = useMemo(() => {
    if (filter === "all") return gallery;
    return gallery.filter((r) => r.category === filter);
  }, [gallery, filter]);

  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError("");
    try {
      const res = await fetch("/api/reels");
      const data = (await res.json()) as {
        success?: boolean;
        reels?: ReelSubmission[];
        error?: string;
      };
      const local = readLocalReels();
      setMyPending(local.filter((r) => r.status === "pending"));
      const localPublic = local.filter(
        (r) => r.status === "approved" || r.status === "featured",
      );
      const remote = Array.isArray(data.reels) ? data.reels : [];
      if (!res.ok || !data.success) {
        setGalleryError(data.error || "గ్యాలరీ లోడ్ కాలేదు — సీడ్ షోకేస్ చూపిస్తున్నాం");
        setGallery(mergeShowcaseGallery([], localPublic));
      } else {
        setGallery(mergeShowcaseGallery(remote, localPublic));
      }
    } catch {
      const local = readLocalReels();
      setMyPending(local.filter((r) => r.status === "pending"));
      setGalleryError("నెట్‌వర్క్ లోపం — సీడ్ షోకేస్ చూపిస్తున్నాం");
      setGallery(
        mergeShowcaseGallery(
          [],
          local.filter(
            (r) => r.status === "approved" || r.status === "featured",
          ),
        ),
      );
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (success) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [success]);

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
    const caption = form.caption.trim();
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
    if (caption.length < 3) {
      setError("క్యాప్షన్ కనీసం 3 అక్షరాలు");
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
          caption,
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
          caption,
          sharesCount: 0,
          likesCount: 0,
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
      setForm(emptyForm);
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
        caption,
        sharesCount: 0,
        likesCount: 0,
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
        upsertLocalReel({
          ...reel,
          sharesCount: (reel.sharesCount || 0) + 1,
        });
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

  function onLike(reel: ReelSubmission) {
    if (likedIds.has(reel.id)) return;
    const local = incrementLocalLikes(reel.id);
    const nextCount = local
      ? local.likesCount
      : (reel.likesCount || 0) + 1;
    setGallery((prev) =>
      prev.map((r) =>
        r.id === reel.id ? { ...r, likesCount: nextCount } : r,
      ),
    );
    if (local) {
      upsertLocalReel(local);
    } else {
      upsertLocalReel({ ...reel, likesCount: nextCount });
    }
    setLikedIds((prev) => new Set(prev).add(reel.id));
  }

  function closeModal() {
    setSuccess(null);
  }

  return (
    <div className="space-y-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT — sticky entry form */}
        <aside className="lg:col-span-5">
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Rules badge block */}
            <section className="rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] px-4 py-4">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-1 font-telugu text-xs font-semibold text-[#B45309]">
                ⚡ 60-సెకన్ల నిబంధనలు (60-Second Rules)
              </p>
              <ul className="mt-3 space-y-2 font-telugu text-sm leading-relaxed text-[#334155]">
                <li>
                  • రీల్ గరిష్టం{" "}
                  <strong className="text-[#B45309]">60 సెకన్లు</strong> —
                  మొబైల్‌లో చిత్రీకరించండి.
                </li>
                <li>
                  • థీమ్: మన కళ, సంప్రదాయం, ఆత్మగౌరవం — సెలూన్ / నాదస్వరం /
                  యువ విద్యా.
                </li>
                <li>
                  • Instagram Reel, YouTube Shorts లేదా Google Drive లింక్
                  సమర్పించండి.
                </li>
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

            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
                  <Clapperboard className="h-3 w-3" aria-hidden />
                  Competition 2 · Entry
                </p>
                <h2 className="mt-1 font-display-te text-xl font-normal text-slate-900">
                  రీల్ సమర్పణ ఫారం
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Submit your 60-second community pride reel
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="reel-name">
                  పూర్తి పేరు (Full Name)
                </label>
                <input
                  id="reel-name"
                  className={inputClass}
                  value={form.creatorName}
                  onChange={(e) => setField("creatorName", e.target.value)}
                  placeholder="ఉదా: రాములు నాయి"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reel-phone">
                  వాట్సాప్ నంబర్ (10 అంకెలు)
                </label>
                <input
                  id="reel-phone"
                  className={inputClass}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setField(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="9876543210"
                  autoComplete="tel"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reel-district">
                  జిల్లా (District)
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
                  మండలం / ULB (Mandal)
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
                  విభాగం (Category)
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
                <label className={labelClass} htmlFor="reel-caption">
                  క్యాప్షన్ (Caption / Title)
                </label>
                <input
                  id="reel-caption"
                  className={inputClass}
                  value={form.caption}
                  onChange={(e) => setField("caption", e.target.value)}
                  placeholder="ఉదా: మా ఊరి నాదస్వరం"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reel-url">
                  వీడియో లింక్ (IG Reel / YT Shorts / Drive)
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
                రీల్ సమర్పించండి (Submit Reel) ➔
              </button>
            </form>

            {myPending.length > 0 ? (
              <section className="rounded-2xl border border-dashed border-[#EAD7B5] bg-[#FFFDF9] p-5">
                <h2 className="font-display-te text-lg font-normal text-slate-900">
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
                        {r.caption}
                      </p>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {reelCategoryLabel(r.category)} · pending
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>

        {/* RIGHT — showcase gallery */}
        <section className="space-y-4 lg:col-span-7">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              <Sparkles className="h-3 w-3" aria-hidden />
              Public Showcase
            </p>
            <h2 className="mt-1 font-display-te text-2xl font-normal text-slate-900">
              ఆమోదిత రీల్స్ గ్యాలరీ
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Featured community pride stories · upvote &amp; share
            </p>
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
              role="status"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-telugu text-sm text-amber-900"
            >
              {galleryError}
              <button
                type="button"
                className="ml-2 underline"
                onClick={() => void loadGallery()}
              >
                Retry
              </button>
            </div>
          ) : null}

          {!galleryLoading && filteredGallery.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white px-4 py-8 text-center">
              <Film className="mx-auto h-8 w-8 text-[#CBD5E1]" aria-hidden />
              <p className="mt-2 font-display-te text-lg font-normal text-slate-900">
                ఈ విభాగంలో రీల్స్ లేవు
              </p>
              <p className="mt-1 font-telugu text-sm text-[#64748B]">
                మరో ఫిల్టర్ ప్రయత్నించండి లేదా మీ రీల్ సమర్పించండి.
              </p>
            </div>
          ) : null}

          {!galleryLoading && filteredGallery.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGallery.map((reel) => (
                <li
                  key={reel.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
                >
                  {/* 9:16 preview */}
                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-[9/16] w-full overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#B45309]"
                    aria-label={`Play reel: ${reel.caption}`}
                  >
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 20%, rgba(251,191,36,0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12), transparent 45%)",
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                      <span
                        className={`inline-flex max-w-[70%] truncate rounded-full border px-2 py-0.5 font-telugu text-[10px] font-bold ${categoryBadgeClass(reel.category)}`}
                      >
                        {reelCategoryLabel(reel.category)}
                      </span>
                      {reel.status === "featured" ? (
                        <span className="inline-flex items-center rounded-full border border-amber-400/50 bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-white/25">
                        <Play className="h-6 w-6 fill-current" aria-hidden />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                      <p className="font-display-te text-base font-normal leading-snug text-white">
                        {reel.caption}
                      </p>
                    </div>
                  </a>

                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div>
                      <p className="font-telugu text-sm font-semibold text-[#0F172A]">
                        {reel.creatorName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {placeLabel(reel.districtSlug, reel.mandalSlug)}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onLike(reel)}
                        disabled={likedIds.has(reel.id)}
                        aria-pressed={likedIds.has(reel.id)}
                        className={`tap inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 font-telugu text-xs font-bold transition disabled:opacity-70 ${
                          likedIds.has(reel.id)
                            ? "border-[#B45309]/50 bg-[#B45309]/10 text-[#B45309]"
                            : "border-[#E2E8F0] bg-[#FBFBFA] text-[#0F172A] hover:border-[#B45309]/40"
                        }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            likedIds.has(reel.id) ? "fill-current" : ""
                          }`}
                        />
                        {reel.likesCount || 0}
                      </button>
                      <button
                        type="button"
                        onClick={() => void onShare(reel)}
                        disabled={sharingId === reel.id}
                        className="tap inline-flex min-h-10 flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-[#128C7E] px-2.5 py-2 font-telugu text-xs font-bold text-white hover:bg-[#0E7A6E] disabled:opacity-60"
                      >
                        {sharingId === reel.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <MessageCircle className="h-3.5 w-3.5" />
                            <Share2 className="h-3.5 w-3.5" />
                          </>
                        )}
                        షేర్ · {reel.sharesCount || 0}
                      </button>
                      <a
                        href={reel.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="tap inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-2.5 py-2 font-telugu text-xs font-bold text-[#0F172A] hover:border-[#B45309]/40"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        వీడియో చూడండి
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      {/* Media desk callout */}
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border border-[#B45309]/40 bg-[#0F172A] px-5 py-6 text-white shadow-[0_16px_40px_rgb(15_23_42_/0.28)] sm:px-8 sm:py-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400">
            Media Desk · నాయీ సమాఖ్య
          </p>
          <h2 className="mt-2 font-display-te text-2xl font-normal leading-snug text-white sm:text-3xl">
            మీడియా డెస్క్‌లో చేరండి — మన కళను వ్యాప్తి చేద్దాం
          </h2>
          <p className="mt-3 max-w-3xl font-telugu text-sm leading-relaxed text-slate-300 sm:text-base">
            మీ 60-సెకన్ల రీల్‌ను కమ్యూనిటీకి అందించండి. మీడియా టీమ్ సమీక్షించి
            ఫీచర్ చేస్తుంది — సెలూన్ కళ, నాదస్వరం, యువ విద్యా కథలు తెలంగాణ
            అంతటా పంచుకోండి.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={mediaDeskJoinUrl()}
              target="_blank"
              rel="noreferrer"
              className="tap inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-5 py-3 font-telugu text-sm font-bold text-white hover:bg-[#0E7A6E]"
            >
              <MessageCircle className="h-4 w-4" />
              వాట్సాప్ గ్రూపులో చేరండి
            </a>
            <a
              href={`${HELPLINE_WA_URL}?text=${encodeURIComponent(
                "నమస్కారం — మన కళ రీల్ కాంటెస్ట్ గురించి మీడియా డెస్క్ సహాయం కావాలి",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="tap inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 font-telugu text-sm font-bold text-white hover:bg-white/10"
            >
              హెల్ప్‌లైన్ · 90326 54111
            </a>
          </div>
        </div>
      </section>

      {/* Confirmation modal + WA alert */}
      <dialog
        ref={dialogRef}
        className="w-[min(100%,24rem)] rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl backdrop:bg-[#0F172A]/55 open:flex open:flex-col"
        onClose={closeModal}
      >
        {success ? (
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-display-te text-xl font-normal text-slate-900">
                    సమర్పణ విజయవంతం!
                  </p>
                  <p className="mt-1 font-telugu text-sm leading-relaxed text-[#334155]">
                    “{success.caption}” సమీక్షలో ఉంది. ఆమోదం తర్వాత గ్యాలరీలో
                    కనిపిస్తుంది.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="tap inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              role="alert"
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 font-telugu text-sm text-emerald-900"
            >
              వాట్సాప్ అలర్ట్: మీడియా డెస్క్‌కు మెసేజ్ పంపి సమీక్షను వేగవంతం
              చేయండి.
            </div>

            {mockNote ? (
              <p className="mt-2 text-xs text-[#64748B]">
                Local reels_db — Supabase sync when configured
              </p>
            ) : null}

            <a
              href={confirmationWaUrl(success)}
              target="_blank"
              rel="noreferrer"
              className="tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 font-telugu text-sm font-bold text-white hover:bg-[#0E7A6E]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp అలర్ట్ పంపండి
            </a>
            <button
              type="button"
              onClick={closeModal}
              className="tap mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-semibold text-[#0F172A]"
            >
              మూసివేయి
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
