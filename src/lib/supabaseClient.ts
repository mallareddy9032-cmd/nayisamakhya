/**
 * Supabase admin client for server-side bot + desk mutations.
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS on storage uploads and inserts.
 */
export { getSupabaseAdmin, getSupabaseAdmin as getSupabaseAdminClient } from "@/lib/supabase/admin";
