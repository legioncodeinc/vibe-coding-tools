# Guide — bundle forensics

**Verb**: `audit-bundle-forensics` · paired knowledge: `references/worked-examples.md` Example C, `lovable--bundle--key-and-endpoint-excerpts.txt` (the validated artifact).

## Purpose
Extract embedded keys, endpoints, third-party hosts, table/RPC inventories from shipped client JS — as evidence with documented offsets, not summaries.

## Preconditions
- Local copies of the bundle and all route chunks (chunk filenames here end `_js` without a dot — globs for `*.js` silently miss; list the directory instead).
- Node available for `indexOf`/`slice`; the bundle is multi-MB single-line minified JS — grep context windows misfire on it.

## Procedure
1. **Key sweep** (`eyJ` prefix): Node loop over `bundle.js` and every chunk: find each occurrence offset, slice ±~250 chars, record `(file, offset, context)`. Adjacent matches ~37 chars apart are the header+payload segments of the *same* JWT [forensics excerpt].
2. **Classify each JWT**: decode the two base64url segments; record `iss`, `role`, `iat`, `exp`. `role:anon` + `iss:supabase` is expected posture [S-API] — audit-relevant facts are reachability and duplication, not mere presence.
3. **Endpoint sweep**: sweep for `functions/v1/<name>`, `supabase.co`, hostnames (`topHosts` frequency), shortened links, dev-server regexes. Record every third party receiving client data [sweep.json].
4. **Inventory sweep**: table names and RPC function names referenced by client code — these become the *named* inputs to surface enumeration (never guessed) [sweep.json].
5. **Secret-class sweep**: scan for non-anon secret patterns (`sb_secret_`, `sk-` classes). Empty result is a *result* — record it [sweep.json `secrets: []`].
6. **Archive** every occurrence as a headed excerpt: origin, fetch date, source type, documented offsets — byte-exact slices, never paraphrase [forensics excerpt].

## Expected shapes (validated)
Anon JWT duplicated verbatim across ≥4 chunks, inline as `Authorization:"Bearer <jwt>"` on `/functions/v1/ai-generate-checklist` and `/functions/v1/ai-write-document` [forensics excerpt][sweep.json]. Hostname frequency table with third-party payroll endpoint present [sweep.json].

## Anti-patterns
- Grep-context-window extraction on multi-MB single-line JS — merged/phantom regions; use per-occurrence slicing with recorded offsets.
- Reporting the anon key as a "leak" — anon keys are public by design; the finding is what they authorize [S-API].
- Paraphrasing context in the archive — the archive holds bytes-with-offsets; interpretation lives in the distillation.
- Retyping credentials anywhere downstream — everything reads from the archived artifact [account fixture].
