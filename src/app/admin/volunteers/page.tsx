"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users } from "lucide-react";

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
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-display-te text-lg leading-telugu text-ink">
              నాయీ సమాఖ్య
            </p>
            <p className="truncate font-telugu text-xs text-muted">
              అడ్మిన్ పోర్టల్ · Volunteers desk
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={pending}
            className="tap inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition hover:border-brand hover:text-brand disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="font-telugu">నిష్క్రమించు (Logout)</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
          >
            {error}
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm">
            <Users className="h-5 w-5 text-brand" aria-hidden />
          </div>
          <div>
            <h1 className="font-telugu text-xl font-semibold leading-telugu text-ink">
              వాలంటీర్లు (Volunteers)
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Secure admin session is active. Full volunteers tooling ships in a
              later milestone — this desk confirms route protection and logout.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
