/** Competition 3 — చట్ట హక్కుల అన్వేషి (Civic & Legal Rights Quiz) */

export const QUIZ_STORAGE_KEY = "ns_legal_quiz_attempts_v1";
export const QUIZ_SESSION_KEY = "ns_legal_quiz_session_v1";
export const QUIZ_PASS_THRESHOLD = 8;
export const QUIZ_QUESTION_COUNT = 10;

export type QuizRegistrant = {
  name: string;
  phone: string;
  district: string;
  mandal: string;
};

export type QuizAttempt = {
  id: string;
  name: string;
  phone: string;
  district: string;
  mandal: string;
  score: number;
  total: number;
  answers: number[];
  certificateId: string | null;
  passed: boolean;
  completedAt: string;
};

export interface QuizQuestion {
  id: number;
  questionTe: string;
  questionEn: string;
  optionsTe: string[];
  optionsEn: string[];
  correctIndex: number;
  legalNoteTe: string;
  legalNoteEn: string;
}
