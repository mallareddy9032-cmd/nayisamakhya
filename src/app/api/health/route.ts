import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

/**
 * Supabase keep-alive + liveness probe.
 *
 * Optional auth: when CRON_SECRET is set, require
 * `Authorization: Bearer <CRON_SECRET>`. When unset, allow open execution
 * (local/preview). Minimal `surveys` select keeps the project warm.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "nayisamakhya-core",
        database: "supabase-unconfigured",
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
        message:
          "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not configured",
      },
      { status: 503 },
    );
  }

  try {
    const { error } = await supabase.from("surveys").select("id").limit(1);

    // PGRST116 = zero rows for single-row expectations; harmless for limit(1).
    if (error && error.code !== "PGRST116") {
      console.warn("[Keep-Alive Health] Query warning:", error.message);
    }

    const duration = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      service: "nayisamakhya-core",
      database: "supabase-active",
      latencyMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown health error";
    return NextResponse.json(
      { status: "error", message },
      { status: 500 },
    );
  }
}
