import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TELANGANA_DISTRICTS } from "@/data/telanganaGeo";

type Props = {
  params: Promise<{ district: string }>;
};

export function generateStaticParams() {
  return Object.keys(TELANGANA_DISTRICTS).map((district) => ({ district }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: slug } = await params;
  const district = TELANGANA_DISTRICTS[slug];
  if (!district) {
    return { title: "District not found | Nayi Samakhya" };
  }
  return {
    title: `${district.nameTe} జిల్లా (${district.nameEn}) | NayiSamakhya`,
    description: `${district.nameTe} — ${district.mandals.length} మండలాలు, HQ ${district.headquarters}. నాయి సమాఖ్య జిల్లా సమన్వయ డెస్క్.`,
    openGraph: {
      title: `${district.nameEn} District Desk — Nayi Samakhya`,
      url: `/districts/${district.slug}`,
    },
  };
}

export default async function DistrictDetailPage({ params }: Props) {
  const { district: slug } = await params;
  const district = TELANGANA_DISTRICTS[slug];
  if (!district) notFound();

  return (
    <div className="min-h-screen bg-[#FBFBFA] px-4 py-10 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="font-telugu mb-6 flex items-center gap-2 text-xs text-slate-500"
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
          <span className="font-semibold text-slate-900">{district.nameTe}</span>
        </nav>

        <div className="mb-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#EAD7B5] bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              {district.zone} • పరిపాలనా డెస్క్
            </span>
            <h1 className="font-display-te mt-2 text-3xl font-normal leading-[1.3] text-[#0F172A] sm:text-4xl">
              {district.nameTe} జిల్లా
            </h1>
            <p className="font-sans mt-1 text-sm font-medium uppercase tracking-widest text-slate-500">
              {district.nameEn}
            </p>
            <p className="font-telugu mt-2 text-sm text-slate-600">
              హెడ్‌క్వార్టర్స్: {district.headquarters} | మొత్తం మండలాలు:{" "}
              {district.mandals.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={district.whatsappCorridorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-2.5 font-telugu text-xs font-medium text-white transition-colors hover:bg-[#0F172A]"
            >
              జిల్లా వాట్సాప్ కారిడార్
            </a>
            <Link
              href={`/representation?dist=${encodeURIComponent(district.slug)}`}
              className="civic-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-4 py-2.5 font-telugu text-xs font-bold text-white shadow-[0_8px_20px_rgb(180_83_9_/0.28)]"
            >
              జిల్లా వినతిపత్రం
            </Link>
          </div>
        </div>

        <h2 className="font-display-te mb-4 text-xl font-normal text-[#0F172A]">
          {district.nameTe} పరిధిలోని మండలాలు &amp; మున్సిపాలిటీలు
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {district.mandals.map((mandal) => (
            <Link
              key={mandal.slug}
              href={`/districts/${district.slug}/${mandal.slug}`}
              className="civic-focus-ring group block rounded-xl border border-[#E2E8F0] bg-white p-4 transition-all hover:border-[#B45309] hover:shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-400">
                  {mandal.type}
                </span>
                <span className="text-xs text-[#B45309] opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </div>
              <h3 className="font-telugu font-bold text-slate-900 transition-colors group-hover:text-[#B45309]">
                {mandal.nameTe}
              </h3>
              <p className="font-sans text-xs text-slate-500">{mandal.nameEn}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
