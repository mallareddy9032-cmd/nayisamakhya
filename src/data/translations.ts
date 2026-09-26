import type { Lang } from "@/lib/types";

export type TranslationKey = keyof typeof translations;

export const translations = {
  brandName: { te: "నాయీ సమాఖ్య", en: "Nayi Samakhya" },
  brandSub: { te: "ప్రజా సమాఖ్య", en: "Praja Samakhya" },
  helpline: {
    te: "హెల్ప్‌లైన్: 1800-NAYI-SEVA | టెలిగ్రామ్ అలర్ట్స్",
    en: "Helpline: 1800-NAYI-SEVA | Telegram Alerts",
  },
  contrast: { te: "కాంట్రాస్ట్", en: "Contrast" },
  navWelfare: { te: "సంక్షేమం", en: "Welfare" },
  navEducation: { te: "విద్య", en: "Education" },
  navLivelihood: { te: "జీవనోపాధి", en: "Livelihood" },
  navBajantri: { te: "భజంత్రి", en: "Bajantri" },
  navMatrimonial: { te: "వివాహ సేవ", en: "Matrimonial" },
  navGallery: { te: "గ్యాలరీ", en: "Gallery" },
  navGoLibrary: { te: "G.O. లైబ్రరీ", en: "G.O. Library" },
  navRepresentation: {
    te: "\u0c35\u0c3f\u0c28\u0c24\u0c3f \u0c2a\u0c24\u0c4d\u0c30\u0c02",
    en: "Representation",
  },
  goMandal: { te: "మండలానికి వెళ్ళండి", en: "Go to mandal" },
  go: { te: "వెళ్ళు", en: "Go" },
  menu: { te: "మెనూ", en: "Menu" },
  marquee: {
    te: "🔴 బ్రేకింగ్ అప్‌డేట్స్: 250 యూనిట్ల ఉచిత విద్యుత్ అర్హత మార్గదర్శకాలు విడుదల • బీసీ స్టడీ సర్కిల్ ఉచిత కోచింగ్ దరఖాస్తులు ప్రారంభం • భజంత్రి పెన్షన్ వెరిఫికేషన్ శిబిరాలు — కోదాడ, మధిర, వైరా • మాతృమూర్తి మ్యాట్రిమోనియల్ డ్రైవ్ ఈ నెల 28న • ",
    en: "🔴 Breaking: 250-unit free power eligibility guidelines released • BC Study Circle free coaching applications open • Bajantri pension verification camps — Kodad, Madhira, Wyra • Matrumurthi matrimonial drive on the 28th • ",
  },
  actionPower: { te: "250 యూనిట్ల స్థితి", en: "Check 250 Units Status" },
  actionSurvey: { te: "కుటుంబ సర్వే", en: "Start Family Survey" },
  actionScholarship: { te: "BC-A స్కాలర్‌షిప్", en: "BC-A Scholarship Guide" },
  actionCartel: { te: "కార్టెల్ బల్క్ ఆర్డర్", en: "Cartel Bulk Order" },
  faqEyebrow: { te: "ప్రశ్నలు", en: "FAQ" },
  faqTitle: { te: "తరచుగా అడిగే ప్రశ్నలు", en: "Frequently asked questions" },
  galleryTitle: { te: "మల్టీమీడియా గ్యాలరీ", en: "Multimedia gallery" },
  viewAll: { te: "అన్నీ చూడండి →", en: "View all →" },
  pressTitle: { te: "ప్రెస్ విడుదలలు", en: "Press releases" },
  pressPill: { te: "ప్రెస్ నోట్ | Press Release", en: "Press Note | Press Release" },
  pressCta: { te: "పూర్తి వివరాలు / PDF డౌన్‌లోడ్ →", en: "Full details / Download PDF →" },
  ambedkarTitle: {
    te: "భారతరత్న డా. బి. ఆర్. అంబేద్కర్",
    en: "Bharat Ratna Dr. B. R. Ambedkar",
  },
  ambedkarRole: {
    te: "రాజ్యాంగ నిర్మాత • సామాజిక న్యాయ ప్రదాత",
    en: "Architect of the Constitution • Champion of Social Justice",
  },
  ambedkarSub: {
    te: "చీఫ్ ఆర్కిటెక్ట్, భారత రాజ్యాంగం • సామాజిక సమానత్వ మార్గదర్శి",
    en: "Chief Architect, Constitution of India • Guide of Social Equality",
  },
  footerVision: {
    te: "ప్రజల కోసం, ప్రజలతో — సంక్షేమం, విద్య, జీవనోపాధి, సంస్కృతి ఒకే అధికార పోర్టల్.",
    en: "For the people, with the people — welfare, education, livelihood, and culture in one civic portal.",
  },
  footerOffice: { te: "కార్యాలయ సంప్రదింపు", en: "Office Contact" },
  footerAddress: {
    te: "తెలంగాణ డా. బి.ఆర్. అంబేద్కర్ సచివాలయం, హైదరాబాద్, 500022",
    en: "Telangana Dr. B.R. Ambedkar Secretariat, Hyderabad, 500022",
  },
  footerLastUpdated: { te: "చివరి నవీకరణ", en: "Last Updated" },
  footerVisitors: { te: "సందర్శకులు", en: "Visitors" },
  footerMap: { te: "స్థానం", en: "Location" },
  footerMapsLink: { te: "Maps ↗", en: "Maps ↗" },
  footerDirectories: { te: "డైరెక్టరీలు & లింకులు", en: "Directories & Quick Links" },
  footerStatewide: { te: "రాష్ట్రవ్యాప్త డైరెక్టరీ", en: "Statewide Directory" },
  footerWelfarePortals: { te: "సంక్షేమ పోర్టల్స్", en: "Welfare Portals" },
  footerBcCirculars: { te: "BC-A సర్క్యులర్లు", en: "BC-A Circulars" },
  footerGoLibrary: { te: "G.O. లైబ్రరీ", en: "G.O. Library" },
  footerPolicies: { te: "విధానాలు & సోషల్", en: "Policies & Social" },
  footerHyperlink: { te: "హైపర్‌లింకింగ్ విధానం", en: "Hyperlinking Policy" },
  footerPrivacy: { te: "గోప్యతా విధానం", en: "Privacy Policy" },
  footerTerms: { te: "వినియోగ నిబంధనలు", en: "Terms of Use" },
  footerSitemap: { te: "సైట్‌మ్యాప్", en: "Sitemap" },
  footerCopyright: {
    te: "© {year} నాయీ సమాఖ్య. అన్ని హక్కులు రక్షించబడ్డాయి.",
    en: "© {year} Nayi Samakhya. All rights reserved.",
  },
  footerDisclaimer: {
    te: "ఈ పోర్టల్ సమాచారం ప్రజా సేవ కోసం. అధికారిక నిర్ణయాలకు సంబంధిత శాఖలను సంప్రదించండి.",
    en: "Portal information is for public service. Consult concerned departments for official decisions.",
  },
  galleryKodad: { te: "కోదాడ సేవా శిబిరం", en: "Kodad Service Camp" },
  galleryBajantri: { te: "భజంత్రి సమ్మేళనం", en: "Bajantri Heritage Meet" },
  galleryStudy: { te: "స్టడీ సర్కిల్ ప్రారంభం", en: "Study Circle Launch" },
  galleryWomen: { te: "మహిళా ఉపాధి మేళా", en: "Women Livelihood Fair" },
} as const;

export function tr(key: TranslationKey, lang: Lang, vars?: Record<string, string | number>) {
  let value: string = translations[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}
