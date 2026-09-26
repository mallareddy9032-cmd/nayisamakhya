"use client";

import Link from "next/link";
import { MessageCircle, Send, Share2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const VISITOR_DIGITS = "73557662".split("");

const MAP_EMBED =
  "https://maps.google.com/maps?q=Telangana+Secretariat+Hyderabad&t=&z=14&ie=UTF8&iwloc=&output=embed";

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-950/50 text-white hover:border-emerald-400 hover:text-emerald-300"
    >
      {children}
    </a>
  );
}

export function CivicFooter() {
  const { language, t } = useLanguage();
  const year = new Date().getFullYear();

  const directories = [
    { href: "/mandals", label: t("footerStatewide") },
    { href: "/verticals/welfare", label: t("footerWelfarePortals") },
    { href: "/verticals/education", label: t("footerBcCirculars") },
    { href: "/verticals/go-library", label: t("footerGoLibrary") },
  ];

  const policies = [
    { href: "/policies/hyperlinking", label: t("footerHyperlink") },
    { href: "/policies/privacy", label: t("footerPrivacy") },
    { href: "/policies/terms", label: t("footerTerms") },
    { href: "/sitemap", label: t("footerSitemap") },
  ];

  return (
    <footer
      className="no-print mt-16 bg-[#0B1320]/90 bg-cover bg-center bg-blend-multiply text-slate-200"
      style={{
        backgroundImage:
          "linear-gradient(rgba(11,19,32,0.92), rgba(11,19,32,0.94)), url(https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1600)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3
            className={`border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-white ${language === "te" ? "font-telugu" : ""}`}
          >
            {t("footerOffice")}
          </h3>
          <p
            className={`mt-4 text-sm leading-relaxed text-slate-300 ${language === "te" ? "font-telugu" : ""}`}
          >
            {t("footerAddress")}
          </p>
          <p className="mt-3 text-sm">
            <a className="hover:text-white" href="mailto:contact@nayisamakhya.org">
              contact@nayisamakhya.org
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:text-white" href="tel:1800NAYISEVA">
              1800-NAYI-SEVA
            </a>
          </p>
          <p className={`mt-3 text-xs text-slate-400 ${language === "te" ? "font-telugu" : ""}`}>
            {t("footerLastUpdated")}: 24-09-2026
          </p>
          <div className="mt-4">
            <p className={`mb-2 text-[11px] uppercase tracking-wide text-slate-400 ${language === "te" ? "font-telugu normal-case" : ""}`}>
              {t("footerVisitors")}
            </p>
            <div className="flex flex-wrap gap-1" aria-label={`${t("footerVisitors")}: 73557662`}>
              {VISITOR_DIGITS.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className="metric-tnum inline-flex h-8 w-7 items-center justify-center rounded border border-slate-600 bg-slate-950/70 text-sm font-bold text-white"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3
            className={`border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-white ${language === "te" ? "font-telugu" : ""}`}
          >
            {t("footerMap")}
          </h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/40 shadow-lg">
            <iframe
              title="Telangana Secretariat, Hyderabad"
              src={MAP_EMBED}
              className="h-40 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://maps.google.com/?q=Telangana+Secretariat+Hyderabad"
              target="_blank"
              rel="noreferrer"
              className="inline-flex m-3 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500"
            >
              {t("footerMapsLink")}
            </a>
          </div>
        </div>

        <div>
          <h3
            className={`border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-white ${language === "te" ? "font-telugu" : ""}`}
          >
            {t("footerDirectories")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {directories.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-2 hover:text-white ${language === "te" ? "font-telugu" : ""}`}
                >
                  <span className="text-emerald-400" aria-hidden>
                    ›
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3
            className={`border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-white ${language === "te" ? "font-telugu" : ""}`}
          >
            {t("footerPolicies")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {policies.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`hover:text-white ${language === "te" ? "font-telugu" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <SocialIcon href="https://wa.me/919876543210" label="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://t.me/nayi_samakhya_demo" label="Telegram">
              <Send className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" label="YouTube">
              <Share2 className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://x.com" label="X">
              <X className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://facebook.com" label="Facebook">
              <span className="text-xs font-bold">f</span>
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className={language === "te" ? "font-telugu" : ""}>
            {t("footerCopyright", { year })}
          </p>
          <p className={`max-w-xl ${language === "te" ? "font-telugu" : ""}`}>
            {t("footerDisclaimer")}
          </p>
          <p>#NayiSamakhya #PrajaSamakhya #BCWelfare</p>
        </div>
      </div>
    </footer>
  );
}
