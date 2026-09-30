import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import {
  deriveStatus,
  generateSarathiRefCode,
  isValidSarathiRef,
  mapDbRow,
  normalizeRefCode,
  uid,
} from "@/lib/sprint/volunteers";
import type { Volunteer } from "@/types/volunteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegisterBody = {
  name?: string;
  phone?: string;
  district?: string;
  mandal?: string;
};

async function findByPhone(
  phone: string,
): Promise<{ volunteer: Volunteer | null; persisted: boolean }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { volunteer: null, persisted: false };
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (error || !data) return { volunteer: null, persisted: Boolean(supabase) };
    return { volunteer: mapDbRow(data as Record<string, unknown>), persisted: true };
  } catch {
    return { volunteer: null, persisted: false };
  }
}

async function findByRef(
  refCode: string,
): Promise<{ volunteer: Volunteer | null; persisted: boolean }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { volunteer: null, persisted: false };
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("ref_code", normalizeRefCode(refCode))
      .maybeSingle();
    if (error || !data) return { volunteer: null, persisted: Boolean(supabase) };
    return { volunteer: mapDbRow(data as Record<string, unknown>), persisted: true };
  } catch {
    return { volunteer: null, persisted: false };
  }
}

async function insertVolunteer(
  volunteer: Volunteer,
): Promise<{ ok: boolean; row?: Volunteer }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { ok: false };
    const { data, error } = await supabase
      .from("volunteers")
      .insert({
        id: volunteer.id,
        name: volunteer.name,
        phone: volunteer.phone,
        district: volunteer.district,
        mandal: volunteer.mandal,
        ref_code: volunteer.refCode,
        completed_count: volunteer.completedCount,
        status: volunteer.status,
      })
      .select("*")
      .maybeSingle();
    if (error) return { ok: false };
    return {
      ok: true,
      row: data ? mapDbRow(data as Record<string, unknown>) : volunteer,
    };
  } catch {
    return { ok: false };
  }
}

/** GET ?phone= or ?ref= — lookup volunteer progress. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = String(searchParams.get("phone") || "").replace(/\D/g, "");
  const ref = String(searchParams.get("ref") || "").trim();

  if (phone.length === 10) {
    const { volunteer, persisted } = await findByPhone(phone);
    return NextResponse.json({
      success: true,
      volunteer,
      persisted,
      mock: !persisted,
    });
  }

  if (ref && isValidSarathiRef(ref)) {
    const { volunteer, persisted } = await findByRef(ref);
    return NextResponse.json({
      success: true,
      volunteer,
      persisted,
      mock: !persisted,
    });
  }

  return NextResponse.json(
    { success: false, error: "Provide phone (10 digits) or valid ref" },
    { status: 400 },
  );
}

/** POST — register a new field champion (or return existing by phone). */
export async function POST(req: Request) {
  try {
    let body: RegisterBody;
    try {
      body = (await req.json()) as RegisterBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const district = String(body.district || "").trim().toLowerCase();
    const mandal = String(body.mandal || "").trim().toLowerCase();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Full name is required" },
        { status: 400 },
      );
    }
    if (phone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "10-digit WhatsApp phone is required" },
        { status: 400 },
      );
    }
    if (!district || !mandal) {
      return NextResponse.json(
        { success: false, error: "District and mandal are required" },
        { status: 400 },
      );
    }

    const existing = await findByPhone(phone);
    if (existing.volunteer) {
      return NextResponse.json({
        success: true,
        volunteer: existing.volunteer,
        persisted: existing.persisted,
        mock: !existing.persisted,
        existing: true,
      });
    }

    const now = new Date().toISOString();
    const volunteer: Volunteer = {
      id: uid(),
      name,
      phone,
      district,
      mandal,
      refCode: generateSarathiRefCode(district),
      completedCount: 0,
      status: deriveStatus(0),
      createdAt: now,
      updatedAt: now,
    };

    const inserted = await insertVolunteer(volunteer);
    if (inserted.ok && inserted.row) {
      return NextResponse.json({
        success: true,
        volunteer: inserted.row,
        persisted: true,
        mock: false,
        existing: false,
      });
    }

    return NextResponse.json({
      success: true,
      volunteer,
      persisted: false,
      mock: true,
      existing: false,
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
