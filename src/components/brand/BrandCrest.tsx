import Image from "next/image";
import { cn } from "@/lib/utils";

export const BRAND_CREST_SRC = "/brand/nayi-samakhya-crest.png";
export const BRAND_CREST_WHITE_SRC = "/brand/nayi-samakhya-crest-white.png";

type BrandCrestSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const SIZE_PX: Record<BrandCrestSize, number> = {
  xs: 28,
  sm: 36,
  md: 40,
  lg: 52,
  xl: 64,
  hero: 96,
};

type BrandCrestProps = {
  size?: BrandCrestSize;
  className?: string;
  /** Soft gold ring — optional accent on light headers */
  ring?: boolean;
  priority?: boolean;
  alt?: string;
};

/**
 * Official Nayi Samakhya Telangana heraldic crest.
 * Transparent / clean circular PNG; object-contain; optically sized for nav/footer/emblems.
 */
export function BrandCrest({
  size = "md",
  className,
  ring = false,
  priority = false,
  alt = "నాయీ సమాఖ్య తెలంగాణ — heraldic crest",
}: BrandCrestProps) {
  const px = SIZE_PX[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent",
        ring && "ring-1 ring-[#D69E2E]/40 ring-offset-1 ring-offset-transparent",
        className,
      )}
      style={{ width: px, height: px }}
      aria-hidden={alt === "" ? true : undefined}
    >
      <Image
        src={BRAND_CREST_SRC}
        alt={alt}
        width={px}
        height={px}
        className="h-full w-full object-contain"
        priority={priority}
        sizes={`${px}px`}
      />
    </span>
  );
}
