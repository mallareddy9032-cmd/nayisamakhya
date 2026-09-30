/**
 * Generates institutional placeholder PNG for Nayee Brahmin Historical & Administrative Trajectory.
 * Placeholder until final user-supplied art is provided.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(
  __dirname,
  "../public/images/heritage/nayee-brahmin-trajectory.png",
);

const W = 1440;
const H = 900;

const pillars = [
  {
    n: "01",
    period: "6th–4th C. BCE",
    title: "Ancient Medical\n& Royal Heritage",
    detail: "Dhanvantari · Charaka\n· Sushruta lineage",
  },
  {
    n: "02",
    period: "12th–18th C.",
    title: "Medieval Temple Music\n& Devotional Agency",
    detail: "Nadaswara · Bajantari\ntemple service",
  },
  {
    n: "03",
    period: "1909–1931",
    title: "Colonial Ethnographic\nMapping",
    detail: "Census & caste\nsurvey records",
  },
  {
    n: "04",
    period: "1996–2000",
    title: "Official Nomenclature\nStandardization",
    detail: "G.O. / Gazette\nnaming clarity",
  },
  {
    n: "05",
    period: "2020–2021",
    title: "Targeted Subsidies\n& Utility Relief",
    detail: "G.O. Ms. No. 23\n250-unit free power",
  },
  {
    n: "06",
    period: "2024–2025",
    title: "CBI (94) &\nSEEEPC Census",
    detail: "Composite Backwardness\nIndex · Vol-II",
  },
];

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function multiline(text, x, y, lineH, attrs) {
  return text
    .split("\n")
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineH}" ${attrs}>${escapeXml(line)}</text>`,
    )
    .join("\n");
}

const colW = 200;
const startX = 70;
const gap = (W - startX * 2 - colW * 6) / 5;
const nodeY = 420;

const pillarNodes = pillars
  .map((p, i) => {
    const x = startX + i * (colW + gap) + colW / 2;
    const cardX = x - colW / 2;
    const isLast = i === pillars.length - 1;
    return `
    <!-- Pillar ${p.n} -->
    <rect x="${cardX}" y="250" width="${colW}" height="280" rx="14"
      fill="${isLast ? "#FFF7ED" : "#FFFFFF"}"
      stroke="${isLast ? "#B45309" : "#EAD7B5"}"
      stroke-width="${isLast ? 2 : 1.25}"/>
    <circle cx="${x}" cy="${nodeY}" r="28"
      fill="${isLast ? "#B45309" : "#0F172A"}"
      stroke="#FBFBFA" stroke-width="3"/>
    <text x="${x}" y="${nodeY + 6}" text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif" font-size="15" font-weight="700"
      fill="#FBFBFA">${p.n}</text>
    <text x="${x}" y="278" text-anchor="middle"
      font-family="system-ui, sans-serif" font-size="12" font-weight="700"
      letter-spacing="0.06em" fill="#B45309">${escapeXml(p.period.toUpperCase())}</text>
    ${multiline(p.title, x, 308, 20, `text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-weight="700" fill="#0F172A"`)}
    ${multiline(p.detail, x, 368, 16, `text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#475569"`)}
  `;
  })
  .join("\n");

const spineX1 = startX + colW / 2;
const spineX2 = startX + 5 * (colW + gap) + colW / 2;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="goldBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#92400E"/>
      <stop offset="50%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Warm paper ground -->
  <rect width="${W}" height="${H}" fill="#FBFBFA"/>
  <rect x="32" y="28" width="${W - 64}" height="${H - 56}" rx="20"
    fill="#FBFBFA" stroke="#EAD7B5" stroke-width="1.5"/>

  <!-- Masthead -->
  <text x="72" y="78" font-family="system-ui, sans-serif" font-size="13" font-weight="700"
    letter-spacing="0.18em" fill="#B45309">NAYI SAMAKHYA TELANGANA · ARCHIVAL INFOGRAPHIC</text>
  <text x="72" y="118" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700"
    fill="#0F172A">Historical &amp; Administrative Trajectory</text>
  <text x="72" y="148" font-family="system-ui, sans-serif" font-size="16"
    fill="#475569">Nayee Brahmin community — six civic pillars from ancient heritage to CBI 94</text>
  <rect x="72" y="168" width="120" height="3" rx="1.5" fill="url(#goldBar)"/>

  <!-- CBI dial callout -->
  <g filter="url(#softShadow)">
    <rect x="1080" y="58" width="288" height="148" rx="16" fill="#0F172A"/>
  </g>
  <circle cx="1155" cy="132" r="46" fill="none" stroke="#334155" stroke-width="8"/>
  <circle cx="1155" cy="132" r="46" fill="none" stroke="#B45309" stroke-width="8"
    stroke-dasharray="260" stroke-dashoffset="16" stroke-linecap="round"
    transform="rotate(-90 1155 132)"/>
  <text x="1155" y="128" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="700" fill="#FBFBFA">94</text>
  <text x="1155" y="148" text-anchor="middle"
    font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="0.12em" fill="#FBBF24">CBI</text>
  <text x="1215" y="108" font-family="system-ui, sans-serif" font-size="13" font-weight="700"
    fill="#FBBF24">CBI 94</text>
  <text x="1215" y="130" font-family="system-ui, sans-serif" font-size="12"
    fill="#CBD5E1">Composite Backwardness</text>
  <text x="1215" y="148" font-family="system-ui, sans-serif" font-size="12"
    fill="#CBD5E1">Index · SEEEPC Vol-II</text>
  <text x="1215" y="172" font-family="system-ui, sans-serif" font-size="11"
    fill="#94A3B8">Pop. 4,33,785 (1.2%)</text>

  <!-- Spine -->
  <line x1="${spineX1}" y1="${nodeY}" x2="${spineX2}" y2="${nodeY}"
    stroke="#EAD7B5" stroke-width="3"/>
  <line x1="${spineX1}" y1="${nodeY}" x2="${spineX2}" y2="${nodeY}"
    stroke="url(#goldBar)" stroke-width="3" stroke-dasharray="8 6"/>

  ${pillarNodes}

  <!-- Footer band -->
  <rect x="72" y="560" width="${W - 144}" height="1" fill="#EAD7B5"/>
  <text x="72" y="600" font-family="Georgia, 'Times New Roman', serif" font-size="18" font-weight="700"
    fill="#0F172A">Contemporary Rights Milestone</text>
  <text x="72" y="628" font-family="system-ui, sans-serif" font-size="14"
    fill="#475569">Telangana SEEEPC Survey Vol-II documents Composite Backwardness Index 94 for the Nayee Brahmin community,</text>
  <text x="72" y="650" font-family="system-ui, sans-serif" font-size="14"
    fill="#475569">with a recorded population of 4,33,785 (1.2% of state population) — grounding welfare planning in census evidence.</text>

  <rect x="72" y="680" width="${W - 144}" height="72" rx="12" fill="#FFF7ED" stroke="#EAD7B5"/>
  <text x="96" y="710" font-family="system-ui, sans-serif" font-size="13" font-weight="700"
    letter-spacing="0.08em" fill="#B45309">PLACEHOLDER ART · REPLACE WITH FINAL USER-SUPPLIED INFOGRAPHIC</text>
  <text x="96" y="734" font-family="system-ui, sans-serif" font-size="13"
    fill="#64748B">Generated for nayisamakhya.org · Warm Paper #FBFBFA · Slate #0F172A · Gold #B45309 · Six-pillar trajectory with CBI 94 callout</text>

  <text x="${W - 72}" y="820" text-anchor="end" font-family="system-ui, sans-serif" font-size="12"
    fill="#94A3B8">nayisamakhya.org/history</text>
</svg>`;

mkdirSync(dirname(outPath), { recursive: true });
const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes, ${W}×${H})`);
