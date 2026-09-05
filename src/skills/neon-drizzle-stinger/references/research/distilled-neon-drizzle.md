# Distilled: Neon + Drizzle on SvelteKit/Vercel

Dense, cited distillation of the raw archive in `raw/`. Every claim ends with `[raw/<file>]`. Conflicts and gaps are flagged, not smoothed over. Research window: sources fetched 2026-08-14; Neon and Drizzle both ship continuously, so re-verify version-sensitive claims (pricing figures, CLI flag names) before relying on them past a few months.

## 1. Neon architecture

| Claim | Detail | Source |
|---|---|---|
| Compute/storage split | Ephemeral compute layer (runs Postgres, no durable state) talks over the network to a durable storage layer (safekeepers + pageserver + object storage) via WAL | [raw/neon-drizzle--architecture--overview.md] |
| Commit mechanism | A transaction commits once a quorum of safekeepers acknowledges the WAL record (Paxos-based); compute does not wait for disk/object storage | [raw/neon-drizzle--architecture--overview.md] |
| Why branching/restore/autoscaling are cheap | Because durable state lives outside compute, branch-create, restore, and read-replica-create are metadata operations, not data copies | [raw/neon-drizzle--architecture--overview.md] |
| Resource hierarchy | Organization → Project → Branch → Compute Endpoint / Database / Role → Operation | [raw/neon-drizzle--architecture--overview.md] |
| Branch = copy-on-write clone | Inherits schema+data from parent at branch time; writes saved as deltas; **zero load added to parent** when a branch is created | [raw/neon-drizzle--architecture--branching.md] |
| Root branch | Every project starts with a `main` root branch; children branch from root or from another branch | [raw/neon-drizzle--architecture--branching.md] |
| History window | Retention window for instant restore / Time Travel / branch-from-past. Defaults: **6h Free, 1 day paid**; configurable up to **7 days Launch, 30 days Scale** | [raw/neon-drizzle--architecture--branching.md] |
| Read replicas | Independent read-only compute on the **same storage**, no data duplication; spin up in seconds; asynchronous (eventually consistent); same-region only (cross-region needs logical replication to a separate project) | [raw/neon-drizzle--architecture--overview.md, raw/neon-drizzle--architecture--branching.md], full read-replica doc not separately archived; overview + branching pages both confirm the mechanism |
| PITR mechanism | Point-in-time restore = pageserver reconstructs pages at a target LSN by replaying WAL up to that point; presented as a specialized branch operation, not a data-copy restore | [raw/neon-drizzle--architecture--overview.md] |
| Autoscaling range | 0.25-16 CU, max range (max−min) of 8 CU; 0.25/0.5 CU are shared compute | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |
| Scale-to-zero default | Suspends after **5 minutes** idle; reactivates in **a few hundred ms**; free plan cannot disable it; paid plans can; only available up to 16 CU (larger stays always-on) | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |
| Cold-start cost | First query after wake pays activation latency (hundreds of ms, longer after 7+ days idle) **plus** cold Postgres memory buffers (slower first queries until warmed) | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |
| Session state lost on suspend | Temp tables, prepared statements, advisory locks, LISTEN/NOTIFY subscriptions do not survive a scale-to-zero suspend | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |
| Cold-start mitigations | Disable scale-to-zero (paid); tune suspend timeout (1 min-7 days); co-locate app/DB region; retry w/ backoff; `sslnegotiation=direct`; pair with autoscaling floor instead of a large always-on fixed size | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |
| Scale-to-zero is conservative | Treats "idle in transaction" as active, so long-running transactions don't get killed by the suspend timer | [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md] |

**Gap flagged**: a dedicated Neon "read replicas" doc and a dedicated "backup-restore"/PITR-console doc were seen in `web_search_exa` highlights during research but were not separately archived as raw files (budget-capped at 18 sources); the claims above are corroborated across the architecture-overview and branching pages, which is enough to state them, but a deeper dive into read-replica monitoring/lag and manual backup scheduling was not fully captured.

## 2. Neon connection patterns

