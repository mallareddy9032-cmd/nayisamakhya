// Not next/og: it bundles pre-HarfBuzz Satori (and aliases @vercel/og to it), which breaks
// Telugu conjuncts like సూర్యాపేట. Satori >=0.33 shapes them; sharp rasterizes for WhatsApp.
import satori from "satori";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const [teluguBold, jakartaBold] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/NotoSansTelugu-Bold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-Bold.ttf")),
]);

const PAPER = "#FBFBFA";
const SLATE = "#0F172A";
const NAVY = "#1E293B";
const GOLD = "#B45309";
const EMERALD = "#047857";

function param(sp: URLSearchParams, key: string, fallback: string, max: number) {
  const value = sp.get(key)?.trim();
  return value ? value.slice(0, max) : fallback;
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const title = param(sp, "title", "నాయి సమాఖ్య తెలంగాణ", 90);
  const subtitle = param(sp, "subtitle", "అధికారిక డిజిటల్ సేవా డెస్క్", 140);
  const district = sp.get("district")?.trim().slice(0, 48);
  const badge = param(sp, "badge", "Verified Civic Desk", 32);

  const svg = await satori(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          fontFamily: "Plus Jakarta Sans, Noto Sans Telugu",
          color: SLATE,
        }}
      >
        <div style={{ display: "flex", height: 12, background: GOLD }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 72px 48px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: NAVY,
                  color: PAPER,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                }}
              >
                NS
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 28, color: NAVY }}>నాయి సమాఖ్య</div>
                <div style={{ fontSize: 16, letterSpacing: 4, color: GOLD }}>NAYI SAMAKHYA TELANGANA</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 999,
                border: `2px solid ${EMERALD}`,
                background: "#ECFDF5",
                color: EMERALD,
                fontSize: 22,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill={EMERALD} />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {badge}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {district ? (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 18px",
                    borderRadius: 10,
                    background: GOLD,
                    color: PAPER,
                    fontSize: 26,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={PAPER} />
                  </svg>
                  {district}
                </div>
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize: 68, lineHeight: 1.25, color: SLATE }}>{title}</div>
            <div style={{ display: "flex", fontSize: 32, lineHeight: 1.4, color: NAVY, opacity: 0.8 }}>{subtitle}</div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `2px solid ${NAVY}1A`,
              paddingTop: 24,
              fontSize: 22,
              color: NAVY,
            }}
          >
            <div style={{ display: "flex" }}>www.nayisamakhya.org</div>
            <div style={{ display: "flex", color: GOLD }}>తెలంగాణ రాష్ట్ర కమ్యూనిటీ సేవా వేదిక</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Plus Jakarta Sans", data: jakartaBold, weight: 700, style: "normal" },
        { name: "Noto Sans Telugu", data: teluguBold, weight: 700, style: "normal" },
      ],
    },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
