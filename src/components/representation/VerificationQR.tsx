"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

type VerificationQRProps = {
  url: string;
  docketId: string;
  size?: number;
  /** Compact footer placement under signature. */
  variant?: "header" | "footer";
};

/**
 * Tamper-evident verification QR — payload is the public /verify/{docketId} URL.
 */
export function VerificationQR({
  url,
  docketId,
  size = 72,
  variant = "header",
}: VerificationQRProps) {
  const box =
    variant === "header"
      ? "print-qr-block flex shrink-0 flex-col items-center gap-1 break-inside-avoid"
      : "print-qr-block flex break-inside-avoid items-center gap-2";

  return (
    <div className={box} data-docket-id={docketId}>
      <div className="rounded border border-slate-300 bg-white p-1 print:border-slate-800">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#0f172a"
          title={`Verify ${docketId}`}
        />
      </div>
      <p
        className={
          variant === "header"
            ? "max-w-[5.5rem] text-center font-telugu text-[8px] leading-tight text-slate-600 print:text-[7px]"
            : "font-telugu text-[9px] leading-tight text-slate-600 print:text-[8px]"
        }
      >
        డిజిటల్ వెరిఫికేషన్ కోడ్
        <br />
        <span className="font-sans text-[7px] tracking-wide text-slate-500 print:text-[6px]">
          Scan to verify official record
        </span>
      </p>
    </div>
  );
}
