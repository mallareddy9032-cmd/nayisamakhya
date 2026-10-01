"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

const ERROR_FALLBACK =
  "తప్పుడు పాస్‌వర్డ్ / Invalid Admin Security PIN";

function safeRedirect(raw: string | null): string {
  if (!raw) return "/admin/volunteers";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin/volunteers";
  if (raw.startsWith("/admin/login")) return "/admin/volunteers";
  return raw;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(
    () => safeRedirect(searchParams.get("redirect")),
    [searchParams],
  );

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          error?: string;
        };
        if (!res.ok || !data.success) {
          setError(data.error || ERROR_FALLBACK);
          return;
        }
        router.push(redirectTo);
        router.refresh();
      } catch {
        setError(ERROR_FALLBACK);
      }
    });
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[radial-gradient(ellipse_at_top,_#F8F4EC_0%,_#FBFBFA_45%,_#EFEAE0_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C2410C' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#E8DFD0] bg-white shadow-sm">
            <ShieldCheck className="h-7 w-7 text-brand" aria-hidden />
          </div>
          <p className="font-display-te text-2xl leading-telugu text-ink sm:text-3xl">
            నాయీ సమాఖ్య తెలంగాణ
          </p>
          <h1 className="mt-3 font-telugu text-lg font-semibold leading-telugu text-ink sm:text-xl">
            రాష్ట్ర &amp; జిల్లా అడ్మిన్ లాగిన్
          </h1>
          <p className="mt-1 text-sm text-muted">
            State &amp; District Leadership Control Desk
          </p>
        </header>

        <section className="rounded-2xl border border-line bg-white/95 p-5 shadow-[0_12px_40px_rgb(15_23_42/0.06)] backdrop-blur-sm sm:p-6">
          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
            >
              <p className="font-telugu leading-telugu">{error}</p>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-pin"
                className="block font-telugu text-sm font-medium leading-telugu text-ink"
              >
                అడ్మిన్ సెక్యూరిటీ పిన్ (Admin Access Passcode)
              </label>
              <div className="relative mt-2">
                <input
                  id="admin-pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="current-password"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="min-h-[48px] w-full rounded-xl border border-line bg-[#FBFBF9] px-4 pr-12 text-base tracking-widest text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="absolute inset-y-0 right-0 inline-flex min-w-[48px] items-center justify-center text-muted hover:text-ink"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? (
                    <EyeOff className="h-5 w-5" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending || !pin.trim()}
              className="tap inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 font-telugu text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              లాగిన్ అవ్వండి (Verify &amp; Enter) ➔
            </button>
          </form>
        </section>

        <p className="mt-8 text-center font-telugu text-xs leading-telugu text-muted">
          ఈ విభాగం కేవలం రాష్ట్ర, జిల్లా మరియు మండల స్థాయి అధికారిక
          సమన్వయకర్తలకు మాత్రమే కేటాయించబడింది.
        </p>
      </div>
    </main>
  );
}
