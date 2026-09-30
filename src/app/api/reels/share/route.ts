import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import { mapDbRow } from "@/lib/reels/store";
import type { ReelSubmission } from "@/types/reels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { id } — increment sharesCount +1 for an approved/featured reel. */
export async function POST(req: Request) {
  try {
    let body: { id?: string };
    try {
      body = (await req.json()) as { id?: string };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Reel id is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        credited: false,
        mock: true,
        id,
        reel: null,
      });
    }

    const { data: existing, error: findErr } = await supabase
      .from("reels")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findErr || !existing) {
      return NextResponse.json({
        success: true,
        credited: false,
        mock: false,
        id,
        reel: null,
        error: findErr?.message || "reel_not_found",
      });
    }

    const current = mapDbRow(existing as Record<string, unknown>);
    if (current.status === "pending") {
      return NextResponse.json({
        success: true,
        credited: false,
        mock: false,
        id,
        reel: current,
        error: "pending_not_shareable",
      });
    }

    const nextShares = (current.sharesCount || 0) + 1;
    const { data: updated, error: updErr } = await supabase
      .from("reels")
      .update({ shares_count: nextShares })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (updErr) {
      return NextResponse.json(
        { success: false, credited: false, error: updErr.message },
        { status: 500 },
      );
    }

    const reel: ReelSubmission = updated
      ? mapDbRow(updated as Record<string, unknown>)
      : { ...current, sharesCount: nextShares };

    return NextResponse.json({
      success: true,
      credited: true,
      mock: false,
      id,
      reel,
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
