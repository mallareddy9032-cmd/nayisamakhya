"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface TemplateOption {
  id: string;
  title: string;
  category: string;
  subject: string;
  body: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "modern_salon_space",
    title: "\u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c37\u0c3e\u0c2a\u0c41\u0c32 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c38\u0c4d\u0c25\u0c32 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c2a\u0c41",
    category: "\u0c2e\u0c4c\u0c32\u0c3f\u0c15 \u0c35\u0c38\u0c24\u0c41\u0c32\u0c41 (Infrastructure)",
    subject: "\u0c17\u0c4d\u0c30\u0c3e\u0c2e/\u0c2a\u0c1f\u0c4d\u0c1f\u0c23 \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c15\u0c3e\u0c02\u0c2a\u0c4d\u0c32\u0c46\u0c15\u0c4d\u0c38\u0c4d \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c4d\u0c25\u0c32\u0c02 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c1a\u0c41\u0c1f \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f \u0c35\u0c3f\u0c28\u0c24\u0c3f.",
    body: "\u0c2e\u0c3e \u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c02\u0c32\u0c4b \u0c05\u0c28\u0c47\u0c15 \u0c38\u0c02\u0c35\u0c24\u0c4d\u0c38\u0c30\u0c3e\u0c32\u0c41\u0c17\u0c3e \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c05\u0c26\u0c4d\u0c26\u0c46 \u0c37\u0c3e\u0c2a\u0c41\u0c32\u0c32\u0c4b \u0c05\u0c27\u0c3f\u0c15 \u0c05\u0c26\u0c4d\u0c26\u0c46\u0c32\u0c41 \u0c1a\u0c46\u0c32\u0c4d\u0c32\u0c3f\u0c02\u0c1a\u0c32\u0c47\u0c15 \u0c24\u0c40\u0c35\u0c4d\u0c30 \u0c06\u0c30\u0c4d\u0c25\u0c3f\u0c15 \u0c07\u0c2c\u0c4d\u0c2c\u0c02\u0c26\u0c41\u0c32\u0c41 \u0c0e\u0c26\u0c41\u0c30\u0c4d\u0c15\u0c4a\u0c02\u0c1f\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c30\u0c41. \u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c38\u0c4d\u0c25\u0c3e\u0c28\u0c3f\u0c15 \u0c17\u0c4d\u0c30\u0c3e\u0c2e \u0c2a\u0c02\u0c1a\u0c3e\u0c2f\u0c24\u0c40/\u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c3e\u0c32\u0c3f\u0c1f\u0c40 \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b\u0c28\u0c3f \u0c05\u0c28\u0c41\u0c35\u0c48\u0c28 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c4d\u0c25\u0c32\u0c02\u0c32\u0c4b \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c06\u0c27\u0c41\u0c28\u0c3f\u0c15 \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d\u0c32 \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3e\u0c23\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c4d\u0c25\u0c32\u0c02 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c1a\u0c3f, \u0c38\u0c39\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.",
  },
  {
    id: "community_hall",
    title: "\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c2d\u0c35\u0c28\u0c02 / \u0c2b\u0c02\u0c15\u0c4d\u0c37\u0c28\u0c4d \u0c39\u0c3e\u0c32\u0c4d \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3e\u0c23\u0c02",
    category: "\u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c02 (Welfare)",
    subject: "\u0c2e\u0c02\u0c21\u0c32 \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02\u0c32\u0c4b \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c2d\u0c35\u0c28 \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3e\u0c23\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c28\u0c3f\u0c27\u0c41\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c4d\u0c25\u0c32 \u0c15\u0c47\u0c1f\u0c3e\u0c2f\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c35\u0c3f\u0c28\u0c24\u0c3f.",
    body: "\u0c2e\u0c3e \u0c2e\u0c02\u0c21\u0c32 \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b\u0c28\u0c3f \u0c2a\u0c47\u0c26 \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32 \u0c38\u0c3e\u0c02\u0c38\u0c4d\u0c15\u0c43\u0c24\u0c3f\u0c15, \u0c38\u0c3e\u0c2e\u0c3e\u0c1c\u0c3f\u0c15 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c3f\u0c35\u0c3e\u0c39\u0c3e\u0c26\u0c3f \u0c36\u0c41\u0c2d\u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c3e\u0c32 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23 \u0c15\u0c4a\u0c30\u0c15\u0c41 \u0c2a\u0c4d\u0c30\u0c24\u0c4d\u0c2f\u0c47\u0c15 \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c2d\u0c35\u0c28\u0c02 \u0c05\u0c02\u0c26\u0c41\u0c2c\u0c3e\u0c1f\u0c41\u0c32\u0c4b \u0c32\u0c47\u0c26\u0c41. \u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2a\u0c25\u0c15\u0c3e\u0c32 \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c39\u0c3e\u0c32\u0c4d \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3e\u0c23\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c4d\u0c25\u0c32\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c24\u0c17\u0c3f\u0c28 \u0c17\u0c4d\u0c30\u0c3e\u0c02\u0c1f\u0c41 \u0c2e\u0c02\u0c1c\u0c42\u0c30\u0c41 \u0c1a\u0c47\u0c2f\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c2e\u0c28\u0c35\u0c3f.",
  },
  {
    id: "id_cards_welfare",
    title: "\u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c15\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41",
    category: "\u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 & \u0c30\u0c15\u0c4d\u0c37\u0c23 (Civic Rights)",
    subject: "\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2c\u0c4b\u0c30\u0c4d\u0c21\u0c41 \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c05\u0c30\u0c4d\u0c39\u0c41\u0c32\u0c48\u0c28 \u0c38\u0c3e\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c02\u0c26\u0c30\u0c3f\u0c15\u0c40 \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c1c\u0c3e\u0c30\u0c40 \u0c1a\u0c47\u0c2f\u0c41\u0c1f \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f.",
    body: "\u0c2e\u0c3e \u0c2a\u0c30\u0c3f\u0c27\u0c3f\u0c32\u0c4b \u0c38\u0c46\u0c32\u0c42\u0c28\u0c4d \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c2a\u0c48 \u0c06\u0c27\u0c3e\u0c30\u0c2a\u0c21\u0c3f \u0c1c\u0c40\u0c35\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28 \u0c15\u0c3e\u0c30\u0c4d\u0c2e\u0c3f\u0c15\u0c41\u0c32\u0c15\u0c41 \u0c0e\u0c1f\u0c41\u0c35\u0c02\u0c1f\u0c3f \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c32\u0c47\u0c15\u0c2a\u0c4b\u0c35\u0c21\u0c02 \u0c35\u0c32\u0c4d\u0c32 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41, \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c2c\u0c40\u0c2e\u0c3e \u0c05\u0c02\u0c26\u0c21\u0c02 \u0c32\u0c47\u0c26\u0c41. \u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c38\u0c30\u0c4d\u0c35\u0c47 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c3f\u0c02\u0c1a\u0c3f \u0c05\u0c30\u0c4d\u0c39\u0c41\u0c32\u0c48\u0c28 \u0c2a\u0c4d\u0c30\u0c24\u0c3f \u0c12\u0c15\u0c4d\u0c15\u0c30\u0c3f\u0c15\u0c40 \u0c24\u0c15\u0c4d\u0c37\u0c23\u0c2e\u0c47 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41 \u0c05\u0c02\u0c26\u0c1c\u0c47\u0c2f\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.",
  }
];

