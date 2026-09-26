import type { Metadata } from "next";
import { RepresentationGenerator } from "@/components/RepresentationGenerator";

export const metadata: Metadata = {
  title: "Representation letter | Nayi Samakhya",
  description:
    "Generate formal bilingual representation letters for Mandal and Town Coordinators.",
};

export default function RepresentationPage() {
  return <RepresentationGenerator />;
}
