/**
 * Competition 3 — చట్ట హక్కుల అన్వేషి
 * Quiz bank aligned with portal legalCitations + heritage timeline facts.
 */

import type { QuizQuestion } from "@/types/quiz";
import { QUIZ_QUESTION_COUNT } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "go23-units",
    categoryTe: "జీ.ఓ. 23 · విద్యుత్",
    categoryEn: "G.O. 23 · Power",
    questionTe:
      "G.O. Ms. No. 23 (ఇంధన శాఖ) ప్రకారం అర్హ సెలూన్ / సాంప్రదాయ వృత్తి దుకాణాలకు నెలకు ఎన్ని యూనిట్ల ఉచిత విద్యుత్ కల్పించబడింది?",
    questionEn:
      "Under G.O. Ms. No. 23 (Energy Dept.), how many free electricity units per month are provided to eligible traditional salon / craft shops?",
    options: [
      { te: "100 యూనిట్లు", en: "100 units" },
      { te: "250 యూనిట్లు", en: "250 units" },
      { te: "500 యూనిట్లు", en: "500 units" },
      { te: "అపరిమితం", en: "Unlimited" },
    ],
    correctIndex: 1,
    explanationTe:
      "తెలంగాణ రాష్ట్ర ప్రభుత్వ ఉత్తర్వు G.O. Ms. No. 23, ఇంధన (విద్యుత్) శాఖ — అర్హ నాయీబ్రాహ్మణ సెలూన్లకు నెలకు 250 యూనిట్ల ఉచిత విద్యుత్.",
    explanationEn:
      "Telangana G.O. Ms. No. 23 (Energy / Power) provides 250 free units per month to eligible Nayi Brahmin salon establishments.",
    citationHint: "power_subsidy",
  },
  {
    id: "go23-dept",
    categoryTe: "జీ.ఓ. 23 · శాఖ",
    categoryEn: "G.O. 23 · Department",
    questionTe:
      "G.O. Ms. No. 23 ఉచిత విద్యుత్ ఉత్తర్వు ఏ శాఖ ద్వారా జారీ అయింది?",
    questionEn:
      "Which department issued G.O. Ms. No. 23 on free electricity for eligible craft shops?",
    options: [
      { te: "విద్యా శాఖ", en: "Education Department" },
      { te: "ఆరోగ్య శాఖ", en: "Health Department" },
      { te: "ఇంధన (విద్యుత్) శాఖ", en: "Energy (Power) Department" },
      { te: "రవాణా శాఖ", en: "Transport Department" },
    ],
    correctIndex: 2,
    explanationTe:
      "పోర్టల్ చట్ట సూచనల ప్రకారం — «తెలంగాణ రాష్ట్ర ప్రభుత్వ ఉత్తర్వు G.O. Ms. No. 23, ఇంధన (విద్యుత్) శాఖ».",
    explanationEn:
      "Portal citations state: Telangana G.O. Ms. No. 23, Energy (Power) Department.",
    citationHint: "power_subsidy",
  },
  {
    id: "muni-act-year",
    categoryTe: "మున్సిపాలిటీల చట్టం",
    categoryEn: "Municipalities Act",
    questionTe:
      "ట్రేడ్ లైసెన్స్ / పురపాలక రుసుము విషయాల్లో పోర్టల్ ఏ చట్టాన్ని ప్రాథమికంగా ఉదహరిస్తుంది?",
    questionEn:
      "Which Act does the portal primarily cite for municipal trade-licence / fee matters?",
    options: [
      { te: "తెలంగాణ మున్సిపాలిటీల చట్టం 2019", en: "Telangana Municipalities Act, 2019" },
      { te: "కేంద్ర GST చట్టం 2017", en: "Central GST Act, 2017" },
      { te: "భారతీయ దండ సంహిత", en: "Indian Penal Code" },
      { te: "ల్యాండ్ అక్విజిషన్ చట్టం 2013", en: "Land Acquisition Act, 2013" },
    ],
    correctIndex: 0,
    explanationTe:
      "ట్రేడ్ లైసెన్స్ మినహాయింపు వినతులకు «తెలంగాణ మున్సిపాలిటీల చట్టం 2019» మరియు పంచాయత్ రాజ్ నిబంధనలు ఉదహరించబడతాయి.",
    explanationEn:
      "Trade-licence waiver petitions cite the Telangana Municipalities Act, 2019 and Panchayat Raj rules.",
    citationHint: "trade_license",
  },
  {
    id: "muni-ss-118",
    categoryTe: "మున్సిపల్ లైసెన్స్",
    categoryEn: "Municipal licence",
    questionTe:
      "తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019లో ట్రేడ్ లైసెన్స్‌కు సంబంధించి పోర్టల్ ఏ సెక్షన్లను ఉదహరిస్తుంది?",
    questionEn:
      "Which sections of the Telangana Municipalities Act, 2019 does the portal cite for trade licences?",
    options: [
      { te: "సెక్షన్లు 10 & 12", en: "Sections 10 & 12" },
      { te: "సెక్షన్లు 118 & 120", en: "Sections 118 & 120" },
      { te: "సెక్షన్లు 200 & 201", en: "Sections 200 & 201" },
      { te: "సెక్షన్ 1 మాత్రమే", en: "Section 1 only" },
    ],
    correctIndex: 1,
    explanationTe:
      "మున్సిపల్ ట్రేడ్ లైసెన్స్ వినతి — సెక్షన్ 118 (trade licence) మరియు సెక్షన్ 120 (fees / exemptions) ప్రకారం సాంప్రదాయ సెలూన్ వృత్తిదారులకు రుసుము మినహాయింపు / సౌలభ్యం.",
    explanationEn:
      "Municipal trade petitions cite §118 (trade licence) and §120 (fees / exemptions) for traditional salon fee relief.",
    citationHint: "municipal_trade",
  },
  {
    id: "muni-lease-54",
    categoryTe: "మున్సిపల్ లీజు",
    categoryEn: "Municipal lease",
    questionTe:
      "పురపాలక ఆస్తి / స్థలం లీజు కేటాయింపు వినతికి పోర్టల్ ఏ సెక్షన్‌ను ఉదహరిస్తుంది?",
    questionEn:
      "Which section does the portal cite for municipal property / site lease allotment petitions?",
    options: [
      { te: "సెక్షన్ 22", en: "Section 22" },
      { te: "సెక్షన్ 99", en: "Section 99" },
      { te: "సెక్షన్ 54", en: "Section 54" },
      { te: "సెక్షన్ 301", en: "Section 301" },
    ],
    correctIndex: 2,
    explanationTe:
      "తెలంగాణ మున్సిపాలిటీస్ చట్టం 2019 — సెక్షన్ 54 ప్రకారం పురపాలక ఆస్తి లీజు / కేటాయింపు విధానం ద్వారా సాంప్రదాయ వృత్తి స్థల సదుపాయం.",
    explanationEn:
      "Telangana Municipalities Act, 2019 — Section 54 covers municipal property lease / allotment for traditional livelihood space.",
    citationHint: "municipal_lease",
  },
  {
    id: "bc-welfare-land",
    categoryTe: "బీసీ సంక్షేమం",
    categoryEn: "BC Welfare",
    questionTe:
      "కమ్యూనిటీ భవనం / స్థల కేటాయింపు వినతులకు పోర్టల్ ఏ శాఖ మార్గదర్శకాలను ఉదహరిస్తుంది?",
    questionEn:
      "Which department’s guidelines does the portal cite for community hall / land allotment petitions?",
    options: [
      { te: "తెలంగాణ బీసీ సంక్షేమ శాఖ", en: "Telangana BC Welfare Department" },
      { te: "రైల్వే శాఖ", en: "Railways Department" },
      { te: "పర్యాటక శాఖ మాత్రమే", en: "Tourism Department only" },
      { te: "విదేశాంగ శాఖ", en: "External Affairs" },
    ],
    correctIndex: 0,
    explanationTe:
      "స్థల & హాల్ కేటాయింపు — «తెలంగాణ బీసీ సంక్షేమ శాఖ సంక్షేమ మార్గదర్శకాలు & ప్రభుత్వ భూ కేటాయింపు నిబంధనలు».",
    explanationEn:
      "Land & hall allotment cites Telangana BC Welfare Department guidelines and government land allotment rules.",
    citationHint: "land_hall",
  },
  {
    id: "bc-a-identity",
    categoryTe: "బీసీ వర్గీకరణ",
    categoryEn: "BC classification",
    questionTe:
      "తెలంగాణ సంక్షేమ నిబంధనల్లో నాయీ బ్రాహ్మణ / మంగలి సమూహాలు సాధారణంగా ఏ విస్తృత వర్గంలో గుర్తించబడతాయి?",
    questionEn:
      "In Telangana welfare frameworks, Nayi Brahmin / Mangali communities are generally recognised under which broad category?",
    options: [
      { te: "షెడ్యూల్డ్ ట్రైబ్ (ST) మాత్రమే", en: "Scheduled Tribe (ST) only" },
      { te: "బ్యాక్‌వర్డ్ క్లాసెస్ (BC) — BC-A పరిణామం", en: "Backward Classes (BC) — BC-A lineage" },
      { te: "ఆర్థికంగా బలహీన వర్గాలు మాత్రమే (EWS)", en: "EWS only" },
      { te: "ఎలాంటి వర్గీకరణ లేదు", en: "No classification exists" },
    ],
    correctIndex: 1,
    explanationTe:
      "సామాజిక సర్వే / కుల గణన చరిత్రలో వృత్తి ఆధారిత నాయీ సమూహాలు BC-A వర్గీకరణ పరిణామంలో స్థానం పొందాయి — స్కాలర్‌షిప్ & సంక్షేమ ప్రణాళికకు ఆధారం.",
    explanationEn:
      "Occupational Nayi communities are placed in the BC-A lineage under Telangana welfare planning — basis for scholarships and schemes.",
    citationHint: "heritage_survey",
  },
  {
    id: "heritage-vaidya",
    categoryTe: "వారసత్వం · వైద్య",
    categoryEn: "Heritage · Vaidya",
    questionTe:
      "నాయీ వృత్తి గౌరవానికి ప్రాచీన మూలంగా పోర్టల్ హైలైట్ చేసే వైద్య / శస్త్ర పరంపర ఏది?",
    questionEn:
      "Which ancient medical / surgical lineage does the portal highlight as a root of Nayi occupational dignity?",
    options: [
      { te: "ధన్వంతరి · చరక · సుశ్రుత పరంపర", en: "Dhanvantari · Charaka · Sushruta lineage" },
      { te: "కేవలం ఆధునిక అలోపతి", en: "Modern allopathy only" },
      { te: "యూనానీ మాత్రమే", en: "Unani only" },
      { te: "పశ్చిమ హోమియోపతి", en: "Western homeopathy" },
    ],
    correctIndex: 0,
    explanationTe:
      "ధన్వంతరి, చరక, సుశ్రుత మహర్షుల మార్గంలో ఆయుర్వేదం & శస్త్రచికిత్స — నాయీ వృత్తి గౌరవానికి ప్రాథమిక స్తంభం.",
    explanationEn:
      "The Dhanvantari–Charaka–Sushruta Ayurvedic / surgical lineage anchors traditional Nayi occupational dignity on the portal timeline.",
    citationHint: "heritage_vaidya",
  },
  {
    id: "heritage-nada",
    categoryTe: "వారసత్వం · నాదం",
    categoryEn: "Heritage · Nada",
    questionTe:
      "«నాదం బ్రహ్మం» సందర్భంలో నాయీ సమాఖ్య హైలైట్ చేసే సాంస్కృతిక వారసత్వం ఏది?",
    questionEn:
      "In the “Nada Brahma” context, which cultural heritage does Nayi Samakhya highlight?",
    options: [
      { te: "క్రికెట్ మాత్రమే", en: "Cricket only" },
      { te: "బజంత్రి / నాదస్వర శాస్త్రీయ పరంపర", en: "Bajantri / Nadaswara classical lineage" },
      { te: "సినిమా నృత్యం మాత్రమే", en: "Film dance only" },
      { te: "విదేశీ రాక్ సంగీతం", en: "Foreign rock music" },
    ],
    correctIndex: 1,
    explanationTe:
      "బజంత్రి / నాదస్వర వారసత్వం — ఆలయ · సామూహిక ఉత్సవాల సాంస్కృతిక శ్వాస; కళ, భక్తి, సామాజిక సేవ ఏకమయ్యే గుర్తింపు.",
    explanationEn:
      "Bajantri / Nadaswara heritage — temple and community festival music uniting craft, devotion, and social service.",
    citationHint: "heritage_nada",
  },
  {
    id: "geo-coverage",
    categoryTe: "సమాఖ్య · కవరేజ్",
    categoryEn: "Samakhya · Coverage",
    questionTe:
      "నాయీ సమాఖ్య డిజిటల్ సేవా నెట్‌వర్క్ తెలంగాణలో ఎన్ని జిల్లాలు · మండలాలను కవర్ చేస్తుంది?",
    questionEn:
      "How many districts and mandals does the Nayi Samakhya digital service network cover in Telangana?",
    options: [
      { te: "10 జిల్లాలు · 100 మండలాలు", en: "10 districts · 100 mandals" },
      { te: "33 జిల్లాలు · 589 మండలాలు", en: "33 districts · 589 mandals" },
      { te: "5 జిల్లాలు · 50 మండలాలు", en: "5 districts · 50 mandals" },
      { te: "కేవలం హైదరాబాద్", en: "Hyderabad only" },
    ],
    correctIndex: 1,
    explanationTe:
      "నాయీ సమాఖ్య — 33 జిల్లాలు · 589 మండలాల రాష్ట్రవ్యాప్త డిజిటల్ సేవా నెట్‌వర్క్; సర్వే, వినతి, సమన్వయకర్త డెస్క్ ఏకీకృతం.",
    explanationEn:
      "Nayi Samakhya spans 33 districts and 589 mandals — statewide digital desk for survey, petitions, and coordinators.",
    citationHint: "heritage_geo",
  },
];

if (QUIZ_QUESTIONS.length !== QUIZ_QUESTION_COUNT) {
  throw new Error(
    `Expected ${QUIZ_QUESTION_COUNT} quiz questions, got ${QUIZ_QUESTIONS.length}`,
  );
}
