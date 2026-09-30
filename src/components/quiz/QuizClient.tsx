"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MessageCircle,
  Printer,
  Scale,
  Share2,
  Trophy,
  XCircle,
} from "lucide-react";
import { QUIZ_QUESTIONS } from "@/data/quizQuestions";
import {
  QUIZ_PASS_THRESHOLD,
  type QuizAttempt,
  type QuizRegistrant,
} from "@/types/quiz";
import {
  advocacyWhatsAppHref,
  buildCertificateShareMessage,
  clearSession,
  districtOptions,
  generateCertificateId,
  mandalOptions,
  persistAttempt,
  readSession,
  uid,
  whatsAppShareHref,
  writeSession,
} from "@/lib/quiz/store";
import { QuizCertificate } from "@/components/quiz/QuizCertificate";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass =
  "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

type Step = "register" | "quiz" | "results";

export function QuizClient() {
  const [step, setStep] = useState<Step>("register");
  const [form, setForm] = useState<QuizRegistrant>({
    name: "",
    phone: "",
    district: "",
    mandal: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const districts = useMemo(() => districtOptions(), []);
  const mandals = useMemo(
    () => mandalOptions(form.district),
    [form.district],
  );

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[qIndex]!;
  const progressPct = Math.round(((qIndex + (revealed ? 1 : 0)) / total) * 100);

  useEffect(() => {
    const session = readSession();
    if (session?.name && session.phone) {
      setForm(session);
    }
    setHydrated(true);
  }, []);

  function setField<K extends keyof QuizRegistrant>(
    key: K,
    value: QuizRegistrant[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "district" ? { mandal: "" } : {}),
    }));
  }

  function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    if (name.length < 2) {
      setError("పూర్తి పేరు నమోదు చేయండి");
      return;
    }
    if (phone.length !== 10) {
      setError("10 అంకెల వాట్సాప్ నంబర్ అవసరం");
      return;
    }
    if (!form.district || !form.mandal) {
      setError("జిల్లా & మండలం ఎంచుకోండి");
      return;
    }
    setSubmitting(true);
    const reg: QuizRegistrant = {
      name,
      phone,
      district: form.district,
      mandal: form.mandal,
    };
    writeSession(reg);
    setForm(reg);
    setAnswers([]);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setAttempt(null);
    setStep("quiz");
    setSubmitting(false);
  }

  function onPickOption(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function onNext() {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);

    if (qIndex + 1 >= total) {
      finishQuiz(nextAnswers);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function finishQuiz(finalAnswers: number[]) {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, i) => {
      if (finalAnswers[i] === q.correctIndex) score += 1;
    });
    const passed = score >= QUIZ_PASS_THRESHOLD;
    const certificateId = passed ? generateCertificateId() : null;
    const completedAt = new Date().toISOString();
    const next: QuizAttempt = {
      id: uid(),
      name: form.name,
      phone: form.phone,
      district: form.district,
      mandal: form.mandal,
      score,
      total,
      answers: finalAnswers,
      certificateId,
      passed,
      completedAt,
    };
    persistAttempt(next);
    setAttempt(next);
    setStep("results");
  }

  function onRetry() {
    clearSession();
    setAnswers([]);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setAttempt(null);
    setStep("register");
  }

  function onPrint() {
    window.print();
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#B45309]" aria-hidden />
      </div>
    );
  }

  if (step === "register") {
    return (
      <section className="space-y-5">
        <div className="rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] px-4 py-5 sm:px-5">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-2.5 py-1 font-telugu text-[11px] font-bold text-[#B45309]">
            <Scale className="h-3.5 w-3.5" aria-hidden />
            Competition 3 · 10 ప్రశ్నలు
          </p>
          <h2 className="mt-3 font-display-te text-xl font-normal leading-snug text-[#0F172A] sm:text-2xl">
            చట్ట హక్కుల అన్వేషి
          </h2>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-[#475569]">
            జీ.ఓ. 23, మున్సిపాలిటీల చట్టం 2019, బీసీ సంక్షేమం, సమూహ వారసత్వం —
            10 ప్రశ్నలు.{" "}
            <span className="font-bold text-[#B45309]">
              {QUIZ_PASS_THRESHOLD}+
            </span>{" "}
            స్కోర్ వస్తే «ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు» సర్టిఫికేట్.
          </p>
        </div>

        <form
          onSubmit={onRegister}
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5"
          noValidate
        >
          <div>
            <label htmlFor="quiz-name" className={labelClass}>
              పూర్తి పేరు
            </label>
            <input
              id="quiz-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass}
              placeholder="మీ పేరు"
              required
            />
          </div>

          <div>
            <label htmlFor="quiz-phone" className={labelClass}>
              వాట్సాప్ నంబర్ (10 అంకెలు)
            </label>
            <input
              id="quiz-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className={inputClass}
              placeholder="9XXXXXXXXX"
              required
            />
          </div>

          <div>
            <label htmlFor="quiz-district" className={labelClass}>
              జిల్లా
            </label>
            <select
              id="quiz-district"
              value={form.district}
              onChange={(e) => setField("district", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">జిల్లా ఎంచుకోండి</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.nameTe} ({d.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quiz-mandal" className={labelClass}>
              మండలం
            </label>
            <select
              id="quiz-mandal"
              value={form.mandal}
              onChange={(e) => setField("mandal", e.target.value)}
              className={inputClass}
              disabled={!form.district}
              required
            >
              <option value="">మండలం ఎంచుకోండి</option>
              {mandals.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.nameTe} ({m.nameEn})
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-telugu text-sm text-amber-900"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="tap flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 font-telugu text-base font-bold text-white shadow-[0_0_16px_rgba(180,83,9,0.28)] transition hover:bg-[#92400E] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Scale className="h-5 w-5" aria-hidden />
            )}
            క్విజ్ ప్రారంభించండి
          </button>
        </form>
      </section>
    );
  }

  if (step === "quiz") {
    const isCorrect = selected === question.correctIndex;
    return (
      <section className="space-y-4">
        <div className="no-print rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-telugu text-xs font-bold text-[#B45309]">
              ప్రశ్న {question.id}
            </p>
            <p className="font-mono text-xs font-semibold text-[#64748B]">
              {qIndex + 1}/{total}
            </p>
          </div>

          <div
            className="mb-4 h-2 overflow-hidden rounded-full bg-[#F4F2EB]"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="క్విజ్ పురోగతి"
          >
            <div
              className="h-full rounded-full bg-[#B45309] transition-all duration-300"
              style={{ width: `${Math.max(8, progressPct)}%` }}
            />
          </div>

          <h2 className="font-display-te text-lg font-normal leading-snug text-[#0F172A] sm:text-xl">
            {question.questionTe}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
            {question.questionEn}
          </p>

          <ul className="mt-5 space-y-2.5" role="listbox" aria-label="జవాబులు">
            {question.optionsTe.map((optTe, idx) => {
              const optEn = question.optionsEn[idx] ?? "";
              const picked = selected === idx;
              const showCorrect = revealed && idx === question.correctIndex;
              const showWrong = revealed && picked && !isCorrect;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={picked}
                    disabled={revealed}
                    onClick={() => onPickOption(idx)}
                    className={cn(
                      "tap flex min-h-[52px] w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                      !revealed &&
                        "border-[#E2E8F0] bg-white hover:border-[#B45309]/40 hover:bg-[#FFFDF9]",
                      showCorrect &&
                        "border-emerald-500 bg-emerald-50 text-emerald-950",
                      showWrong &&
                        "border-amber-400 bg-amber-50 text-amber-950",
                      revealed &&
                        !showCorrect &&
                        !showWrong &&
                        "border-[#E2E8F0] bg-[#F8F7F4] opacity-70",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        showCorrect &&
                          "border-emerald-600 bg-emerald-600 text-white",
                        showWrong && "border-amber-600 bg-amber-600 text-white",
                        !revealed && "border-[#E2E8F0] text-[#64748B]",
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-telugu text-sm font-semibold leading-snug text-[#0F172A]">
                        {optTe}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#64748B]">
                        {optEn}
                      </span>
                    </span>
                    {showCorrect ? (
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                        aria-hidden
                      />
                    ) : null}
                    {showWrong ? (
                      <XCircle
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {revealed ? (
            <div
              className={cn(
                "mt-4 rounded-xl border px-4 py-3",
                isCorrect
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-amber-300 bg-amber-50",
              )}
              role="status"
            >
              <p className="font-telugu text-sm font-bold text-[#0F172A]">
                {isCorrect ? "✓ సరైన జవాబు" : "ⓘ గమనిక — సరైన జవాబు హైలైట్"}
              </p>
              <p className="mt-1.5 font-telugu text-sm leading-relaxed text-[#334155]">
                {question.legalNoteTe}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
                {question.legalNoteEn}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            disabled={!revealed}
            onClick={onNext}
            className="tap mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-base font-bold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {qIndex + 1 >= total ? "ఫలితాలు చూడండి" : "తదుపరి ప్రశ్న"}
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </section>
    );
  }

  /* results */
  if (!attempt) return null;
  const passed = attempt.passed;
  const certId = attempt.certificateId;
  const shareHref =
    passed && certId
      ? whatsAppShareHref(
          buildCertificateShareMessage({
            name: attempt.name,
            score: attempt.score,
            total: attempt.total,
            certificateId: certId,
            district: attempt.district,
            mandal: attempt.mandal,
          }),
        )
      : null;
  const advocacyHref = advocacyWhatsAppHref(attempt.district);

  return (
    <section className="space-y-5">
      <div className="no-print rounded-2xl border border-[#E2E8F0] bg-white px-4 py-5 text-center sm:px-5">
        <Trophy
          className={cn(
            "mx-auto h-10 w-10",
            passed ? "text-[#B45309]" : "text-[#64748B]",
          )}
          aria-hidden
        />
        <h2 className="mt-3 font-display-te text-2xl font-normal text-[#0F172A]">
          మీ స్కోర్: {attempt.score}/{attempt.total}
        </h2>
        <p className="mt-2 font-telugu text-sm text-[#475569]">
          {passed
            ? "అభినందనలు! మీరు ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు."
            : `${QUIZ_PASS_THRESHOLD} లేదా అంతకంటే ఎక్కువ స్కోర్ అవసరం — మళ్లీ ప్రయత్నించండి.`}
        </p>
      </div>

      {passed && certId ? (
        <>
          <QuizCertificate
            name={attempt.name}
            district={attempt.district}
            mandal={attempt.mandal}
            score={attempt.score}
            total={attempt.total}
            certificateId={certId}
            completedAt={attempt.completedAt}
          />

          <div className="no-print flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onPrint}
              className="tap inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#B45309]/40 bg-[#B45309]/10 px-4 font-telugu text-sm font-bold text-[#B45309]"
            >
              <Printer className="h-4 w-4" aria-hidden />
              Print / Save A4
            </button>
            {shareHref ? (
              <a
                href={shareHref}
                target="_blank"
                rel="noreferrer"
                className="tap inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0E7A6E] px-4 font-telugu text-sm font-bold text-white"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                WhatsApp షేర్
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <div className="no-print rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="font-telugu text-sm leading-relaxed text-amber-950">
            సర్టిఫికేట్ కోసం కనీసం {QUIZ_PASS_THRESHOLD}/10 అవసరం. జీ.ఓ. 23 &amp;
            మున్సిపల్ చట్టం వివరాలు చదివి మళ్లీ ప్రయత్నించండి.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="tap mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white"
          >
            మళ్లీ ప్రయత్నించండి
          </button>
        </div>
      )}

      {/* Legal Advocacy Cell CTA — always */}
      <aside className="no-print rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] px-4 py-5 sm:px-5">
        <p className="inline-flex items-center gap-1.5 font-telugu text-xs font-bold uppercase tracking-wide text-[#B45309]">
          <Award className="h-3.5 w-3.5" aria-hidden />
          Legal Advocacy Cell
        </p>
        <h3 className="mt-2 font-display-te text-lg font-normal text-[#0F172A]">
          హక్కుల రక్షణకు తదుపరి అడుగు
        </h3>
        <p className="mt-1.5 font-telugu text-sm leading-relaxed text-[#475569]">
          జీ.ఓ. 23 అమలు, ట్రేడ్ లైసెన్స్, స్థల కేటాయింపు — లీగల్ అడ్వకసీ సెల్ /
          సమన్వయకర్త డెస్క్ సహాయం పొందండి.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={advocacyHref}
            target="_blank"
            rel="noreferrer"
            className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0E7A6E] px-4 font-telugu text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp హెల్ప్‌లైన్
          </a>
          <Link
            href="/sprint"
            className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 font-telugu text-sm font-bold text-amber-900"
          >
            <Trophy className="h-4 w-4" aria-hidden />
            సేవా సారథి ఛాలెంజ్
          </Link>
          <Link
            href="/coordinator-card"
            className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-bold text-[#0F172A]"
          >
            కోఆర్డినేటర్ కార్డు
          </Link>
          <Link
            href="/representation"
            className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-bold text-[#0F172A]"
          >
            వినతిపత్రం
          </Link>
        </div>
      </aside>

      {passed ? (
        <button
          type="button"
          onClick={onRetry}
          className="no-print mx-auto block font-telugu text-sm text-[#64748B] underline-offset-4 hover:text-[#B45309] hover:underline"
        >
          మరొకరికి క్విజ్ ప్రారంభించండి
        </button>
      ) : null}
    </section>
  );
}
