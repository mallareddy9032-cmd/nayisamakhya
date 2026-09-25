#!/usr/bin/env node
/**
 * One-shot Method 3 production setup.
 *
 * Requires env:
 *   VERCEL_TOKEN
 *   SUPABASE_SERVICE_ROLE_KEY
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_WEBHOOK_SECRET
 * Optional:
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   MODERATION_DESK_SECRET
 *   VERCEL_PROJECT_ID / VERCEL_TEAM_ID (auto-detected if omitted)
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-method3.mjs
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || "";
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://www.nayisamakhya.org";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  "https://pvhnwoukpccgeoqdsevm.supabase.co";

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}
if (!WEBHOOK_SECRET) {
  console.error("TELEGRAM_WEBHOOK_SECRET is required");
  process.exit(1);
}

async function vercel(path, opts = {}) {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) throw new Error("VERCEL_TOKEN is required");
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Vercel ${path} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function resolveProject() {
  if (process.env.VERCEL_PROJECT_ID) {
    return {
      id: process.env.VERCEL_PROJECT_ID,
      teamId: process.env.VERCEL_TEAM_ID || undefined,
    };
  }
  const qs = new URLSearchParams({ limit: "100" });
  if (process.env.VERCEL_TEAM_ID) qs.set("teamId", process.env.VERCEL_TEAM_ID);
  const data = await vercel(`/v9/projects?${qs}`);
  const project = (data.projects || []).find((p) =>
    /nayi|samakhya/i.test(p.name),
  );
  if (!project) {
    throw new Error(
      `Could not find nayisamakhya project. Set VERCEL_PROJECT_ID. Seen: ${(data.projects || []).map((p) => p.name).join(", ")}`,
    );
  }
  return { id: project.id, teamId: project.accountId };
}

async function upsertEnv(projectId, teamId, key, value, targets = ["production", "preview", "development"]) {
  const qs = teamId ? `?teamId=${teamId}` : "";
  // Remove existing
  const existing = await vercel(`/v9/projects/${projectId}/env${qs}`);
  const envs = existing.envs || existing || [];
  for (const row of envs) {
    if (row.key === key) {
      await vercel(`/v9/projects/${projectId}/env/${row.id}${qs}`, {
        method: "DELETE",
      });
    }
  }
  await vercel(`/v10/projects/${projectId}/env${qs}`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: targets,
    }),
  });
  console.log(`  set ${key}`);
}

async function redeploy(projectId, teamId) {
  const qs = teamId ? `?teamId=${teamId}` : "";
  const deps = await vercel(`/v6/deployments?projectId=${projectId}&limit=1${teamId ? `&teamId=${teamId}` : ""}`);
  const latest = (deps.deployments || [])[0];
  if (!latest) throw new Error("No existing deployment to redeploy");
  const created = await vercel(`/v13/deployments${qs}`, {
    method: "POST",
    body: JSON.stringify({
      name: latest.name,
      project: projectId,
      target: "production",
      gitSource: latest.meta?.githubCommitSha
        ? {
            type: "github",
            ref: latest.meta.githubCommitRef || "main",
            sha: latest.meta.githubCommitSha,
            repoId: latest.meta.githubRepoId,
          }
        : undefined,
    }),
  });
  console.log("redeploy", created.url || created.id);
  return created;
}

async function setWebhook() {
  const form = new FormData();
  form.set("url", `${SITE}/api/telegram-webhook`);
  form.set("secret_token", WEBHOOK_SECRET);
  form.set("drop_pending_updates", "true");
  form.set("allowed_updates", JSON.stringify(["message"]));
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    { method: "POST", body: form },
  );
  const json = await res.json();
  console.log("setWebhook", json);
  const info = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`,
  ).then((r) => r.json());
  console.log("getWebhookInfo", JSON.stringify(info.result, null, 2));
  return info.result;
}

async function waitConfigured(timeoutMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${SITE}/api/telegram-webhook`);
    const json = await res.json().catch(() => ({}));
    console.log("health", json);
    if (json.configured) return true;
    await new Promise((r) => setTimeout(r, 8000));
  }
  return false;
}

async function main() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRole) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");

  console.log("Resolving Vercel project…");
  const { id, teamId } = await resolveProject();
  console.log("project", id, "team", teamId);

  console.log("Upserting env vars…");
  await upsertEnv(id, teamId, "TELEGRAM_BOT_TOKEN", BOT_TOKEN);
  await upsertEnv(id, teamId, "TELEGRAM_WEBHOOK_SECRET", WEBHOOK_SECRET);
  await upsertEnv(id, teamId, "SUPABASE_SERVICE_ROLE_KEY", serviceRole);
  await upsertEnv(id, teamId, "NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
  await upsertEnv(id, teamId, "NEXT_PUBLIC_SITE_URL", SITE);
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    await upsertEnv(
      id,
      teamId,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim(),
    );
  }
  if (process.env.MODERATION_DESK_SECRET) {
    await upsertEnv(
      id,
      teamId,
      "MODERATION_DESK_SECRET",
      process.env.MODERATION_DESK_SECRET.trim(),
    );
  }

  console.log("Redeploying production…");
  await redeploy(id, teamId);

  console.log("Setting Telegram webhook…");
  await setWebhook();

  console.log("Waiting for configured:true …");
  const ok = await waitConfigured();
  if (!ok) {
    console.error("Timed out waiting for configured:true — redeploy may still be building.");
    process.exit(2);
  }
  console.log("Method 3 is live.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
