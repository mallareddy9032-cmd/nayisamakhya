"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Landmark,
  MessageCircle,
  Mic,
  Minus,
  Send,
  X,
} from "lucide-react";
import { useLanguageStore, useMandalPrefStore } from "@/lib/store/preferences";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
  linkHref?: string;
  linkLabel?: string;
};

type Flow = "none" | "power" | "grievance-mandal" | "grievance-name" | "grievance-text";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function RangoliBorder({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-0 right-0 h-8 opacity-70",
        position === "top" ? "top-0" : "bottom-0",
      )}
      aria-hidden
      style={{
        backgroundImage:
          "radial-gradient(circle at 8px 8px, #E8732A 1.5px, transparent 1.8px), radial-gradient(circle at 24px 16px, #D94F2B 1.2px, transparent 1.5px), radial-gradient(circle at 40px 6px, #F5A623 1.4px, transparent 1.7px)",
        backgroundSize: "48px 24px",
        backgroundRepeat: "repeat-x",
        transform: position === "bottom" ? "scaleY(-1)" : undefined,
      }}
    />
  );
}

function NamaskaramArt() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-[#D94F2B]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Left prayer hand */}
      <path d="M28 18c-1.2-4.5-3.8-7-6.5-7-3.2 0-5.5 3.2-5.5 7.5V34c0 2.2 1.5 3.5 3.2 3.5 1.4 0 2.6-.8 3.3-2.1" />
      <path d="M22 16.5c-.2-2.8-1.6-4.8-3.4-4.8-2.2 0-3.8 2.4-3.8 5.6V31" />
      <path d="M19 15c-.1-2.2-1.2-3.8-2.7-3.8-1.8 0-3.1 2-3.1 4.6v13.2" />
      <path d="M28 34.5c0 6.5-2.8 12.5-6.5 16.2" />
      {/* Right prayer hand (mirrored) */}
      <path d="M36 18c1.2-4.5 3.8-7 6.5-7 3.2 0 5.5 3.2 5.5 7.5V34c0 2.2-1.5 3.5-3.2 3.5-1.4 0-2.6-.8-3.3-2.1" />
      <path d="M42 16.5c.2-2.8 1.6-4.8 3.4-4.8 2.2 0 3.8 2.4 3.8 5.6V31" />
      <path d="M45 15c.1-2.2 1.2-3.8 2.7-3.8 1.8 0 3.1 2 3.1 4.6v13.2" />
      <path d="M36 34.5c0 6.5 2.8 12.5 6.5 16.2" />
      {/* Palms meeting */}
      <path d="M28 22v16c0 2.5 1.8 4 4 4s4-1.5 4-4V22" />
      <path d="M30 52h4" />
    </svg>
  );
}

function SealWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 m-auto h-64 w-64 opacity-5"
      aria-hidden
    >
      <div className="flex h-full w-full items-center justify-center rounded-full border-[10px] border-[#D94F2B]">
        <Landmark className="h-28 w-28 text-[#D94F2B]" />
      </div>
    </div>
  );
}

