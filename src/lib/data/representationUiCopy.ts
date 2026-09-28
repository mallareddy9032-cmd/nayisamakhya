/**
 * Wizard chrome copy for /representation (TE | EN).
 * Official letter body stays Telugu for government filing.
 */

export type RepUiLang = "te" | "en";

type Pair = { te: string; en: string };

const P = (te: string, en: string): Pair => ({ te, en });

export const REP_UI = {
  title: P(
    "అధికారిక వినతిపత్రం తయారీ కేంద్రం",
    "Official Representation Maker",
  ),
  subtitle: P(
    "3-దశల అధికారిక వినతిపత్రం & పౌర పిటిషన్",
    "3-step Official Representation & Citizen Petition",
  ),
  steps: [
    P("జిల్లా / మండలం", "District / Mandal"),
    P("వినతి అంశం", "Petition topic"),
    P("ప్రివ్యూ & డౌన్‌లోడ్", "Preview & Download"),
  ] as const,
  step1Title: P(
    "స్టెప్ 1 — జిల్లా & మండలం ఎంచుకోండి",
    "Step 1 — Choose district & mandal",
  ),
  step1Hint: P(
    "మీ జిల్లా/మండలం ఎంచుకుంటే వినతిపత్రం స్వయంగా నిండుతుంది.",
    "Pick your district and mandal to auto-fill the petition letter.",
  ),
  district: P("జిల్లా (District)", "District"),
  mandal: P("మండలం (Mandal)", "Mandal"),
  locality: P("గ్రామం / కాలనీ (Locality)", "Village / Colony"),
  authority: P(
    "సమర్పించాల్సిన అధికారి (To Authority)",
    "Submit to (Authority)",
  ),
  nextTopic: P("తరువాత — వినతి అంశం", "Next — Petition topic"),
  step2Title: P(
    "స్టెప్ 2 — వినతి అంశం ఎంచుకోండి",
    "Step 2 — Choose petition topic",
  ),
  step2Hint: P(
    "నాలుగు సాధారణ అంశాల్లో ఒకటి ట్యాప్ చేయండి, లేదా మీ స్వంత వచనం రాయండి.",
    "Tap one of the four common topics, or write your own text.",
  ),
  customToggle: P(
    "అదనపు / స్వంత వచనం (Custom)",
    "Additional / custom text",
  ),
  customPh: P(
    "మీ వినతి వివరాలు ఇక్కడ రాయండి…",
    "Write your petition details here…",
  ),
  back: P("వెనక్కి", "Back"),
  preview: P("ప్రివ్యూ చూడండి", "View preview"),
  step3Title: P(
    "స్టెప్ 3 — వివరాలు & డౌన్‌లోడ్",
    "Step 3 — Details & download",
  ),
  applicant: P(
    "దరఖాస్తుదారుని పేరు / సంఘం పేరు",
    "Applicant / association name",
  ),
  phone: P("సంప్రదింపు నంబర్ (Phone)", "Contact phone"),
  summaryDistrict: P("జిల్లా", "District"),
  summaryMandal: P("మండలం", "Mandal"),
  summaryTopic: P("అంశం", "Topic"),
  customTopic: P("స్వంత వచనం", "Custom text"),
  printPdf: P("వినతిపత్రం ప్రింట్ / PDF సేవ్", "Print petition / Save PDF"),
  printShort: P("ప్రింట్ / PDF సేవ్", "Print / PDF"),
  changeTopic: P("అంశం మార్చండి", "Change topic"),
  letterNote: P(
    "అధికారిక లేఖ ఎల్లప్పుడూ తెలుగులో ఉంటుంది (ప్రభుత్వ ఫైలింగ్).",
    "Official letter body stays in Telugu (for government filing).",
  ),
} as const;

export function ui(
  lang: RepUiLang,
  key: Exclude<keyof typeof REP_UI, "steps">,
): string {
  return REP_UI[key][lang];
}

export function uiStep(lang: RepUiLang, index: 0 | 1 | 2): string {
  return REP_UI.steps[index][lang];
}
