"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { mandals } from "@/lib/data/mandals";
import { loc } from "@/lib/i18n/dictionary";

const verticals = [
  { href: "/verticals/welfare", te: "సంక్షేమం", en: "Welfare" },
  { href: "/verticals/education", te: "విద్య", en: "Education" },
  { href: "/verticals/livelihood", te: "జీవనోపాధి", en: "Livelihood" },
  { href: "/verticals/bajantri", te: "భజంత్రి", en: "Bajantri" },
  { href: "/verticals/matrimonial", te: "వివాహ సేవ", en: "Matrimonial" },
  { href: "/verticals/gallery", te: "గ్యాలరీ", en: "Gallery" },
  { href: "/verticals/go-library", te: "జి.ఓ. లైబ్రరీ", en: "G.O. Library" },
];

export default function SitemapPage() {
  const { language } = useLanguage();
  const te = language === "te";

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className={`text-xs text-[#71717A] hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}
      >
        {te ? "← హోమ్" : "← Home"}
      </Link>
      <h1 className={`mt-4 text-2xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}>
        {te ? "సైట్‌మ్యాప్" : "Sitemap"}
      </h1>

      <div className="mt-6 space-y-6 rounded-2xl border border-[#EBE8E0] bg-white p-6 shadow-sm">
        <div>
          <h2 className={`text-sm font-semibold text-[#C2410C] ${te ? "font-telugu" : ""}`}>
            {te ? "ప్రధానం" : "Primary"}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-[#C2410C]">
                {te ? "హోమ్" : "Home"}
              </Link>
            </li>
            <li>
              <Link href="/mandals" className="hover:text-[#C2410C]">
                {te ? "మండల కేంద్రాలు" : "Mandal hubs"}
              </Link>
            </li>
            <li>
              <Link href="/representation" className="hover:text-[#C2410C]">
                {te ? "వినతి పత్రం" : "Representation letter"}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={`text-sm font-semibold text-[#C2410C] ${te ? "font-telugu" : ""}`}>
            {te ? "విభాగాలు" : "Verticals"}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {verticals.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className={`hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}>
                  {te ? v.te : v.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={`text-sm font-semibold text-[#C2410C] ${te ? "font-telugu" : ""}`}>
            {te ? "మండలాలు" : "Mandals"}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {mandals.map((m) => (
              <li key={m.path}>
                <Link href={m.path} className={`hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}>
                  {loc(m.district, language)} · {loc(m.mandal, language)}
                </Link>
                {" · "}
                <Link href={m.surveyPath} className="text-[#71717A] hover:text-[#C2410C]">
                  {te ? "సర్వే" : "Survey"}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={`text-sm font-semibold text-[#C2410C] ${te ? "font-telugu" : ""}`}>
            {te ? "విధానాలు" : "Policies"}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <Link href="/policies/privacy" className="hover:text-[#C2410C]">
                {te ? "గోప్యత" : "Privacy"}
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-[#C2410C]">
                {te ? "నిబంధనలు" : "Terms"}
              </Link>
            </li>
            <li>
              <Link href="/policies/hyperlinking" className="hover:text-[#C2410C]">
                {te ? "హైపర్‌లింకింగ్" : "Hyperlinking"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
