"use client";

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
} from "lucide-react";

type Tab = "pending" | "approved" | "rejected";

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

type Counts = Record<Tab, number>;

const EMPTY_COUNTS: Counts = { pending: 0, approved: 0, rejected: 0 };
const TABS: Tab[] = ["pending", "approved", "rejected"];

function usablePhotoUrl(url: unknown): url is string {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return false;
  // Incomplete storage prefixes (missing object path) are not previewable.
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

function pickDefaultTab(counts: Counts): Tab {
  if (counts.pending > 0) return "pending";
  if (counts.rejected > 0) return "rejected";
  if (counts.approved > 0) return "approved";
  return "pending";
}

export default function AdminDeskPage() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

  const loadDesk = useCallback(
    async (authToken: string, tab: Tab) => {
      setLoading(true);
      setError("");
      try {
        const nextCounts = { ...EMPTY_COUNTS };
        const results = await Promise.all(
          TABS.map(async (status) => {
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

        if (results.some((r) => "unauthorized" in r && r.unauthorized)) {
          setIsAuthorized(false);
          localStorage.removeItem("ns_admin_token");
          setError("Session expired — sign in again.");
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
            // Effect will reload for the new tab; still paint counts now.
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
    [],
  );

  useEffect(() => {
    if (!isAuthorized || !token) return;
    void loadDesk(token, activeTab);
  }, [isAuthorized, token, activeTab, loadDesk]);

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
        }),
      });
      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(json.error || `Update failed (${res.status})`);
        return;
      }

      setSelectedSubmission(null);
      await loadDesk(token, activeTab);
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
            {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F"} Desk Login
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

  const otherNonEmpty = TABS.filter((t) => t !== activeTab && counts[t] > 0);

  return (
    <div className="min-h-dvh bg-slate-950 p-4 text-slate-100 sm:p-6">
      <header className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-500">
            Nayi Samakhya · Admin
          </p>
          <h1 className="mt-1 text-xl font-bold text-white">
            {"\u0C38\u0C30\u0C4D\u0C35\u0C47 & \u0C2B\u0C4B\u0C1F\u0C4B \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28"}{" "}
            (Moderation Desk)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Review field photos from @NayiSamakhyaDeskBot — approve to keep,
            reject to dismiss.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1.5 font-medium capitalize transition-colors sm:px-4 ${
                  activeTab === tab
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}{" "}
                <span
                  className={
                    activeTab === tab ? "text-amber-100" : "text-slate-500"
                  }
                >
                  ({counts[tab]})
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void loadDesk(token, activeTab)}
            disabled={loading}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
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

      <main className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        {error ? (
          <div className="lg:col-span-12 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        <section className="space-y-4 lg:col-span-7">
          {submissions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/80 p-8 text-center">
              <Camera className="mx-auto mb-3 h-8 w-8 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">
                No {activeTab} submissions
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
                          {new Date(sub.created_at).toLocaleDateString("te-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="mb-2 line-clamp-2 rounded border border-slate-800/80 bg-slate-950/60 p-2 text-xs leading-relaxed text-slate-300">
                        {sub.raw_caption || "No caption provided"}
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
                <span>Submission details</span>
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
                    placeholder="Village or colony name"
                    className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-slate-400">Admin notes</label>
                  <textarea
                    rows={2}
                    value={selectedSubmission.admin_notes || ""}
                    onChange={(e) =>
                      setSelectedSubmission({
                        ...selectedSubmission,
                        admin_notes: e.target.value,
                      })
                    }
                    placeholder="Internal moderation notes"
                    className="w-full resize-none rounded border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    void handleUpdateStatus(selectedSubmission.id, "approved")
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void handleUpdateStatus(selectedSubmission.id, "rejected")
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600/80 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-8 text-center text-xs text-slate-500">
              Select a submission on the left to preview photos and approve or
              reject.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
