"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Users,
  ExternalLink,
  Lock,
  Send,
  MapPin,
} from "lucide-react";

export function CivicFooter() {
  const pathname = usePathname() || "";
  const year = new Date().getFullYear();

  // Full-bleed tool surfaces — no light sitemap under dark/print/TWA chrome.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/announce") ||
    pathname.startsWith("/twa") ||
    pathname.startsWith("/poster")
  ) {
    return null;
  }

  return (
    <footer className="no-print mt-auto border-t border-civic-border bg-white font-sans text-xs text-slate-600 print:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-civic-bronze/20 bg-civic-bronze/10 p-1.5 text-civic-bronze">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-telugu text-sm font-bold text-civic-ink">
              {"\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23"}
            </span>
          </div>
          <p className="font-telugu text-[11px] leading-relaxed text-slate-500">
            {"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c35\u0c4d\u0c2f\u0c3e\u0c2a\u0c4d\u0c24\u0c02\u0c17\u0c3e \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02, \u0c2a\u0c4d\u0c30\u0c1c\u0c3e \u0c2a\u0c4d\u0c30\u0c3e\u0c24\u0c3f\u0c28\u0c3f\u0c27\u0c4d\u0c2f\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c38\u0c4d\u0c2f\u0c32 \u0c2a\u0c30\u0c3f\u0c37\u0c4d\u0c15\u0c3e\u0c30\u0c02 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c30\u0c42\u0c2a\u0c4a\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c47\u0c26\u0c3f\u0c15."}
          </p>
          <div className="flex items-center gap-1.5 pt-1 font-telugu text-[11px] text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-civic-bronze" />
            <span>{"33 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e\u0c32\u0c41 \u2022 589 \u0c2e\u0c02\u0c21\u0c32\u0c3e\u0c32\u0c41"}</span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <FileText className="h-3.5 w-3.5 text-civic-bronze" />
            {"\u0c2a\u0c4d\u0c30\u0c1c\u0c3e \u0c38\u0c47\u0c35\u0c32\u0c41 & \u0c35\u0c3f\u0c28\u0c24\u0c41\u0c32\u0c41"}
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <Link
                href="/"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c2a\u0c4d\u0c30\u0c27\u0c3e\u0c28 \u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c32\u0c4d (Home)"}</span>
                <span className="font-sans text-[10px] text-slate-400">/</span>
              </Link>
            </li>
            <li>
              <Link
                href="/representation"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c24\u0c2f\u0c3e\u0c30\u0c40"}</span>
                <span className="font-sans text-[10px] text-slate-400">
                  /representation
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/feed"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30 \u0c38\u0c2e\u0c40\u0c15\u0c4d\u0c37 & \u0c38\u0c2e\u0c38\u0c4d\u0c2f\u0c32 \u0c2b\u0c40\u0c21\u0c4d"}</span>
                <span className="font-sans text-[10px] text-slate-400">/feed</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <Users className="h-3.5 w-3.5 text-civic-bronze" />
            {"\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24\u0c32 \u0c35\u0c47\u0c26\u0c3f\u0c15"}
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <Link
                href="/coordinators/card"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 \u0c21\u0c3f\u0c1c\u0c3f\u0c1f\u0c32\u0c4d \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41"}</span>
                <span className="font-sans text-[10px] text-slate-400">
                  /coordinators/card
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/poster"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c37\u0c3e\u0c2a\u0c41 QR \u0c2a\u0c4b\u0c38\u0c4d\u0c1f\u0c30\u0c4d (A4)"}</span>
                <span className="font-sans text-[10px] text-slate-400">/poster</span>
              </Link>
            </li>
            <li>
              <Link
                href="/twa"
                className="flex items-center justify-between hover:text-civic-bronze"
              >
                <span>{"\u0c1f\u0c46\u0c32\u0c3f\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c4d Mini App \u0c39\u0c2c\u0c4d"}</span>
                <span className="font-sans text-[10px] text-slate-400">/twa</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1 font-telugu text-xs font-bold uppercase tracking-wider text-civic-ink">
            <Send className="h-3.5 w-3.5 text-civic-bronze" />
            {"\u0c38\u0c47\u0c35\u0c3e \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d & \u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d"}
          </h3>
          <ul className="space-y-2.5 font-telugu text-[12px]">
            <li>
              <a
                href="https://t.me/NayiSamakhyaDeskBot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between font-semibold text-civic-ink hover:text-civic-bronze"
              >
                <span>{"\u0c1f\u0c46\u0c32\u0c3f\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c4d \u0c2c\u0c3e\u0c1f\u0c4d (@NayiSamakhyaDeskBot)"}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </li>
            <li>
              <Link
                href="/admin/desk"
                className="flex items-center justify-between text-slate-600 hover:text-civic-bronze"
              >
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-slate-400" />
                  {"\u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d & \u0c05\u0c28\u0c32\u0c3f\u0c1f\u0c3f\u0c15\u0c4d\u0c38\u0c4d"}
                </span>
                <span className="font-sans text-[10px] text-slate-400">
                  /admin/desk
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-civic-border bg-slate-50 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-[11px] text-slate-500 sm:flex-row">
          <p className="font-telugu">
            © {year} {"\u0c28\u0c3e\u0c2f\u0c3f \u0c38\u0c2e\u0c3e\u0c16\u0c4d\u0c2f \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23. \u0c38\u0c30\u0c4d\u0c35 \u0c39\u0c15\u0c4d\u0c15\u0c41\u0c32\u0c41 \u0c2a\u0c4d\u0c30\u0c24\u0c4d\u0c2f\u0c47\u0c15\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c4d\u0c21\u0c3e\u0c2f\u0c3f."}
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-sans font-medium text-slate-600">
              nayisamakhya.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CivicFooter;
