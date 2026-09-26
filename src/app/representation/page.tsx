import type { Metadata } from "next";
import { Suspense } from "react";
import { RepresentationLetterPage } from "@/components/RepresentationLetterPage";

export const metadata: Metadata = {
  title: "\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40 | Nayi Samakhya",
  description:
    "\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c28\u0c3e\u0c2f\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c3e\u0c32 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 A4 \u0c32\u0c46\u0c1f\u0c30\u0c4d \u0c1c\u0c28\u0c30\u0c47\u0c1f\u0c30\u0c4d.",
};

export default function RepresentationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-civic-paper font-telugu text-sm text-slate-500">
          {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c32\u0c4b\u0c21\u0c4d \u0c05\u0c35\u0c41\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c26\u0c3f\u2026"}
        </div>
      }
    >
      <RepresentationLetterPage />
    </Suspense>
  );
}