| Claim | Detail | Source |
|---|---|---|
| Pooling mechanism | PgBouncer, transaction mode, accepts up to **10,000 client connections**, `default_pool_size` = 90% of `max_connections` | [raw/neon-drizzle--connections--pooling.md] |
| Pooled vs direct string | Add `-pooler` to the endpoint hostname for pooled; omit for direct | [raw/neon-drizzle--connections--pooling.md] |
| When pooled | Serverless functions, web apps, connection-per-request frameworks, ORMs at runtime | [raw/neon-drizzle--connections--pooling.md] |
| When direct | Schema migrations, `pg_dump`/`pg_restore`, logical replication, long-running analytics, anything needing `SET`/`LISTEN`/`NOTIFY`/session state | [raw/neon-drizzle--connections--pooling.md, raw/neon-drizzle--integration--neon-drizzle-connect-guide.md] |
| Transaction-mode limitations | No `SET`/`RESET`, no `LISTEN`/`NOTIFY`, no `WITH HOLD CURSOR`, no SQL-level `PREPARE`/`DEALLOCATE`, no temp tables w/ `PRESERVE`/`DELETE ROWS` on **pooled** connections; protocol-level prepared statements (driver-level) still work | [raw/neon-drizzle--connections--pooling.md] |
| Serverless HTTP driver | `@neondatabase/serverless`, `neon()` fn over HTTPS `fetch`, one-shot queries or `sql.transaction()` for a non-interactive multi-query transaction; drop-in `Pool`/`Client` over WebSockets for interactive transactions / `node-postgres` compatibility | [raw/neon-drizzle--connections--serverless-driver.md] |
| HTTP vs WS tradeoff | HTTP = lowest setup cost (~3 roundtrips), single query only, no session; WS = ~4 roundtrips, supports sessions/interactive transactions, pg-compatible API | [raw/neon-drizzle--connections--serverless-driver.md, raw/neon-drizzle--connections--vercel-fluid-compute.md] |
| **Vercel-specific driver choice** | With **Vercel Fluid compute**, use standard TCP (`pg`/node-postgres) + a pool (`@vercel/functions` `attachDatabasePool`), Fluid keeps functions warm long enough to safely reuse/close pooled connections, making TCP the *lowest-latency* option once warm. On **classic serverless** (no pooling support, Netlify, Deno Deploy, Cloudflare Workers without Hyperdrive), keep using `@neondatabase/serverless` HTTP | [raw/neon-drizzle--connections--vercel-fluid-compute.md] |
| Driver decision matrix by platform | Vercel Fluid → `pg`; Cloudflare Hyperdrive → `pg`; Cloudflare Workers (no Hyperdrive) / Netlify / Deno Deploy → `@neondatabase/serverless`; Railway/Render/VPS/Docker → `pg`/`postgres.js`; browser → Data API client | [raw/neon-drizzle--connections--vercel-fluid-compute.md] |
| Double-pooling warning | Don't layer client-side pooling on top of Neon's server-side PgBouncer pool; if unavoidable, release connections promptly | [raw/neon-drizzle--connections--vercel-fluid-compute.md] |

**Conflict flagged**: none between sources, Vercel's Fluid-compute guidance (favor TCP+pool) and the serverless-driver doc's HTTP-first framing are **not contradictory**, they answer different questions ("classic serverless" vs "Vercel Fluid specifically"). A stinger consuming this research must ask *which Vercel compute model* before recommending a driver, this repo's target is Vercel, where Fluid is the modern default, so `pg` + `attachDatabasePool` is the **preferred default for this stack**, with `@neondatabase/serverless` reserved for edge runtime routes that need HTTP/WebSocket transport.

## 3. Drizzle ORM

