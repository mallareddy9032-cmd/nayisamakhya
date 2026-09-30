import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import {
  deriveStatus,
  isValidSarathiRef,
  mapDbRow,
  normalizeRefCode,
} from "@/lib/sprint/volunteers";
import type { Volunteer } from "@/types/volunteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { refCode } — increment completedCount +1 (certify at 15). */
export async function POST(req: Request) {
  try {
    let body: { refCode?: string; ref?: string };
    try {
      body = (await req.json()) as { refCode?: string; ref?: string };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const raw = String(body.refCode || body.ref || "").trim();
    if (!isValidSarathiRef(raw)) {
      return NextResponse.json(
        { success: false, error: "Invalid SARATHI ref code" },
        { status: 400 },
      );
    }
    const refCode = normalizeRefCode(raw);

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        credited: false,
        mock: true,
        refCode,
        volunteer: null,
      });
    }

    const { data: existing, error: findErr } = await supabase
      .from("volunteers")
      .select("*")
      .eq("ref_code", refCode)
      .maybeSingle();

    if (findErr || !existing) {
      return NextResponse.json({
        success: true,
        credited: false,
        mock: false,
        refCode,
        volunteer: null,
        error: findErr?.message || "volunteer_not_found",
      });
    }

    const current = mapDbRow(existing as Record<string, unknown>);
    const nextCount = (current.completedCount || 0) + 1;
    const nextStatus = deriveStatus(nextCount);

    const { data: updated, error: updErr } = await supabase
      .from("volunteers")
      .update({
        completed_count: nextCount,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("ref_code", refCode)
      .select("*")
      .maybeSingle();

    if (updErr) {
      return NextResponse.json(
        { success: false, credited: false, error: updErr.message },
        { status: 500 },
      );
    }

    const volunteer: Volunteer = updated
      ? mapDbRow(updated as Record<string, unknown>)
      : { ...current, completedCount: nextCount, status: nextStatus };

    return NextResponse.json({
      success: true,
      credited: true,
      mock: false,
      refCode,
      volunteer,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
