import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  FileText,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  districtDeskMetrics,
  districtStaticParams,
  getGeoDistrict,
  listUrbanPlaces,
} from "@/data/telanganaGeo";

type Props = {
  params: Promise<{ district: string }>;
};

export function generateStaticParams() {
  return districtStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: slug } = await params;
  const d = getGeoDistrict(slug);
  if (!d) {
    return { title: "District not found | Nayi Samakhya" };
  }
  return {
    title: `${d.nameTe} జిల్లా సేవా డెస్క్ | ${d.nameEn} | Nayi Samakhya`,
    description: `${d.nameTe} — ${d.mandals.length} మండలాలు, HQ ${d.headquarters}. నాయి సమాఖ్య జిల్లా సమన్వయ డెస్క్.`,
    openGraph: {
      title: `${d.nameEn} District Desk — Nayi Samakhya`,
      url: `/districts/${d.slug}`,
    },
  };
}

export default async function DistrictDeskPage({ params }: Props) {
  const { district: slug } = await params;
  const district = getGeoDistrict(slug);
  if (!district) notFound();

  const metrics = districtDeskMetrics(district.slug);
  const towns = listUrbanPlaces(district);
  const petitionHref = `/representation?dist=${encodeURIComponent(district.slug)}`;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] antialiased">
      <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/districts"
            className="civic-focus-ring flex min-h-11 items-center gap-2 rounded-xl px-1"
          >
            <span className="rounded-xl border border-[#B45309]/20 bg-[#B45309]/10 p-2 text-[#B45309]">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-telugu text-sm font-bold text-[#0F172A]">
              జిల్లా డైరెక్టరీ
            </span>
          </Link>
          <nav
            aria-label="Breadcrumb"
            className="font-sans flex flex-wrap items-center gap-1 text-xs text-slate-500"
          >
            <Link href="/" className="civic-focus-ring rounded px-1 hover:text-[#B45309]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link
              href="/districts"
              className="civic-focus-ring rounded px-1 hover:text-[#B45309]"
            >
              Districts
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold text-[#0F172A]">{district.nameEn}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="civic-eyebrow-pill mb-3">District Coordination Desk</span>
            <h1 className="font-display-te text-[1.75rem] font-normal leading-[1.35] text-[#0F172A] sm:text-3xl md:text-4xl">
              {district.nameTe}
            </h1>
            <p className="font-sans mt-1 text-sm font-medium uppercase tracking-widest text-slate-500">
              {district.nameEn} District · {district.zone} · HQ{" "}
              {district.headquarters}
            </p>
            <p className="font-telugu mt-3 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-[#B45309]" aria-hidden />
              జిల్లా కేంద్రం: {district.headquarters}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
            <Link
              href={petitionHref}
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-4 py-2.5 font-telugu text-sm font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.28)]"
            >
              <FileText className="h-4 w-4" aria-hidden />
              జిల్లా వినతిపత్రం
            </Link>
            <a
              href={district.whatsappCorridorUrl}
              target="_blank"
              rel="noreferrer"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#EAD7B5] bg-white px-4 py-2.5 font-telugu text-sm font-semibold text-[#1E293B] hover:border-[#B45309]/40"
            >
              <MessageCircle className="h-4 w-4 text-[#B45309]" aria-hidden />
              WhatsApp కారిడార్
            </a>
          </div>
        </div>

        <section
          aria-label="District metrics"
          className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {[
            {
              label: "మండలాలు",
              value: district.mandals.length,
              icon: MapPin,
            },
            {
              label: "ఓపెన్ పిటిషన్లు",
              value: metrics.openPetitions,
              icon: FileText,
            },
            {
              label: "G.O. 23 క్లెయిమ్స్",
              value: metrics.go23Claims,
              icon: ShieldCheck,
            },
            {
              label: "సమన్వయకర్తలు",
              value: metrics.verifiedCoordinators,
              icon: Users,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-[#EAD7B5]/80 bg-gradient-to-br from-[#FFFDF9] to-[#F5EFE0] p-4"
            >
              <m.icon className="mb-2 h-4 w-4 text-[#B45309]" aria-hidden />
              <p className="font-sans text-2xl font-bold tabular-nums text-[#0F172A]">
                {m.value}
              </p>
              <p className="font-telugu mt-0.5 text-xs text-slate-600">{m.label}</p>
            </div>
          ))}
        </section>

        {towns.length > 0 ? (
          <section className="mb-10" aria-labelledby="towns-heading">
            <h2
              id="towns-heading"
              className="font-display-te mb-3 text-xl font-normal text-[#0F172A]"
            >
              ప్రధాన పట్టణాలు &amp; మున్సిపాలిటీలు
            </h2>
            <ul className="flex flex-wrap gap-2">
              {towns.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/districts/${district.slug}/${t.slug}`}
                    className="civic-focus-ring inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 font-telugu text-xs text-slate-700 hover:border-[#B45309]/40"
                  >
                    <Building2 className="h-3.5 w-3.5 text-[#B45309]" aria-hidden />
                    {t.nameTe}
                    <span className="font-sans text-[10px] uppercase text-slate-400">
                      {t.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="mandals-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <h2
              id="mandals-heading"
              className="font-display-te text-xl font-normal text-[#0F172A] md:text-2xl"
            >
              {district.mandals.length} మండల సేవా డెస్కులు
            </h2>
            <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-500">
              Mandal desks
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {district.mandals.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/districts/${district.slug}/${m.slug}`}
                  className="civic-focus-ring group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#EAD7B5]/70 bg-white px-4 py-3 transition hover:border-[#B45309]/45 hover:bg-[#FFFDF9]"
                >
                  <span className="min-w-0">
                    <span className="font-telugu block truncate text-sm font-semibold text-[#0F172A]">
                      {m.nameTe}
                    </span>
                    <span className="font-sans block truncate text-[11px] text-slate-500">
                      {m.nameEn}
                      {m.type !== "mandal" ? ` · ${m.type}` : ""}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[#B45309] transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
