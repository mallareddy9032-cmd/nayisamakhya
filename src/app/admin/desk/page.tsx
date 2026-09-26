"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  KeyRound,
  Calendar,
  User,
} from "lucide-react";

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

export default function AdminDeskPage() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null,
  );

  useEffect(() => {
    const saved = localStorage.getItem("ns_admin_token");
    if (saved) {
      setToken(saved);
      setIsAuthorized(true);
    }
  }, []);

  const fetchSubmissions = async (authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${authToken || token}`,
        },
      });

      if (res.status === 401) {
        setIsAuthorized(false);
        localStorage.removeItem("ns_admin_token");
        return;
      }

      const json = await res.json();
      if (json.submissions) {
        setSubmissions(json.submissions);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      void fetchSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when auth/tab changes
  }, [isAuthorized, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem("ns_admin_token", token.trim());
    setIsAuthorized(true);
    void fetchSubmissions(token.trim());
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
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

      if (res.ok) {
        setSubmissions((prev) => prev.filter((item) => item.id !== id));
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl"
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
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
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

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <header className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            {"\u0C38\u0C30\u0C4D\u0C35\u0C47 & \u0C2B\u0C4B\u0C1F\u0C4B \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28 \u0C35\u0C3F\u0C2D\u0C3E\u0C17\u0C02"}{" "}
            (Moderation Desk)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Review incoming field photos and shop data received from
            @NayiSamakhyaDeskBot
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
            {(["pending", "approved", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-1.5 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void fetchSubmissions()}
            disabled={loading}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-7">
          {submissions.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
              {"\u0C28\u0C4B\u0C1F\u0C3F\u0C2B\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D\u0C32\u0C41 \u0C0F\u0C35\u0C40 \u0C32\u0C47\u0C35\u0C41"}{" "}
              (No {activeTab} submissions found).
            </div>
          ) : (
            submissions.map((sub) => {
              const photos = sub.photo_urls?.length
                ? sub.photo_urls
                : [sub.photo_url];
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photos[0]}
                        alt="Field intake"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-200">
                          <User className="h-3.5 w-3.5 text-amber-500" />
                          {sub.sender_name}
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
                        {sub.raw_caption ||
                          "\u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C28\u0C2E\u0C4B\u0C26\u0C41 \u0C15\u0C3E\u0C32\u0C47\u0C26\u0C41 (No text provided)"}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {"\u0C2B\u0C4A\u0C1F\u0C4B\u0C32\u0C41"}: {photos.length}
                        </span>
                        <span className="font-medium text-amber-500">
                          Click to inspect & approve →
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
                <span>
                  {"\u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41"} (Submission
                  Details)
                </span>
                <span className="rounded border border-amber-500/20 bg-slate-800 px-2 py-0.5 text-xs text-amber-400">
                  {selectedSubmission.status}
                </span>
              </h2>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {(selectedSubmission.photo_urls?.length
                  ? selectedSubmission.photo_urls
                  : [selectedSubmission.photo_url]
                ).map((url, idx) => (
                  <a
                    key={idx}
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
                    {"\u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C35\u0C3E\u0C30\u0C3F \u0C2A\u0C47\u0C30\u0C41"} / Telegram:
                  </label>
                  <div className="rounded border border-slate-800 bg-slate-950 p-2 text-slate-200">
                    {selectedSubmission.sender_name} (Chat ID:{" "}
                    {selectedSubmission.telegram_chat_id})
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-slate-400">
                    {"\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C02 / \u0C15\u0C3E\u0C32\u0C28\u0C40"} (Panchayat /
                    Locality):
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
                    placeholder="e.g., Gudibanda or Ladak Bazaar"
                    className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-slate-400">
                    {"\u0C05\u0C02\u0C24\u0C30\u0C4D\u0C17\u0C24 \u0C17\u0C2E\u0C28\u0C3F\u0C15\u0C32\u0C41"} (Admin Notes):
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
                  {"\u0C06\u0C2E\u0C4B\u0C26\u0C3F\u0C02\u0C1A\u0C41"} (Approve)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void handleUpdateStatus(selectedSubmission.id, "rejected")
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600/80 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600"
                >
                  <XCircle className="h-4 w-4" />
                  {"\u0C24\u0C3F\u0C30\u0C38\u0C4D\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C41"} (Reject)
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-8 text-center text-xs text-slate-500">
              {"\u0C0E\u0C21\u0C2E\u0C35\u0C48\u0C2A\u0C41 \u0C1C\u0C3E\u0C2C\u0C3F\u0C24\u0C3E \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C12\u0C15 \u0C05\u0C02\u0C36\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F"}{" "}
              (Select a submission to review details).
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
