"use client";

import Link from "next/link";
import { Activity, Building2, Users } from "lucide-react";
import type { UrbanPortal } from "@/lib/data/urbanRepository";
import { RepresentativeCard } from "@/components/RepresentativeCard";
import { TelegramQRCard } from "@/components/TelegramQRCard";
import { useLanguageStore } from "@/lib/store/preferences";

type Props = {
  portal: UrbanPortal;
};

export function UrbanPortalClient({ portal }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const { district, ulb, representatives, establishments } = portal;
  const areaName = te ? ulb.name_te : ulb.name_en;

  const metrics = [
    {
      id: "coords",
      icon: Users,
      label: te ? "టౌన్ సమన్వయకర్తలు" : "Town coordinators",
      value: String(ulb.town_coordinators_count || representatives.length),
    },
    {
      id: "shops",
      icon: Building2,
      label: te ? "నమోదైన సంస్థలు" : "Registered establishments",
      value: String(
        ulb.registered_establishments_count || establishments.length,
      ),
    },
    {
      id: "welfare",
      icon: Activity,
      label: te ? "సంక్షేమ మద్దతు" : "Welfare support",
      value: ulb.welfare_support_active
        ? te
          ? "క్రియాశీలం"
          : "Active"
        : te
          ? "నిలిపివేయబడింది"
          : "Paused",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBF9]">
      <section className="border-b border-[#EBE8E0] bg-gradient-to-b from-[#FFF7ED] to-[#FBFBF9]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href={`/${district.slug}`}
            className={`text-xs text-[#71717A] hover:text-[#C2410C] ${te ? "font-telugu" : ""}`}
          >
            {te
              ? `← ${district.name_te} డైరెక్టరీ`
              : `← ${district.name_en} directory`}
          </Link>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="font-telugu">పౌర సేవా కేంద్రం</span>
            <span>/</span>
            <span>Civic service hub</span>
          </div>

          <h1
            className={`mt-3 text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl ${te ? "font-telugu" : ""}`}
          >
            {te ? ulb.name_te : ulb.name_en}
          </h1>
          <p
            className={`mt-2 max-w-2xl text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
          >
            {te ? district.name_te : district.name_en}
            {" · "}
            {te ? "పట్టణ స్థానిక సంస్థ" : "Urban local body"}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[#EBE8E0] bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-2 text-[#C2410C]">
                  <m.icon className="h-4 w-4" aria-hidden />
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wide text-[#71717A] ${te ? "font-telugu" : ""}`}
                  >
                    {m.label}
                  </p>
                </div>
                <p className="mt-1 text-2xl font-bold text-[#18181B]">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <section>
            <h2
              className={`text-xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
            >
              {te
                ? "సమన్వయకర్తలు & సేవా ప్రతినిధులు"
                : "Coordinators & Seva Representatives"}
            </h2>
            <div className="mt-4 space-y-3">
              {representatives.length === 0 ? (
                <p
                  className={`rounded-2xl border border-dashed border-[#EBE8E0] bg-white p-6 text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
                >
                  {te
                    ? "ఇంకా సమన్వయకర్తలు నమోదు కాలేదు."
                    : "No coordinators registered yet."}
                </p>
              ) : (
                representatives.map((rep, idx) => (
                  <RepresentativeCard
                    key={`${rep.phone}-${idx}`}
                    name_en={rep.name_en}
                    name_te={rep.name_te}
                    designation_en={rep.designation_en}
                    designation_te={rep.designation_te}
                    phone={rep.phone}
                    photo_url={rep.photo_url}
                    area_name={areaName}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <h2
              className={`text-xl font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
            >
              {te ? "నమోదైన సంస్థలు" : "Registered establishments"}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {establishments.length === 0 ? (
                <li
                  className={`col-span-full rounded-2xl border border-dashed border-[#EBE8E0] bg-white p-6 text-sm text-[#71717A] ${te ? "font-telugu" : ""}`}
                >
                  {te
                    ? "సంస్థల జాబితా సీడ్ కావాలి."
                    : "Establishment list pending seed."}
                </li>
              ) : (
                establishments.map((est, idx) => (
                  <li
                    key={`${est.name_en}-${idx}`}
                    className="rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C2410C]">
                      {te ? est.category_te : est.category_en}
                    </p>
                    <h3
                      className={`mt-1 text-base font-semibold text-[#18181B] ${te ? "font-telugu" : ""}`}
                    >
                      {te ? est.name_te : est.name_en}
                    </h3>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <TelegramQRCard contextLabel={areaName} sticky />
      </div>
    </div>
  );
}