export function CivicChatbot() {
  const siteLang = useLanguageStore((s) => s.lang);
  const setSiteLang = useLanguageStore((s) => s.setLang);
  const districtSlug = useMandalPrefStore((s) => s.districtSlug);
  const mandalSlug = useMandalPrefStore((s) => s.mandalSlug);
  const activeHub = `/${districtSlug}/${mandalSlug}`;
  const surveyHref = `${activeHub}/survey`;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [botLang, setBotLang] = useState<Lang | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [flow, setFlow] = useState<Flow>("none");
  const [draft, setDraft] = useState({ mandal: "", name: "" });
  const [showActions, setShowActions] = useState(true);
  const [listening, setListening] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, open, botLang, showActions]);

  function pickLanguage(next: Lang) {
    setBotLang(next);
    setSiteLang(next);
    setFlow("none");
    setShowActions(true);
    setMessages([
      {
        id: uid(),
        role: "bot",
        text:
          next === "te"
            ? "నమస్కారం! నేను సమాఖ్య మిత్రను. మీకు ఏ సేవ కావాలో క్రింది బటన్ల ద్వారా ఎంచుకోండి:"
            : "How can I help you today? Please choose the service you need:",
      },
    ]);
  }

  function push(userText: string, bot: Omit<Msg, "id" | "role">) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text: userText },
      { id: uid(), role: "bot", ...bot },
    ]);
  }

  function startPower() {
    const label =
      botLang === "te"
        ? "🔍 250 యూనిట్ల ఉచిత విద్యుత్ స్టేటస్"
        : "🔍 250 Units Free Power Status";
    setShowActions(false);
    setFlow("power");
    push(label, {
      text:
        botLang === "te"
          ? "దయచేసి మీ 9 అంకెల USC / మీటర్ నంబర్ నమోదు చేయండి."
          : "Please enter your 9-digit USC / Meter number.",
    });
  }

  function startGrievance() {
    const label =
      botLang === "te"
        ? "📝 నూతన వినతి / సమస్య నమోదు"
        : "📝 Register Grievance";
    setShowActions(false);
    setFlow("grievance-mandal");
    setDraft({ mandal: "", name: "" });
    push(label, {
      text:
        botLang === "te"
          ? "మీ మండలం పేరు రాయండి (ఉదా: కోదాడ)."
          : "Enter your mandal name (e.g. Kodad).",
    });
  }

  function startSurvey() {
    const label =
      botLang === "te" ? "📋 కుటుంబ సర్వే నమోదు" : "📋 Family Survey Entry";
    setShowActions(false);
    setFlow("none");
    push(label, {
      text:
        botLang === "te"
          ? "కుటుంబ సర్వే ప్రారంభించడానికి క్రింది బటన్ నొక్కండి."
          : "Tap the button below to start the family survey.",
      linkHref: surveyHref,
      linkLabel: botLang === "te" ? "సర్వే ప్రారంభించండి →" : "Start survey →",
    });
  }

  function quickChip(kind: "scholarship" | "bajantri" | "officer") {
    const labels = {
      scholarship: {
        te: "🎓 BC-A స్కాలర్‌షిప్ & హాస్టల్",
        en: "🎓 BC-A Scholarship & Hostel",
      },
      bajantri: {
        te: "🎵 భజంత్రి పెన్షన్ సహాయం",
        en: "🎵 Bajantri Pension Help",
      },
      officer: {
        te: "👥 మండల ఆఫీసర్ వివరాలు",
        en: "👥 Mandal Officer Details",
      },
    } as const;
    const replies = {
      scholarship: {
        te: "BC-A స్కాలర్‌షిప్ వివరాలు Education వర్టికల్‌లో ఉన్నాయి. అవసరమైన సర్టిఫికేట్ల జాబితా కూడా ఉంది.",
        en: "BC-A scholarship steps are in the Education vertical, including the certificate checklist.",
        href: "/verticals/education",
        linkTe: "Education తెరవండి →",
        linkEn: "Open Education →",
      },
      bajantri: {
        te: "భజంత్రి పెన్షన్ వెరిఫికేషన్ శిబిరాలు & డాక్యుమెంట్ చెక్‌లిస్ట్ Bajantri వర్టికల్‌లో ఉన్నాయి.",
        en: "Bajantri pension camps and document checklist are in the Bajantri vertical.",
        href: "/verticals/bajantri",
        linkTe: "Bajantri తెరవండి →",
        linkEn: "Open Bajantri →",
      },
      officer: {
        te: "మీ మండల హబ్ పేజీలో అధికారి ఫోన్ & WhatsApp వివరాలు ఉన్నాయి.",
        en: "Officer phone & WhatsApp are on each mandal hub page.",
        href: activeHub,
        linkTe: "మండల హబ్ తెరవండి →",
        linkEn: "Open mandal hub →",
      },
    } as const;

    const lang = botLang ?? "te";
    const href = kind === "officer" ? activeHub : replies[kind].href;
    setShowActions(false);
    setFlow("none");
    push(labels[kind][lang], {
      text: replies[kind][lang],
      linkHref: href,
      linkLabel: lang === "te" ? replies[kind].linkTe : replies[kind].linkEn,
    });
  }

  function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || !botLang) return;

    if (flow === "power") {
      const ok = /^\d{9}$/.test(text.replace(/\s/g, ""));
      push(text, {
        text: ok
          ? botLang === "te"
            ? `USC ${text}: డెమో స్థితి — పరిశీలనలో (mock). రిఫరెన్స్ #NS-PWR-${text.slice(-4)}. నిజమైన DISCOM స్థితికి మండల అధికారిని సంప్రదించండి.`
            : `USC ${text}: Demo status — Under Verification (mock). Reference #NS-PWR-${text.slice(-4)}. Contact your mandal officer for live DISCOM status.`
          : botLang === "te"
            ? "దయచేసి సరిగ్గా 9 అంకెల USC/మీటర్ నంబర్ ఇవ్వండి."
            : "Please enter a valid 9-digit USC/Meter number.",
      });
      if (ok) {
        setFlow("none");
        setShowActions(true);
      }
      setInput("");
      return;
    }

    if (flow === "grievance-mandal") {
      setDraft((d) => ({ ...d, mandal: text }));
      setFlow("grievance-name");
      push(text, {
        text:
          botLang === "te"
            ? "మీ పూర్తి పేరు రాయండి."
            : "Please enter your full name.",
      });
      setInput("");
      return;
    }

    if (flow === "grievance-name") {
      setDraft((d) => ({ ...d, name: text }));
      setFlow("grievance-text");
      push(text, {
        text:
          botLang === "te"
            ? "మీ సమస్య / వినతిని సంక్షిప్తంగా వివరించండి."
            : "Briefly describe your grievance.",
      });
      setInput("");
      return;
    }

    if (flow === "grievance-text") {
      const ref = `#NS-GR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      push(text, {
        text:
          botLang === "te"
            ? `ధన్యవాదాలు ${draft.name || ""}. ${draft.mandal || "మీ"} మండలం వినతి డెమోగా నమోదైంది. ట్రాకింగ్ ID: ${ref}. (లైవ్ సర్వర్ లింక్ తర్వాత వస్తుంది — ఈ IDని సేవ్ చేసుకోండి.)`
            : `Thank you ${draft.name || ""}. Demo grievance logged for ${draft.mandal || "your"} mandal. Tracking ID: ${ref}. (Live server sync coming soon — please save this ID.)`,
      });
      setFlow("none");
      setShowActions(true);
      setInput("");
      return;
    }

    push(text, {
      text:
        botLang === "te"
          ? "మీ సందేశం అందింది. దయచేసి పైనున్న సేవా బటన్లు ఉపయోగించండి లేదా 1800-NAYI-SEVAకి కాల్ చేయండి."
          : "Message received. Please use the service buttons above or call 1800-NAYI-SEVA.",
    });
    setShowActions(true);
    setInput("");
  }

  function onMic() {
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      const sample =
        botLang === "en"
          ? "Check my free power status"
          : "250 యూనిట్ల స్టేటస్ చెప్పండి";
      setInput(sample);
    }, 900);
  }

  const panelMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
        transition: { duration: 0.22 },
      };

  return (
    <div className="no-print fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && !minimized ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-label={
              botLang === "en"
                ? "Samakhya Seva Mitra helpdesk"
                : "సమాఖ్య సేవ మిత్ర"
            }
            className="flex h-[600px] max-h-[85vh] w-[380px] max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-[#EBE8E0] bg-[#FAF8F2] shadow-2xl"
            {...panelMotion}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#D94F2B] via-[#E8732A] to-[#F5A623] p-4 text-white shadow-md">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-inner">
                  <Landmark className="h-5 w-5 text-[#D94F2B]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-telugu text-sm font-bold leading-tight">
                    {botLang === "en"
                      ? "Samakhya Seva Mitra"
                      : "సమాఖ్య సేవ మిత్ర"}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/90">
                    {botLang === "en"
                      ? "Nayi–Bajantri civic helpdesk"
                      : "నాయీ - భజంత్రి సమాఖ్య ప్రజా వేదిక"}
                  </span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="tap inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
                  onClick={() => setMinimized(true)}
                  aria-label="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="tap inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!botLang ? (
                <motion.div
                  key="welcome"
                  className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-6"
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                >
                  <RangoliBorder position="top" />
                  <RangoliBorder position="bottom" />
                  <NamaskaramArt />
                  <h2 className="mt-2 font-telugu text-3xl font-extrabold tracking-wide text-[#781B0E]">
                    నమస్కారం!
                  </h2>
                  <p className="mt-1 text-center font-telugu text-sm font-bold text-[#8C2A1E]">
                    నాయీ సమాఖ్య ప్రజా సహాయ వ్యవస్థకు స్వాగతం.
                  </p>
                  <p className="mt-0.5 text-center text-xs font-semibold text-[#8C2A1E]/80">
                    Welcome to Nayi Samakhya Helpdesk
                  </p>
                  <p className="mt-3 px-6 text-center font-telugu text-xs text-[#71717A]">
                    ఫిర్యాదు నమోదు చేయడానికి, సమాచారం పొందడానికి భాషను ఎంచుకోండి /
                    Select language to continue.
                  </p>
                  <div className="mt-6 flex w-full flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => pickLanguage("te")}
                      className="w-3/4 rounded-2xl border-2 border-[#E8732A]/50 bg-white py-3 text-center font-telugu text-lg font-bold text-[#781B0E] shadow-sm transition-all hover:bg-[#FFF4E6]"
                    >
                      తెలుగు
                    </button>
                    <button
                      type="button"
                      onClick={() => pickLanguage("en")}
                      className="w-3/4 rounded-2xl border-2 border-[#E8732A]/50 bg-white py-3 text-center text-lg font-bold text-[#781B0E] shadow-sm transition-all hover:bg-[#FFF4E6]"
                    >
                      English
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  className="flex min-h-0 flex-1 flex-col"
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    ref={scrollerRef}
                    className="relative flex-1 space-y-4 overflow-y-auto bg-[#FAF8F2] p-4"
                  >
                    <SealWatermark />
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn(
                          "relative z-[1] max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                          m.role === "bot"
                            ? cn(
                                "border border-[#EBE8E0] bg-white text-[#18181B]",
                                botLang === "te" && "font-telugu",
                              )
                            : "ml-auto bg-[#E8732A] text-white",
                        )}
                      >
                        {m.text}
                        {m.linkHref ? (
                          <Link
                            href={m.linkHref}
                            className="mt-2 block rounded-xl bg-[#FDE8D3] px-3 py-2 text-center text-xs font-bold text-[#781B0E] hover:bg-[#FCD5B5]"
                          >
                            {m.linkLabel}
                          </Link>
                        ) : null}
                      </div>
                    ))}

                    {showActions ? (
                      <div className="relative z-[1] space-y-2.5 pt-1">
                        <button
                          type="button"
                          onClick={startGrievance}
                          className="w-full rounded-2xl bg-[#E8732A] py-3.5 text-center text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#D96318]"
                        >
                          {botLang === "te"
                            ? "📝 నూతన వినతి / సమస్య నమోదు (Register Grievance)"
                            : "📝 Register Grievance / New Complaint"}
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={startPower}
                            className={cn(
                              "rounded-2xl bg-[#EE8939] px-2 py-3 text-center text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#DE7725]",
                              botLang === "te" && "font-telugu",
                            )}
                          >
                            {botLang === "te"
                              ? "🔍 250 యూనిట్ల ఉచిత విద్యుత్ స్టేటస్"
                              : "🔍 250-Unit Free Power Status"}
                          </button>
                          <button
                            type="button"
                            onClick={startSurvey}
                            className={cn(
                              "rounded-2xl bg-[#EE8939] px-2 py-3 text-center text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#DE7725]",
                              botLang === "te" && "font-telugu",
                            )}
                          >
                            {botLang === "te"
                              ? "📋 కుటుంబ సర్వే నమోదు"
                              : "📋 Family Survey Entry"}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => quickChip("scholarship")}
                            className={cn(
                              "rounded-full border border-[#E8732A]/35 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#781B0E] hover:bg-[#FFF4E6]",
                              botLang === "te" && "font-telugu",
                            )}
                          >
                            {botLang === "te"
                              ? "🎓 BC-A స్కాలర్‌షిప్ & హాస్టల్"
                              : "🎓 BC-A Scholarship & Hostel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => quickChip("bajantri")}
                            className={cn(
                              "rounded-full border border-[#E8732A]/35 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#781B0E] hover:bg-[#FFF4E6]",
                              botLang === "te" && "font-telugu",
                            )}
                          >
                            {botLang === "te"
                              ? "🎵 భజంత్రి పెన్షన్ సహాయం"
                              : "🎵 Bajantri Pension Help"}
                          </button>
                          <button
                            type="button"
                            onClick={() => quickChip("officer")}
                            className={cn(
                              "rounded-full border border-[#E8732A]/35 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#781B0E] hover:bg-[#FFF4E6]",
                              botLang === "te" && "font-telugu",
                            )}
                          >
                            {botLang === "te"
                              ? "👥 మండల ఆఫీసర్ వివరాలు"
                              : "👥 Mandal Officer Details"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBotLang(null);
                            setMessages([]);
                            setFlow("none");
                          }}
                          className="text-[10px] font-medium text-[#A1A1AA] underline-offset-2 hover:underline"
                        >
                          Change language / భాష మార్చండి
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-[#EBE8E0] bg-white p-3">
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                    >
                      <button
                        type="button"
                        onClick={onMic}
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8D3] text-[#D94F2B] transition-colors hover:bg-[#FCD5B5]",
                          listening && "ring-2 ring-[#E8732A]/40",
                        )}
                        aria-label="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                          botLang === "en"
                            ? "Use the buttons above, or type here…"
                            : "పైనున్న బటన్లను ఉపయోగించండి…"
                        }
                        className={cn(
                          "flex-1 rounded-full border border-[#EBE8E0] bg-[#F4F2EB]/60 px-4 py-2 text-xs text-[#18181B] focus:border-[#E8732A] focus:outline-none",
                          botLang === "te" && "font-telugu",
                        )}
                      />
                      <button
                        type="submit"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8732A] text-white transition-colors hover:bg-[#D96318]"
                        aria-label="Send"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                    <span className="mt-1 block text-center text-[10px] text-[#A1A1AA]">
                      {botLang === "en"
                        ? "Demo helpdesk • Call 1800-NAYI-SEVA for live seva"
                        : "డెమో హెల్ప్‌డెస్క్ • లైవ్ సేవకు 1800-NAYI-SEVA"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (minimized) {
            setMinimized(false);
            setOpen(true);
            return;
          }
          setOpen((v) => !v);
        }}
        className="chat-pulse tap inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D94F2B] via-[#E8732A] to-[#F5A623] px-4 py-3 text-sm font-semibold text-white shadow-lg"
        aria-expanded={open && !minimized}
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        <span className={siteLang === "te" ? "font-telugu" : ""}>
          {siteLang === "en" ? "Seva Mitra" : "సమాఖ్య సేవ మిత్ర"}
        </span>
      </button>
    </div>
  );
}
