# Nayi Samakhya | నాయీ సమాఖ్య

Authoritative civic portal for Telangana & Andhra Pradesh — Next.js App Router, editorial linen + terracotta design system.

## Stack

- Next.js (App Router) + React 19
- Tailwind CSS v4
- Framer Motion (hero crossfade)
- Lucide icons + Radix Accordion
- Zustand (language, mandal, accessibility)

## UX / Mobile (v2.0 overhaul)

- Safe-area shell (`100dvh`, `viewportFit: cover`) + `.pb-safe` / `.pb-nav-clear` under fixed `MobileBottomNav`
- Mobile drawers use independent scroll + `.pb-drawer-safe`; bottom nav hides while sheets are open
- Telugu display/body floor via `.font-telugu` / `.font-display-te` (`leading-telugu` ≈ 1.7–1.75)
- Compact mobile header brand (no “Nayi S…” truncation); horizontal pill rails use `.no-scrollbar`
- In-app browser breakout banner (Telegram / Instagram / WhatsApp)
- 3-step representation wizard at `/representation` (`?dist=` deep-link)
- A4 print + TWA PDF fallback (`html2canvas` + `jspdf`)
- Dual-mode admin heat map: SVG choropleth on `md+`, ranked Civic Corridor cards on mobile

## Run locally

```bash
npm install
npm run dev -- --port 43211
```

