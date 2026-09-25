"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { unlockModerationDesk } from "@/app/admin/moderation/actions";

export function ModerationUnlockForm() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await unlockModerationDesk(secret);
      if (!res.ok) {
        setError(
          res.error === "invalid_secret"
            ? "Invalid desk secret"
            : res.error === "desk_secret_not_configured"
              ? "Set MODERATION_DESK_SECRET on Vercel, then redeploy"
              : res.error,
        );
        return;
      }
      router.refresh();
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-[#EBE8E0] bg-white p-6 shadow-sm">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F2EB]">
          <Lock className="h-5 w-5 text-[#C2410C]" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-[#18181B]">Moderation Desk</h1>
        <p className="mt-1 text-sm text-[#71717A]">
          Enter <code className="text-xs">MODERATION_DESK_SECRET</code> to
          unlock approve / reject.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            type="password"
            autoComplete="current-password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Desk secret"
            className="min-h-[44px] w-full rounded-full border border-[#EBE8E0] bg-[#FBFBF9] px-4 text-sm"
            required
          />
          {error ? (
            <p className="text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending || !secret.trim()}
            className="tap inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#C2410C] px-4 text-sm font-semibold text-white hover:bg-[#9A3412] disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Unlock desk
          </button>
        </form>
      </div>
    </main>
  );
}
