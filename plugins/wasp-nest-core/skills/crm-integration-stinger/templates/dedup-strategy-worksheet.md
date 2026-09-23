# Dedup Strategy Worksheet

*Template for `guides/05-deduplication.md`. Complete before running any dedup batch or deploying sync dedup logic.*

**Product:** {product name}
**CRM:** {CRM name}
**Date:** {YYYY-MM-DD}
**Estimated record volume:** {N contacts, N companies}

---

## Layer 1: Prevention (at create time)

| Check | Query/Method | Implemented? |
|---|---|---|
| Email exact match (normalized) | `GET /contacts?email={normalized_email}` | [ ] |
| External product ID match | `GET /contacts?properties=external_product_id&value={id}` | [ ] |
| E.164 phone match | `GET /contacts?phone={e164_phone}` | [ ] |

**Action on match:** `{update existing | flag for review | drop}`

---

## Layer 2: Deterministic matching (existing records)

**Confidence: High (auto-merge)**

| Signal | Match type | Volume estimate |
|---|---|---|
| Email exact (normalized) | Exact | {N} |
| External product ID | Exact | {N} |
| E.164 phone | Exact | {N} |

**Auto-merge approved for:** `{Yes / No}`
**Auto-merge log location:** `{e.g., library/crm-audit/dedup-log-YYYY-MM-DD.md}`

---

## Layer 3: Probabilistic matching (human review queue)

**Signals to surface for review:**

| Signal combination | Confidence estimate | Review required |
|---|---|---|
| Fuzzy name (>0.85) + same domain | Medium | Yes |
| Same company + same market | Low | Yes |

**Human review queue location:** `{e.g., shared Notion DB | Slack channel | custom UI}`
**Review SLA:** `{N business days}`

---

## Survivorship rules

| Field category | Rule | Example |
|---|---|---|
| Most recent timestamp | Keep more recent | `last_activity_at` |
| Most complete text | Keep non-null | `phone`, `address` |
| Consent / opt-out | Most restrictive wins | `do_not_contact`, `unsubscribed` |
| Pipeline / CRM data | Keep from CRM record | `deal_stage`, `owner` |
| External IDs | Union (keep all) | `external_product_id`, `stripe_id` |
| Tags / list memberships | Union | All tags from both records |
| Notes / activity history | Merge | All notes from both records |

---

## External ID alias

**Alias storage mechanism:** `{custom CRM property name, e.g., legacy_contact_ids}`
**Alias format:** `{pipe-delimited list of old IDs | JSON array | custom}`
**Lookup table location:** `{database table name | service endpoint}`

---

## Post-migration verification

- [ ] Audit query returns 0 duplicate pairs after migration
- [ ] Integration creates no new duplicates over 2-week monitoring period
- [ ] All non-surviving IDs resolvable via alias lookup table
- [ ] Opt-out/Do Not Contact flags verified on all merged records

---

*See `guides/05-deduplication.md` for the three-layer hierarchy and AI governance rules.*
