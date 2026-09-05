# Worked Example: Serverless Platform Choice Walkthrough

A full platform-choice walkthrough for a hypothetical SaaS workload. Source: `guides/08-serverless-platforms.md`, `research/2026-04-25-serverless-platforms-comparison.md`.

---

## Context

- **Product:** B2B project-tracking SaaS. Multi-tenant.
- **Team:** 5 engineers, mostly TypeScript-fluent, comfortable with SQL but no DBA.
- **Stack:** Next.js 15 App Router on Vercel. Drizzle ORM.
- **Workload:** mixed read/write; 70/30 read-heavy. Point lookups by org/user dominant. ~100 RPS at launch, projected 1000 RPS in 12 months.
- **Geo:** US + EU customers; latency requirements moderate (<200ms p95).
- **Embedding/RAG:** plan to support semantic search over user-uploaded docs in Q3.
- **Auth:** want auth handled by the platform if reasonable (limited team).
- **Branching:** want preview DBs per PR.
- **Budget:** startup; idle cost matters.

## Walking the choice tree

From `guides/08-serverless-platforms.md`:

1. **Need geographic distribution and 5-9s availability?**
   - No. Single-region (US-East primary, EU read replica eventually) is fine. → Skip CockroachDB.
2. **Time-series workload?**
   - No (project tracking, not metrics). → Skip Tiger Data.
3. **Read-heavy edge data, mostly-static, multi-tenant where each tenant is small?**
   - Multi-tenant yes; mostly-static no (active project tracking). → Skip Turso.
4. **Committed to MySQL?**
   - No, prefer Postgres. → Skip PlanetScale.
5. **Want integrated auth + RLS + storage + realtime + edge functions in one platform?**
   - Auth: yes, want it bundled. RLS: yes, multi-tenant.
   - Storage: yes (user uploads). Realtime: nice-to-have. Edge functions: nice-to-have.
   - Strong fit for **Supabase**.
6. **Want world-class branching for dev workflow + serverless Postgres?**
   - Branching: yes, per-PR preview DBs.
   - Pure Postgres: yes.
   - Strong fit for **Neon**.

## The trade-off

Both Supabase and Neon are reasonable. Decisive factors:

| Factor | Weight | Supabase | Neon |
|---|---|---|---|
| Integrated auth | High | ✅ Built-in (`supabase-auth`) | ❌ Need Clerk/Auth0/Better-Auth (~$25-100/mo extra) |
| Built-in storage | Medium | ✅ Built-in | ❌ Need R2/S3 |
| RLS support | High | ✅ Postgres RLS native | ✅ Postgres RLS native (same Postgres) |
| Per-PR branching | High | ✅ Pro+ tier | ✅ Free tier, more mature |
| Idle cost | High | ⚠️ Always-on minimum (~$25/mo small project) | ✅ Scale-to-zero |
| Postgres version | Medium | 15/16 | 16/17 |
| pgvector | High (Q3) | ✅ Available | ✅ Available |
| Supavisor / pooler | High | ✅ Built-in | ✅ Built-in + serverless driver |
| Edge function integration with Vercel | Medium | Indirect | Native via `@neondatabase/serverless` |

## Recommendation

**Primary: Supabase** for these reasons:
1. **Auth + RLS in one platform** halves the team's surface area. With 5 engineers, one fewer service to operate is real value.
2. **Storage included**: user uploads have no separate vendor.
3. **Realtime + Edge Functions** are bonuses for future features (live cursors on tasks; webhook handlers).

**Backup: Neon + Clerk + R2**, accepted if:
- The team grows and dedicates someone to the auth/RLS layer.
- Branching workflow becomes a daily-use feature (Neon's branching is more mature).
- Idle cost becomes a primary concern (scale-to-zero on Neon vs always-on on Supabase).

**Not recommended:**
- **Turso**: write throughput on the project-tracking workload is too high for SQLite's single-writer model.
- **CockroachDB**: workload doesn't justify the latency hit; geo distribution overkill.
- **PlanetScale**: would force MySQL onto a TypeScript team that wants Postgres features (`jsonb`, `pgvector`, `EXCLUDE` constraints).
- **Tiger Data**: paying for TimescaleDB they won't use.

## Migration story for the Q3 RAG feature

When semantic search lands:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE documents ADD COLUMN embedding vector(1536);
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

Supabase has `pgvector` available out-of-the-box. db-worker-bee picks the index family (`hnsw`) and the column type (`vector(1536)` for OpenAI `text-embedding-3-small`); **`mind-worker-bee` owns retrieval, chunking, top-k, and reranking**.

## Connection pooling

On Supabase, **Supavisor** is the pooler. Use **transaction mode** (default for serverless), and set the connection string with `?pgbouncer=true` if any prepared-statement issues surface. Drizzle handles this transparently; Prisma would need the flag explicitly.

## Sign-off

Decision: **Supabase**. Revisit at 12-month mark if:
- Idle cost > $300/mo.
- Branching workflow becomes critical.
- Custom auth requirements outpace Supabase's customization.

## References

- `guides/08-serverless-platforms.md`.
- `research/2026-04-25-serverless-platforms-comparison.md`.
- `templates/ADR.md`: wrap this walkthrough as an ADR for the team to ratify.

---

*Forged 2026-04-25.*
