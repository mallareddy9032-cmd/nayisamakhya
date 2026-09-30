"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, MessageCircle } from "lucide-react";

const WA =
  "https://wa.me/919032654111?text=" +
  encodeURIComponent(
    "నమస్కారం నాయి సమాఖ్య డెస్క్, నాకు వినతిపత్రం / సేవా సహాయం కావాలి.",
  );

/** Slim sticky conversion bar after hero — mobile only. */
export function MobileStickyActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home-hero");
      const footer = document.querySelector("footer");
      const pastHero = hero
        ? window.scrollY > hero.offsetTop + hero.offsetHeight - 80
        : window.scrollY > 420;
      const nearFooter = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 40
        : false;
      setVisible(pastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EAD7B5] bg-white/95 px-3 py-2 shadow-[0_-8px_24px_rgb(15_23_42_/0.1)] backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <Link
          href="/representation"
          className="civic-focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#D97706] px-3 font-telugu text-xs font-bold text-white"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden />
          వినతిపత్రం
        </Link>
        <a
          href={WA}
          target="_blank"
          rel="noreferrer"
          className="civic-focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#128C7E]/40 bg-white px-3 font-telugu text-xs font-bold text-[#0E7A6E]"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
