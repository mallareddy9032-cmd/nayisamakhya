import type { Metadata } from "next";
import { Suspense } from "react";
import { RepresentationLetterPage } from "@/components/RepresentationLetterPage";

export const metadata: Metadata = {
  title: "Representation letter | Nayi Samakhya",
  description:
    "Generate formal bilingual representation letters for Mandal and Town Coordinators.",
};

export default function RepresentationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
          Loading petition maker…
        </div>
      }
    >
      <RepresentationLetterPage />
    </Suspense>
  );
}
