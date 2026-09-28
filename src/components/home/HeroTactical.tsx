"use client";

import Link from "next/link";
import { SosButton } from "@/components/layout/SosButton";
import { t } from "@/lib/i18n/dictionary";
import { getMandal } from "@/lib/data/mandals";
import { useLanguageStore, useMandalPrefStore } from "@/lib/store/preferences";
import { FadeItem, Stagger } from "@/components/motion/primitives";

export function HeroTactical() {
  const lang = useLanguageStore((s) => s.lang);
  const districtSlug = useMandalPrefStore((s) => s.districtSlug);
  const mandalSlug = useMandalPrefStore((s) => s.mandalSlug);
  const mandal = getMandal(districtSlug, mandalSlug);

  return (
    <section className="civic-hero-surface px-4 pb-8 pt-6" id="home">
      <div className="mx-auto max-w-6xl">
        <Stagger>
          <FadeItem>
            <p
              className={`text-xs font-medium tracking-wide text-slate-500 ${lang === "te" ? "font-telugu" : ""}`}
            >
              {t("heroEyebrow", lang)}
            </p>
            <h1
              className={`mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl ${lang === "te" ? "font-telugu leading-[1.8]" : ""}`}
            >
              {t("heroTitle", lang)}
            </h1>
            <p
              className={`mt-3 max-w-2xl text-base text-slate-600 ${lang === "te" ? "font-telugu leading-[1.8]" : "leading-relaxed"}`}
            >
              {t("heroBody", lang)}
            </p>
          </FadeItem>

          <FadeItem>
            <div
              id="sos"
              className="mt-5 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 p-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className={`text-sm font-semibold text-red-700 ${lang === "te" ? "font-telugu" : ""}`}
                >
                  {t("incidentSos", lang)}
                </p>
                <SosButton className="w-full bg-gradient-sos sm:w-auto" />
              </div>
            </div>
          </FadeItem>

          <FadeItem>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href={mandal?.surveyPath ?? "/suryapet/kodad/survey"}
                className={`tap inline-flex items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95 ${lang === "te" ? "font-telugu" : ""}`}
              >
                {t("startSurvey", lang)}
              </Link>
              <a
                href="#electricity"
                className={`tap inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50 ${lang === "te" ? "font-telugu" : ""}`}
              >
                {t("discomForm", lang)}
              </a>
            </div>
          </FadeItem>
        </Stagger>
      </div>
    </section>
  );
}
