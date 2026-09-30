"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Users,
  ExternalLink,
  Lock,
  Send,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { TELEGRAM_BOT_URL } from "@/lib/data/communityAnnounce";

const WA_HELP = "https://wa.me/919032654111";
const HELPLINE_DISPLAY = "+91 9032654111";
const CONTACT_EMAIL = "contact@nayisamakhya.org";

const linkClass =
  "civic-focus-ring text-sm leading-relaxed text-slate-700 transition-colors hover:text-amber-700";

export function CivicFooter() {
  const pathname = usePathname() || "";
  const year = new Date().getFullYear();

  // Full-bleed tool surfaces — no light sitemap under dark/print/TWA chrome.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/announce") ||
    pathname.startsWith("/twa") ||
    pathname.startsWith("/poster")
  ) {
    return null;
  }

  return (
    <footer className="no-print mt-auto border-t border-slate-200 bg-[#F8F7F4] font-sans text-slate-700 print:hidden">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Col 1 — Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-civic-bronze/20 bg-civic-bronze/10 p-1.5 text-civic-bronze">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="font-display-te text-sm font-normal text-civic-ink">
                నాయి సమాఖ్య తెలంగాణ
              </span>
            </div>
            <p className="font-telugu text-sm leading-relaxed text-slate-600">
              తెలంగాణ రాష్ట్రవ్యాప్తంగా నాయి బ్రాహ్మణ, మంగలి &amp; బజంత్రి కమ్యూనిటీ
              సంక్షేమం, ప్రజా ప్రాతినిధ్యం మరియు క్షేత్రస్థాయి సమస్యల పరిష్కారం కొరకు
              రూపొందించబడిన అధికారిక వేదిక.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white/60 px-2.5 py-1 font-telugu text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              <span>33 districts • 589 mandals</span>
            </div>
          </div>

          {/* Col 2 — Public services */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5 font-telugu text-xs font-bold tracking-wider text-civic-ink">
              <FileText className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              ప్రజా సేవలు &amp; వినతులు
            </h3>
            <ul className="space-y-2 font-telugu">
              <li>
                <Link href="/" className={linkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/representation" className={linkClass}>
                  Petition
                </Link>
              </li>
              <li>
                <Link href="/feed" className={linkClass}>
                  Gazette
                </Link>
              </li>
              <li>
                <Link href="/survey" className={linkClass}>
                  Survey
                </Link>
              </li>
              <li>
                <Link href="/districts" className={linkClass}>
                  Districts
                </Link>
              </li>
              <li>
                <Link href="/history" className={linkClass}>
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Coordinators */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5 font-telugu text-xs font-bold tracking-wider text-civic-ink">
              <Users className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              సమన్వయకర్తల విభాగం • COORDINATORS
            </h3>
            <ul className="space-y-2 font-telugu">
              <li>
                <Link href="/poster" className={linkClass}>
                  Wall Poster
                </Link>
              </li>
              <li>
                <Link href="/announce" className={linkClass}>
                  WhatsApp Mobilization
                </Link>
              </li>
              <li>
                <Link href="/coordinator-card" className={linkClass}>
                  Coordinator Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Desk & admin */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5 font-telugu text-xs font-bold tracking-wider text-civic-ink">
              <Send className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              సేవా డెస్క్ &amp; అడ్మిన్
            </h3>
            <ul className="space-y-2 font-telugu">
              <li>
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkClass} inline-flex items-center gap-1.5`}
                >
                  Telegram Bot
                  <ExternalLink className="h-3 w-3 text-slate-400" aria-hidden />
                </a>
              </li>
              <li>
                <Link href="/twa" className={linkClass}>
                  Mini App Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/moderation"
                  className={`${linkClass} inline-flex items-center gap-1.5`}
                >
                  <Lock className="h-3 w-3 text-slate-400" aria-hidden />
                  Moderation Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — same container */}
        <div className="mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={WA_HELP}
                target="_blank"
                rel="noreferrer"
                className="civic-focus-ring inline-flex items-center gap-1.5 transition-colors hover:text-amber-700"
              >
                <Phone className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                WhatsApp helpline {HELPLINE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="civic-focus-ring inline-flex items-center gap-1.5 transition-colors hover:text-amber-700"
              >
                <Mail className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-civic-bronze" aria-hidden />
                Hub: Hyderabad
              </span>
            </div>

            <nav
              className="flex flex-wrap items-center gap-x-2 gap-y-1 lg:justify-end"
              aria-label="Legal and admin"
            >
              <Link
                href="/policies/privacy"
                className="civic-focus-ring transition-colors hover:text-amber-700"
              >
                Privacy
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/policies/terms"
                className="civic-focus-ring transition-colors hover:text-amber-700"
              >
                Terms
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/representation?subject=go23_free_power"
                className="civic-focus-ring transition-colors hover:text-amber-700"
              >
                G.O. 23 Reference
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/admin/desk"
                className="civic-focus-ring inline-flex items-center gap-1 transition-colors hover:text-amber-700"
              >
                <Lock className="h-3 w-3 text-slate-400" aria-hidden />
                Admin Login
              </Link>
            </nav>
          </div>

          <div className="mt-3 flex flex-col items-start justify-between gap-2 pb-4 sm:flex-row sm:items-center">
            <p className="font-telugu">
              © {year} నాయి సమాఖ్య తెలంగాణ. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/50 px-2.5 py-0.5 font-sans font-medium text-slate-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              nayisamakhya.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CivicFooter;
