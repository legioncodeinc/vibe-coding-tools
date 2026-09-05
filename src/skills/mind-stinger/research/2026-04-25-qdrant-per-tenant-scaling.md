# Qdrant Per-Tenant Collection Scaling

**Source:** Qdrant docs: https://qdrant.tech/documentation/guides/multiple-partitions/
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/08-rag-strategy.md §1`.
**Numbers tag:** benchmarked (Qdrant docs explicitly warn against many small collections).

---

## TL;DR

Qdrant supports per-tenant collections at scale, but the docs explicitly warn:

> "Creating too many collections may result in resource overhead and cause dependencies."

For 10K+ users with per-USER collections, this would mean 40K+ collections (4 collection types per user). Per-collection HNSW indexes + metadata structures consume ~10× more memory than a shared collection with equivalent vector counts.

**the deploying product's choice: per-TENANT collections, with user isolation via indexed payload fields.**

---

## The numbers

For the deploying product's expected scale:

- **10K tenants × 4 collection types = 40K collections** if per-tenant.
- **At 100K tenants × 4 = 400K collections**: operationally untenable.

But the deploying product's growth model is more conservative (small number of well-onboarded tenants), so per-tenant is comfortable through ~10K tenants. Past that, two paths:

1. Shard tenants across multiple Qdrant instances.
2. Move smaller-tenant collections into a shared collection with `tenant_id` as a payload filter (the inverse of the per-user design).

For 10K+ users PER TENANT with per-user collections: catastrophic. the deploying product explicitly rejected this at design time.

---

## Why per-tenant (not per-user)

| Design | Collections at 10K users / 100 tenants | Memory profile |
|---|---|---|
| Per-user, all-types | 10K × 100 × 4 = **4M** | catastrophic |
| Per-tenant, all-types | 100 × 4 = 400 | comfortable |
| Per-tenant, all-types **(current)** | 100 × 4 = 400 + payload filter on `user_id` | comfortable |
| Single global per-type | 4 | one big shared collection: `tenant_id` enforcement at filter layer |

the deploying product's choice (middle row) gets tenant isolation by collection naming AND `user_id` isolation by payload filter. Operationally simple, security-clean.

---

## User isolation via payload field

Every user-scoped query MUST include both `tenant_id` AND `user_id`:

```typescript
filter: {
  must: [
    { key: "tenant_id", match: { value: tenantId } },
    { key: "user_id",   match: { value: userId   } },
  ],
}
```

Both fields are indexed (`COMMON_INDEXES`). Filter performance: 2-5ms.

---

## When per-tenant breaks down

- **At 10K+ tenants:** start sharding. Hash-shard tenants across 2-4 Qdrant instances; route queries by tenant.
- **At a single collection > 10GB:** consider on-disk mode for that collection or shard within a tenant.

For the deploying product at current scale, per-tenant is comfortably within healthy.

---

## Implications

- Per-user or global collections are **must-fix** findings.
- New tenant onboarding triggers `ensureAllCollectionsForTenant(tenantId)` per `guides/08-rag-strategy.md §2`.
- See `guides/08-rag-strategy.md §1`, `guides/09-vector-payload-schema.md §1`.
