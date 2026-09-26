"use client";

import Image from "next/image";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/store/preferences";

type Props = {
  contextLabel: string;
  botHandle?: string;
  className?: string;
  sticky?: boolean;
};

const DEFAULT_BOT = "NayiSamakhyaDeskBot";

export function TelegramQRCard({
  contextLabel,
  botHandle = DEFAULT_BOT,
  className,
  sticky = true,
}: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const te = lang === "te";
  const telegramUrl = `https://t.me/${botHandle}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(telegramUrl)}`;

  return (
    <aside
      className={cn(
        "rounded-2xl border border-[#EBE8E0] bg-white p-4 shadow-sm",
        sticky && "lg:sticky lg:top-24",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#229ED9]">
        Telegram Desk
      </p>
      <h3
        className={`mt-1 text-base font-bold text-[#18181B] ${te ? "font-telugu" : ""}`}
      >
        {te ? "ఫీల్డ్ ఫోటో డెస్క్" : "Field photo desk"}
      </h3>
      <p className={`mt-1 text-xs text-[#71717A] ${te ? "font-telugu" : ""}`}>
        {te
          ? `${contextLabel} కోసం @${botHandle} కు ఫోటో పంపండి.`
          : `Send field photos to @${botHandle} for ${contextLabel}.`}
      </p>

      <div className="mx-auto mt-4 w-fit rounded-xl border border-[#EBE8E0] bg-[#FBFBF9] p-2">
        <Image
          src={qrUrl}
          alt={`QR code for @${botHandle}`}
          width={160}
          height={160}
          className="h-40 w-40"
          unoptimized
        />
      </div>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noreferrer"
        className={`tap mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#229ED9] px-4 text-sm font-semibold text-white hover:bg-[#1B8BC0] ${te ? "font-telugu" : ""}`}
      >
        <Send className="h-4 w-4" aria-hidden />
        @{botHandle}
      </a>
    </aside>
  );
}
