const JUMPS = [
  { href: "/districts", label: "జిల్లాలు" },
  { href: "#heritage-triad", label: "వారసత్వం" },
  { href: "#persona-section", label: "వ్యక్తిత్వాలు" },
  { href: "#civic-timeline", label: "కాలక్రమం" },
  { href: "#three-click", label: "సేవలు" },
  { href: "#grievance-desk", label: "వినతి డెస్క్" },
  { href: "#stalwarts", label: "మార్గదర్శకులు" },
] as const;

/** Thin “On this page” chip row under metrics — guides long homepage rhythm. */
export function HomeJumpNav() {
  return (
    <nav
      aria-label="On this page"
      className="mx-auto max-w-6xl px-4 pb-2 pt-4 sm:pt-5"
    >
      <p className="mb-2 text-center">
        <span className="civic-eyebrow-pill">
          ఈ పేజీలో ముఖ్య విభాగాలు • Quick Nav
        </span>
      </p>
      <ul className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible">
        {JUMPS.map((j) => (
          <li key={j.href} className="shrink-0">
            <a
              href={j.href}
              className="civic-focus-ring inline-flex min-h-10 items-center rounded-full border border-[#EAD7B5] bg-white px-3.5 py-2 font-telugu text-[11px] font-bold text-[#1E293B] transition hover:border-[#B45309]/50 hover:bg-[#FFFDF9]"
            >
              {j.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
