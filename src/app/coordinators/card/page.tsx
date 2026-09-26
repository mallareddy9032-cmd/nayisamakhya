import { redirect } from "next/navigation";

/**
 * Alias used by Telegram / announce SOP links.
 * Canonical builder lives at /coordinator-card (executive civic light theme).
 */
export default function CoordinatorsCardAliasPage() {
  redirect("/coordinator-card");
}
