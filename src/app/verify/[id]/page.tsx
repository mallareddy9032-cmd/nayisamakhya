import type { Metadata } from "next";
import { VerifyDocketClient } from "./VerifyDocketClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const docketId = decodeURIComponent(id || "").toUpperCase();
  const title = `వినతిపత్ర ధృవీకరణ — ${docketId} | Nayi Samakhya`;
  const description =
    "నాయీ సమఖ్య తెలంగాణ — అధికారిక వినతిపత్ర రికార్డు ధృవీకరణ";
  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://www.nayisamakhya.org/verify/${encodeURIComponent(docketId)}`,
      siteName: "Nayi Samakhya",
      locale: "te_IN",
      type: "website",
    },
  };
}

export default async function VerifyDocketPage({ params }: Props) {
  const { id } = await params;
  const docketId = decodeURIComponent(id || "").trim();
  return <VerifyDocketClient docketId={docketId} />;
}
