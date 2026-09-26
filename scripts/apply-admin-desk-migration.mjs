#!/usr/bin/env node
/**
 * Apply supabase/migrations/006_admin_desk_submissions_api.sql via the
 * Supabase SQL HTTP endpoint when SUPABASE_SERVICE_ROLE_KEY is available.
 *
 * Usage:
 *   node scripts/apply-admin-desk-migration.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env
 * (or .env.local). Prefer running the SQL in the Supabase SQL Editor if
 * the project does not expose the query endpoint.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i);
    const val = trimmed.slice(i + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnvLocal();

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const sqlPath = resolve(root, "supabase/migrations/006_admin_desk_submissions_api.sql");
const sql = readFileSync(sqlPath, "utf8");

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Paste supabase/migrations/006_admin_desk_submissions_api.sql into the Supabase SQL Editor instead.",
  );
  process.exit(1);
}

// PostgREST cannot run arbitrary DDL; try the database query endpoint used by some projects.
const endpoints = [
  `${url}/pg/query`,
  `${url}/rest/v1/rpc/exec_sql`,
];

let lastErr = "";
for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql, sql }),
    });
    const text = await res.text();
    if (res.ok) {
      console.log("Migration applied via", endpoint);
      console.log(text.slice(0, 500));
      process.exit(0);
    }
    lastErr = `${endpoint} → ${res.status} ${text.slice(0, 200)}`;
  } catch (err) {
    lastErr = `${endpoint} → ${err instanceof Error ? err.message : String(err)}`;
  }
}

console.error("Could not apply DDL over HTTP.");
console.error(lastErr);
console.error(
  "\nOpen the Supabase SQL Editor and run:\n  supabase/migrations/006_admin_desk_submissions_api.sql",
);
process.exit(2);
