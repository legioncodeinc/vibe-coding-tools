# Valkey vs Redis: Working Memory Choice

**Source:** Valkey docs: https://valkey.io/, Linux Foundation announcement (March 2024); Redis 7.4 license change announcement.
**Retrieved:** 2026-04-25
**Status:** Informational: referenced in `guides/01-stack-enforcement.md`.
**Numbers tag:** vendor-directional (no large-scale benchmark differentiating Valkey from Redis 7.4 yet, as Valkey is a fork, performance is functionally equivalent).

---

## TL;DR

Valkey is the OSS-licensed continuation of Redis after the March 2024 Redis license change (BSL/SSPL). Linux Foundation-backed, drop-in compatible, BSD-3-Clause licensed.

the deploying product uses Valkey for working memory (`session:working:{sessionId}`, `compact:lock:*`, `coach:persona:*`, `media:queue`, `platform:ai-models` cache, `ai:match:*` cache, `coaching:opening:*` cache, `platform:referral-ai-config` cache).

---

## Why Valkey, not Redis

1. **License clarity.** Redis 7.4+ uses SSPL/BSL: commercial use restrictions. Valkey is BSD-3-Clause: no restrictions.
2. **Drop-in compatible.** Same wire protocol. Existing `ioredis` / `redis` clients work without changes.
3. **Linux Foundation governance.** Stable governance model.
4. **Performance parity.** No measurable difference in current benchmarks (it's a fork of Redis 7.2.4).

A push to switch to Redis 7.4+ requires `guides/01-stack-enforcement.md §2` (and a license-compliance review).

---

## the deploying product's Valkey usage

| Key pattern | Purpose | TTL |
|---|---|---|
| `session:working:{sessionId}` | Working memory (3-tier Tier 1) | 7200s (2h) |
| `compact:lock:{sessionId}` | Compaction watchdog | 600s (10 min, NX) |
| `coach:persona:{tenantId}:{coachType}` | Coach prompt cache | 600s (10 min) |
| `platform:ai-models` | Model slot cache | 3600s (1h) |
| `platform:referral-ai-config` | Referral AI config cache | 3600s (1h) |
| `ai:match:{tenantId}:{requesterId}` | Matching results cache | 43200s (12h) |
| `coaching:opening:{tenantId}:{module}:{memberId}` | Module opening message cache | 3600s (1h) |
| `media:queue` | Async video processing queue | (list, no TTL) |
| `media:job:{id}` | In-progress job lock | 3600s (1h) |
| `media:dlq` | Dead letter queue | (list, no TTL) |

All TTLs are documented in the corresponding `guides/`. Drift is **must-fix** unless accompanied by doc update.

---

## Persistence

the deploying product runs Valkey with periodic RDB snapshots for durability. Working memory expiry (TTL) is the design: losing recent working memory is acceptable (`reconstructSession()` rebuilds from Postgres + Qdrant). Losing match-result caches and coach-persona caches is acceptable (rebuild on next access).

The only persistence-critical Valkey state is the `media:queue` list. Ensure it survives restarts (snapshot frequency tuned accordingly).

---

## Failure modes (from `guides/13-context-continuity.md §7`)

- **Valkey outage:** all sessions fall to RESUMED state on next message; `reconstructSession()` runs from Qdrant. Performance degrades; functionality maintained. Do NOT serve empty context.

---

## Why not in-memory only (Node `Map`)

- **Multi-process coordination:** lock semantics (`SET ... NX`) require an external store.
- **Restart durability:** in-memory state lost on every deploy.
- **Cross-instance read** (multiple API replicas): in-memory state isn't shared.

Valkey is the canonical pick for these reasons.

---

## Implications

- Substituting Redis 7.4+ requires substitution policy + license review.
- TTL drift from documented values is **must-fix** without doc update.
- See `guides/01-stack-enforcement.md`, `guides/12-three-tier-memory.md §3`, `guides/13-context-continuity.md`.
