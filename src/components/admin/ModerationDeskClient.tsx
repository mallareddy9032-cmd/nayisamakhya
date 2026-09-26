"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Filter,
  Loader2,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { moderateSubmission } from "@/app/admin/moderation/actions";
import { DESK_UI } from "@/lib/moderation/deskCopy";

type Status = "pending" | "approved" | "rejected" | "flagged";

type District = { id: string; slug: string; name_en: string; name_te: string };
type Mandal = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
};
type Ulb = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
};

export type DeskSubmission = {
  id: string;
  sender_name: string | null;
  raw_caption: string | null;
  photo_url: string | null;
  photo_urls?: string[] | null;
  status: Status;
  created_at: string;
  district_id: string | null;
  mandal_id: string | null;
  ulb_id?: string | null;
  gp_id: string | null;
  moderator_notes: string | null;
  extracted_data: Record<string, unknown> | null;
  districts?: District | null;
  mandals?: Mandal | null;
  urban_local_bodies?: Ulb | null;
  gram_panchayats?: { id: string; name_en: string; name_te: string } | null;
};

type Draft = {
  district_id: string;
  mandal_id: string;
  ulb_id: string;
  caption: string;
  notes: string;
};

type Props = {
  initial: DeskSubmission[];
  counts: Record<Status | "all", number>;
  districts: District[];
  mandals: Mandal[];
  ulbs: Ulb[];
  focusId?: string;
};

const tabs: Array<{ id: "pending" | "approved" | "all"; label: string }> = [
  { id: "pending", label: DESK_UI.tabPending_te },
  { id: "approved", label: DESK_UI.tabApproved_te },
  { id: "all", label: DESK_UI.tabAll_te },
];

function photoList(row: DeskSubmission): string[] {
  const fromArr = Array.isArray(row.photo_urls)
    ? row.photo_urls.filter((u): u is string => typeof u === "string" && !!u)
    : [];
  if (fromArr.length) return fromArr;
  return row.photo_url ? [row.photo_url] : [];
}

function buildDrafts(rows: DeskSubmission[]): Record<string, Draft> {
  const map: Record<string, Draft> = {};
  for (const row of rows) {
    map[row.id] = {
      district_id: row.district_id || "",
      mandal_id: row.mandal_id || "",
      ulb_id: row.ulb_id || "",
      caption: row.raw_caption || "",
      notes: row.moderator_notes || "",
    };
  }
  return map;
}

