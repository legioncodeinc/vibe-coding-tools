# Deduplication Strategy

Duplicate contacts and accounts degrade every downstream system. Design dedup into the sync from day one.

## The three-layer dedup hierarchy

Apply layers in order. Stop at the first match. Do not skip deterministic matching to reach probabilistic matching -- false-positive merges are catastrophic.

### Layer 1: Data contract (prevention)

Prevent duplicates at write time before they enter the CRM.

**At create time:**
- Normalize email (lowercase, trim) before checking for existing records.
- Normalize phone to E.164 (`+14155551234`) before checking.
- Query the CRM for exact email match before creating a new record. If found, update; do not create.
- For Salesforce: check both Lead and Contact objects when deduplicating. A Lead and a Contact with the same email are the same person.

**Standard dedup order at create time:**
1. Exact email match (normalized) → update existing record
2. External ID match → update existing record
3. No match found → create new record

### Layer 2: Deterministic matching (after the fact)

For records already in the CRM, deterministic matching uses exact or normalized key equality.

**Confidence tier: High (merge without human review)**
- Email exact match (normalized)
- External product ID match
- E.164 phone exact match
- Company domain exact match + same person name

**Confidence tier: Medium (flag for review before merging large accounts)**
- Company name exact match (normalized)
- Company domain + country exact match

**Rules for deterministic matching:**
- Only merge records in the same confidence tier in a single batch.
- Log every merge with the merge reason, source records, and the winning field values.
- Preserve the non-surviving record's ID as an alias (see External ID Alias Pattern below).

### Layer 3: Probabilistic matching (human review required)

Fuzzy matching for records without a deterministic match signal. Requires human confirmation before merge.

**Signals to use in combination (not individually):**
- Fuzzy name similarity (Levenshtein or Jaro-Winkler, threshold >= 0.85)
- Same company domain
- Same geographic market (country/state)
- Same job title or role keywords

**Rule:** Never auto-merge on probabilistic signals alone. Surface the candidate merge pair to a human review queue. See `templates/dedup-strategy-worksheet.md` for the review queue format.

---

## Selective survivorship

When merging two records, "one record wins" is too blunt. Apply field-level survivorship rules.

| Field category | Survivorship rule |
|---|---|
| Most recent timestamp field (e.g., `last_activity_at`) | Keep the more recent value |
| Most complete text field (e.g., `phone`, `address`) | Keep the non-null value; prefer more specific (city + state vs city alone) |
| Consent / opt-out / Do Not Contact | **Always keep the most restrictive value.** If either record has `unsubscribed: true`, the merged record must have `unsubscribed: true`. Non-negotiable. |
| CRM-owned pipeline data (deal stage, owner) | Keep from the surviving CRM record; do not overwrite with product-side values |
| External IDs from all integrated systems | Union -- keep ALL external IDs from both records |
| Tags / list memberships | Union -- keep all memberships from both records |
| Notes / activity history | Keep all notes from both records (merge, do not overwrite) |

---

## External ID alias pattern

After merging, the non-surviving record's ID is dead. Any downstream system that was holding a reference to the non-surviving ID will now have a broken foreign key.

**Required post-merge step:**
1. Record the non-surviving record's ID as an alias on the surviving record.
2. Configure a lookup table: `old_id → surviving_id`.
3. Any downstream system querying by the old ID should hit the lookup table and resolve to the surviving record.

In HubSpot: store the non-surviving `hs_object_id` in a custom multi-value property on the surviving Contact.
In Salesforce: store the non-surviving record ID in a custom text field (or a related `ExternalIdAlias__c` custom object for multi-ID cases).

---

## Dedicated dedup tools

When the CRM's native dedup is insufficient and the integration team doesn't want to build the matching pipeline from scratch:

- **HubSpot native:** HubSpot has a built-in Duplicates Manager (Professional/Enterprise). Limited to email/name matching. Batch process.
- **Dedupely:** HubSpot-specific dedup SaaS. Strong for large HubSpot contacts databases.
- **RingLead / Zoominfo DMS:** Salesforce-focused dedup. Handles Lead/Contact cross-object dedup.
- **Merge.dev:** Includes basic dedup within its sync layer; does not replace a dedicated dedup workflow for existing CRM records.

---

## AI in deduplication: rules first, AI second

AI/ML-based fuzzy matching can surface candidate pairs that rule-based systems miss. However:

- **Rule-based matching must run first.** AI should only process records that deterministic rules did not match.
- **AI recommends; human decides.** For enterprise accounts and records with conflicting consent flags, require human confirmation regardless of AI confidence score.
- **Never auto-merge on AI score alone.** The cost of a false-positive merge (two different people merged into one contact) exceeds the cost of a false negative (duplicate remains but is identified).

---

*Sources: `research/external/2026-05-20-crm-deduplication-strategy.md`, `research/external/2026-05-20-bidirectional-sync-architecture.md`*
*See also: `examples/hubspot-bidirectional-sync.md` (dedup section)*
