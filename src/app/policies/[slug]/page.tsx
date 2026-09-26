"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
  privacy: {
    title: { te: "గోప్యతా విధానం", en: "Privacy Policy" },
    body: {
      te: "నాయీ సమాఖ్య పోర్టల్ కుటుంబ సర్వే, వినతి మరియు డైరెక్టరీ సేవల కోసం అవసరమైన వ్యక్తిగత వివరాలను మాత్రమే సేకరిస్తుంది. డేటా సమాజ సంక్షేమ సమన్వయం కోసం మాత్రమే ఉపయోగించబడుతుంది; మూడవ పక్ష విక్రయం జరగదు. ప్రశ్నలకు contact@nayisamakhya.orgకి రాయండి.",
      en: "The Nayi Samakhya portal collects only the personal details needed for family survey, grievance, and directory services. Data is used solely for community welfare coordination and is not sold to third parties. Write to contact@nayisamakhya.org with questions.",
    },
  },
  terms: {
    title: { te: "నిబంధనలు & షరతులు", en: "Terms of Use" },
    body: {
      te: "ఈ వేదిక సమాజ సమాచారం మరియు సంక్షేమ మార్గదర్శకం కోసం. చాట్‌బాట్ / స్టేటస్ స్క్రీన్‌లు డెమో స్పందనలు కావచ్చు — అధికారిక DISCOM లేదా ప్రభుత్వ రికార్డులకు మండల అధికారిని సంప్రదించండి. సేవలు మారవచ్చు.",
      en: "This portal provides community information and welfare guidance. Chatbot and status screens may show demo responses — confirm official DISCOM or government records with your mandal officer. Services may change without notice.",
    },
  },
  hyperlinking: {
    title: { te: "హైపర్‌లింకింగ్ విధానం", en: "Hyperlinking Policy" },
    body: {
      te: "బయటి సైట్లకు లింకులు సౌకర్యం కోసం మాత్రమే. నాయీ సమాఖ్య ఆ సైట్ల కంటెంట్ లేదా గోప్యతా పద్ధతులకు బాధ్యత వహించదు. అధికారిక లింక్ అభ్యర్థనలకు contact@nayisamakhya.org.",
      en: "Outbound links are for convenience only. Nayi Samakhya is not responsible for third-party content or privacy practices. Request official linking via contact@nayisamakhya.org.",
    },
  },
} as const;

export default function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const te = language === "te";
  if (!(slug in copy)) {
    notFound();
  }
  const page = copy[slug as keyof typeof copy];

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className={`text-xs text-[#71717A] hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}
      >
        {te ? "← హోమ్" : "← Home"}
      </Link>
      <article className="mt-4 rounded-2xl border border-[#EBE8E0] bg-white p-6 shadow-sm sm:p-8">
        <h1 className={`text-2xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}>
          {te ? page.title.te : page.title.en}
        </h1>
        <p className={`mt-4 text-sm leading-relaxed text-[#71717A] ${te ? "font-telugu" : ""}`}>
          {te ? page.body.te : page.body.en}
        </p>
        <p className="mt-6 text-xs text-[#A1A1AA]">Last updated: 24-09-2026</p>
      </article>
    </section>
  );
}
