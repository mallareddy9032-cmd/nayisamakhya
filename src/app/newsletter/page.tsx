import type { Metadata } from "next";
import { NEWSLETTER_TITLE } from "@/lib/newsletter/digest";
import { loadNewsletterDigest } from "@/lib/newsletter/loadEditions";
import NewsletterClient from "./NewsletterClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `${NEWSLETTER_TITLE} | Nayi Samakhya`,
  description:
    "Zero-maintenance bi-weekly Telugu civic digest auto-populated from civic_bulletins — G.O.s, BC-A welfare, collector circulars.",
  alternates: { canonical: "https://www.nayisamakhya.org/newsletter" },
};

export default async function NewsletterPage() {
  const payload = await loadNewsletterDigest();
  return <NewsletterClient payload={payload} />;
}
