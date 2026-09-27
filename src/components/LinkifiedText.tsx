import type { ReactNode } from "react";

const URL_RE =
  /(https?:\/\/[^\s<>"'`)\]]+|@[A-Za-z][A-Za-z0-9_]{3,})/g;

function hrefFor(token: string): string | null {
  if (token.startsWith("http://") || token.startsWith("https://")) {
    // Trim trailing punctuation / closers often stuck to URLs in chat drafts.
    return token.replace(/[.,;:!?)\]]+$/u, "");
  }
  if (token.startsWith("@")) {
    return `https://t.me/${token.slice(1)}`;
  }
  return null;
}

/** Render plain blast text with clickable http(s) URLs and @Telegram handles. */
export function LinkifiedText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_RE.source, "g");

  while ((match = re.exec(text)) !== null) {
    const token = match[0];
    const start = match.index;
    if (start > last) {
      parts.push(text.slice(last, start));
    }
    const href = hrefFor(token);
    const display = href && token.startsWith("http") ? href : token;
    if (href) {
      parts.push(
        <a
          key={`${start}-${token}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-civic-bronze underline underline-offset-2 hover:text-civic-bronze-hover"
        >
          {display}
        </a>,
      );
    } else {
      parts.push(token);
    }
    last = start + token.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return (
    <pre className="font-telugu whitespace-pre-wrap break-words text-[14px] leading-relaxed text-civic-ink sm:text-[15px]">
      {parts}
    </pre>
  );
}

/** Unique openable targets (http + @Telegram) for chip buttons. */
export function extractBlastUrls(text: string): string[] {
  const urls = (text.match(/https?:\/\/[^\s<>"'`)\]]+/g) || []).map((u) =>
    u.replace(/[.,;:!?)\]]+$/u, ""),
  );
  const handles = (text.match(/@[A-Za-z][A-Za-z0-9_]{3,}/g) || []).map(
    (h) => `https://t.me/${h.slice(1)}`,
  );
  return [...new Set([...urls, ...handles])];
}
