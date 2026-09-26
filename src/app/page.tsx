import Link from "next/link";
import { FileText, MapPin, Send, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-white">
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[120px]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            <span className="font-telugu">
              {"\u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D (Official Digital Network)"}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            <span className="font-telugu">
              {"\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F"}
            </span>
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text font-telugu text-transparent">
              {"\u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C38\u0C47\u0C35\u0C3E \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D"}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl font-telugu text-sm leading-relaxed text-slate-400 md:text-lg">
            {"\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23 \u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C24\u0C02\u0C17\u0C3E \u0C28\u0C3E\u0C2F\u0C3F \u0C2C\u0C4D\u0C30\u0C3E\u0C39\u0C4D\u0C2E\u0C23, \u0C2E\u0C02\u0C17\u0C32\u0C3F & \u0C2C\u0C1C\u0C02\u0C24\u0C4D\u0C30\u0C3F \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C38\u0C3E\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C24, \u0C38\u0C02\u0C15\u0C4D\u0C37\u0C47\u0C2E\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C32 \u0C2A\u0C30\u0C3F\u0C37\u0C4D\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C0F\u0C30\u0C4D\u0C2A\u0C3E\u0C1F\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C28 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <a
              href="https://t.me/NayiSamakhyaDeskBot"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 hover:bg-amber-400 active:scale-95 sm:w-auto"
            >
              <Send className="h-4 w-4" aria-hidden />
              <span className="font-telugu">
                {"\u0C13\u0C2A\u0C46\u0C28\u0C4D \u0C38\u0C47\u0C35\u0C3E \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D (Telegram)"}
              </span>
            </a>

            <Link
              href="/feed"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
            >
              <MapPin className="h-4 w-4 text-amber-400" aria-hidden />
              <span className="font-telugu">
                {"\u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37 \u0C2B\u0C40\u0C21\u0C4D (View Feed)"}
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs text-slate-500">
            <Link
              href="/representation"
              className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-amber-400"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              <span className="font-telugu">
                {"\u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02"}
              </span>
            </Link>
            <Link
              href="/mandals"
              className="font-telugu text-slate-400 transition hover:text-amber-400"
            >
              {"\u0C2E\u0C02\u0C21\u0C32 \u0C21\u0C48\u0C30\u0C46\u0C15\u0C4D\u0C1F\u0C30\u0C40"}
            </Link>
            <Link
              href="/announce"
              className="font-telugu text-slate-400 transition hover:text-amber-400"
            >
              {"\u0C2C\u0C4D\u0C30\u0C3E\u0C21\u0C4D\u200C\u0C15\u0C3E\u0C38\u0C4D\u0C1F\u0C4D & SOP"}
            </Link>
            <Link
              href="/twa"
              className="text-slate-400 transition hover:text-amber-400"
            >
              Mini App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
