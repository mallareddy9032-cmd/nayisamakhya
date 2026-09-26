#!/usr/bin/env python3
"""Generate src/app/layout.tsx with ASCII-safe Telugu metadata escapes."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/app/layout.tsx"


def te(*cps: int) -> str:
    return "".join(chr(c) for c in cps)


def esc(s: str) -> str:
    out: list[str] = []
    for c in s:
        o = ord(c)
        if c == "\\":
            out.append("\\\\")
        elif c == '"':
            out.append('\\"')
        elif o < 32 or o > 126:
            out.append(f"\\u{o:04x}")
        else:
            out.append(c)
    return "".join(out)


def main() -> None:
    # నాయి సమాఖ్య తెలంగాణ | అధికారిక డిజిటల్ సేవా డెస్క్
    title = (
        te(0x0C28, 0x0C3E, 0x0C2F, 0x0C3F)
        + " "
        + te(0x0C38, 0x0C2E, 0x0C3E, 0x0C16, 0x0C4D, 0x0C2F)
        + " "
        + te(0x0C24, 0x0C46, 0x0C32, 0x0C02, 0x0C17, 0x0C3E, 0x0C23)
        + " | "
        + te(0x0C05, 0x0C27, 0x0C3F, 0x0C15, 0x0C3E, 0x0C30, 0x0C3F, 0x0C15)
        + " "
        + te(0x0C21, 0x0C3F, 0x0C1C, 0x0C3F, 0x0C1F, 0x0C32, 0x0C4D)
        + " "
        + te(0x0C38, 0x0C47, 0x0C35, 0x0C3E)
        + " "
        + te(0x0C21, 0x0C46, 0x0C38, 0x0C4D, 0x0C15, 0x0C4D)
    )
    # తెలంగాణ నాయి బ్రాహ్మణ, మంగలి & బజంత్రి కమ్యూనిటీ సాధికారత, సంక్షేమం మరియు వినతిపత్రాల సమర్పణ కేంద్రం.
    desc = (
        te(0x0C24, 0x0C46, 0x0C32, 0x0C02, 0x0C17, 0x0C3E, 0x0C23)
        + " "
        + te(0x0C28, 0x0C3E, 0x0C2F, 0x0C3F)
        + " "
        + te(0x0C2C, 0x0C4D, 0x0C30, 0x0C3E, 0x0C39, 0x0C4D, 0x0C2E, 0x0C23)
        + ", "
        + te(0x0C2E, 0x0C02, 0x0C17, 0x0C32, 0x0C3F)
        + " & "
        + te(0x0C2C, 0x0C1C, 0x0C02, 0x0C24, 0x0C4D, 0x0C30, 0x0C3F)
        + " "
        + te(0x0C15, 0x0C2E, 0x0C4D, 0x0C2F, 0x0C42, 0x0C28, 0x0C3F, 0x0C1F, 0x0C40)
        + " "
        + te(0x0C38, 0x0C3E, 0x0C27, 0x0C3F, 0x0C15, 0x0C3E, 0x0C30, 0x0C24)
        + ", "
        + te(0x0C38, 0x0C02, 0x0C15, 0x0C4D, 0x0C37, 0x0C47, 0x0C2E, 0x0C02)
        + " "
        + te(0x0C2E, 0x0C30, 0x0C3F, 0x0C2F, 0x0C41)
        + " "
        + te(
            0x0C35,
            0x0C3F,
            0x0C28,
            0x0C24,
            0x0C3F,
            0x0C2A,
            0x0C24,
            0x0C4D,
            0x0C30,
            0x0C3E,
            0x0C32,
        )
        + " "
        + te(0x0C38, 0x0C2E, 0x0C30, 0x0C4D, 0x0C2A, 0x0C23)
        + " "
        + te(0x0C15, 0x0C47, 0x0C02, 0x0C26, 0x0C4D, 0x0C30, 0x0C02)
        + "."
    )
    assert "\ufffd" not in title + desc
    print("title:", title)
    print("desc:", desc)

    OUT.write_text(
        f'''import type {{ Metadata, Viewport }} from "next";
import type {{ ReactNode }} from "react";
import {{ Noto_Sans_Telugu, Plus_Jakarta_Sans }} from "next/font/google";
import {{ AppShell }} from "@/components/AppShell";
import {{ LanguageProvider }} from "@/components/providers/LanguageProvider";
import "./globals.css";

const sans = Plus_Jakarta_Sans({{
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
}});

const telugu = Noto_Sans_Telugu({{
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
  display: "swap",
}});

export const metadata: Metadata = {{
  title: "{esc(title)}",
  description: "{esc(desc)}",
  applicationName: "Nayi Samakhya",
  manifest: "/manifest.webmanifest",
}};

export const viewport: Viewport = {{
  themeColor: "#B45309",
  width: "device-width",
  initialScale: 1,
}};

export default function RootLayout({{
  children,
}}: Readonly<{{
  children: ReactNode;
}}>) {{
  return (
    <html
      lang="te"
      suppressHydrationWarning
      className={{`${{sans.variable}} ${{telugu.variable}} h-full`}}
    >
      <body className="flex min-h-dvh flex-col bg-civic-paper font-sans text-civic-ink antialiased selection:bg-civic-bronze selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <AppShell>{{children}}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}}
''',
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
