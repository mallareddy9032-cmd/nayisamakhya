"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import VolunteersDeskClient from "@/components/admin/VolunteersDeskClient";

export default function AdminVolunteersPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onLogout() {
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          setError("Logout failed. Try again.");
          return;
        }
        router.push("/admin/login");
        router.refresh();
      } catch {
        setError("Logout failed. Try again.");
      }
    });
  }

  return (
    <main className="min-h-[100dvh] bg-[#FBFBFA]">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-display-te text-lg font-normal leading-telugu text-ink">
              నాయీ సమాఖ్య
            </p>
            <p className="truncate font-telugu text-xs text-muted">
              అడ్మిన్ పోర్టల్ · తెలంగాణ 33 జిల్లాలు · Volunteers desk
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={pending}
            className="tap inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition hover:border-[#1E293B] hover:text-[#1E293B] disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="font-telugu">→ నిష్క్రమించు (Logout)</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <VolunteersDeskClient logoutError={error} />
      </div>
    </main>
  );
}