const OFFICERS = [
  { value: "\u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c24\u0c39\u0c36\u0c40\u0c32\u0c4d\u0c26\u0c3e\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41 (MRO)", label: "\u0c24\u0c39\u0c36\u0c40\u0c32\u0c4d\u0c26\u0c3e\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41 (Tahsildar / MRO)" },
  { value: "\u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c32\u0c4d \u0c15\u0c2e\u0c3f\u0c37\u0c28\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41", label: "\u0c2e\u0c41\u0c28\u0c4d\u0c38\u0c3f\u0c2a\u0c32\u0c4d \u0c15\u0c2e\u0c3f\u0c37\u0c28\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41 (Municipal Commissioner)" },
  { value: "\u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c06\u0c30\u0c4d.\u0c21\u0c3f.\u0c13 \u0c17\u0c3e\u0c30\u0c41 (RDO)", label: "\u0c06\u0c30\u0c4d.\u0c21\u0c3f.\u0c13 \u0c17\u0c3e\u0c30\u0c41 (Revenue Divisional Officer)" },
  { value: "\u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e \u0c15\u0c32\u0c46\u0c15\u0c4d\u0c1f\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41", label: "\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e \u0c15\u0c32\u0c46\u0c15\u0c4d\u0c1f\u0c30\u0c4d \u0c17\u0c3e\u0c30\u0c41 (District Collector)" },
] as const;

