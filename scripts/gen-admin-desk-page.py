#!/usr/bin/env python3
"""Generate src/app/admin/desk/page.tsx with ASCII-safe Telugu escapes."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/app/admin/desk/page.tsx"


def te(*cps: int) -> str:
    return "".join(chr(c) for c in cps)


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


def q(s: str) -> str:
    """JS/TS string literal."""
    return '"' + esc(s) + '"'


def lit(s: str) -> str:
    """JSX text expression: {"..." }"""
    return "{" + q(s) + "}"


def main() -> None:
    nayi = te(0x0C28, 0x0C3E, 0x0C2F, 0x0C3F) + " " + te(
        0x0C38, 0x0C2E, 0x0C3E, 0x0C16, 0x0C4D, 0x0C2F
    )
    header = (
        te(0x0C38, 0x0C30, 0x0C4D, 0x0C35, 0x0C47)
        + " & "
        + te(0x0C2B, 0x0C4B, 0x0C1F, 0x0C4B)
        + " "
        + te(0x0C2A, 0x0C30, 0x0C3F, 0x0C36, 0x0C40, 0x0C32, 0x0C28)
        + " "
        + te(0x0C35, 0x0C3F, 0x0C2D, 0x0C3E, 0x0C17, 0x0C02)
        + " (Moderation Desk)"
    )
    analytics_h2 = (
        te(0x0C1C, 0x0C3F, 0x0C32, 0x0C4D, 0x0C32, 0x0C3E)
        + " "
        + te(0x0C35, 0x0C3E, 0x0C30, 0x0C40, 0x0C17, 0x0C3E)
        + " "
        + te(0x0C28, 0x0C3F, 0x0C35, 0x0C47, 0x0C26, 0x0C3F, 0x0C15, 0x0C32, 0x0C41)
        + " (District Performance)"
    )
    col_dist = te(0x0C1C, 0x0C3F, 0x0C32, 0x0C4D, 0x0C32, 0x0C3E) + " (District)"
    col_total = te(0x0C2E, 0x0C4A, 0x0C24, 0x0C4D, 0x0C24, 0x0C02) + " (Total)"
    col_approved = (
        te(0x0C06, 0x0C2E, 0x0C4B, 0x0C26, 0x0C3F, 0x0C02, 0x0C1A, 0x0C3F, 0x0C28, 0x0C35, 0x0C3F)
        + " (Approved)"
    )
    col_pending = (
        te(0x0C2A, 0x0C46, 0x0C02, 0x0C21, 0x0C3F, 0x0C02, 0x0C17, 0x0C4D) + " (Pending)"
    )
    col_rejected = (
        te(
            0x0C24,
            0x0C3F,
            0x0C30,
            0x0C38,
            0x0C4D,
            0x0C15,
            0x0C30,
            0x0C3F,
            0x0C02,
            0x0C1A,
            0x0C3F,
            0x0C28,
            0x0C35,
            0x0C3F,
        )
        + " (Rejected)"
    )
    no_data = (
        te(0x0C21, 0x0C47, 0x0C1F, 0x0C3E)
        + " "
        + te(0x0C32, 0x0C47, 0x0C26, 0x0C41)
        + " (No data available)"
    )
    no_subs = (
        te(
            0x0C28,
            0x0C4B,
            0x0C1F,
            0x0C3F,
            0x0C2B,
            0x0C3F,
            0x0C15,
            0x0C47,
            0x0C37,
            0x0C28,
            0x0C4D,
            0x0C32,
            0x0C41,
        )
        + " "
        + te(0x0C0F, 0x0C35, 0x0C40)
        + " "
        + te(0x0C32, 0x0C47, 0x0C35, 0x0C41)
    )
    no_caption = (
        te(0x0C35, 0x0C3F, 0x0C35, 0x0C30, 0x0C3E, 0x0C32, 0x0C41)
        + " "
        + te(0x0C28, 0x0C2E, 0x0C4B, 0x0C26, 0x0C41)
        + " "
        + te(0x0C15, 0x0C3E, 0x0C32, 0x0C47, 0x0C26, 0x0C41)
        + " (No text provided)"
    )
    details = (
        te(0x0C38, 0x0C2E, 0x0C40, 0x0C15, 0x0C4D, 0x0C37)
        + " "
        + te(0x0C35, 0x0C3F, 0x0C35, 0x0C30, 0x0C3E, 0x0C32, 0x0C41)
        + " (Submission Details)"
    )
    panchayat_ph = (
        te(0x0C17, 0x0C4D, 0x0C30, 0x0C3E, 0x0C2E, 0x0C02)
        + " / "
        + te(0x0C15, 0x0C3E, 0x0C32, 0x0C28, 0x0C40)
        + " (e.g., "
        + te(0x0C32, 0x0C21, 0x0C15, 0x0C4D)
        + " "
        + te(0x0C2C, 0x0C1C, 0x0C3E, 0x0C30, 0x0C4D)
        + ")"
    )
    notes_ph = (
        te(0x0C05, 0x0C02, 0x0C24, 0x0C30, 0x0C4D, 0x0C17, 0x0C24)
        + " "
        + te(0x0C17, 0x0C2E, 0x0C28, 0x0C3F, 0x0C15, 0x0C32, 0x0C41)
        + " (Admin Notes)"
    )
    approve = te(0x0C06, 0x0C2E, 0x0C4B, 0x0C26, 0x0C3F, 0x0C02, 0x0C1A, 0x0C41) + " (Approve)"
    reject = (
        te(0x0C24, 0x0C3F, 0x0C30, 0x0C38, 0x0C4D, 0x0C15, 0x0C30, 0x0C3F, 0x0C02, 0x0C1A, 0x0C41)
        + " (Reject)"
    )
    select = (
        te(0x0C12, 0x0C15)
        + " "
        + te(0x0C05, 0x0C02, 0x0C36, 0x0C3E, 0x0C28, 0x0C4D, 0x0C28, 0x0C3F)
        + " "
        + te(0x0C0E, 0x0C02, 0x0C1A, 0x0C41, 0x0C15, 0x0C4B, 0x0C02, 0x0C21, 0x0C3F)
        + " (Select a submission to review details)."
    )

    for label, value in (
        ("header", header),
        ("analytics_h2", analytics_h2),
        ("approve", approve),
    ):
        assert "\ufffd" not in value, label

    L_LOGIN = lit(nayi + " Desk Login")
    L_HEADER = lit(header)
    L_ANALYTICS = lit(analytics_h2)
    L_DIST = lit(col_dist)
    L_TOTAL = lit(col_total)
    L_APPROVED = lit(col_approved)
    L_PENDING = lit(col_pending)
    L_REJECTED = lit(col_rejected)
    L_NO_DATA = lit(no_data)
    L_NO_SUBS = lit(no_subs)
    L_NO_CAPTION = lit(no_caption)
    L_DETAILS = lit(details)
    L_PANCH = lit(panchayat_ph)
    L_NOTES = lit(notes_ph)
    L_APPROVE = lit(approve)
    L_REJECT = lit(reject)
    L_SELECT = lit(select)

    page = r'''"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  KeyRound,
  Calendar,
  User,
  LogOut,
  Camera,
  BarChart3,
} from "lucide-react";

type QueueTab = "pending" | "approved" | "rejected";
type Tab = QueueTab | "analytics";

interface Submission {
  id: string;
  created_at: string;
  sender_name: string;
  telegram_chat_id: string;
  photo_url: string;
  photo_urls: string[];
  raw_caption: string;
  status: string;
  district_id?: string;
  mandal_id?: string;
  panchayat_name?: string;
  admin_notes?: string;
}

interface AnalyticsRow {
  district: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  flagged?: number;
}

type Counts = Record<QueueTab, number>;

const EMPTY_COUNTS: Counts = { pending: 0, approved: 0, rejected: 0 };
const QUEUE_TABS: QueueTab[] = ["pending", "approved", "rejected"];
const ALL_TABS: Tab[] = ["pending", "approved", "rejected", "analytics"];

function usablePhotoUrl(url: unknown): url is string {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return false;
  if (/\/storage\/v1\/object\/public\/survey-photos\/?$/i.test(url)) return false;
  return url.length > 48;
}

function photosOf(sub: Submission): string[] {
  const fromArr = Array.isArray(sub.photo_urls)
    ? sub.photo_urls.filter(usablePhotoUrl)
    : [];
  if (fromArr.length) return fromArr;
  return usablePhotoUrl(sub.photo_url) ? [sub.photo_url] : [];
}

function pickDefaultTab(counts: Counts): QueueTab {
  if (counts.pending > 0) return "pending";
  if (counts.rejected > 0) return "rejected";
  if (counts.approved > 0) return "approved";
  return "pending";
}

export default function AdminDeskPage() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [counts, setCounts] = useState<Counts>(EMPTY_COUNTS);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null,
  );
  const didPickDefaultTab = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("ns_admin_token");
    if (saved) {
      setToken(saved);
      setIsAuthorized(true);
    }
  }, []);

  const handleUnauthorized = useCallback(() => {
    setIsAuthorized(false);
    localStorage.removeItem("ns_admin_token");
    setError("Session expired — sign in again.");
  }, []);

  const loadAnalytics = useCallback(
    async (authToken: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: "no-store",
        });
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        const json = (await res.json()) as {
          analytics?: AnalyticsRow[];
          error?: string;
        };
        if (!res.ok) {
          setError(json.error || `HTTP ${res.status}`);
          setAnalytics([]);
          return;
        }
        setAnalytics(json.analytics || []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized],
  );

  const loadDesk = useCallback(
    async (authToken: string, tab: QueueTab) => {
      setLoading(true);
      setError("");
      try {
        const nextCounts = { ...EMPTY_COUNTS };
        const results = await Promise.all(
          QUEUE_TABS.map(async (status) => {
            const res = await fetch(`/api/admin/submissions?status=${status}`, {
              headers: { Authorization: `Bearer ${authToken}` },
              cache: "no-store",
            });
            if (res.status === 401) return { status, unauthorized: true as const };
            const json = (await res.json()) as {
              submissions?: Submission[];
              error?: string;
            };
            if (!res.ok) {
              return {
                status,
                unauthorized: false as const,
                list: [] as Submission[],
                error: json.error || `HTTP ${res.status}`,
              };
            }
            return {
              status,
              unauthorized: false as const,
              list: json.submissions || [],
            };
          }),
        );

        if (results.some((r) => r.unauthorized)) {
          handleUnauthorized();
          return;
        }

        const firstErr = results.find(
          (r) => !r.unauthorized && "error" in r && r.error,
        );
        if (firstErr && !firstErr.unauthorized && "error" in firstErr) {
          setError(String(firstErr.error));
        }

        for (const r of results) {
          if (!r.unauthorized) nextCounts[r.status] = r.list.length;
        }
        setCounts(nextCounts);

        let tabToShow = tab;
        if (!didPickDefaultTab.current) {
          didPickDefaultTab.current = true;
          tabToShow = pickDefaultTab(nextCounts);
          if (tabToShow !== tab) {
            setActiveTab(tabToShow);
            setLoading(false);
            return;
          }
        }

        const active = results.find(
          (r) => !r.unauthorized && r.status === tabToShow,
        );
        const list = active && !active.unauthorized ? active.list : [];
        setSubmissions(list);
        setSelectedSubmission((prev) =>
          prev && list.some((s) => s.id === prev.id) ? prev : null,
        );
      } catch (err) {
        console.error("Failed to load submissions:", err);
        setError(err instanceof Error ? err.message : "Failed to load desk");
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized],
  );

  const fetchData = useCallback(
    async (authToken?: string) => {
      const t = (authToken || token).trim();
      if (!t) return;
      if (activeTab === "analytics") {
        await loadAnalytics(t);
      } else {
        await loadDesk(t, activeTab);
      }
    },
    [activeTab, token, loadAnalytics, loadDesk],
  );

  useEffect(() => {
    if (!isAuthorized || !token) return;
    void fetchData();
  }, [isAuthorized, token, activeTab, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    const trimmed = token.trim();
    localStorage.setItem("ns_admin_token", trimmed);
    didPickDefaultTab.current = false;
    setToken(trimmed);
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("ns_admin_token");
    didPickDefaultTab.current = false;
    setIsAuthorized(false);
    setToken("");
    setSubmissions([]);
    setAnalytics([]);
    setCounts(EMPTY_COUNTS);
    setSelectedSubmission(null);
    setActiveTab("pending");
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    setError("");
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          status: newStatus,
          admin_notes: selectedSubmission?.admin_notes,
          panchayat_name: selectedSubmission?.panchayat_name,
          district_id: selectedSubmission?.district_id,
          mandal_id: selectedSubmission?.mandal_id,
        }),
      });
      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(json.error || `Update failed (${res.status})`);
        return;
      }

      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      setSelectedSubmission(null);
      if (activeTab !== "analytics") {
        setCounts((prev) => ({
          ...prev,
          [activeTab]: Math.max(0, prev[activeTab] - 1),
          [newStatus]: (prev[newStatus] || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center gap-3 text-xl font-semibold text-white">
            <KeyRound className="h-6 w-6 text-amber-500" />
            <span className="font-telugu">__LOGIN__</span>
          </div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Moderation Desk Secret
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter MODERATION_DESK_SECRET"
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  const otherNonEmpty = QUEUE_TABS.filter(
    (t) => t !== activeTab && counts[t] > 0,
  );

  return (
    <div className="min-h-dvh bg-slate-950 p-4 text-slate-100 sm:p-6">
      <header className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-500">
            Nayi Samakhya · Admin
          </p>
          <h1 className="mt-1 font-telugu text-xl font-bold text-white">
            __HEADER__
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Review field photos from @NayiSamakhyaDeskBot — approve to publish,
            reject to dismiss.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
            {ALL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedSubmission(null);
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium capitalize transition-colors sm:px-4 ${
                  activeTab === tab
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "analytics" ? (
                  <BarChart3 className="h-3.5 w-3.5" aria-hidden />
                ) : null}
                {tab}
                {tab !== "analytics" ? (
                  <span
                    className={
                      activeTab === tab ? "text-amber-100" : "text-slate-500"
                    }
                  >
                    ({counts[tab]})
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void fetchData()}
            disabled={loading}
            className="flex-shrink-0 rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            title="Lock desk"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock
          </button>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-7xl">
        {error ? (
          <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {activeTab === "analytics" ? (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col gap-1 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-telugu text-sm font-semibold text-white">
                __ANALYTICS__
              </h2>
              <span className="text-xs text-slate-400">
                Total volume tracking for coordinator engagement
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-telugu">__COL_DIST__</th>
                    <th className="px-6 py-4 text-center font-telugu">
                      __COL_TOTAL__
                    </th>
                    <th className="px-6 py-4 text-center font-telugu text-emerald-400">
                      __COL_APPROVED__
                    </th>
                    <th className="px-6 py-4 text-center font-telugu text-amber-400">
                      __COL_PENDING__
                    </th>
                    <th className="px-6 py-4 text-center font-telugu text-rose-400">
                      __COL_REJECTED__
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {analytics.map((row) => (
                    <tr
                      key={row.district}
                      className="transition-colors hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4 font-telugu font-medium text-white">
                        {row.district}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-200">
                        {row.total}
                      </td>
                      <td className="px-6 py-4 text-center">{row.approved}</td>
                      <td className="px-6 py-4 text-center">{row.pending}</td>
                      <td className="px-6 py-4 text-center">{row.rejected}</td>
                    </tr>
                  ))}
                  {analytics.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center font-telugu text-slate-500"
                      >
                        __NO_DATA__
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="space-y-4 lg:col-span-7">
              {submissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/80 p-8 text-center">
                  <Camera className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                  <p className="font-telugu text-sm font-medium text-slate-300">
                    __NO_SUBS__ (No {activeTab} submissions found).
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {activeTab === "pending"
                      ? "Pending includes new and flagged intake. Send a photo to @NayiSamakhyaDeskBot to queue work."
                      : `Nothing in ${activeTab} right now.`}
                  </p>
                  {otherNonEmpty.length > 0 ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {otherNonEmpty.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-amber-400 hover:bg-amber-500/20"
                        >
                          Open {tab} ({counts[tab]})
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                submissions.map((sub) => {
                  const photos = photosOf(sub);
                  const isSelected = selectedSubmission?.id === sub.id;

                  return (
                    <div
                      key={sub.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedSubmission(sub)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedSubmission(sub);
                        }
                      }}
                      className={`cursor-pointer rounded-xl border bg-slate-900 p-4 transition-all ${
                        isSelected
                          ? "border-amber-500 ring-1 ring-amber-500"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                          {photos[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photos[0]}
                              alt="Field intake"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-slate-600">
                              No photo
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-medium text-slate-200">
                              <User className="h-3.5 w-3.5 text-amber-500" />
                              {sub.sender_name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(sub.created_at).toLocaleDateString(
                                "te-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          <p className="mb-2 line-clamp-2 rounded border border-slate-800/80 bg-slate-950/60 p-2 font-telugu text-xs leading-relaxed text-slate-300">
                            {sub.raw_caption || __NO_CAPTION_Q__}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-2">
                              Photos: {photos.length || "none"}
                              {sub.status === "flagged" ? (
                                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-orange-300">
                                  flagged
                                </span>
                              ) : null}
                            </span>
                            <span className="font-medium text-amber-500">
                              Click to inspect →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            <section className="lg:col-span-5">
              {selectedSubmission ? (
                <div className="sticky top-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="mb-4 flex items-center justify-between text-sm font-semibold text-white">
                    <span className="font-telugu">__DETAILS__</span>
                    <span className="rounded border border-amber-500/20 bg-slate-800 px-2 py-0.5 text-xs capitalize text-amber-400">
                      {selectedSubmission.status}
                    </span>
                  </h2>

                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {photosOf(selectedSubmission).map((url, idx) => (
                      <a
                        key={`${url}-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block aspect-square overflow-hidden rounded-lg border border-slate-800"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Intake ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mb-6 space-y-3 text-xs">
                    <div>
                      <label className="mb-1 block text-slate-400">
                        Sender / Telegram
                      </label>
                      <div className="rounded border border-slate-800 bg-slate-950 p-2 text-slate-200">
                        {selectedSubmission.sender_name} (Chat ID:{" "}
                        {selectedSubmission.telegram_chat_id})
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-slate-400">
                        Panchayat / locality
                      </label>
                      <input
                        type="text"
                        value={selectedSubmission.panchayat_name || ""}
                        onChange={(e) =>
                          setSelectedSubmission({
                            ...selectedSubmission,
                            panchayat_name: e.target.value,
                          })
                        }
                        placeholder=__PANCH__
                        className="w-full rounded border border-slate-800 bg-slate-950 p-2 font-telugu text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-slate-400">
                        Admin notes
                      </label>
                      <textarea
                        rows={2}
                        value={selectedSubmission.admin_notes || ""}
                        onChange={(e) =>
                          setSelectedSubmission({
                            ...selectedSubmission,
                            admin_notes: e.target.value,
                          })
                        }
                        placeholder=__NOTES__
                        className="w-full resize-none rounded border border-slate-800 bg-slate-950 p-2 font-telugu text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {activeTab === "pending" ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          void handleUpdateStatus(
                            selectedSubmission.id,
                            "approved",
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-telugu">__APPROVE__</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void handleUpdateStatus(
                            selectedSubmission.id,
                            "rejected",
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600/80 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600"
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="font-telugu">__REJECT__</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-8 text-center font-telugu text-xs text-slate-500">
                  __SELECT__
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
'''

    # placeholder=__PANCH__ needs to be placeholder={"..."}
    # For JSX text nodes use the lit() form directly.
    replacements = {
        "__LOGIN__": L_LOGIN,
        "__HEADER__": L_HEADER,
        "__ANALYTICS__": L_ANALYTICS,
        "__COL_DIST__": L_DIST,
        "__COL_TOTAL__": L_TOTAL,
        "__COL_APPROVED__": L_APPROVED,
        "__COL_PENDING__": L_PENDING,
        "__COL_REJECTED__": L_REJECTED,
        "__NO_DATA__": L_NO_DATA,
        "__NO_SUBS__": L_NO_SUBS,
        "__NO_CAPTION_Q__": q(no_caption),
        "__DETAILS__": L_DETAILS,
        "placeholder=__PANCH__": f"placeholder={L_PANCH}",
        "placeholder=__NOTES__": f"placeholder={L_NOTES}",
        "__APPROVE__": L_APPROVE,
        "__REJECT__": L_REJECT,
        "__SELECT__": L_SELECT,
    }

    for key, value in replacements.items():
        if key not in page:
            raise SystemExit(f"missing placeholder {key}")
        page = page.replace(key, value)

    if "\ufffd" in page:
        raise SystemExit("FFFD leaked into output")
    if "__" in page:
        raise SystemExit(f"unreplaced placeholder remains: {page[page.index('__'):page.index('__')+20]}")

    OUT.write_text(page, encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print("header:", header)
    print("analytics:", analytics_h2)


if __name__ == "__main__":
    main()