| Claim | Detail | Source |
|---|---|---|
| Schema is single source of truth | Feeds both queries (drizzle-orm) and migrations (drizzle-kit); one `schema.ts` or a folder of schema files, path configured in `drizzle.config.ts` | [raw/neon-drizzle--drizzle--schema-declaration.md] |
| Dialect-specific imports | No generic "table" builder, import from `drizzle-orm/pg-core` for Postgres | [raw/neon-drizzle--drizzle--schema-declaration.md] |
| Modern identity columns | Docs' worked example uses `.primaryKey().generatedAlwaysAsIdentity()`, not `serial` | [raw/neon-drizzle--drizzle--schema-declaration.md] |
| Relations are app-level only | `defineRelations()` (v2 API) declares relations for `db.query`; relations do **not** create FK constraints and are independent of physical foreign keys | [raw/neon-drizzle--drizzle--relations.md] |
| `one()`/`many()` fields | `from`/`to` (column or array, composite-key capable), `optional`, `alias` (disambiguate duplicate relations), `where` (polymorphic/filtered relation) | [raw/neon-drizzle--drizzle--relations.md] |
| Many-to-many | Requires an explicit junction table + `.through()` helper in the relation definition | [raw/neon-drizzle--drizzle--relations.md] |
| Relation indexing advice | Index the FK column on the "many" side for 1:N; index both FK columns **and** a composite `(colA, colB)` index on the junction table for N:N | [raw/neon-drizzle--drizzle--relations.md] |
| `drizzle-kit generate` | Diffs schema snapshot vs last migration, writes `migration.sql` + `snapshot.json`; does **not** apply anything | [raw/neon-drizzle--drizzle--migrations-kit-commands.md] |
| `drizzle-kit migrate` | Applies unapplied `.sql` files, tracked in a `__drizzle_migrations` table in the `drizzle` schema | [raw/neon-drizzle--drizzle--migrations-kit-commands.md] |
| `drizzle-kit push` | Diffs schema against the **live database** and applies changes immediately, skipping the SQL-file/history trail entirely | [raw/neon-drizzle--drizzle--migrations-kit-commands.md] |
| **Why `push` is dangerous** | Has a `--force` flag that **"auto-approve all data loss statements without confirmation"** (official warning, verbatim in docs); no audit trail of what changed or when. Official recommendation, quoted: *"The `push` command is ideal for prototyping and development. For production, use `generate` and `migrate`."* | [raw/neon-drizzle--drizzle--migrations-kit-commands.md] |
| Relational queries (`db.query`) | Requires passing both `tables` and `relations` to `drizzle()`; supports nested `with`, relation-scoped filters | [raw/neon-drizzle--drizzle--query-patterns.md] |
| Prepared statements | `.prepare("name")` + `.execute({...})`; placeholders via `sql.placeholder(...)`; works in core query builder AND the relational query builder (`where`, `limit`, `offset`) | [raw/neon-drizzle--drizzle--query-patterns.md] |
| Why prepared statements matter | SQL-string concatenation happens once at prepare time; the driver reuses the precompiled query instead of reparsing every call, near-zero overhead on top of Drizzle's already-thin SQL layer | [raw/neon-drizzle--drizzle--query-patterns.md] |
| Transactions | `db.transaction(async (tx) => {...})`; composes with relational queries (`tx.query...`) | [raw/neon-drizzle--drizzle--query-patterns.md] |

**Gap flagged**: dialect-specific transaction isolation-level configuration is referenced by the Drizzle docs but not captured in the fetched excerpt, verify isolation-level syntax against current docs before writing guide content that depends on it.

## 4. Neon + Drizzle + SvelteKit/Vercel

| Claim | Detail | Source |
|---|---|---|
| Driver selection at `drizzle()` init | `drizzle-orm/neon-http` + `neon()` for HTTP; `drizzle-orm/neon-serverless` + `Pool`/`neonConfig` for WebSocket; `ws` polyfill needed on Node < v22 | [raw/neon-drizzle--integration--neon-drizzle-connect-guide.md] |
| Migrations must use a **direct** connection | Explicit official warning: pooled connection strings **can cause errors** with Drizzle Kit migrations, use the unpooled string for `drizzle-kit generate`/`migrate`/`push` | [raw/neon-drizzle--integration--neon-drizzle-connect-guide.md] |
| Branch-per-environment pattern | Select the Neon connection string by `NODE_ENV` (or similar) so the same Drizzle client code targets a different Neon branch per environment without code changes | [raw/neon-drizzle--integration--neon-drizzle-connect-guide.md] |
| SvelteKit client boundary | Official guide: instantiate `neon()`/the driver **only in server-only files** (`+server.js`, `+page.server.ts`); the Svelte component only ever receives the already-resolved `data` prop from a `load` function, the driver import and `DATABASE_URL` never reach client-shipped code | [raw/neon-drizzle--integration--sveltekit-vercel-guide.md] |
| Provisioning | `vc i neon/neon` (Vercel CLI) provisions and links a Neon resource to a Vercel project; `vercel env pull` syncs connection-string env vars locally | [raw/neon-drizzle--integration--sveltekit-vercel-guide.md] |