Open [http://127.0.0.1:43211](http://127.0.0.1:43211).

## Design system

- Canvas `#FBFBF9` · Surface white · Hairline `#EBE8E0`
- Ink `#18181B` · Muted `#71717A` · Brand terracotta `#C2410C`

## Key routes

| Path | View |
|------|------|
| `/` | Civic homepage (hero, actions, FAQ, gallery, press) |
| `/api/admin/analytics` | Desk Bearer auth — district volume + **Saturation Index** (active submissions + verified coordinators ÷ mandals) |
| `/verticals/[slug]` | Welfare, Education, Livelihood, Bajantri, … |
| `/mandals` | Mandal directory |
| `/{district}` | Unified rural & urban directory (tabs + search) |
| `/{district}/urban/{ulb}` | Urban local body portal (coordinators, establishments, Telegram desk) |
| `/{district}/{mandal}` | Mandal civic portal (Supabase when configured, else static) |
| `/representation` | Official petition / representation letter generator (print-ready) |
| `/feed` | Public civic field feed (approved Telegram photos) |
| `/newsletter` | Bi-weekly digest **పాక్షిక పౌర సమాచార పత్రిక** (auto from `civic_bulletins` + verified feed) |
| `/coordinator-card` | Printable coordinator digital ID / visiting card (+ hub join links) |
| `/api/cron/sync-bulletins` | Vercel Cron — ingest GOs/circulars (Bearer `CRON_SECRET` / desk secret) |
| `/api/broadcast/dispatch` | District-scoped Telegram + WhatsApp dispatch to matching coordinators |
| `/twa` | Telegram Mini App hub (petition, feed, GO 23, ID card) |
| `/announce` | Community WhatsApp blasts + coordinator SOP (`?blast=desk|representation|feed|sop`) |
| `/poster` | Printable A4 Digital Desk QR poster (`@NayiSamakhyaDeskBot`) |
| `/admin/login` | Bilingual admin portal PIN login — sets HTTP-only `admin_session` (HMAC, 7 days) |
| `/admin/volunteers` | Volunteers control desk (requires `admin_session`; logout clears cookie) |
| `/admin/desk` | Admin moderation desk (Bearer `MODERATION_DESK_SECRET` → submissions + **analytics** tab with statewide choropleth / Saturation Index; approve/reject notifies submitter on Telegram). Portal session also unlocks desk actions. |
| `/admin/moderation` | Field photo moderation desk (cookie PIN via `MODERATION_DESK_SECRET`, or portal `admin_session`) |
| `/{district}/{mandal}/survey` | Family survey wizard |
| `/policies/*` · `/sitemap` | Legal pages |

## Supabase (optional)

Geography coverage (static fallbacks always available): **33 districts**, **589 mandals**, **135 ULBs** (12 municipal corporations + 123 municipalities).

Mandal hubs and urban ULB pages read from Postgres when env is set; otherwise they fall back to static JSON (`mandals-directory.json`, `urban-directory.json`). Apply `supabase/migrations/004_urban_local_bodies.sql` for the urban tables.

1. Create a Supabase project and copy URL + anon key into `.env.local` (see `.env.example`).
2. Run migrations in order:
   - `supabase/migrations/001_civic_schema.sql`
   - `supabase/migrations/002_surveys.sql`
   - `supabase/migrations/004_urban_local_bodies.sql`
   - `supabase/migrations/create_mandal_officers.sql`
   - … through `008_lock_survey_photos_insert.sql`
   - `supabase/migrations/009_civic_bulletins.sql` (Modules 2–3 bulletins + coordinator endpoints)
3. Seed districts + mandals + ULBs: `seed_phase1_districts.sql`, `seed_phase1_ulbs.sql`, then `seed_phase2_mandals.sql` (or `seed.sql`).
4. Seed nodal officers roster:
   ```bash
   npm run seed:officers
   ```
   (needs `SUPABASE_SERVICE_ROLE_KEY` or anon key with insert rights; contact line `+91 9032654111`)
5. Publish `local_updates` rows (`is_published = true`) for the photo feed.

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev -- --port 43123
```

RLS: public `SELECT` on districts, mandals, officers, mandal_officers, gram_panchayats; published-only on `local_updates`.

## Method 3 — Telegram Moderation Desk

Webhook lives at `src/app/api/telegram-webhook/route.ts` (welcome menu, `/officer`, album batching, photo ingest). **Never replace GitHub `main` with a telegram-only tree** — that wipes the Next site and 404s Vercel (including `/representation`). Edit the route under `src/` and push the full app.

1. Run `supabase/migrations/create_moderation_desk.sql` (creates `survey_submissions` + `survey-photos` bucket), then `005_moderation_desk_v2.sql` and `006_admin_desk_submissions_api.sql` (`panchayat_name`, `admin_notes`, `reviewed_at`).
2. Set in Vercel / `.env.local`: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `MODERATION_DESK_SECRET`. Prefer also setting Admin Portal `ADMIN_SECRET_PIN` and `ADMIN_SESSION_SECRET`; if those are unset, login falls back to the desk PIN and a derived HMAC key from existing ops secrets.
3. Alert channel chat id — add `@NayiSamakhyaTelanganaBot` as admin on **“Nayi Samakhya Alert”**, publish a short channel post, then run:
   ```bash
   npm run setup:telegram
   ```
   This detects `channel_post` / `my_chat_member`, writes `TELEGRAM_CHAT_ID` into `.env.local` (gitignored), and posts a Telugu HTML test ping. Mirror the same id to Vercel as `TELEGRAM_ADMIN_CHANNEL_ID` for deskDispatch.
4. Point the bot webhook (use **www** — apex redirects break Telegram). Include `callback_query` so welcome inline buttons work:
   ```bash
   curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d "url=https://www.nayisamakhya.org/api/telegram-webhook" \
     -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
     -d 'allowed_updates=["message","callback_query"]'
   ```
   Or: `npm run setup:method3` (needs `VERCEL_TOKEN` + the keys above).
5. Open `/admin/login`, enter `ADMIN_SECRET_PIN` (or the existing `MODERATION_DESK_SECRET` desk PIN if `ADMIN_SECRET_PIN` is unset), then use `/admin/volunteers` or `/admin/moderation`.
   External tools can POST `/api/admin/moderate` with header `x-moderation-secret: $MODERATION_DESK_SECRET`.
6. Logout: navbar **నిష్క్రమించు** → `POST /api/admin/logout` clears `admin_session`.

### Admin Portal auth (Milestone 1)

| Env | Purpose |
|-----|---------|
| `ADMIN_SECRET_PIN` | Preferred PIN for `POST /api/admin/login` (timing-safe). Falls back to `MODERATION_DESK_SECRET`, then a **dev-only** placeholder outside production. |
| `ADMIN_SESSION_SECRET` | Preferred HMAC-SHA256 key for `admin_session`. If unset, derived from `MODERATION_DESK_SECRET` → `CRON_SECRET` → `TELEGRAM_WEBHOOK_SECRET` (domain-separated). Dev-only placeholder outside production if none exist. |
| `MODERATION_DESK_SECRET` | Existing desk unlock PIN; also unlocks portal login when `ADMIN_SECRET_PIN` is unset, and can back the session HMAC derivation. |

**Vercel checklist (production):**

1. Preferred: set both `ADMIN_SECRET_PIN` and `ADMIN_SESSION_SECRET` (long random), then Redeploy.
2. Minimum for “our credentials” to work today: ensure `MODERATION_DESK_SECRET` is set (already used by moderation) — portal will accept that PIN and derive the session key.
3. After env changes, Redeploy (or wait for next deploy) and hard-refresh `/admin/login`.

Cookie: `admin_session` — HTTP-only, `SameSite=strict`, `Secure` in production, `maxAge` 7 days. Middleware redirects unauthenticated `/admin/*` (except `/admin/login`) once a session secret is available.

### Telegram Mini App (`/twa`)

- Hub: `https://www.nayisamakhya.org/twa` (chrome-free; petition, feed, GO 23 → DISCOM prefill, coordinator card).
- Menu button (persistent):
  ```bash
  curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setChatMenuButton" \
    -H "Content-Type: application/json" \
    -d '{"menu_button":{"type":"web_app","text":"📱 సేవా డెస్క్","web_app":{"url":"https://www.nayisamakhya.org/twa"}}}'
  ```
- BotFather → Bot Settings → Domain: `www.nayisamakhya.org`. Always set `NEXT_PUBLIC_SITE_URL=https://www.nayisamakhya.org`.

## Pilot simulation (5 field cohorts)

End-to-end harness for Kodad / Chilkur / Huzurnagar / Suryapet / Mellachervu coordinators:

```bash
# Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or anon) in .env.local
# Telegram optional — skips cleanly when TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID unset
npm run test:pilot
```

Inserts into `surveys`, `quiz_records`, `grievances`, and `orders` (when present), validates UTF-8 BOM CSV with Telugu, and dispatches War Room alerts. Apply `017_quiz_records.sql` + `018_grievances.sql` in Supabase for full inserts; missing tables soft-skip with logs. Artifacts land in `scripts/.pilot-artifacts/` (gitignored).

## Deploy

GitHub `mallareddy9032-cmd/nayisamakhya` **`main`** → Vercel (Next.js). Domain: `nayisamakhya.org`.

```bash
./scripts/push-github-main.sh
```

Requires `GITHUB_TOKEN` in `.env.local` (Contents: Read and write). Prefer a **new commit** over re-pushing an already-built SHA so Vercel redeploys. Set the GitHub default branch to `main` (not a `cursor/*` branch).
