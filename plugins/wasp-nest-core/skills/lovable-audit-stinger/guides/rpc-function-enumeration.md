# Guide — RPC & function-surface enumeration

**Verb**: `audit-rpc-function-surface` · paired knowledge: `references/probe-tables.md` §2, `references/worked-examples.md` Example D.

## Purpose
Map which Edge Functions and RPCs exist under each role and how each gates — using the client's own named inventory as the probe list.

## Preconditions
- Named inventories from bundle forensics (`rpcCalls`, `functionsPath`) — probes are by name, never blind guessing [sweep.json].
- Anon key (byte-exact) + optional synthetic session for the auth leg; spacing ~1.4–1.6 s.

## Procedure
1. **Root probes**: `GET /functions/v1` and `GET /rest/v1` — record the platform's own miss shapes (`404 NOT_FOUND`, `404 "requested path is invalid"`) as the negative baseline [sweep.json].
2. **Function gates** (per client-named function, anon first): `POST` minimal body; classify:
   - uniform `404 NOT_FOUND` ⇒ absent (negative baseline confirmed) [probes.json].
   - `401 Unauthorized` ⇒ anon-denied — control effective, function exists [probes.json].
   - `400/404` token-gating messages ⇒ token control effective [probes.json][probe7.json].
   - `503 BOOT_ERROR` ⇒ **availability finding only** — record, never adjudicate as configuration [probe9.json].
3. **Auth-leg contrast** (for each function that answered the anon leg differently than expected): repeat under the synthetic session; a `401→200` delta proves server-side role gating [probe9.json `scanFile`].
4. **RPC probes** (per client-named RPC): `POST /rest/v1/rpc/<name>` with minimal/empty args:
   - `404 PGRST202` (names the searched function) ⇒ not exposed (negative) [probes.json].
   - `200` + computed value/data ⇒ callable; if the anon leg answered with *real data*, that is a **Tier-1 candidate** (anon over-permission) — `get_events_reserved_counts` is the validated shape [probes.json].
   - role-check shapes inside RPC bodies (`403 "Admin access required"`) ⇒ control effective [probe9.json `inviteEmployee`].
5. **Ledger** every name × role × shape × verdict with the transcript anchor.

## Anti-patterns
- Blind name-guessing as the *primary* method — guessing is baseline confirmation only; the inventory comes from forensics.
- Folding `BOOT_ERROR` into configuration findings — availability ≠ posture [probe9.json].
- Reporting a callable-with-data anon RPC as "expected" without a policy-source citation — anon data exposure is the canonical Tier-1 signal [S-RLS].
