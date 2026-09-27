"use client";

import { ExternalLink, Megaphone, MessageCircle } from "lucide-react";
import {
  getAllCommHubs,
  type CommHub,
} from "@/lib/comms/hubs";

type Props = {
  /** When set, highlight the matching regional hub first. */
  districtHint?: string;
  compact?: boolean;
};

function HubRow({ hub }: { hub: CommHub }) {
  const Icon = hub.channel === "telegram" ? Megaphone : MessageCircle;
  return (
    <a
      href={hub.join_url}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 rounded-xl border border-civic-border bg-civic-paper p-3 transition hover:border-civic-bronze/40 hover:bg-white"
    >
      <span className="mt-0.5 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-800">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-telugu text-xs font-bold text-civic-ink">
          {hub.name_te}
        </span>
        <span className="mt-0.5 block text-[10px] text-slate-500">
          {hub.name_en}
        </span>
      </span>
      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" />
    </a>
  );
}

export function HubJoinLinks({ districtHint, compact }: Props) {
  const hubs = getAllCommHubs();
  const slug = districtHint?.trim().toLowerCase() || "";
  const sorted = [...hubs].sort((a, b) => {
    const aMatch = slug && a.districts.includes(slug) ? 0 : 1;
    const bMatch = slug && b.districts.includes(slug) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    if (a.tier !== b.tier) return a.tier === "state" ? -1 : 1;
    return a.name_en.localeCompare(b.name_en);
  });

  return (
    <section
      className={
        compact
          ? "space-y-2"
          : "w-full space-y-3 rounded-2xl border border-civic-border bg-white p-5 shadow-xs"
      }
    >
      {!compact && (
        <div>
          <h2 className="font-telugu text-sm font-bold text-civic-ink">
            సమాచార హబ్‌లు · Communication hubs
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            State broadcast + 3 regional WhatsApp hubs — join links update from
            env when real invites are set.
          </p>
        </div>
      )}
      <div className="space-y-2">
        {sorted.map((hub) => (
          <HubRow key={hub.id} hub={hub} />
        ))}
      </div>
    </section>
  );
}
