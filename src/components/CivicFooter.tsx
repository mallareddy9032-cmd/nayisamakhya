"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Users,
  ExternalLink,
  Lock,
  Send,
  MapPin,
  Mail,
  Phone,
  Home,
  ScrollText,
  Newspaper,
  ClipboardList,
  Landmark,
  BookOpen,
  Image as ImageIcon,
  MessageCircle,
  IdCard,
  Bot,
  LayoutGrid,
  ChevronRight,
  Trophy,
  Clapperboard,
  Scale,
  Scissors,
  Zap,
} from "lucide-react";
import { BrandCrest } from "@/components/brand/BrandCrest";
import { useLanguage } from "@/context/LanguageContext";
import { TELEGRAM_BOT_URL } from "@/lib/data/communityAnnounce";

const WA_HELP = "https://wa.me/919032654111";
const HELPLINE_DISPLAY = "+91 9032654111";
const CONTACT_EMAIL = "contact@nayisamakhya.org";

function FooterNavLink({
  href,
  children,
  icon: Icon,
  external = false,
}: {
  href: string;
  children: ReactNode;
  icon: typeof Home;
  external?: boolean;
}) {
  const className =
    "civic-focus-ring group inline-flex items-start gap-1.5 text-sm leading-relaxed text-slate-700 transition-colors hover:text-amber-700";

  const content = (
    <>
      <Icon
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-amber-700"
        aria-hidden
      />
      <span className="min-w-0 text-pretty transition-transform duration-200 group-hover:translate-x-0.5">
        {children}
      </span>
      {external ? (
        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" aria-hidden />
      ) : (
        <ChevronRight
          className="mt-0.5 h-3 w-3 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function FooterColHeading({
  icon: Icon,
  label,
  isTe,
}: {
  icon: typeof Home;
  label: string;
  isTe: boolean;
}) {
  return (
    <h3
      className={`mb-3 flex min-h-[2.75rem] items-start gap-1.5 border-b border-slate-200/70 pb-2 text-xs font-bold tracking-wider text-civic-ink ${
        isTe ? "font-telugu" : "font-sans"
      }`}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-civic-bronze" aria-hidden />
      <span className="min-w-0 leading-snug">
        <span className="block">{label}</span>
      </span>
    </h3>
  );
}

const contactPillClass =
  "civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs text-slate-700 shadow-xs transition-colors hover:border-amber-300 hover:bg-amber-50/60 hover:text-amber-800";

export function CivicFooter() {
  const pathname = usePathname() || "";
  const year = new Date().getFullYear();
  const { language, t } = useLanguage();
  const isTe = language === "te";

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
    <footer className="no-print mt-auto border-t border-slate-200 bg-[#F8F7F4] font-sans text-slate-700 print:hidden pb-nav-clear md:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="space-y-3">
                        <div className="flex min-h-[2.75rem] items-center gap-2.5 border-b border-transparent pb-2">
              <BrandCrest size="lg" />
              <span
                className={`whitespace-nowrap text-sm font-normal leading-none text-civic-ink ${
                  isTe ? "font-display-te" : "font-sans font-semibold"
                }`}
              >
                {t("brandSub")}
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed text-slate-600 ${
                isTe ? "font-telugu" : "font-sans"
              }`}
            >
              {t("footerBrandBlurb")}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white/60 px-2.5 py-1 font-telugu text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
              <span>33 districts • 589 mandals</span>
            </div>
          </div>

          {/* Col 2 — Public services */}
          <div>
            <FooterColHeading
              icon={FileText}
              label={t("footerColServices")}
              isTe={isTe}
            />
            <ul className={`space-y-2.5 ${isTe ? "font-telugu" : "font-sans"}`}>
              <li>
                <FooterNavLink href="/" icon={Home}>
                  Home
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/representation" icon={ScrollText}>
                  Petition
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/grievance" icon={Zap}>
                  {isTe ? t("navGrievance") : "G.O. 23 Grievance Docket"}
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/feed" icon={Newspaper}>
                  {t("navGazette")}
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/survey" icon={ClipboardList}>
                  Survey
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/districts" icon={Landmark}>
                  Districts
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/history" icon={BookOpen}>
                  History
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/salon-hub" icon={Scissors}>
                  {t("navSalonHub")}
                </FooterNavLink>
              </li>
            </ul>
          </div>

          {/* Col 3 — Coordinators */}
          <div>
            <FooterColHeading
              icon={Users}
              label={t("footerColCoordinators")}
              isTe={isTe}
            />
            <ul className={`space-y-2.5 ${isTe ? "font-telugu" : "font-sans"}`}>
              <li>
                <FooterNavLink href="/poster" icon={ImageIcon}>
                  Wall Poster
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/announce" icon={MessageCircle}>
                  WhatsApp Mobilization
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/sprint" icon={Trophy}>
                  సేవా సారథి ఛాలెంజ్
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/quiz" icon={Scale}>
                  లీగల్ క్విజ్
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/reels" icon={Clapperboard}>
                  మన కళ రీల్స్
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/coordinator-card" icon={IdCard}>
                  Coordinator Card
                </FooterNavLink>
              </li>
            </ul>
          </div>

          {/* Col 4 — Desk & admin */}
          <div>
            <FooterColHeading
              icon={Send}
              label={t("footerColDesk")}
              isTe={isTe}
            />
            <ul className={`space-y-2.5 ${isTe ? "font-telugu" : "font-sans"}`}>
              <li>
                <FooterNavLink href={TELEGRAM_BOT_URL} icon={Bot} external>
                  Telegram Bot
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/twa" icon={LayoutGrid}>
                  Mini App Hub
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/admin/moderation" icon={Lock}>
                  Moderation Desk
                </FooterNavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — contact pills + legal */}
        <div className="mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={WA_HELP}
                target="_blank"
                rel="noreferrer"
                className={contactPillClass}
              >
                <Phone className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                <span className="font-medium">WhatsApp helpline</span>
                <span className="text-slate-500">{HELPLINE_DISPLAY}</span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className={contactPillClass}>
                <Mail className="h-3.5 w-3.5 text-civic-bronze" aria-hidden />
                <span className="font-medium">{CONTACT_EMAIL}</span>
              </a>
              <span className={`${contactPillClass} cursor-default hover:border-slate-200 hover:bg-white/80 hover:text-slate-700`}>
                <MapPin className="h-3.5 w-3.5 shrink-0 text-civic-bronze" aria-hidden />
                <span className="font-medium">HQ Hyderabad</span>
              </span>
            </div>

            <nav
              className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:justify-end"
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
                href="/grievance"
                className="civic-focus-ring transition-colors hover:text-amber-700"
              >
                G.O. 23 Grievance
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link
                href="/admin/desk"
                className="civic-focus-ring inline-flex items-center gap-1 transition-colors hover:text-amber-700"
              >
                <Lock className="h-3 w-3 shrink-0 text-slate-400" aria-hidden />
                Admin Login
              </Link>
            </nav>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-slate-200/50 pt-4 pb-2 sm:flex-row sm:items-center md:pb-4">
            <p className={`leading-telugu ${isTe ? "font-telugu" : "font-sans"}`}>
              {t("footerCopyright", { year })}
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