## 5. Migrations discipline (expand-backfill-contract, CI gating, branch-per-PR)

| Claim | Detail | Source |
|---|---|---|
| Neon branch-per-PR mechanics | `neondatabase/create-branch-action` creates a branch named e.g. `preview/pr-<n>-<branchname>`, inheriting parent schema+data; migrations run against that branch; `neondatabase/schema-diff-action` posts the diff as a PR comment; `neondatabase/delete-branch-action` cleans up on close; production migration only runs after merge, against a **separate** `DATABASE_URL` secret | [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md] |
| Action outputs are secrets, job-scoped | `create-branch-action` outputs (`db_url`, `db_url_with_pooler`) are only available within the same job and are marked secret, never logged; run migrations/tests inside that same job | [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md] |
| CI gating shape | The GitHub integration auto-sets `NEON_API_KEY`/`NEON_PROJECT_ID`; a documented workflow structure exists for open/sync/close events | [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md] |
| Zero-downtime column add on Postgres 11+ | Adding a nullable column, or a `NOT NULL` column with a **constant** default, is metadata-only (fast, no rewrite); a **volatile** default (`now()`) or an unvalidated `CHECK`/`NOT NULL` constraint forces a full-table scan/rewrite under `ACCESS EXCLUSIVE` | this general-Postgres claim is **not covered by a dedicated raw source in this archive**; it restates the pattern documented for Postgres generally in this repo's `db-stinger` skill (`guides/03-migrations.md`), which the neon-drizzle-stinger guides point to rather than re-deriving |
| The expand-backfill-contract shape | Add (nullable) → backfill in batches → add `CHECK ... NOT VALID` → `VALIDATE CONSTRAINT` (takes only `SHARE UPDATE EXCLUSIVE`, non-blocking) → promote to real `NOT NULL` → drop the old column once nothing reads it | same as above, general Postgres pattern owned by `db-stinger`, applied here to the Neon+Drizzle toolchain (generate/migrate as the file-based mechanism that carries each phase) |

**Gap flagged explicitly**: this skill deliberately does **not** re-research generic Postgres expand-backfill-contract mechanics from scratch, that pattern is already grounded in this Hive's `db-stinger` skill (`guides/03-migrations.md`, pairs with `db-worker-bee`). `neon-drizzle-stinger`'s guide 03 cites `db-stinger` for the general pattern and adds only the Neon/Drizzle-specific layer on top (branch-per-PR as the test bed for a migration, `drizzle-kit generate`+`migrate` as the file mechanism, direct-not-pooled connection requirement). Treat any generic-Postgres locking claim in guide 03 as inherited from `db-stinger`, not freshly verified in this archive.

## 6. pgvector on Neon

| Claim | Detail | Source |
|---|---|---|
| Availability | Available on **every plan**, no add-on; installed **per database**, not per project, run `CREATE EXTENSION IF NOT EXISTS vector;` once per database | [raw/neon-drizzle--ai--pgvector-extension.md] |
| Distance operators | `<->` L2, `<#>` negative inner product, `<=>` cosine, `<+>` L1; also Hamming/Jaccard for `bit` vectors | [raw/neon-drizzle--ai--pgvector-extension.md] |
| Default behavior | No index = exact sequential scan, 100% recall, costly past roughly tens of thousands of rows | [raw/neon-drizzle--ai--pgvector-extension.md] |
| HNSW vs IVFFlat | HNSW: better query speed/recall tradeoff, slower/more-memory build, no training step needed, buildable on an empty table. IVFFlat: faster/cheaper build, lower query performance, **requires existing data** to build (training step) | [raw/neon-drizzle--ai--pgvector-extension.md] |
| Dimension limits | `vector` up to 2,000 dims, `halfvec` up to 4,000, `bit` up to 64,000 (both HNSW and IVFFlat) | [raw/neon-drizzle--ai--pgvector-extension.md] |
| HNSW tuning | `m` (default 16, typical 12-48), `ef_construction` (default 64, ≥2×`m`), `ef_search` at query time (default 40, ≥ `LIMIT` value) | [raw/neon-drizzle--ai--pgvector-extension.md] |
| IVFFlat tuning | `lists` (cluster count at build), `probes` (lists searched per query, default 1, low recall near cluster edges) | [raw/neon-drizzle--ai--pgvector-extension.md] |

