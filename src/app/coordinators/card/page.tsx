import { redirect } from "next/navigation";

/** Alias used by Telegram Mini App links → printable card builder. */
export default function CoordinatorsCardAliasPage() {
  redirect("/coordinator-card");
}
