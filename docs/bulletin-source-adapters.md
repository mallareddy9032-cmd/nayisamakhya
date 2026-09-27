# Bulletin source adapters (Module 2)

The Vercel Cron route `GET|POST /api/cron/sync-bulletins` collects notices from every registered adapter in `src/lib/bulletins/adapters.ts`, generates a formal Telugu `summary_te`, and upserts into `civic_bulletins`.

## Adapters

| Id | Status | Behavior |
|----|--------|----------|
| `seed-mock` | **Active** | Deterministic fixture GOs / collector circulars / BC-A welfare / scholarships. Keeps local + Cron runnable without gov scrapers. |
| `telangana-go-portal` | Stub | Reserved for `go.telangana.gov.in` / collector circular HTML feeds. Returns `[]` unless `BULLETIN_ENABLE_LIVE_ADAPTERS=1`. |

## Adding a live adapter

1. Implement `BulletinSourceAdapter` with a stable `source_external_id` per notice.
2. Map into categories: `BC-A Welfare` \| `Collector Circular` \| `Education/Scholarships` \| `Legal Rights`.
3. Call `generateTeluguSummary()` from `src/lib/bulletins/summary.ts`.
4. Register in `BULLETIN_ADAPTERS`.

## Auth

Cron / desk secret via `Authorization: Bearer <CRON_SECRET|MODERATION_DESK_SECRET>` or `x-cron-secret` / `x-desk-secret`.

## Dispatch

`POST /api/broadcast/dispatch` with `{ "bulletin_id": "<uuid>" }` fans out **only** to rows in `bulletin_coordinator_endpoints` whose `district_slug` is in the bulletin’s `target_districts` (Telegram bot + WhatsApp webhook).
