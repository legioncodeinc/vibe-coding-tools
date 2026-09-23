# Guide — write-denial discrimination

**Verb**: `audit-write-denials` · paired knowledge: `references/probe-tables.md` §1, `references/worked-examples.md` Example B.

## Purpose
Prove whether the write-path control exists on a table, with the smallest labeled, deletable write — and classify the denial by its embedded identity, never its HTTP status.

## Preconditions
- Authority + anon key (byte-exact) + probe spacing (~1.4–1.6 s) [hygiene constants].
- The table's real schema shape — obtained by anon read (body rows) first; never guess columns (`PGRST204` will surface your mistake and leak schema expectations) [probes.json].
- Label prepared: `pentest probe - safe to delete` on every identifiable field; the write disclosed in the report.

## Procedure
1. **Shape discovery**: anon `GET /rest/v1/<table>`; if rows exist, derive required columns from them; if `[]`, derive from client-code write shapes (chunk forensics) — both are archived before any write.
2. **Minimal labeled write**: anon `POST /rest/v1/<table>` with the minimal body that satisfies the discovered schema, carrying the label on a free-text field.
3. **Classify** using the embedded `code`/`message` (probe-tables §1):
   - `42501`-class (any outer status) ⇒ **control effective** — record as verified control, cite the transcript.
   - `PGRST204` ⇒ probe malformed ⇒ correct columns from the surfaced message, repeat step 2 once; log the enumeration as informational.
   - `200` ⇒ **control absent** ⇒ Tier-1 candidate (anon write permitted); immediately execute the paired cleanup (step 5) and verify.
4. **Cleanup** (mandatory on every `200` write and on every probe where a row *might* have formed): targeted `DELETE`/`PATCH` by the identified row key; expect `204`; re-read the table and confirm the shape returned to its pre-probe state.
5. **Attest**: record write status + cleanup status + post-cleanup read in the transcript; all three belong in the report's hygiene section.

## Expected shapes (validated)
`contact_messages` anon INSERT ⇒ `401` wrapping `"code":"42501"` [probes.json]. `party_inquiries` corrected ⇒ `401` wrapping `42501` [probe6.json]. Wrong-column shape ⇒ `400 PGRST204` [probes.json].

## Anti-patterns
- Reporting `PGRST204` as an application vulnerability — it is probe-authoring feedback.
- Keying verdicts on HTTP status: a `42501` embedded in a `401` is a *policy* denial, not an auth-plane denial [probes.json][probe6.json].
- Skipping cleanup because "it surely didn't persist" — persistence is exactly what is under test; verify by re-read [probe9.json F4].
