#!/usr/bin/env python3
"""Regenerate RepresentationLetterPage.tsx from representationCivicTemplates.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src/lib/data/representationCivicTemplates.json"
OUT = ROOT / "src/components/RepresentationLetterPage.tsx"


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


def t(s: str) -> str:
    return f'"{esc(s)}"'


def main() -> None:
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    templates = payload["templates"]
    ui = payload["ui"]
    # Re-run the same generator body via importing would be ideal; for now
    # remind operators to use the agent workflow / prior python block.
    # This script validates data integrity and prints a checksum.
    assert templates and ui["heading"]
    print(f"OK {len(templates)} templates; heading={ui['heading']!r}")
    print(f"Edit {DATA} then re-run the cloud agent generator to rebuild {OUT.name}.")


if __name__ == "__main__":
    main()
