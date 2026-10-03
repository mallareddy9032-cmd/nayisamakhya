import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  subtitleEn?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * One pill · one Suranna H2 · optional EN subtitle — avoids stacked TE/EN collisions.
 */
export function SectionHeading({
  eyebrow,
  title,
  titleId,
  subtitleEn,
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <header className={`mb-5 max-w-3xl ${className}`.trim()}>
      <span className="civic-eyebrow-pill">{eyebrow}</span>
      <h2
        id={titleId}
        className="mt-3 font-display-te text-2xl font-normal leading-telugu tracking-tight text-[#0F172A] sm:text-3xl"
      >
        {title}
      </h2>
      {subtitleEn ? (
        <p className="mt-1.5 font-sans text-sm font-medium tracking-wide text-slate-500">
          {subtitleEn}
        </p>
      ) : null}
      {children}
    </header>
  );
}

/** Canonical homepage section eyebrow pills (exactly one per section). */
export const SECTION_EYEBROWS = {
  heritageTriad: "సాంస్కృతిక త్రివేణి • HERITAGE TRIAD",
  empowermentPillars: "సమగ్ర సంక్షేమం • EMPOWERMENT PILLARS",
  civicTimeline: "చారిత్రక ప్రస్థానం • CIVIC TIMELINE",
  threeClickTools: "ప్రజా సేవలు • 3-CLICK TOOLS",
  oneClickDesk: "తక్షణ సహాయం • 1-CLICK DESK",
  luminaries: "మార్గదర్శకులు • LUMINARIES",
} as const;
