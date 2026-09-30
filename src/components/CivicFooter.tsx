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
    <footer className="no-print mt-auto border-t border-civic-border bg-white font-sans text-xs text-slate-600 print:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-civic-bronze/20 bg-civic-bronze/10 p-1.5 text-civic-bronze">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-display-te text-sm font-normal text-civic-ink">
              నాయి సమాఖ్య తెలంగాణ
            </span>
          </div>
          <p className="font-telugu text-[11px] leading-relaxed text-slate-500">
            తెలంగాణ రాష్ట్రవ్యాప్తంగా నాయి బ్రాహ్మణ, మంగలి &amp; బజంత్రి కమ్యూనిటీ
            సంక్షేమం, ప్రజా ప్రాతినిధ్యం మరియు క్షేత్రస్థాయి సమస్యల పరిష్కారం కొరకు
            రూపొందించబడిన అధికారిక వేదిక.
          </p>
          <div className="flex items-center gap-1.5 pt-1 font-telugu text-[11px] text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-civic-bronze" />
            <span>33 జిల్లాలు • 589 మండలాలు</span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <FileText className="h-3.5 w-3.5 text-civic-bronze" />
            ప్రజా సేవలు &amp; వినతులు
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <Link
                href="/"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                ప్రధాన పోర్టల్ (Home)
              </Link>
            </li>
            <li>
              <Link
                href="/representation"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                చట్టబద్ధ వినతిపత్రం (Legal Petition)
              </Link>
            </li>
            <li>
              <Link
                href="/feed"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                గెజిట్ &amp; జీవోలు (Gazette)
              </Link>
            </li>
            <li>
              <Link
                href="/survey"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                సమగ్ర సర్వే (Survey)
              </Link>
            </li>
            <li>
              <Link
                href="/districts"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                జిల్లాల సమాచారం (Districts)
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                చారిత్రక ప్రస్థానం (Heritage &amp; History)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <Users className="h-3.5 w-3.5 text-civic-bronze" />
            సమన్వయకర్తల విభాగం
            <span className="font-sans text-[10px] font-semibold normal-case tracking-wide text-slate-500">
              • FOR COORDINATORS
            </span>
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <Link
                href="/poster"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                సెలూన్ వాల్ పోస్టర్ (Wall Poster)
              </Link>
            </li>
            <li>
              <Link
                href="/announce"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                WhatsApp మొబిలైజేషన్
              </Link>
            </li>
            <li>
              <Link
                href="/coordinator-card"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                సమన్వయకర్త కార్డు
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <Send className="h-3.5 w-3.5 text-civic-bronze" />
            సేవా డెస్క్ &amp; అడ్మిన్
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between font-semibold text-civic-ink hover:text-civic-bronze"
              >
                <span>టెలిగ్రామ్ బాట్ (@NayiSamakhyaDeskBot)</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </li>
            <li>
              <Link
                href="/twa"
                className="civic-focus-ring flex min-h-10 items-center rounded-lg px-1 py-2 hover:text-civic-bronze"
              >
                టెలిగ్రామ్ Mini App హబ్
              </Link>
            </li>
            <li>
              <Link
                href="/admin/desk"
                className="flex items-center gap-1 text-slate-600 hover:text-civic-bronze"
              >
                <Lock className="h-3 w-3 text-slate-400" />
                అడ్మిన్ డెస్క్ &amp; అనలిటిక్స్
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-civic-border bg-[#F4F2EB] px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <a
                href={WA_HELP}
                target="_blank"
                rel="noreferrer"
                className="civic-focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg font-telugu text-[12px] font-semibold text-civic-navy hover:text-civic-bronze"
              >
                <Phone className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                Helpline {HELPLINE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="civic-focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg font-sans text-[12px] font-semibold text-civic-navy hover:text-civic-bronze"
              >
                <Mail className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                {CONTACT_EMAIL}
              </a>
            </div>
            <nav
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-600"
              aria-label="Legal"
            >
              <Link
                href="/policies/privacy"
                className="civic-focus-ring rounded hover:text-civic-bronze"
              >
                Privacy
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/policies/terms"
                className="civic-focus-ring rounded hover:text-civic-bronze"
              >
                Terms
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/admin/moderation"
                className="civic-focus-ring inline-flex items-center gap-1 rounded hover:text-civic-bronze"
              >
                <Lock className="h-3 w-3 text-slate-400" aria-hidden />
                Admin Moderation Desk
              </Link>
            </nav>
          </div>

          <p className="font-telugu text-[11px] leading-relaxed text-slate-500">
            G.O. Ms. No. 23 &amp; Telangana Municipalities Act 2019 Civic Portal
          </p>

          <div className="flex flex-col items-start justify-between gap-2 border-t border-civic-border/80 pt-3 text-[11px] text-slate-500 sm:flex-row sm:items-center">
            <p className="font-telugu">
              © {year} నాయి సమాఖ్య తెలంగాణ. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-sans font-medium text-slate-600">
                nayisamakhya.org
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CivicFooter;
