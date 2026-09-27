/**
 * Print / PDF helpers for Representation Petition Maker.
 * Desktop: native window.print(). Telegram Mini App / mobile webviews: html2canvas + jspdf.
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

export const PDF_LOADING_TE = "పీడీఎఫ్ సిద్ధం అవుతోంది...";
export const OPEN_EXTERNAL_BROWSER_LABEL =
  "పూర్తి ఫీచర్ల కొరకు క్రోమ్ లేదా సఫారీలో తెరవండి (Open in Browser)";

function telegramWindow(): TelegramWindow | null {
  if (typeof window === "undefined") return null;
  return window as TelegramWindow;
}

export function getTelegramWebApp(): TelegramWebAppLike | null {
  return telegramWindow()?.Telegram?.WebApp ?? null;
}

export function isTelegramWebApp(): boolean {
  const wa = getTelegramWebApp();
  if (!wa) return false;
  // Real Mini Apps expose initData or a non-empty platform.
  return Boolean(wa.initData) || Boolean(wa.platform && wa.platform !== "unknown");
}

/** True when native print is unlikely to work (TWA or typical mobile in-app webview). */
export function shouldUsePdfFallback(): boolean {
  if (typeof window === "undefined") return false;
  if (isTelegramWebApp()) return true;
  const ua = navigator.userAgent || "";
  const mobile =
    /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      ua,
    );
  if (!mobile) return false;
  // In-app browsers / WebViews where print() is a no-op.
  return (
    /Telegram|FBAN|FBAV|Instagram|Line\/|MicroMessenger|WV|WebView/i.test(ua) ||
    (!(window as unknown as { chrome?: unknown }).chrome &&
      /Android/i.test(ua))
  );
}

export function openCurrentPageExternally(): boolean {
  const wa = getTelegramWebApp();
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (!url) return false;
  if (wa?.openLink) {
    try {
      wa.openLink(url, { try_instant_view: false });
      return true;
    } catch (err) {
      console.error("Telegram.WebApp.openLink failed", err);
    }
  }
  try {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Delay revoke so Telegram / Safari can start the download.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Capture `.printable-card` (or provided element) into an A4 PDF and download it.
 * Prefer this path inside Telegram Mini Apps.
 */
export async function downloadPetitionPdf(
  element: HTMLElement,
  filename = "nayi-samakhya-vinathipatra.pdf",
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: Math.min(2, window.devicePixelRatio || 2),
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;
  const imgWidth = usableWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
  heightLeft -= usableHeight;

  while (heightLeft > 1) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
    heightLeft -= usableHeight;
  }

  const blob = pdf.output("blob");
  triggerBlobDownload(blob, filename);

  // Escape hatch reserved for Telegram; download above is the primary path.
  void getTelegramWebApp();
}
