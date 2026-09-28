"use client";

import { useCallback, useRef, useState } from "react";
import {
  Printer,
  ShieldCheck,
  QrCode,
  ArrowLeft,
  Download,
  Loader2,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PosterFormat = "a4" | "status";

const BOT_URL = "https://t.me/NayiSamakhyaDeskBot";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(BOT_URL)}&margin=10`;

export default function PosterPage() {
  const [format, setFormat] = useState<PosterFormat>("a4");
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const isStatus = format === "status";

  const downloadCanvas = useCallback(async () => {
    const el = canvasRef.current;
    if (!el || busy) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      // Enforce scale: 2 for crisp print-shop / high-DPI WhatsApp status output.
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0F172A",
        logging: false,
        width: isStatus ? 1080 : undefined,
        height: isStatus ? 1920 : undefined,
        windowWidth: isStatus ? 1080 : el.scrollWidth,
        windowHeight: isStatus ? 1920 : el.scrollHeight,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("canvas_blob_failed");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isStatus
        ? "NayiSamakhya-WhatsApp-Status-1080x1920.png"
        : "NayiSamakhya-Poster-A4.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[Poster:Download]", err);
      window.alert(
        "డౌన్‌లోడ్ విఫలమైంది. Chrome/Safariలో మళ్లీ ప్రయత్నించండి.",
      );
    } finally {
      setBusy(false);
    }
  }, [busy, isStatus]);

  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#FBFBFA] p-4 text-[#0F172A] antialiased md:p-8">
      <div className="mb-5 flex w-full max-w-md flex-col gap-3 print:hidden">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-telugu text-xs text-slate-500 hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {"పోర్టల్‌కు తిరిగి వెళ్లండి"}
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Poster format"
          className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isStatus}
            onClick={() => setFormat("a4")}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-telugu text-xs font-bold transition",
              !isStatus
                ? "bg-[#0F172A] text-white"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            {"A4 ప్రింట్ (Print)"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isStatus}
            onClick={() => setFormat("status")}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-telugu text-xs font-bold transition",
              isStatus
                ? "bg-[#B45309] text-white"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            {"WhatsApp స్టేటస్ (9:16)"}
          </button>
        </div>

        <div className="flex gap-2">
          {!isStatus ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" aria-hidden />
              <span className="font-telugu">{"ప్రింట్ చేయండి"}</span>
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void downloadCanvas()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-800 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            <span className="font-telugu">
              {busy
                ? "సిద్ధం అవుతోంది…"
                : isStatus
                  ? "PNG డౌన్‌లోడ్ (1080×1920)"
                  : "హై-DPI PNG డౌన్‌లోడ్"}
            </span>
          </button>
        </div>
        <p className="text-center font-sans text-[10px] text-slate-500">
          Canvas export uses scale:2 for crisp print-shop banners
          {isStatus ? " · 9:16 WhatsApp Status" : " · A4 portrait"}
        </p>
      </div>

      <div
        ref={canvasRef}
        className={cn(
          "relative flex flex-col items-center justify-between overflow-hidden border-2 border-[#B45309]/50 bg-[#0F172A] text-center text-slate-100 shadow-2xl print:w-full print:max-w-none print:rounded-none print:border-4 print:border-black print:bg-white print:p-10 print:text-black",
          isStatus
            ? "h-[640px] w-[360px] rounded-2xl p-6 md:h-[720px] md:w-[405px]"
            : "w-full max-w-[480px] rounded-3xl p-8",
        )}
        style={
          isStatus
            ? { aspectRatio: "9 / 16", maxWidth: 405 }
            : undefined
        }
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-[#B45309]/15 blur-3xl print:hidden"
          aria-hidden
        />

        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-1 text-xs font-semibold text-[#B45309] print:border-black print:text-black">
            <ShieldCheck
              className="h-4 w-4 text-[#B45309] print:text-black"
              aria-hidden
            />
            <span className="font-telugu">{"నాయి సమాఖ్య తెలంగాణ"}</span>
          </div>
          <h1
            className={cn(
              "font-telugu font-black tracking-tight text-white print:text-black",
              isStatus ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
            )}
          >
            {"డిజిటల్ సేవా డెస్క్"}
          </h1>
          <p
            className={cn(
              "mx-auto mt-1 max-w-xs font-telugu text-slate-400 print:text-slate-700",
              isStatus ? "text-[11px]" : "text-xs md:text-sm",
            )}
          >
            {
              "సెలూన్ వృత్తిదారులు & కమ్యూనిటీ సంక్షేమం కొరకు అధికారిక వేదిక"
            }
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl border-4 border-[#B45309]/30 bg-white shadow-xl print:border-black print:shadow-none",
            isStatus ? "my-4 p-3" : "my-8 p-5",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_URL}
            alt="Telegram Desk QR Code"
            className={cn(
              "mx-auto object-contain",
              isStatus ? "h-40 w-40" : "h-56 w-56 md:h-64 md:w-64",
            )}
            crossOrigin="anonymous"
          />
          <p className="mt-2 flex items-center justify-center gap-1 font-telugu text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
            <QrCode
              className="h-3.5 w-3.5 text-[#B45309] print:text-black"
              aria-hidden
            />
            {"కెమెరా లేదా గూగుల్ లెన్స్‌తో స్కాన్ చేయండి"}
          </p>
        </div>

        <div
          className={cn(
            "w-full space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 text-left text-xs print:border-black print:bg-slate-100 print:text-black",
            isStatus ? "mb-3 p-3" : "mb-6 p-4",
          )}
        >
          {(
            [
              "అధికారిక వినతిపత్రాల తయారీ (Representation Maker)",
              "క్షేత్రస్థాయి సమస్యలు & ఫోటో నమోదు",
              "మండల సమన్వయకర్తలు & అధికారుల వివరాలు",
            ] as const
          ).map((line) => (
            <div key={line} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#B45309] print:bg-black"
                aria-hidden
              />
              <span className="font-telugu">{line}</span>
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-500 print:border-black print:text-slate-800">
          <span>Telegram: @NayiSamakhyaDeskBot</span>
          <span className="font-semibold text-slate-400 print:text-black">
            nayisamakhya.org
          </span>
        </div>
      </div>
    </div>
  );
}
