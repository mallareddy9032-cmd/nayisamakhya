/** Mandal Field Champion (సేవా సారథి) volunteer — Competition 1. */

export type VolunteerStatus = "active" | "certified";

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  district: string;
  mandal: string;
  refCode: string;
  /** Surveys completed via this champion's share link */
  completedCount: number;
  status: VolunteerStatus;
  createdAt?: string;
  updatedAt?: string;
}

export const SPRINT_CERT_THRESHOLD = 15;

/** Spec localStorage key — array of Volunteer records */
export const VOLUNTEERS_STORAGE_KEY = "volunteers_db";
export const SPRINT_SESSION_KEY = "nayi_sprint_session_v1";
