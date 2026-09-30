/**
 * Competition 3 — చట్ట హక్కుల అన్వేషి
 * Exact statutory question bank (user schema).
 */

import type { QuizQuestion } from "@/types/quiz";
import { QUIZ_QUESTION_COUNT } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionTe:
      "జీవో నెం. 23 ప్రకారం అర్హులైన నాయీ బ్రాహ్మణ సెలూన్లకు ఎన్ని యూనిట్ల ఉచిత విద్యుత్ లభిస్తుంది?",
    questionEn:
      "How many units of free power are provided per month under G.O. Ms. No. 23?",
    optionsTe: ["100 యూనిట్లు", "250 యూనిట్లు", "200 యూనిట్లు", "300 యూనిట్లు"],
    optionsEn: ["100 Units", "250 Units", "200 Units", "300 Units"],
    correctIndex: 1,
    legalNoteTe:
      "జీవో 23 ప్రకారం ప్రతినెలా 250 యూనిట్ల వరకు ఉచిత విద్యుత్ అర్హత ఉంది.",
    legalNoteEn:
      "G.O. Ms. No. 23 mandates up to 250 units of free power monthly for registered salons.",
  },
  {
    id: 2,
    questionTe:
      "మున్సిపల్ కాంప్లెక్స్‌లలో షాపుల కేటాయింపులో నాయీ బ్రాహ్మణులకు చట్టబద్ధమైన హక్కు ఏ చట్టం ద్వారా రక్షించబడుతుంది?",
    questionEn:
      "Which statute safeguards the shop reservation rights in municipal shopping complexes?",
    optionsTe: [
      "పంచాయతీ రాజ్ చట్టం 1994",
      "తెలంగాణ మున్సిపాలిటీల చట్టం 2019",
      "కార్మిక సంక్షేమ చట్టం",
      "షాప్స్ & ఎస్టాబ్లిష్‌మెంట్స్ చట్టం",
    ],
    optionsEn: [
      "Panchayat Raj Act 1994",
      "Telangana Municipalities Act 2019",
      "Labor Welfare Act",
      "Shops & Establishments Act",
    ],
    correctIndex: 1,
    legalNoteTe:
      "తెలంగాణ మున్సిపాలిటీల చట్టం 2019 ప్రకారం దుకాణాల కేటాయింపులో చట్టబద్ధ నిబంధనలు వర్తిస్తాయి.",
    legalNoteEn:
      "The Telangana Municipalities Act 2019 protects artisanal statutory quotas in municipal complexes.",
  },
  {
    id: 3,
    questionTe:
      "మహాత్మా జ్యోతిబా ఫూలే విదేశీ విద్యా నిధి కింద బీసీ విద్యార్థులకు అందే గరిష్ట విదేశీ విద్య గ్రాంట్ ఎంత?",
    questionEn:
      "What is the maximum overseas education grant under Mahatma Jyotiba Phule Overseas Scheme?",
    optionsTe: ["₹10 లక్షలు", "₹15 లక్షలు", "₹20 లక్షలు", "₹25 లక్షలు"],
    optionsEn: ["₹10 Lakhs", "₹15 Lakhs", "₹20 Lakhs", "₹25 Lakhs"],
    correctIndex: 2,
    legalNoteTe:
      "అర్హులైన బీసీ విద్యార్థులకు విదేశీ ఉన్నత విద్య కోసం ప్రభుత్వం గరిష్టంగా ₹20 లక్షల ఆర్థిక సహాయం అందిస్తుంది.",
    legalNoteEn:
      "Eligible BC students receive up to ₹20 Lakhs grant for overseas postgraduate education.",
  },
  {
    id: 4,
    questionTe:
      "భారతదేశంలో తొలిసారిగా బీసీ వర్గాలకు చట్టబద్ధ రక్షణ కల్పించిన నంద సామ్రాజ్య స్థాపకుడు ఎవరు?",
    questionEn:
      "Who was the founder of the Nanda Empire recognized for social welfare and state lineage?",
    optionsTe: [
      "చంద్రగుప్త మౌర్య",
      "చక్రవర్తి మహాపద్మనంద",
      "అశోక చక్రవర్తి",
      "బింబిసారుడు",
    ],
    optionsEn: [
      "Chandragupta Maurya",
      "Emperor Mahapadmananda",
      "Emperor Ashoka",
      "Bimbisara",
    ],
    correctIndex: 1,
    legalNoteTe:
      "చక్రవర్తి మహాపద్మనంద నంద సామ్రాజ్యాన్ని స్థాపించి ప్రజారంజక పరిపాలన అందించారు.",
    legalNoteEn:
      "Emperor Mahapadmananda established the powerful Nanda Empire in ancient India.",
  },
  {
    id: 5,
    questionTe:
      "ప్రాచీన భారతదేశంలో శస్త్రచికిత్స (Surgery) మరియు ఆయుర్వేదానికి పితామహుడిగా ఎవరిని పరిగణిస్తారు?",
    questionEn:
      "Who is celebrated as the foundational pioneer of Indian surgery and classical clinical sciences?",
    optionsTe: [
      "భరద్వాజ",
      "ఆచార్య సుశ్రుతుడు & ధన్వంతరి",
      "భాస్కరాచార్య",
      "వరాహమిహిర",
    ],
    optionsEn: [
      "Bharadwaja",
      "Acharya Sushruta & Dhanvantari",
      "Bhaskaracharya",
      "Varahamihira",
    ],
    correctIndex: 1,
    legalNoteTe:
      "సుశ్రుత సంహిత రచించిన ఆచార్య సుశ్రుతుడు ప్రపంచ శస్త్రచికిత్సా విజ్ఞానానికి ఆద్యుడు.",
    legalNoteEn:
      "Acharya Sushruta authored the Sushruta Samhita, pioneering classical surgical techniques.",
  },
  {
    id: 6,
    questionTe:
      "సెలూన్ విద్యుత్ మీటర్లను అధికారులు అకారణంగా కమర్షియల్ కేటగిరీ కిందకు మార్చితే ఎవరికి దరఖాస్తు సమర్పించాలి?",
    questionEn:
      "To whom should a statutory grievance petition be submitted if free power is wrongly billed?",
    optionsTe: [
      "పోలీస్ స్టేషన్",
      "డిస్కామ్ ADE / విద్యుత్ విజిలెన్స్ / కలెక్టర్",
      "ట్రాన్స్పోర్ట్ ఆఫీస్",
      "పంచాయతీ సెక్రటరీ",
    ],
    optionsEn: [
      "Police Station",
      "DISCOM ADE / District Collector",
      "Transport Office",
      "Panchayat Secretary",
    ],
    correctIndex: 1,
    legalNoteTe:
      "జీవో 23 అమలుపై విద్యుత్ సర్కిల్ ADE మరియు జిల్లా కలెక్టరేట్ ప్రజావాణికి ఫిర్యాదు చేయాలి.",
    legalNoteEn:
      "Submit representation with USCNO to DISCOM ADE and District Collectorate Grievance Cell.",
  },
  {
    id: 7,
    questionTe:
      "భారత రత్న కర్పూరి ఠాకూర్ ఏ రాష్ట్ర ముఖ్యమంత్రిగా బడుగు, బలహీన వర్గాల కోసం రిజర్వేషన్ సంస్కరణలు తెచ్చారు?",
    questionEn:
      "Bharat Ratna Karpoori Thakur served as Chief Minister of which state implementing historic BC quotas?",
    optionsTe: ["ఉత్తరప్రదేశ్", "బీహార్", "మధ్యప్రదేశ్", "రాజస్థాన్"],
    optionsEn: ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Rajasthan"],
    correctIndex: 1,
    legalNoteTe:
      "కర్పూరి ఠాకూర్ బీహార్ ముఖ్యమంత్రిగా అత్యంత వెనుకబడిన వర్గాలకు (EBC) రిజర్వేషన్లు కల్పించారు.",
    legalNoteEn:
      "Karpoori Thakur served as the CM of Bihar, pioneering the historic Karpoori Formula.",
  },
  {
    id: 8,
    questionTe:
      "ఆలయాల్లో పనిచేసే నాదస్వర, డోలు కళాకారుల పింఛన్లు మరియు గౌరవ భృతిని ఏ శాఖ పర్యవేక్షిస్తుంది?",
    questionEn:
      "Which state department oversees temple pensions and welfare stipends for Nadaswaram musicians?",
    optionsTe: [
      "రెవెన్యూ శాఖ",
      "దేవాదాయ మరియు ధర్మాదాయ శాఖ (Endowments)",
      "పర్యాటక శాఖ",
      "విద్యుత్ శాఖ",
    ],
    optionsEn: [
      "Revenue Department",
      "Endowments Department",
      "Tourism Department",
      "Energy Department",
    ],
    correctIndex: 1,
    legalNoteTe:
      "దేవాదాయ శాఖ ద్వారా అర్హులైన దేవాలయ కళాకారులకు భృతి మరియు గుర్తింపు కార్డులు లభిస్తాయి.",
    legalNoteEn:
      "The Telangana Endowments Department administers pensions and cultural allowances for temple artists.",
  },
  {
    id: 9,
    questionTe:
      "ముద్రా (Mudra) లేదా బీసీ కార్పొరేషన్ రుణాలకు బ్యాంకు మేనేజర్‌కు సమర్పించాల్సిన ప్రాథమిక నివేదిక ఏది?",
    questionEn:
      "Which formal document is required by bank managers to process salon modernization credit?",
    optionsTe: [
      "కేవలం ఆధార్ జెరాక్స్",
      "వివరణాత్మక ప్రాజెక్ట్ రిపోర్ట్ (DPR)",
      "వ్యక్తిగత లేఖ",
      "గ్రామ సర్పంచ్ పత్రం",
    ],
    optionsEn: [
      "Only Aadhaar Xerox",
      "Detailed Project Report (DPR)",
      "Informal Letter",
      "Sarpanch Note",
    ],
    correctIndex: 1,
    legalNoteTe:
      "పరికరాల కొనుగోలు, వ్యయ-ఆదాయాల సాధ్యాసాధ్యాలను తెలిపే వివరణాత్మక DPR నివేదిక తప్పనిసరి.",
    legalNoteEn:
      "A formal Detailed Project Report (DPR) detailing equipment outlay and cashflow viability is mandatory.",
  },
  {
    id: 10,
    questionTe:
      "నాయీ సమాఖ్య పోర్టల్ ద్వారా అధికారులు స్పందించే విధంగా స్వయంచాలకంగా సిద్ధమయ్యే పత్రం ఏది?",
    questionEn:
      "Which instant legal document is auto-generated on the Nayi Samakhya platform?",
    optionsTe: [
      "సాధారణ ఫీడ్‌బ్యాక్",
      "చట్టబద్ధ అధికారిక వినతిపత్రం (Legal Petition Docket)",
      "ప్రైవేట్ మెమో",
      "ఏదీ కాదు",
    ],
    optionsEn: [
      "General Feedback",
      "Official Legal Petition Docket",
      "Private Memo",
      "None",
    ],
    correctIndex: 1,
    legalNoteTe:
      "అధికారులకు సమర్పించేందుకు చట్ట నిబంధనలు, సంతకం వివరాలతో కూడిన A4 వినతిపత్రం తయారవుతుంది.",
    legalNoteEn:
      "A complete, stamped A4 legal petition docket ready for MRO, ADE, or Collector submission is generated.",
  },
];

if (QUIZ_QUESTIONS.length !== QUIZ_QUESTION_COUNT) {
  throw new Error(
    `Expected ${QUIZ_QUESTION_COUNT} quiz questions, got ${QUIZ_QUESTIONS.length}`,
  );
}

const ids = QUIZ_QUESTIONS.map((q) => q.id);
if (
  ids.length !== QUIZ_QUESTION_COUNT ||
  new Set(ids).size !== QUIZ_QUESTION_COUNT ||
  !ids.every((id, i) => id === i + 1)
) {
  throw new Error(
    `Expected quiz question ids 1–${QUIZ_QUESTION_COUNT}, got [${ids.join(", ")}]`,
  );
}