export function RepresentationLetterPage() {
  const searchParams = useSearchParams();
  const initialMandal = searchParams.get("mandal") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialLocality = searchParams.get("locality") || "";

  const [applicantName, setApplicantName] = useState("\u0c38\u0c2e\u0c28\u0c4d\u0c35\u0c2f\u0c15\u0c30\u0c4d\u0c24 / \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c28\u0c3f \u0c2a\u0c47\u0c30\u0c41");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [district, setDistrict] = useState(initialDistrict || "\u0c38\u0c42\u0c30\u0c4d\u0c2f\u0c3e\u0c2a\u0c47\u0c1f");
  const [mandal, setMandal] = useState(initialMandal || "\u0c15\u0c4b\u0c26\u0c3e\u0c21");
  const [locality, setLocality] = useState(initialLocality || "\u0c17\u0c3e\u0c02\u0c27\u0c40 \u0c28\u0c17\u0c30\u0c4d");
  const [recipientOfficer, setRecipientOfficer] = useState<string>(
    OFFICERS[0].value,
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [recordId, setRecordId] = useState("------");

  useEffect(() => {
    const nextDistrict = searchParams.get("district") || "";
    const nextMandal = searchParams.get("mandal") || "";
    const nextLocality = searchParams.get("locality") || "";
    if (nextDistrict) setDistrict(nextDistrict);
    if (nextMandal) setMandal(nextMandal);
    if (nextLocality) setLocality(nextLocality);
  }, [searchParams]);

  useEffect(() => {
    setRecordId(Date.now().toString().slice(-6));
  }, []);

  const activeTemplate =
    TEMPLATES.find((tmpl) => tmpl.id === selectedTemplateId) || TEMPLATES[0];

  return (
    <div className="min-h-screen bg-civic-paper text-civic-ink antialiased selection:bg-civic-bronze selection:text-white print:bg-white print:text-black">
      <header className="no-print sticky top-0 z-20 border-b border-civic-border bg-white shadow-xs print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-civic-border p-1.5 text-slate-500 transition-colors hover:bg-civic-subtle hover:text-civic-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-civic-bronze" />
                <h1 className="font-telugu text-base font-bold text-civic-ink md:text-lg">
                  {"\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c24\u0c2f\u0c3e\u0c30\u0c40 \u0c15\u0c47\u0c02\u0c26\u0c4d\u0c30\u0c02"}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500">
                Official Representation &amp; Citizen Petition Generator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-civic-bronze px-4 py-2 font-telugu text-xs font-bold text-white shadow-xs transition-all hover:bg-civic-bronze-hover hover:shadow-md"
          >
            <Printer className="h-4 w-4" />
            {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 \u0c2a\u0c4d\u0c30\u0c3f\u0c02\u0c1f\u0c4d / PDF \u0c38\u0c47\u0c35\u0c4d"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12 print:m-0 print:block print:p-0">
        <section className="no-print space-y-5 print:hidden lg:col-span-5">
          <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
            <h2 className="mb-3 flex items-center gap-2 font-telugu text-sm font-bold text-civic-ink">
              <Sparkles className="h-4 w-4 text-civic-bronze" />
              {"\u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f"}
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c26\u0c30\u0c16\u0c3e\u0c38\u0c4d\u0c24\u0c41\u0c26\u0c3e\u0c30\u0c41\u0c28\u0c3f \u0c2a\u0c47\u0c30\u0c41 / \u0c38\u0c02\u0c18\u0c02 \u0c2a\u0c47\u0c30\u0c41:"}
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c3f\u0c02\u0c1a\u0c3e\u0c32\u0c4d\u0c38\u0c3f\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f (To Authority):"}
                </label>
                <select
                  value={recipientOfficer}
                  onChange={(e) => setRecipientOfficer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                >
                  {OFFICERS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-telugu font-medium text-slate-600">
                    {"\u0c2e\u0c02\u0c21\u0c32\u0c02 (Mandal):"}
                  </label>
                  <input
                    type="text"
                    value={mandal}
                    onChange={(e) => setMandal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-telugu font-medium text-slate-600">
                    {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e (District):"}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c17\u0c4d\u0c30\u0c3e\u0c2e\u0c02 / \u0c15\u0c3e\u0c32\u0c28\u0c40 (Locality):"}
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 font-telugu text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-telugu font-medium text-slate-600">
                  {"\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c2a\u0c41 \u0c28\u0c02\u0c2c\u0c30\u0c4d (Phone):"}
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-slate-300 bg-civic-paper p-2.5 text-civic-ink focus:border-civic-bronze focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-civic-border bg-white p-5 shadow-xs">
            <p className="mb-3 block font-telugu text-xs font-bold text-civic-ink">
              {"\u0c35\u0c3f\u0c28\u0c24\u0c3f \u0c05\u0c02\u0c36\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c0e\u0c02\u0c1a\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f (Select Matter):"}
            </p>
            <div className="space-y-2" role="listbox" aria-label="Petition templates">
              {TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full cursor-pointer rounded-xl border p-3 text-left text-xs transition-all ${
                      isSelected
                        ? "border-civic-bronze bg-civic-bronze/5 ring-1 ring-civic-bronze"
                        : "border-civic-border bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between font-telugu font-bold text-civic-ink">
                      <span>{tmpl.title}</span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-civic-bronze" />
                      ) : null}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {tmpl.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex justify-center lg:col-span-7">
          <div className="print-only-document print-document printable-card flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between rounded-lg border border-slate-300 bg-white p-10 shadow-xl md:p-14 print:m-0 print:w-full print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
            <div>
              <div className="mb-8 border-b-2 border-civic-ink pb-6 text-center">
                <h2 className="font-telugu text-xl font-black tracking-wide text-civic-ink md:text-2xl">
                  {"\u0c35\u0c3f\u0c28\u0c24\u0c3f\u0c2a\u0c24\u0c4d\u0c30\u0c02 (REPRESENTATION)"}
                </h2>
                <p className="mt-1 font-telugu text-xs font-semibold text-slate-600">
                  {"\u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f & \u0c2c\u0c1c\u0c02\u0c24\u0c4d\u0c30\u0c3f \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c39\u0c15\u0c4d\u0c15\u0c41\u0c32 \u0c2a\u0c30\u0c3f\u0c30\u0c15\u0c4d\u0c37\u0c23 \u0c35\u0c47\u0c26\u0c3f\u0c15"}
                </p>
                <div className="mt-0.5 font-telugu text-[11px] text-slate-500">
                  {"\u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02 | \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41 \u0c10\u0c21\u0c40: NS-TEL-"}{recordId}
                </div>
              </div>

              <div className="mb-8 flex items-start justify-between font-telugu text-xs leading-relaxed md:text-sm">
                <div>
                  <p className="font-bold text-civic-ink">{"\u0c38\u0c4d\u0c35\u0c40\u0c15\u0c30\u0c4d\u0c24 (To):"}</p>
                  <p className="font-semibold text-slate-800">{recipientOfficer},</p>
                  <p className="text-slate-700">
                    {mandal} {"\u0c2e\u0c02\u0c21\u0c32 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c3e\u0c32\u0c2f\u0c02,"}
                  </p>
                  <p className="text-slate-700">
                    {district} {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e, \u0c24\u0c46\u0c32\u0c02\u0c17\u0c3e\u0c23 \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02."}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-slate-700">
                    <strong>{"\u0c24\u0c47\u0c26\u0c40:"}</strong> 
                    {new Date().toLocaleDateString("te-IN")}
                  </p>
                  <p className="text-slate-700">
                    <strong>{"\u0c2a\u0c4d\u0c30\u0c26\u0c47\u0c36\u0c02:"}</strong> {locality}
                  </p>
                </div>
              </div>

              <div className="mb-6 border-l-4 border-civic-ink bg-slate-50 p-3 font-telugu text-xs font-bold leading-relaxed text-civic-ink md:text-sm">
                {"\u0c35\u0c3f\u0c37\u0c2f\u0c02:"} {activeTemplate.subject}
              </div>

              <div className="space-y-4 text-justify font-telugu text-xs leading-loose text-slate-900 md:text-sm">
                <p>
                  <strong>{"\u0c05\u0c2f\u0c4d\u0c2f\u0c3e / \u0c06\u0c30\u0c4d\u0c2f\u0c3e,"}</strong>
                </p>
                <p>
                  {"\u0c2e\u0c47\u0c2e\u0c41"} {district} {"\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e,"} 
                  {mandal} {"\u0c2e\u0c02\u0c21\u0c32\u0c02,"} {locality} 
                  {"\u0c2a\u0c4d\u0c30\u0c3e\u0c02\u0c24\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c1a\u0c46\u0c02\u0c26\u0c3f\u0c28 \u0c28\u0c3e\u0c2f\u0c3f \u0c2c\u0c4d\u0c30\u0c3e\u0c39\u0c4d\u0c2e\u0c23, \u0c2e\u0c02\u0c17\u0c32\u0c3f \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c3e\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c2e\u0c41. \u0c2e\u0c3e \u0c15\u0c2e\u0c4d\u0c2f\u0c42\u0c28\u0c3f\u0c1f\u0c40 \u0c1c\u0c40\u0c35\u0c28\u0c4b\u0c2a\u0c3e\u0c27\u0c3f \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c47\u0c2e\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c02\u0c2c\u0c02\u0c27\u0c3f\u0c02\u0c1a\u0c3f \u0c15\u0c4d\u0c30\u0c3f\u0c02\u0c26\u0c3f \u0c2e\u0c41\u0c16\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c05\u0c02\u0c36\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c24\u0c2e\u0c30\u0c3f \u0c26\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c15\u0c3f \u0c24\u0c40\u0c38\u0c41\u0c15\u0c41\u0c35\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41."}
                </p>
                <p className="rounded-md border border-civic-border bg-civic-paper p-3 font-medium text-slate-800">
                  {activeTemplate.body}
                </p>
                <p>{"\u0c15\u0c3e\u0c35\u0c41\u0c28 \u0c17\u0c4c\u0c30\u0c35\u0c28\u0c40\u0c2f\u0c41\u0c32\u0c48\u0c28 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c38\u0c4d\u0c2a\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c3f, \u0c15\u0c4d\u0c37\u0c47\u0c24\u0c4d\u0c30\u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f \u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23 \u0c1a\u0c47\u0c2a\u0c1f\u0c4d\u0c1f\u0c3f \u0c2e\u0c3e \u0c28\u0c4d\u0c2f\u0c3e\u0c2f\u0c2e\u0c48\u0c28 \u0c05\u0c2d\u0c4d\u0c2f\u0c30\u0c4d\u0c25\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c3f\u0c37\u0c4d\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c35\u0c32\u0c38\u0c3f\u0c02\u0c26\u0c3f\u0c17\u0c3e \u0c15\u0c4b\u0c30\u0c41\u0c1a\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41."}</p>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between border-t border-slate-300 pt-12 font-telugu text-xs md:text-sm">
              <div>
                <p className="font-sans text-[11px] text-slate-500">
                  Verification Stamp / Ref: nayisamakhya.org
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {"\u0c2b\u0c4b\u0c28\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d:"} +91 {applicantPhone || "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-slate-700">{"\u0c2d\u0c35\u0c26\u0c40\u0c2f\u0c41\u0c21\u0c41 / \u0c07\u0c1f\u0c4d\u0c32\u0c41,"}</p>
                <div className="flex h-12 items-end justify-end">
                  <span className="font-sans text-[11px] italic text-slate-400">
                    {"( \u0c38\u0c02\u0c24\u0c15\u0c02 / Signature )"}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-civic-ink">{applicantName}</p>
                <p className="text-xs text-slate-600">
                  {locality}, {mandal}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