## 7. Row Level Security, what's lost leaving Supabase, and the app-code alternative

| Claim | Detail | Source |
|---|---|---|
| Neon's RLS is standard Postgres RLS | Not a proprietary reinterpretation, `CREATE POLICY`, `ENABLE ROW LEVEL SECURITY`, `USING`/`WITH CHECK`, all vanilla Postgres | [raw/neon-drizzle--authorization--rls-data-api.md] |
| RLS state matrix | Disabled = no filtering (all granted rows visible); enabled + no policy = **all access blocked**; enabled + policy = filtered per policy | [raw/neon-drizzle--authorization--rls-data-api.md] |
| RLS is required **only if using the Neon Data API** | The Data API (PostgREST-compatible REST layer) requires RLS on every exposed table because it has no separate permission system of its own, GRANT decides table access, RLS decides row access | [raw/neon-drizzle--authorization--rls-data-api.md] |
| `auth.user_id()` | Extracts the JWT `sub` claim; works with **any** JWT-issuing provider (Neon downloads the provider's JWKS), not tied to a specific auth vendor, so WorkOS JWTs work the same way Clerk/Auth0/Managed Better Auth JWTs do | [raw/neon-drizzle--authorization--rls-data-api.md] |
| Drizzle's `crudPolicy` helper | Declares RLS policies alongside the schema (`role`, `read`, `modify` params); `authUid(column)` = `(select auth.user_id() = column)`; lower-level `pgPolicy` available for asymmetric per-operation rules | [raw/neon-drizzle--authorization--rls-data-api.md] |
| **If not using the Data API** | RLS is optional, not required, a SvelteKit app with a server-only Drizzle client that never exposes the DB to the browser can enforce authorization entirely in server-side application code (route-level checks, service-layer checks) instead of RLS, since every query already passes through trusted server code | inference from [raw/neon-drizzle--authorization--rls-data-api.md] + [raw/neon-drizzle--integration--sveltekit-vercel-guide.md] (server-only client boundary), this is the architecture this stack (SvelteKit + WorkOS, no client-side Data API usage) is expected to use by default; RLS becomes a defense-in-depth layer, not the sole authorization mechanism |

**Conflict/nuance flagged**: Supabase's marketing position treats RLS as close to mandatory because Supabase's client SDK talks to Postgres (via PostgREST) directly from the browser. In a SvelteKit + Neon + Drizzle stack where the database is **only ever touched from server code**, that specific threat model (a browser holding a DB-scoped JWT) does not exist unless the team deliberately adopts Neon's Data API for client-side queries. Guide 07 (`07-authorization-without-rls.md`) treats RLS as optional defense-in-depth for this stack, not a required replacement, this is a judgment call the research supports but does not state in so many words; flagged here as reasoning, not a raw-file quote.

## 8. Migration from Supabase to Neon

| Claim | Detail | Source |
|---|---|---|
| Schema/data transfer, basic | `pg_dump -Fc --schema=public ... -f dump.bak` (direct, not pooled, connection) then `pg_restore --no-owner --no-acl` into Neon | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| Why `--no-owner --no-acl` | Supabase ties object ownership/ACLs to its own auth system; skipping them avoids restore failures, then roles/privileges are reconfigured manually post-migration | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| Near-zero-downtime path | Logical replication: Supabase IPv4 add-on (direct connection required, pooled won't work), Neon NAT IPs allow-listed on Supabase, `PUBLICATION` on Supabase → `SUBSCRIPTION` on Neon; Supabase's `max_replication_slots`/`max_wal_senders` are plan-capped and may force an instance upgrade for large migrations | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| Auth replacement, the ID-remap gotcha | Any new auth provider (Managed Better Auth in Neon's own docs, or WorkOS in this stack) assigns **new user IDs**, breaking every `user_id` foreign key in the migrated schema; the documented fix is a temporary `email → old_id → new_id` mapping table used to rewrite every `user_id` column, then dropped | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| RLS translation | Supabase's `anon` role → Neon's `anonymous` role; Supabase's `auth.uid()` → Neon's `auth.user_id()`, every policy referencing either needs a rewrite, not just a rename at the SQL level (function bodies differ) | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| Permissions are not auto-migrated | Extract `GRANT`s from Supabase manually and reapply the equivalent on Neon, there is no automated 1:1 permission port | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| **Storage and Realtime are explicitly out of scope** | The most detailed migration guide found covers database + auth + RLS only. It does **not** provide a Neon-native replacement for Supabase Storage (object storage) or Supabase Realtime (pub/sub), a team must separately choose an object-storage service (S3/R2/Vercel Blob) and a realtime mechanism (WebSocket service, Postgres `LISTEN`/`NOTIFY` over a direct connection, or a third-party provider) | [raw/neon-drizzle--migration--supabase-to-neon.md] |
| WorkOS specifically | Not itself a Neon doc, [raw/neon-drizzle--auth--workos-authkit-sveltekit.md] documents AuthKit's own session/cookie/callback flow, independent of the database; it does **not** natively perform the Supabase-user-ID remap, that step must be done manually the same way, keyed by email, regardless of which non-Supabase auth provider is chosen | [raw/neon-drizzle--auth--workos-authkit-sveltekit.md, raw/neon-drizzle--migration--supabase-to-neon.md] |

## 9. Cost, limits, connection caps, common production failures

| Claim | Detail | Source |
|---|---|---|
| Pricing model | Fully usage-based on paid plans (Launch/Scale), metered hourly, billed monthly, **no monthly minimum** (as of the Aug 2025 pricing overhaul) | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Compute rate | Launch $0.106/CU-hour; Scale $0.222/CU-hour (~2.1x Launch, buys higher ceiling/SLA/compliance, not a volume discount) | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Storage rate | $0.35/GB-month on both paid plans; Free capped at 0.5 GB/project | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Branch limits | 10 branches/project (Free/Launch included), 25 (Scale included), extra at $1.50/branch-month; hard cap 5,000 branches/project on paid plans | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Storage ceiling | 16 TB logical data per branch on paid plans before write performance degrades (increasable on request) | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Free-plan failure modes | CU-hours exhausted → compute suspended until next period/upgrade; egress exhausted → same; storage over 0.5 GB → writes fail (not data loss); branch count at 10 → branch creation fails. None of these delete data | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Connection caps | Pooled: 10,000 client connections via PgBouncer, `default_pool_size` = 90% of `max_connections`. Direct: `max_connections` scales with compute size (e.g. 104 @ 0.25 CU, 419 @ 1 CU) | [raw/neon-drizzle--cost--pricing-plans-limits.md, raw/neon-drizzle--connections--pooling.md] |
| Read-replica config drift | Certain Postgres settings (`max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`) sync from primary to replica **only at replica start**, resizing the primary without restarting replicas is a documented cause of config mismatch/replication-lag issues | [raw/neon-drizzle--cost--pricing-plans-limits.md] |
| Real-world cost shape | Cost is dominated by CU-hours (uptime), not query count; an always-on Scale compute can run $300+/month; scale-to-zero is the primary lever for cost control on non-24/7 workloads | [raw/neon-drizzle--cost--pricing-plans-limits.md] |

## Cross-cutting gaps (stated, not smoothed over)

1. **Generic Postgres expand-backfill-contract mechanics** are deliberately *not* re-derived here, they're inherited from this Hive's existing `db-stinger` skill. Guide 03 of this stinger cites that skill directly rather than duplicating unverified-in-this-archive locking claims.
2. **Read replica monitoring/lag tooling and manual snapshot scheduling** were seen in search highlights but not archived as dedicated raw files, treat any deep operational claim about read-replica lag thresholds or snapshot retention beyond what's stated in §1 as unverified.
3. **Drizzle transaction isolation-level syntax** is referenced by Drizzle's own docs but the specific API shape wasn't captured in the fetched excerpt, verify before documenting it as a worked example.
4. **Neon Storage/Realtime replacements** (for teams also leaving Supabase Storage/Realtime) are out of scope for every source in this archive, flagged explicitly in §8, not silently omitted.
