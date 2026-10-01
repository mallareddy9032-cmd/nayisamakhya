"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type DraftEnvelope<T> = {
  v: 1;
  savedAt: string;
  data: T;
};

export type UseFormAutoSaveOptions<T> = {
  /** Debounce before writing to localStorage (default 500ms). */
  debounceMs?: number;
  /** When false, skip hydrate + save (default true). */
  enabled?: boolean;
  /**
   * Invoked once on mount when a valid draft exists.
   * Parent should merge into form state (e.g. setForm / setStep).
   */
  onHydrate?: (draft: T) => void;
};

export type UseFormAutoSaveResult = {
  isHydrated: boolean;
  lastSaved: Date | null;
  clearDraft: () => void;
  hasDraft: boolean;
};

/**
 * Resilient offline auto-save + hydration for multi-step civic forms.
 * - Hydrates from localStorage once on mount
 * - Debounces writes (default 500ms) after hydration
 * - clearDraft removes the key and suppresses the next write cycle
 */
export function useFormAutoSave<T>(
  storageKey: string,
  data: T,
  options?: UseFormAutoSaveOptions<T>,
): UseFormAutoSaveResult {
  const debounceMs = options?.debounceMs ?? 500;
  const enabled = options?.enabled ?? true;
  const onHydrateRef = useRef(options?.onHydrate);
  onHydrateRef.current = options?.onHydrate;

  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  /** Skip one save after hydrate / clear so we don't overwrite or thrash. */
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsHydrated(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as DraftEnvelope<T>;
        if (parsed && parsed.v === 1 && parsed.data != null) {
          setHasDraft(true);
          if (parsed.savedAt) {
            const d = new Date(parsed.savedAt);
            if (!Number.isNaN(d.getTime())) setLastSaved(d);
          }
          skipNextSaveRef.current = true;
          onHydrateRef.current?.(parsed.data);
        }
      }
    } catch {
      /* corrupt / private mode */
    }

    setIsHydrated(true);
  }, [storageKey, enabled]);

  useEffect(() => {
    if (!enabled || !isHydrated || typeof window === "undefined") return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        const envelope: DraftEnvelope<T> = { v: 1, savedAt, data };
        window.localStorage.setItem(storageKey, JSON.stringify(envelope));
        setLastSaved(new Date(savedAt));
        setHasDraft(true);
      } catch {
        /* quota / private mode — non-fatal */
      }
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [data, storageKey, debounceMs, enabled, isHydrated]);

  const clearDraft = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      /* ignore */
    }
    setHasDraft(false);
    setLastSaved(null);
    skipNextSaveRef.current = true;
  }, [storageKey]);

  return { isHydrated, lastSaved, clearDraft, hasDraft };
}

export function formatDraftSavedTime(date: Date | null, lang: "te" | "en" = "te"): string {
  if (!date) return "";
  try {
    return date.toLocaleTimeString(lang === "te" ? "te-IN" : "en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date.toISOString().slice(11, 16);
  }
}
