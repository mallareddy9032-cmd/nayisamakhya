/**
 * Shared WhatsApp share helper for NayiSamakhya growth surfaces
 * (Quiz certificate, Sprint referral, and future CTAs).
 *
 * Uses wa.me so desktop opens WhatsApp Web and mobile opens the app.
 */

export function generateWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text.trim())}`;
}

export function triggerWhatsAppShare(text: string): void {
  const url = generateWhatsAppShareUrl(text);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
