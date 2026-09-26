import { FaqSection } from "@/components/FaqSection";
import { FloatingActionWidget } from "@/components/FloatingActionWidget";
import { GalleryPreview } from "@/components/GalleryPreview";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PressSection } from "@/components/PressSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FloatingActionWidget />
      <FaqSection />
      <GalleryPreview />
      <PressSection />
    </>
  );
}
