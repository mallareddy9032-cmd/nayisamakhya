"use client";

import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import {
  sortHubsForDistrict,
  type RegionalHub,
} from "@/config/communityHubs";

type Props = {
  /** District slug — matching corridor is sorted first and pulsed when active. */
  highlightDistrict?: string | null;
  /** Force pulse on a hub id (e.g. south-telangana for Suryapet success). */
  pulseHubId?: string | null;
  className?: string;
};

function HubCard({
  hub,
  highlighted,
  pulse,
}: {
  hub: RegionalHub;
  highlighted: boolean;
  pulse: boolean;
}) {
  return (
    <article
      className={[
        "rounded-2xl border bg-white p-4 shadow-xs transition",
        highlighted
          ? "border-[#B45309]/60 ring-2 ring-[#B45309]/25"
          : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 font-telugu text-sm font-bold leading-snug text-[#1E293B] md:text-base">
          {hub.nameTe}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#B45309]/10 px-2 py-0.5 font-telugu text-[10px] font-bold tracking-wide text-[#B45309]">
          {pulse ? (
            <span
              className="relative flex h-2 w-2"
              aria-label="Active corridor"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B45309] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B45309]" />
            </span>
          ) : null}
          {hub.badgeTe}
        </span>
      </div>

      <p className="mt-2 font-telugu text-xs leading-relaxed text-slate-500">
        {hub.coverageTe}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={hub.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#059669] px-3 py-2.5 font-telugu text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          వాట్సాప్ గ్రూపులో చేరండి (Join Group)
        </a>
        <a
          href={hub.helplineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-telugu text-xs font-bold text-[#1E293B] transition hover:border-[#B45309]/40 hover:bg-slate-50 active:scale-[0.99]"
        >
          <Phone className="h-4 w-4 shrink-0 text-[#B45309]" aria-hidden />
          హెల్ప్‌లైన్ అడ్మిన్‌తో మాట్లాడండి
        </a>
      </div>
    </article>
  );
}

export function CommunityHubsSection({
  highlightDistrict,
  pulseHubId,
  className = "",
}: Props) {
  const slug = (highlightDistrict || "").trim().toLowerCase();
  const hubs = sortHubsForDistrict(slug);
  const autoPulseId =
    pulseHubId ||
    (slug === "suryapet" || slug === "kodad" ? "south-telangana" : null);

  return (
    <section
      className={`w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs ${className}`}
      aria-labelledby="community-hubs-heading"
    >
      <div>
        <h2
          id="community-hubs-heading"
          className="font-telugu text-sm font-bold text-[#1E293B] md:text-base"
        >
          ప్రాంతీయ వాట్సాప్ కమ్యూనిటీ హబ్‌లు
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Grassroots corridors — join your regional peer group to share load off
          the central Telegram desk.
        </p>
      </div>

      <div className="space-y-3">
        {hubs.map((hub) => {
          const highlighted = Boolean(slug && hub.districts.includes(slug));
          const pulse = autoPulseId === hub.id;
          return (
            <HubCard
              key={hub.id}
              hub={hub}
              highlighted={highlighted || pulse}
              pulse={pulse}
            />
          );
        })}
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2.5 font-telugu text-[11px] leading-relaxed text-emerald-900">
        <ShieldCheck
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700"
          aria-hidden
        />
        అధికారిక గ్రూపులు మాత్రమే — బయటి ప్రచారాలకు తావులేదు.
      </p>
    </section>
  );
}
