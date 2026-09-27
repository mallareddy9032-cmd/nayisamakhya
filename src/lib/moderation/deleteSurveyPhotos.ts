import type { SupabaseClient } from "@supabase/supabase-js";

export const SURVEY_PHOTOS_BUCKET = "survey-photos";

export function collectPhotoUrls(row: {
  photo_url?: string | null;
  photo_urls?: unknown;
}): string[] {
  const urls: string[] = [];
  if (Array.isArray(row.photo_urls)) {
    for (const u of row.photo_urls) {
      if (typeof u === "string" && u.trim()) urls.push(u.trim());
    }
  }
  if (typeof row.photo_url === "string" && row.photo_url.trim()) {
    urls.push(row.photo_url.trim());
  }
  return [...new Set(urls)];
}

/**
 * Extract object path inside the survey-photos bucket from a public/signed URL
 * or a raw path like `submissions/<id>.jpg`.
 */
export function storagePathFromPhotoUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (!/^https?:\/\//i.test(trimmed)) {
    const cleaned = trimmed.replace(/^\/+/, "");
    if (cleaned.startsWith(`${SURVEY_PHOTOS_BUCKET}/`)) {
      return cleaned.slice(SURVEY_PHOTOS_BUCKET.length + 1) || null;
    }
    return cleaned || null;
  }

  try {
    const parsed = new URL(trimmed);
    const match = parsed.pathname.match(
      /\/storage\/v1\/object\/(?:public|sign|authenticated)\/survey-photos\/(.+)$/i,
    );
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {
    return null;
  }
  return null;
}

export type DeleteSurveyPhotosResult = {
  attempted: number;
  deleted: string[];
  missing: string[];
  errors: string[];
};

function isMissingObjectError(message: string): boolean {
  return /not\s*found|does not exist|no such file|404|object not found/i.test(
    message,
  );
}

/**
 * Delete survey photo objects via the service-role client.
 * Missing objects are treated as success (already gone).
 * Never call this for approved submissions.
 */
export async function deleteSurveyPhotosFromStorage(
  admin: SupabaseClient,
  urls: string[],
): Promise<DeleteSurveyPhotosResult> {
  const paths = [
    ...new Set(
      urls
        .map(storagePathFromPhotoUrl)
        .filter((p): p is string => Boolean(p)),
    ),
  ];

  const result: DeleteSurveyPhotosResult = {
    attempted: paths.length,
    deleted: [],
    missing: [],
    errors: [],
  };

  if (!paths.length) return result;

  // Prefer batch remove; fall back to per-path if the API complains.
  const { error: batchError } = await admin.storage
    .from(SURVEY_PHOTOS_BUCKET)
    .remove(paths);

  if (!batchError) {
    result.deleted.push(...paths);
    return result;
  }

  for (const path of paths) {
    const { error } = await admin.storage
      .from(SURVEY_PHOTOS_BUCKET)
      .remove([path]);
    if (!error) {
      result.deleted.push(path);
      continue;
    }
    const msg = error.message || String(error);
    if (isMissingObjectError(msg)) {
      result.missing.push(path);
    } else {
      result.errors.push(`${path}: ${msg}`);
    }
  }

  return result;
}

/** Clear photo URL fields after Storage delete so the desk does not show dead links. */
export function clearedPhotoFields() {
  return {
    photo_url: null as string | null,
    photo_urls: [] as string[],
  };
}
