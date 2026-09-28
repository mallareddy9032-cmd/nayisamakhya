/**
 * Print / PDF helpers for Representation Petition Maker.
 * Desktop / Safari / Chrome: native window.print().
 * Telegram Mini App / WhatsApp / Instagram / FB webviews: html2canvas + jspdf download.
 */

type TelegramWebAppLike = {
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  platform?: string;
  version?: string;
  initData?: string;
};

type TelegramWindow = Window & {
  Telegram?: { WebApp?: TelegramWebAppLike };
};

export const PDF_LOADING_TE =
  "పీడీఎఫ్ సిద్ధం అవుతోంది... (Generating PDF)";

/** Sticky banner copy for restricted in-app browsers. */
export const IN_APP_PRINT_BANNER_TE =
  "మొబైల్ యాప్‌లో ప్రింట్ సపోర్ట్ పరిమితం. పీడీఎఫ్ డౌన్‌లోడ్ కోసం క్రోమ్ లేదా సఫారీలో తెరవండి.";

export const OPEN_IN_BROWSER_BTN_TE =
  "బ్రౌజర్‌లో తెరవండి (Open in Browser)";

/** @deprecated prefer OPEN_IN_BROWSER_BTN_TE */
export const OPEN_EXTERNAL_BROWSER_LABEL = OPEN_IN_BROWSER_BTN_TE;

export const PETITION_PDF_FILENAME = "NayiSamakhya-Vinathipathram.pdf";

export const PETITION_HELPLINE_WA = "+91 9032654111";
export const PETITION_HELPLINE_URL =
  "https://wa.me/919032654111?text=" +
  encodeURIComponent(
    "వినతిపత్రం పీడీఎఫ్ డౌన్‌లోడ్ కాలేదు. దయచేసి సహాయం చేయండి.",
  );

/** Build `NayiSamakhya-Vinathipathram-[DISTRICT].pdf` with ASCII-safe district token. */
export function petitionPdfFilename(districtSlugOrName?: string | null): string {
  const raw = (districtSlugOrName || "").trim();
  const token =
    raw
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "Telangana";
  return `NayiSamakhya-Vinathipathram-${token}.pdf`;
}

function telegramWindow(): TelegramWindow | null {
  if (typeof window === "undefined") return null;
  return window as TelegramWindow;
}

export function getTelegramWebApp(): TelegramWebAppLike | null {
  return telegramWindow()?.Telegram?.WebApp ?? null;
}

export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;
  const wa = getTelegramWebApp();
  if (wa?.initData) return true;
  const ua = navigator.userAgent || "";
  if (ua.includes("Telegram")) return true;
  // Real Mini Apps expose a non-empty platform after SDK inject.
  return Boolean(wa?.platform && wa.platform !== "unknown");
}

/** Telegram / WhatsApp / Instagram / Facebook / generic WebView. */
export function isInAppWebView(): boolean {
  if (typeof window === "undefined") return false;
  if (isTelegramWebApp()) return true;
  const ua = navigator.userAgent || "";
  return /WhatsApp|Instagram|FBAN|FBAV|FBIOS|Line\/|MicroMessenger|WV|; wv\)|WebView/i.test(
    ua,
  );
}

/**
 * True when native print is unreliable — use client PDF download instead.
 * Covers TWA + common mobile in-app browsers.
 */
export function shouldUsePdfFallback(): boolean {
  if (typeof window === "undefined") return false;
  if (isInAppWebView()) return true;
  const ua = navigator.userAgent || "";
  const mobile =
    /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      ua,
    );
  if (!mobile) return false;
  // Android WebView without Chrome object — print() is often a no-op.
  return (
    (!(window as unknown as { chrome?: unknown }).chrome &&
      /Android/i.test(ua)) ||
    /; wv\)/i.test(ua)
  );
}

/**
 * Break out of the in-app browser into Chrome / Safari.
 * Tries Telegram.WebApp.openLink, then `_system`, then `_blank`.
 */
export function openCurrentPageExternally(): boolean {
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (!url) return false;

  const wa = getTelegramWebApp();
  if (wa?.openLink) {
    try {
      wa.openLink(url, { try_instant_view: false });
      return true;
    } catch (err) {
      console.error("Telegram.WebApp.openLink failed", err);
    }
  }

  // Cordova / some WebViews honor `_system` for the OS browser.
  try {
    const sys = window.open(url, "_system");
    if (sys) return true;
  } catch {
    /* continue */
  }

  try {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch {
    // Last resort: navigate current frame (user can then use OS share/open).
    try {
      window.location.href = url;
      return true;
    } catch {
      return false;
    }
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Delay revoke so Telegram / Safari can start the download.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

/**
 * Capture the printable letter (#petition-document) into a single A4 PDF.
 * Scales content to fit one page — never spills onto page 2.
 */
export async function downloadPetitionPdf(
  element: HTMLElement,
  filename: string = PETITION_PDF_FILENAME,
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Ensure Telugu / layout locks are visible to the canvas renderer.
  element.setAttribute("translate", "no");
  element.setAttribute("lang", "te");
  if (!element.id) element.id = "petition-document";

  const canvas = await html2canvas(element, {
    scale: Math.min(2, window.devicePixelRatio || 2),
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  if (!canvas.width || !canvas.height) {
    throw new Error("empty_canvas");
  }

  const imgData = canvas.toDataURL("image/jpeg", 0.93);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  // Fit entirely on one A4 sheet (strict single-page contract).
  const widthRatio = usableWidth / canvas.width;
  const heightRatio = usableHeight / canvas.height;
  const ratio = Math.min(widthRatio, heightRatio);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  const x = margin + (usableWidth - imgWidth) / 2;
  const y = margin;

  pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");

  const blob = pdf.output("blob");
  triggerBlobDownload(blob, filename);
}
