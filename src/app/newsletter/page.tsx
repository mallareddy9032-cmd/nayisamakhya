import type { Metadata } from "next";
import { NEWSLETTER_TITLE } from "@/lib/bulletins/categories";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: `${NEWSLETTER_TITLE} | Nayi Samakhya`,
  description:
    "Bi-weekly Telugu civic digest auto-populated from approved bulletins and verified field submissions.",
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
