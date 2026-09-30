import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  FileText,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  getGeoDistrict,
  getGeoMandal,
  mandalCoordinatorBadge,
  mandalDeskMetrics,
  mandalStaticParams,
} from "@/data/telanganaGeo";
import { resolveRegionalHubForDistrict } from "@/config/communityHubs";

type Props = {
  params: Promise<{ district: string; mandal: string }>;
};

export function generateStaticParams() {
  return mandalStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: dSlug, mandal: mSlug } = await params;
  const district = getGeoDistrict(dSlug);
  const mandal = getGeoMandal(dSlug, mSlug);
  if (!district || !mandal) {
    return { title: "Mandal desk not found | Nayi Samakhya" };
  }
  return {
    title: `${mandal.nameTe} నాయీ సమాఖ్య అధికారిక సేవా డెస్క్ | ${mandal.nameEn}`,
    description: `${mandal.nameTe}, ${district.nameTe} — ధృవీకృత సమన్వయకర్త, 1-క్లిక్ వినతిపత్రం, WhatsApp కారిడార్.`,
    openGraph: {
      title: `${mandal.nameEn} Service Desk — Nayi Samakhya`,
      url: `/districts/${district.slug}/${mandal.slug}`,
    },
  };
}

export default async function MandalDeskPage({ params }: Props) {
  const { district: dSlug, mandal: mSlug } = await params;
  const district = getGeoDistrict(dSlug);
  const mandal = getGeoMandal(dSlug, mSlug);
  if (!district || !mandal) notFound();

  const badge = mandalCoordinatorBadge(district, mandal);
  const metrics = mandalDeskMetrics(district.slug, mandal.slug);
  const hub = resolveRegionalHubForDistrict(district.slug);
  const isTownLike =
    /urban|municipality|town|corporation|nagar/i.test(mandal.slug) ||
    /అర్బన్|మున్సిప|పట్టణ|కార్పొరేషన్/.test(mandal.nameTe);
  const placeKindTe = isTownLike ? "పట్టణం" : "మండలం";

  const petitionHref = `/representation?dist=${encodeURIComponent(district.slug)}&mandal=${encodeURIComponent(mandal.slug)}`;
  const waHref =
    hub?.inviteUrl ||
    `https://wa.me/${badge.phoneE164}?text=${encodeURIComponent(
      `${mandal.nameTe} (${district.nameTe}) సేవా డెస్క్ — సహాయం కావాలి`,
    )}`;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] antialiased">
      <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
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
            <Link
              href={`/districts/${district.slug}`}
              className="civic-focus-ring rounded px-1 hover:text-[#B45309]"
            >
              {district.nameEn}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold text-[#0F172A]">{mandal.nameEn}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 max-w-3xl">
          <span className="civic-eyebrow-pill mb-3">
            {placeKindTe} Official Service Desk
          </span>
          <h1 className="font-display-te text-[1.55rem] font-normal leading-[1.35] text-[#0F172A] sm:text-3xl md:text-[2.15rem] md:leading-[1.3]">
            {mandal.nameTe} నాయీ సమాఖ్య అధికారిక సేవా డెస్క్
          </h1>
          <p className="font-sans mt-2 text-sm font-medium uppercase tracking-widest text-slate-500">
            {mandal.nameEn} · {district.nameEn} District
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Coordinator badge */}
          <section
            aria-labelledby="coord-heading"
            className="lg:col-span-5 rounded-2xl border border-[#EAD7B5] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2
                id="coord-heading"
                className="font-telugu text-sm font-bold text-[#1E293B]"
              >
                ధృవీకృత సమన్వయకర్త
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                <BadgeCheck className="h-3 w-3" aria-hidden />
                Verified
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#B45309] bg-white shadow-[0_0_0_3px_#FEF3C7]">
                <ShieldCheck className="h-6 w-6 text-[#B45309]" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-telugu text-base font-bold text-[#0F172A]">
                  {badge.nameTe}
                </p>
                <p className="font-sans text-xs text-slate-500">{badge.nameEn}</p>
                <p className="font-telugu mt-1 text-xs text-[#B45309]">
                  {badge.roleTe}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#EAD7B5]/80 bg-white/80 px-3 py-2.5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Coordinator ID
              </p>
              <p className="font-sans mt-0.5 text-sm font-bold tracking-wide text-[#1E293B]">
                {badge.id}
              </p>
            </div>

            <a
              href={`tel:+${badge.phoneE164}`}
              className="civic-focus-ring mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#EAD7B5] bg-white px-4 font-telugu text-sm font-semibold text-[#1E293B] hover:border-[#B45309]/40"
            >
              <Phone className="h-4 w-4 text-[#B45309]" aria-hidden />
              {badge.phoneDisplay}
            </a>
          </section>

          {/* Actions + status */}
          <div className="lg:col-span-7 space-y-4">
            <section
              aria-labelledby="actions-heading"
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <h2
                id="actions-heading"
                className="font-telugu mb-3 text-sm font-bold text-[#1E293B]"
              >
                తక్షణ సేవా చర్యలు
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={petitionHref}
                  className="civic-focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-4 py-3 font-telugu text-sm font-bold text-white shadow-[0_8px_24px_rgb(180_83_9_/0.3)]"
                >
                  <FileText className="h-4 w-4" aria-hidden />
                  1-Click వినతిపత్రం
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="civic-focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] px-4 py-3 font-telugu text-sm font-semibold text-[#1E293B] hover:border-[#B45309]/45"
                >
                  <MessageCircle className="h-4 w-4 text-[#B45309]" aria-hidden />
                  WhatsApp కారిడార్
                </a>
              </div>
              <p className="font-telugu mt-3 text-[11px] leading-relaxed text-slate-500">
                వినతిపత్రం జిల్లా ({district.nameTe}) &amp; {placeKindTe} (
                {mandal.nameTe}) తో ప్రీ-ఫిల్ అవుతుంది.
              </p>
            </section>

            <section
              aria-labelledby="status-heading"
              className="rounded-2xl border border-[#EAD7B5]/80 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] p-5"
            >
              <h2
                id="status-heading"
                className="font-telugu mb-3 flex items-center gap-1.5 text-sm font-bold text-[#1E293B]"
              >
                <Sparkles className="h-4 w-4 text-[#B45309]" aria-hidden />
                స్థానిక స్థితి సూచిక
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <li className="rounded-xl border border-white/80 bg-white/70 px-3 py-3">
                  <p className="font-sans text-xl font-bold tabular-nums text-[#0F172A]">
                    {metrics.activeSalons}
                  </p>
                  <p className="font-telugu text-[11px] text-slate-600">
                    Active Salons
                  </p>
                </li>
                <li className="rounded-xl border border-white/80 bg-white/70 px-3 py-3">
                  <p className="font-sans text-xl font-bold tabular-nums text-[#0F172A]">
                    {metrics.go23Claims}
                  </p>
                  <p className="font-telugu text-[11px] text-slate-600">
                    G.O. 23 claims
                  </p>
                </li>
                <li className="rounded-xl border border-white/80 bg-white/70 px-3 py-3 sm:col-span-1 col-span-2">
                  <p className="font-sans text-xl font-bold tabular-nums text-[#0F172A]">
                    {metrics.openPetitions}
                  </p>
                  <p className="font-telugu text-[11px] text-slate-600">
                    Open petitions
                  </p>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <p className="font-telugu mt-8 text-center text-xs text-slate-500">
          <Link
            href={`/districts/${district.slug}`}
            className="civic-focus-ring text-[#B45309] underline-offset-2 hover:underline"
          >
            ← {district.nameTe} జిల్లా అన్ని మండలాలు
          </Link>
        </p>
      </main>
    </div>
  );
}
