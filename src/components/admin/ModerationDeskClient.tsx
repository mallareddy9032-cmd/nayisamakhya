"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Filter,
  Loader2,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { moderateSubmission } from "@/app/admin/moderation/actions";

type Status = "pending" | "approved" | "rejected" | "flagged";

type District = { id: string; slug: string; name_en: string; name_te: string };
type Mandal = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
};
type GP = { id: string; mandal_id: string; name_en: string; name_te: string };

export type DeskSubmission = {
  id: string;
  sender_name: string | null;
  raw_caption: string | null;
  photo_url: string | null;
  status: Status;
  created_at: string;
  district_id: string | null;
  mandal_id: string | null;
  gp_id: string | null;
  moderator_notes: string | null;
  extracted_data: Record<string, unknown> | null;
  districts?: District | null;
  mandals?: Mandal | null;
  gram_panchayats?: { id: string; name_en: string; name_te: string } | null;
};

type Draft = {
  district_id: string;
  mandal_id: string;
  gp_id: string;
  notes: string;
};

type Props = {
  initial: DeskSubmission[];
  counts: Record<Status, number>;
  districts: District[];
  mandals: Mandal[];
  gps: GP[];
  focusId?: string;
};

const tabs: Array<{ id: Status | "all"; label: string }> = [
  { id: "pending", label: "Pending" },
  { id: "flagged", label: "Flagged" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

function buildDrafts(rows: DeskSubmission[]): Record<string, Draft> {
  const map: Record<string, Draft> = {};
  for (const row of rows) {
    map[row.id] = {
      district_id: row.district_id || "",
      mandal_id: row.mandal_id || "",
      gp_id: row.gp_id || "",
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
  gps,
  focusId,
}: Props) {
  const [tab, setTab] = useState<Status | "all">(focusId ? "all" : "pending");
  const [rows, setRows] = useState(initial);
  const [counts, setCounts] = useState(initialCounts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState(() => buildDrafts(initial));

  const filtered = useMemo(() => {
    if (tab === "all") return rows;
    return rows.filter((r) => r.status === tab);
  }, [rows, tab]);

  function updateDraft(
    id: string,
    patch: Partial<{ district_id: string; mandal_id: string; gp_id: string; notes: string }>,
  ) {
    setDrafts((prev) => {
      const cur = prev[id] || {
        district_id: "",
        mandal_id: "",
        gp_id: "",
        notes: "",
      };
      const next = { ...cur, ...patch };
      if (patch.district_id !== undefined && patch.district_id !== cur.district_id) {
        next.mandal_id = "";
        next.gp_id = "";
      }
      if (patch.mandal_id !== undefined && patch.mandal_id !== cur.mandal_id) {
        next.gp_id = "";
      }
      return { ...prev, [id]: next };
    });
  }

  async function moderate(
    id: string,
    action: "approve" | "reject" | "retag",
  ) {
    const draft = drafts[id];
    let notes = draft?.notes || "";
    if (action === "reject") {
      const reason = window.prompt(
        "Rejection reason / తిరస్కరణ కారణం:",
        notes,
      );
      if (reason === null) return;
      if (!reason.trim()) {
        window.alert("Rejection reason is required.");
        return;
      }
      notes = reason.trim();
      updateDraft(id, { notes });
    }

    setBusyId(id);
    startTransition(async () => {
      try {
        const data = await moderateSubmission({
          id,
          action,
          notes: notes || undefined,
          district_id: draft?.district_id || null,
          mandal_id: draft?.mandal_id || null,
          gp_id: draft?.gp_id || null,
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
              gp_id: draft?.gp_id || null,
              moderator_notes: notes || r.moderator_notes,
            };
          }),
        );

        setCounts((prev) => {
          const row = rows.find((r) => r.id === id);
          if (!row || action === "retag") return prev;
          const next = { ...prev };
          next[row.status] = Math.max(0, (next[row.status] || 0) - 1);
          const ns = action === "approve" ? "approved" : "rejected";
          next[ns] = (next[ns] || 0) + 1;
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
          Method 3 · Live Moderation Desk
        </p>
        <h1 className="mt-1 font-telugu text-2xl font-bold text-[#18181B] sm:text-3xl">
          ఫీల్డ్ సర్వే ఫోటో సమీక్ష
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">
          Telegram intake · approve to publish & bump GP survey progress
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count =
            t.id === "all"
              ? rows.length
              : counts[t.id as Status] ??
                rows.filter((r) => r.status === t.id).length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "tap inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
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
          No submissions in this queue.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((row) => {
            const draft = drafts[row.id] || {
              district_id: "",
              mandal_id: "",
              gp_id: "",
              notes: "",
            };
            const filteredMandals = mandals.filter(
              (m) => !draft.district_id || m.district_id === draft.district_id,
            );
            const filteredGps = gps.filter(
              (g) => !draft.mandal_id || g.mandal_id === draft.mandal_id,
            );
            const busy = busyId === row.id || isPending;
            const confidence = String(
              (row.extracted_data as { confidence?: string } | null)?.confidence ||
                "—",
            );

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
                  {row.photo_url ? (
                    <>
                      <Image
                        src={row.photo_url}
                        alt={row.raw_caption || "Survey submission"}
                        fill
                        className="object-cover"
                        sizes="(max-width:1024px) 100vw, 50vw"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => setLightbox(row.photo_url)}
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
                        row.status === "approved" && "bg-emerald-50 text-emerald-800",
                        row.status === "rejected" && "bg-rose-50 text-rose-800",
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    {new Date(row.created_at).toLocaleString()} · confidence{" "}
                    {confidence}
                  </p>
                  <p className="text-sm text-[#52525B]">
                    {row.raw_caption || "— no caption —"}
                  </p>
                  <p className="text-xs text-[#71717A]">
                    Detected:{" "}
                    {[
                      row.districts?.name_en,
                      row.mandals?.name_en,
                      row.gram_panchayats?.name_en,
                    ]
                      .filter(Boolean)
                      .join(" → ") || "manual triage needed"}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <select
                      aria-label="District"
                      value={draft.district_id}
                      onChange={(e) =>
                        updateDraft(row.id, { district_id: e.target.value })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs"
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
                      disabled={!draft.district_id}
                      onChange={(e) =>
                        updateDraft(row.id, { mandal_id: e.target.value })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs disabled:opacity-50"
                    >
                      <option value="">Mandal</option>
                      {filteredMandals.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name_en}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Gram Panchayat"
                      value={draft.gp_id}
                      disabled={!draft.mandal_id}
                      onChange={(e) =>
                        updateDraft(row.id, { gp_id: e.target.value })
                      }
                      className="min-h-[40px] rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-3 text-xs disabled:opacity-50"
                    >
                      <option value="">GP / Ward</option>
                      {filteredGps.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => moderate(row.id, "approve")}
                      className="tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#C2410C] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#9A3412] disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve / ఆమోదించు
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => moderate(row.id, "reject")}
                      className="tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EBE8E0] bg-white px-3 py-2.5 text-sm font-semibold text-[#18181B] hover:bg-[#F4F2EB] disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4 text-[#C2410C]" />
                      Reject / తిరస్కరించు
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => moderate(row.id, "retag")}
                      className="tap inline-flex w-full items-center justify-center rounded-full border border-[#EBE8E0] px-3 py-2 text-xs font-semibold text-[#71717A] hover:bg-[#FBFBF9] disabled:opacity-50 sm:w-auto"
                    >
                      Save location tags
                    </button>
                  </div>
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