export function ModerationDeskClient({
  initial,
  counts: initialCounts,
  districts,
  mandals,
  ulbs,
  focusId,
}: Props) {
  const [tab, setTab] = useState<"pending" | "approved" | "all">(
    focusId ? "all" : "pending",
  );
  const [rows, setRows] = useState(initial);
  const [counts, setCounts] = useState(initialCounts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState(() => buildDrafts(initial));
  const [carouselIdx, setCarouselIdx] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    if (tab === "all") return rows;
    if (tab === "pending") {
      return rows.filter((r) => r.status === "pending" || r.status === "flagged");
    }
    return rows.filter((r) => r.status === tab);
  }, [rows, tab]);

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => {
      const cur = prev[id] || {
        district_id: "",
        mandal_id: "",
        ulb_id: "",
        caption: "",
        notes: "",
      };
      const next = { ...cur, ...patch };
      if (patch.district_id !== undefined && patch.district_id !== cur.district_id) {
        next.mandal_id = "";
        next.ulb_id = "";
      }
      return { ...prev, [id]: next };
    });
  }

  async function moderate(id: string, action: "approve" | "reject" | "retag") {
    const draft = drafts[id];
    setBusyId(id);
    startTransition(async () => {
      try {
        const data = await moderateSubmission({
          id,
          action,
          notes: draft?.notes || undefined,
          raw_caption: draft?.caption ?? undefined,
          district_id: draft?.district_id || null,
          mandal_id: draft?.mandal_id || null,
          ulb_id: draft?.ulb_id || null,
          moderator: "desk",
        });
        if (!data.ok) {
          throw new Error(data.error || "moderate_failed");
        }

        setRows((prev) =>
          prev.map((r) => {
            if (r.id !== id) return r;
            const nextStatus =
              action === "approve"
                ? "approved"
                : action === "reject"
                  ? "rejected"
                  : r.status;
            return {
              ...r,
              status: nextStatus as Status,
              district_id: draft?.district_id || null,
              mandal_id: draft?.mandal_id || null,
              ulb_id: draft?.ulb_id || null,
              raw_caption: draft?.caption ?? r.raw_caption,
              moderator_notes: draft?.notes || r.moderator_notes,
            };
          }),
        );

        setCounts((prev) => {
          const row = rows.find((r) => r.id === id);
          if (!row || action === "retag") return prev;
          const next = { ...prev };
          const wasPending =
            row.status === "pending" || row.status === "flagged";
          if (wasPending) next.pending = Math.max(0, (next.pending || 0) - 1);
          else if (row.status === "approved")
            next.approved = Math.max(0, (next.approved || 0) - 1);
          else if (row.status === "rejected")
            next.rejected = Math.max(0, (next.rejected || 0) - 1);

          if (action === "approve") next.approved = (next.approved || 0) + 1;
          if (action === "reject") next.rejected = (next.rejected || 0) + 1;
          next.all = rows.length;
          return next;
        });
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Moderation failed");
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
          {DESK_UI.eyebrow}
        </p>
        <h1 className="mt-1 font-telugu text-2xl font-bold text-[#18181B] sm:text-3xl">
          {DESK_UI.title_te}
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">{DESK_UI.lead_en}</p>
        <p className="font-telugu text-sm text-[#71717A]">{DESK_UI.lead_te}</p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count =
            t.id === "all"
              ? counts.all ?? rows.length
              : t.id === "pending"
                ? (counts.pending || 0) + (counts.flagged || 0)
                : counts[t.id] ?? 0;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "tap inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors font-telugu",
                active
                  ? "border-[#C2410C] bg-[#C2410C] text-white"
                  : "border-[#EBE8E0] bg-white text-[#18181B] hover:bg-[#F4F2EB]",
              )}
            >
              <Filter className="h-3.5 w-3.5" aria-hidden />
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EBE8E0] bg-[#FBFBF9] p-8 text-center text-sm text-[#71717A]">
          <p className="font-telugu">{DESK_UI.empty_te}</p>
          <p>{DESK_UI.empty_en}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((row) => {
            const draft = drafts[row.id] || {
              district_id: "",
              mandal_id: "",
              ulb_id: "",
              caption: "",
              notes: "",
            };
            const photos = photoList(row);
            const idx = carouselIdx[row.id] || 0;
            const activePhoto = photos[Math.min(idx, Math.max(photos.length - 1, 0))];
            const filteredMandals = mandals.filter(
              (m) => !draft.district_id || m.district_id === draft.district_id,
            );
            const filteredUlbs = ulbs.filter(
              (u) => !draft.district_id || u.district_id === draft.district_id,
            );
            const busy = busyId === row.id || isPending;
            const canAct = row.status === "pending" || row.status === "flagged";

            return (
              <article
                key={row.id}
                id={`submission-${row.id}`}
                className={cn(
                  "overflow-hidden rounded-2xl border border-[#EBE8E0] bg-white shadow-sm",
                  focusId === row.id && "ring-2 ring-[#C2410C]/40",
                )}
              >
                <div className="relative aspect-[4/3] bg-[#F4F2EB]">
                  {activePhoto ? (
                    <>
                      <Image
                        src={activePhoto}
                        alt={draft.caption || "Survey submission"}
                        fill
                        className="object-cover"
                        sizes="(max-width:1024px) 100vw, 50vw"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => setLightbox(activePhoto)}
                        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                        Zoom
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#A1A1AA]">
                      No photo
                    </div>
                  )}
                </div>

                {photos.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto border-b border-[#EBE8E0] bg-[#FBFBF9] px-3 py-2">
                    {photos.map((url, i) => (
                      <button
                        key={`${row.id}-${url}-${i}`}
                        type="button"
                        onClick={() =>
                          setCarouselIdx((prev) => ({ ...prev, [row.id]: i }))
                        }
                        className={cn(
                          "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border",
                          i === idx
                            ? "border-[#C2410C]"
                            : "border-[#EBE8E0]",
                        )}
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#18181B]">
                      {row.sender_name || "Unknown sender"}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase",
                        row.status === "pending" && "bg-amber-50 text-amber-800",
                        row.status === "flagged" && "bg-orange-50 text-orange-800",
                        row.status === "approved" &&
                          "bg-emerald-50 text-emerald-800",
                        row.status === "rejected" && "bg-rose-50 text-rose-800",
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    Telegram · {new Date(row.created_at).toLocaleString()}
                  </p>

                  <label className="block space-y-1">
                    <span className="font-telugu text-xs font-semibold text-[#71717A]">
                      {DESK_UI.caption_te}
                    </span>
                    <textarea
                      value={draft.caption}
                      onChange={(e) =>
                        updateDraft(row.id, { caption: e.target.value })
                      }
                      rows={3}
                      disabled={!canAct}
                      className="w-full rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] px-3 py-2 text-sm text-[#18181B] disabled:opacity-60"
                    />
                  </label>

                  <p className="text-xs text-[#71717A]">
                    Detected:{" "}
                    {[
                      row.districts?.name_en,
                      row.mandals?.name_en,
                      row.urban_local_bodies?.name_en,
                      row.gram_panchayats?.name_en,
                    ]
                      .filter(Boolean)
                      .join(" → ") || "manual triage needed"}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <select
                      aria-label="District"
                      value={draft.district_id}
                      disabled={!canAct}
                      onChange={(e) =>
                        updateDraft(row.id, { district_id: e.target.value })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs disabled:opacity-50"
                    >
                      <option value="">District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name_en}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Mandal"
                      value={draft.mandal_id}
                      disabled={!canAct || !draft.district_id}
                      onChange={(e) =>
                        updateDraft(row.id, {
                          mandal_id: e.target.value,
                          ulb_id: "",
                        })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs disabled:opacity-50"
                    >
                      <option value="">Rural mandal</option>
                      {filteredMandals.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name_en}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Urban local body"
                      value={draft.ulb_id}
                      disabled={!canAct || !draft.district_id}
                      onChange={(e) =>
                        updateDraft(row.id, {
                          ulb_id: e.target.value,
                          mandal_id: "",
                        })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs disabled:opacity-50"
                    >
                      <option value="">Urban ULB</option>
                      {filteredUlbs.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {canAct ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderate(row.id, "approve")}
                        className="tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 font-telugu"
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {DESK_UI.approve_te}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderate(row.id, "reject")}
                        className="tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EBE8E0] bg-white px-3 py-2.5 text-sm font-semibold text-[#18181B] hover:bg-[#F4F2EB] disabled:opacity-50 font-telugu"
                      >
                        <Trash2 className="h-4 w-4 text-[#C2410C]" />
                        {DESK_UI.dismiss_te}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderate(row.id, "retag")}
                        className="tap inline-flex w-full items-center justify-center rounded-full border border-[#EBE8E0] px-3 py-2 text-xs font-semibold text-[#71717A] hover:bg-[#FBFBF9] disabled:opacity-50 sm:w-auto"
                      >
                        Save caption & location
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {lightbox ? (
        <button
          type="button"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          aria-label="Close lightbox"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Submission zoom"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
          />
        </button>
      ) : null}
    </div>
  );
}
