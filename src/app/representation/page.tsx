import type { Metadata } from "next";
import { Suspense } from "react";
import { RepresentationLetterPage } from "@/components/RepresentationLetterPage";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";

const heading = "\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40";
const description =
  "\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 A4 \u0c32\u0c46\u0c1f\u0c30\u0c4d \u0c1c\u0c28\u0c30\u0c47\u0c1f\u0c30\u0c4d.";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const raw = [sp.dist ?? sp.district].flat()[0]?.trim() ?? "";
  const key = raw.toLowerCase();
  const match = TELANGANA_DISTRICTS.find(
    (d) => d.slug === key.replace(/\s+/g, "-") || d.name_en.toLowerCase() === key || d.name_te === raw,
  );
  const district = match?.name_te ?? raw.slice(0, 48);

  const title = district ? `${heading} \u2014 ${district} | Nayi Samakhya` : `${heading} | Nayi Samakhya`;
  const og = new URLSearchParams({ title: heading, subtitle: description, badge: "Official Representation" });
  if (district) og.set("district", district);
  // WhatsApp/crawlers need a strictly absolute og:image URL (never relative /api/og).
  const ogImageUrl = `https://www.nayisamakhya.org/api/og?${og}`;
  const ogImageAlt =
    "\u0c28\u0c3e\u0c2f\u0c40 \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02";
  const images = [
    {
      url: ogImageUrl,
      type: "image/png" as const,
      width: 1200,
      height: 630,
      alt: ogImageAlt,
    },
  ];

  return {
    title,
    description,
    openGraph: { type: "website", siteName: "Nayi Samakhya", locale: "te_IN", url: "/representation", title, description, images },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

export default function RepresentationPage() {
  // Print/PDF: desktop → window.print(); Telegram/WhatsApp/IG webviews →
  // sticky breakout banner + html2canvas/jspdf → NayiSamakhya-Vinathipathram-[DISTRICT].pdf.
  // Phase 3: official docket REF + authentic QR → /verify/[id], receiving seal block.
  // Letter locked with translate="no" lang="te"; globals.css enforces single A4.
  return (
    <Suspense
      fallback={
        <div className="no-print flex min-h-[40vh] items-center justify-center bg-civic-paper font-telugu text-sm text-slate-500 print:hidden">
          {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c32\u0c4b\u0c21\u0c4d \u0c05\u0c35\u0c41\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c26\u0c3f\u2026"}
        </div>
      }
    >
      <RepresentationLetterPage />
    </Suspense>
  );
}
