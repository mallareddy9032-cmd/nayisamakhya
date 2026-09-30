import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { TELANGANA_DISTRICTS } from "@/data/telanganaGeo";
import { placeJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/seo/site";

type Props = {
  params: Promise<{ district: string; mandal: string }>;
};

export function generateStaticParams() {
  const paths: { district: string; mandal: string }[] = [];
  Object.values(TELANGANA_DISTRICTS).forEach((dist) => {
    dist.mandals.forEach((m) => {
      paths.push({ district: dist.slug, mandal: m.slug });
    });
  });
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: dSlug, mandal: mSlug } = await params;
  const district = TELANGANA_DISTRICTS[dSlug];
  const mandal = district?.mandals.find((m) => m.slug === mSlug);
  if (!district || !mandal) {
    return { title: "Mandal desk not found | Nayi Samakhya" };
  }
  const path = `/districts/${district.slug}/${mandal.slug}`;
  return {
    title: `${mandal.nameTe} నాయీ సమాఖ్య అధికారిక సేవా డెస్క్ | ${mandal.nameEn}`,
    description: `${mandal.nameTe}, ${district.nameTe} — ధృవీకృత సమన్వయకర్త, 1-క్లిక్ వినతిపత్రం, WhatsApp డెస్క్.`,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${mandal.nameEn} Service Desk — Nayi Samakhya`,
      url: path,
    },
  };
}

export default async function MandalDeskPage({ params }: Props) {
  const { district: dSlug, mandal: mSlug } = await params;
  const district = TELANGANA_DISTRICTS[dSlug];
  if (!district) notFound();

  const mandal = district.mandals.find((m) => m.slug === mSlug);
  if (!mandal) notFound();

  const path = `/districts/${district.slug}/${mandal.slug}`;
  const districtPath = `/districts/${district.slug}`;
  const prefilledPetitionUrl = `/representation?district=${encodeURIComponent(district.nameEn)}&mandal=${encodeURIComponent(mandal.nameEn)}&dist=${encodeURIComponent(district.slug)}`;
  const prefilledCoordinatorUrl = `/coordinator-card?district=${encodeURIComponent(district.nameTe)}&zone=${encodeURIComponent(mandal.nameTe)}&mandal=${encodeURIComponent(mandal.nameTe)}`;
  const waPrefill = encodeURIComponent(
    `Hello NayiSamakhya Desk — ${mandal.nameEn}, ${district.nameEn}`,
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] px-4 py-10 text-[#0F172A] sm:px-6 lg:px-8">
      <JsonLd
        data={placeJsonLd({
          nameEn: mandal.nameEn,
          nameTe: mandal.nameTe,
          path,
          districtNameEn: district.nameEn,
          districtPath,
        })}
      />
      <div className="mx-auto max-w-4xl">
        <nav
          aria-label="Breadcrumb"
          className="font-telugu mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"
        >
          <Link
            href="/"
            className="civic-focus-ring rounded px-0.5 hover:text-[#B45309]"
          >
            హోమ్
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/districts"
            className="civic-focus-ring rounded px-0.5 hover:text-[#B45309]"
          >
            జిల్లాలు
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/districts/${district.slug}`}
            className="civic-focus-ring rounded px-0.5 hover:text-[#B45309]"
          >
            {district.nameTe}
          </Link>
          <span aria-hidden>/</span>
          <span className="font-semibold text-slate-900">{mandal.nameTe}</span>
        </nav>

        <div className="mb-8 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row">
            <div>
              <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wider text-[#B45309]">
                అధికారిక క్షేత్రస్థాయి సేవా డెస్క్
              </span>
              <h1 className="font-display-te mt-2 text-3xl font-normal leading-[1.3] text-[#0F172A] sm:text-4xl">
                {mandal.nameTe}
              </h1>
              <p className="font-sans mt-1 text-sm font-medium uppercase tracking-widest text-slate-500">
                {mandal.nameEn}
              </p>
              <p className="font-telugu mt-1 text-sm text-slate-600">
                {district.nameTe} జిల్లా • {district.zone}
              </p>
            </div>

            <div className="rounded-xl border border-[#EAD7B5] bg-[#FAF6ED] px-4 py-2 text-center">
              <span className="font-mono text-[10px] uppercase text-slate-500">
                శాసన వర్గీకరణ
              </span>
              <p className="font-sans text-sm font-bold capitalize text-[#B45309]">
                {mandal.type}
              </p>
            </div>
          </div>

          <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-[#EAD7B5] bg-[#FFFDF9] p-6">
              <div>
                <span className="font-mono text-xs font-semibold text-[#B45309]">
                  చట్టబద్ధ రక్షణ (G.O. 23)
                </span>
                <h3 className="font-display-te mt-1 text-lg font-normal text-[#0F172A]">
                  {mandal.nameTe} వినతిపత్రం తయారీ
                </h3>
                <p className="font-telugu mt-2 text-xs leading-relaxed text-slate-600">
                  {mandal.nameTe} తాసిల్దార్ / విద్యుత్ ఏడీఈ గారికి 250 యూనిట్ల
                  ఉచిత విద్యుత్ &amp; కేటగిరీ మార్పు కొరకు ప్రీ-ఫిల్డ్ పత్రం
                  డౌన్‌లోడ్ చేసుకోండి.
                </p>
              </div>
              <Link
                href={prefilledPetitionUrl}
                className="civic-focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#D97706] px-4 py-2.5 font-telugu text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
              >
                తక్షణ వినతిపత్రం తయారుచేసుకోండి →
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  సమన్వయ వేదిక
                </span>
                <h3 className="font-display-te mt-1 text-lg font-normal text-[#0F172A]">
                  మండల సమన్వయకర్త కార్డు
                </h3>
                <p className="font-telugu mt-2 text-xs leading-relaxed text-slate-600">
                  {mandal.nameTe} పరిధిలో అధికారిక సేవల పర్యవేక్షణ కొరకు మీ
                  డిజిటల్ సమన్వయకర్త ఐడీ కార్డును పొందండి.
                </p>
              </div>
              <Link
                href={prefilledCoordinatorUrl}
                className="civic-focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#1E293B] px-4 py-2.5 font-telugu text-xs font-semibold text-white transition-colors hover:bg-[#0F172A]"
              >
                సమన్వయకర్త కార్డు తీసుకోండి →
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-[#F1F5F9] p-4 sm:flex-row">
            <span className="font-telugu text-xs font-medium text-slate-700">
              {mandal.nameTe} స్థానిక సమస్యల కోసం మండల కోఆర్డినేటర్ సహాయం
              కావాలా?
            </span>
            <a
              href={`https://wa.me/919032654111?text=${waPrefill}`}
              target="_blank"
              rel="noopener noreferrer"
              className="civic-focus-ring font-telugu text-xs font-bold text-[#15803D] hover:underline"
            >
              డైరెక్ట్ వాట్సాప్ డెస్క్ చాట్ (+91 9032654111)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
