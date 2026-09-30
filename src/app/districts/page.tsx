import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DistrictsDirectoryClient } from "@/components/districts/DistrictsDirectoryClient";
import { TELANGANA_DISTRICTS } from "@/data/telanganaGeo";

export const metadata: Metadata = {
  title: "తెలంగాణ జిల్లా & మండల సేవా నెట్‌వర్క్ | NayiSamakhya",
  description:
    "తెలంగాణలోని 33 జిల్లాలు మరియు 589 మండలాల అధికారిక సంక్షేమ మరియు వినతుల సమన్వయ డెస్క్.",
  alternates: { canonical: "https://www.nayisamakhya.org/districts" },
  openGraph: {
    title: "తెలంగాణ జిల్లా & మండల సేవా నెట్‌వర్క్ | NayiSamakhya",
    description:
      "తెలంగాణలోని 33 జిల్లాలు మరియు 589 మండలాల అధికారిక సంక్షేమ మరియు వినతుల సమన్వయ డెస్క్.",
    url: "/districts",
  },
};

export default function DistrictsDirectoryPage() {
  const districts = Object.values(TELANGANA_DISTRICTS);

  return (
    <div className="min-h-screen bg-[#FBFBFA] px-4 py-12 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="font-sans mb-8 flex flex-wrap items-center justify-center gap-1 text-xs text-slate-500"
        >
          <Link
            href="/"
            className="civic-focus-ring rounded px-1 hover:text-[#B45309]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="font-semibold text-[#0F172A]">Districts</span>
        </nav>

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="civic-eyebrow-pill mb-3">
            33 జిల్లాలు • 589 మండలాలు • అధికారిక వేదిక
          </span>
          <h1 className="font-display-te text-3xl font-normal leading-[1.3] tracking-tight text-[#0F172A] sm:text-4xl">
            తెలంగాణ సమగ్ర జిల్లా సేవా నెట్‌వర్క్
          </h1>
          <p className="font-telugu mt-3 text-base leading-relaxed text-slate-600">
            మీ జిల్లా మరియు మండలాన్ని ఎంచుకుని.. స్థానిక సమన్వయకర్త వివరాలు,
            జీ.ఓ. 23 విద్యుత్ రాయితీ స్థితి మరియు తక్షణ వినతిపత్రాల సేవలను
            పొందండి.
          </p>
        </div>

        <DistrictsDirectoryClient districts={districts} />
      </div>
    </div>
  );
}
