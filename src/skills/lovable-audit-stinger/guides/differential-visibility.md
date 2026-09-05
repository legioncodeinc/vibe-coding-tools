# Guide — differential visibility

**Verb**: `audit-differential-visibility` · paired knowledge: `research/distillation.md` §7.1, `references/worked-examples.md` Example A.

## Purpose
Establish whether a table, function, or resource is role-keyed — i.e., whether a live policy sits between roles — using reads only. Never writes. Never single-role reads.

## Preconditions
- Authority over the target Supabase project (operator grant) and the anon key, byte-exact from the bundle with documented offsets — never retyped [forensics excerpt].
- A confirmed synthetic account for the authenticated leg, fixture-disclosed and deletable [account fixture].
- Probe spacing ~1.4–1.6 s between all requests.

## Procedure
1. **Anon leg**: `GET /rest/v1/<table>` with the anon key. Record status **and** body shape.
2. **Authenticate leg**: sign in with the synthetic account (`grant_type=password`); verify JWT carries `role:authenticated`, `aal`, `amr` before proceeding [S-JWT].
3. **Auth leg**: identical `GET /rest/v1/<table>` under the session token. Record status and body shape.
4. **Compare**:
   - `[]` → rows ⇒ a role-keyed control is live. Identify what the exposed rows contain; if exposure to *all* authenticated users is not defensible from context, report as **unknown-intent**, not as a finding [S-RLS].
   - rows → `[]` (rare inversion) ⇒ anon-permissive policy ⇒ **Tier-1 candidate** (anon over-permission) [S-RLS].
   - `[]` → `[]` ⇒ inconclusive: empty data *or* uniform denial. Escalate to write-denial discrimination or RPC-shape analysis before concluding anything.
5. **Repeat per resource class** (table, function, bucket) — the delta is per-resource, not global [S9 scanFile pair].

## Expected shapes (validated)
`documents`: `200 []` → `200` + SOP row (`requires_signature:true`) [probe7.json → probe9.json]. `scanFile`-class function: `401` → `200 {"safe":true}` [probe9.json].

## Anti-patterns
- Single-role read + calling `[]` "the table is empty" — filter-out and absence are indistinguishable in one role [S-RLS].
- Using HTTP status alone for comparison — parse the body's embedded `code`/`message` [probe6.json].
- Mutating probes during this verb — visibility is a read verb; writes belong to write-denial discrimination.
