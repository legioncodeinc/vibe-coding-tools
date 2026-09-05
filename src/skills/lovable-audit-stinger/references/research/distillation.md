# Distillation — Auditing Lovable × Supabase stacks

Distillation of the raw archive for the `lovable-audit-stinger` component. Every factual claim terminates in a bracketed citation resolving to a file under `raw/` in this directory. Claims without a raw-file citation are methodological assertions about how to audit, not claims about the world. Where two archived sources disagree, both readings are stated.

## Citation key

| Key | Raw file | Source type |
|---|---|---|
| `[S-42501]` | `raw/supabase--docs--api-42501-errors.html` | official vendor documentation |
| `[S-RLS]` | `raw/supabase--docs--row-level-security.html` | official vendor documentation |
| `[S-API]` | `raw/supabase--docs--securing-your-api.html` | official vendor documentation |
| `[S-PW]` | `raw/supabase--docs--auth-passwords.html` | official vendor documentation |
| `[S-JWT]` | `raw/supabase--docs--auth-jwt-claims.html` | official vendor documentation |
| `[S-STO]` | `raw/supabase--docs--storage.html` | official vendor documentation |
| `[S-FN]` | `raw/supabase--docs--edge-functions.html` | official vendor documentation |
| `[S-RT]` | `raw/supabase--docs--realtime.html` | official vendor documentation |
| `[L-FN]` | `raw/lovable--docs--edge-functions.md` | official vendor documentation |
| `[L-INT]` | `raw/lovable--docs--supabase-integration.md` | official vendor documentation |
| `[L-CLOUD]` | `raw/lovable--docs--cloud.md` | official vendor documentation |
| `[B]` | `raw/lovable--bundle--key-and-endpoint-excerpts.txt` | empirical observation (client bundle forensics) |
| `[S1]` | `raw/probes.json` | empirical observation (authorized pentest, loungeatswift.com, anon wave) |
| `[S6]` | `raw/probe6.json` | empirical observation (auth settings/activation/denial) |
| `[S7]` | `raw/probe7.json` | empirical observation (reads + realtime) |
| `[S9]` | `raw/probe9.json` | empirical observation (authenticated posture wave) |
| `[SW]` | `raw/sweep.json` | empirical observation (185-chunk bundle sweep) |
| `[AF]` | `raw/empirical--loungeatswift--test-account.md` | empirical observation (sanitized account fixture) |

---

## 1. Stack topology — what is being audited

A Lovable-built application is a client bundle (Vite/RSC route chunks) talking to a Supabase project: Postgres exposed through PostgREST (`/rest`), GoTrue (`/auth/v1`), Storage, Realtime, and Edge Functions (`/functions/v1/`) [L-INT][S-FN]. Two hosting postures exist: the built-in backend ("Cloud") and a bring-your-own Supabase project, with no migration path in either direction [L-INT][L-CLOUD]. Edge Functions in a Lovable project are written, deployed, and maintained by the platform via chat — they are not customer-owned server code, and they are unavailable while the project is paused [L-FN]. The platform's built-in "Run security checks" feature is explicitly documented as *not* a full audit [L-CLOUD] — which is exactly the gap an independent audit fills.

Consequence for method: the audit surface splits into four layers that must each be probed independently — auth (`/auth/v1`), data (REST/RLS), functions (`/functions/v1`), and client-side exposure (the bundle itself) [L-INT][B].

## 2. Authentication layer — semantics an auditor must know

| Claim | Citation |
|---|---|
| Supabase maps JWTs to roles (`anon`, `authenticated`, `service_role`); `ref` and `role` claims appear only on platform-issued tokens | `[S-JWT]` |
| Signature validation precedes claim trust; `aal`/`amr` record assurance level and last auth method | `[S-JWT]` |
| Hosted Supabase projects enable email confirmation by default; unconfirmed users cannot sign in until confirmed | `[S-PW]` |
| `resetPasswordForEmail` is non-enumerating (same response whether or not the email exists) | `[S-PW]` |
| Email-sending rate limits exist by default (best-effort) to bound abuse | `[S-PW]` |
| `user_metadata` is user-mutable at signup; `app_metadata` is server-controlled/immutable | `[S-JWT]` |

Empirical confirmation on the audited stack: anonymous signup returned 200 with `confirmation_sent_at` set and `email_verified:false` (i.e., confirmation required before sign-in) [S1]; settings showed `mailer_autoconfirm:false`, email+google+apple enabled, phone disabled [S6]; the OTP resend path returned `429 over_email_send_rate_limit` with a retry-after hint [S1]. A confirmed account then signed in with `role:authenticated`, `aal:aal1`, `amr:[{method:password}]` [S9]. All consistent with `[S-PW]`/`[S-JWT]`.

## 3. Data layer — grants vs. policies, and what each denial actually means

| Denial shape | Meaning | Citation |
|---|---|---|
| `42501` (possibly embedded inside an outer 400/401) | Row-level security policy violation — a grant exists but no policy matched the operation | `[S-42501]` |
| `200` with `[]` | Success semantics: rows were *filtered out*, not absent — a `using`-clause mismatch returns zero rows with **no error** | `[S-RLS]` |
| `PGRST204` | Column not in schema cache — schema-cache enumeration leak (names the missing column) | `[S1]` |
| `PGRST202` | Function not exposed to RPC — RPC-surface enumeration (names the searched function) | `[S1]` |
| `PGRST100` | Filter-parse failure — malformed query filter (probe-authoring error, not an app defect) | `[S7]` |

Service-role keys bypass RLS entirely, so client-side findings never bound the server-side posture `[S-API]`. Recursive policy definitions fail with `42P17`; views bypass RLS unless defined `security_invoker=true` [S-RLS]. Default privileges on `public` tables grant SELECT/INSERT/UPDATE/DELETE to `anon`+`authenticated`, so absent explicit revocation the *grant* layer is open and the entire control burden sits in the *policy* layer [S-RLS][S-API].

Empirical: anonymous INSERT into `contact_messages` → outer **401** with embedded `"code":"42501","message":"new row violates row-level security policy"` [S1]; same shape on `party_inquiries` (outer **401**) [S6]. Anonymous reads of seven tables returned `200 []` while `menu_items` returned `200` with real rows — the filter-out-vs-absent distinction is observable in one transcript [S1]. Under the authenticated role, `documents` returned one SOP row (`requires_signature:true`) where the anonymous read of the same table had returned `[]` [S7][S9] — a live `auth.uid()`-keyed policy in action.

**Status-code insufficiency** [S1][S6]: the embedded `code` field, not the HTTP status, carries the denial's identity. A scanner that keys on HTTP status alone misclassifies every `42501`-embedded-in-401 event. Audit tooling must parse the body.

## 4. Function layer — Edge Functions as an audit surface

| Claim | Citation |
|---|---|
| Functions are invoked at `/functions/v1/<name>` and may gate on JWTs/tokens server-side | `[S-FN]` |
| Function secrets live server-side and must never be embedded in client code | `[L-FN]` |
| Functions written/deployed/maintained by Lovable via chat; unavailable while paused | `[L-FN]` |

Empirical: `/functions/v1` root → `404 NOT_FOUND` [SW]; guessed names (`hello`, `webhook`, `otp`, …) → uniform `404 NOT_FOUND` [S1]; real names found by bundle forensics: `ai-generate-checklist` and `ai-write-document` answered **401 `Unauthorized`** to anonymous POST [S1][B]; `handle-email-unsubscribe` is token-gated — `400 "Token is required"` [S1] and `404 "Invalid or expired token"` on a malformed token [S7]. A client-referenced function (`scrapeArticle`-style) returned `503 BOOT_ERROR "Function failed to start"` [S9] — an availability/infra failure, recorded as such, not as a configuration verdict. Differential gating observed: `scanFile` anon → `401` vs authenticated → `200 {"safe":true}` [S9].

## 5. Storage & realtime layers

`storage_buckets` enumerated empty even to the authenticated role (`[]`) [SW][S9]; bucket policies are the control mechanism when buckets exist [S-STO]. Realtime channel establishment under test conditions produced `ws_error` [S7]; realtime subscription semantics (presence, broadcast, postgres_changes) are documented at `[S-RT]`, but no archived primary source explains the *failure* mode observed — thin spot, flagged below.

## 6. Client-side exposure — the bundle is evidence, not just a target

- The anonymous-role JWT (`iss:supabase`, `role:anon`, ~10-year lifetime) is **duplicated verbatim** across at least four route chunks — inline as `Authorization:"Bearer <jwt>"` headers on calls to `/functions/v1/ai-generate-checklist` and `/functions/v1/ai-write-document`, plus the index and unsubscribe chunks [B][SW].
- Anonymous keys are public by design; exposure of the anon JWT in client JS is expected posture, not a leak [S-API]. What it *does* prove: those two AI functions are reachable by anyone holding the public bundle under the `anon` role — their own authorization is the only control [S1][B].
- Hostname/URL inventory from the 185-chunk sweep: `loungeatswift.com` (62), `schema.org` (24), `www.w3.org` (20), `github.com` (6), `supabase.co` (5), `lovable.dev` (3), `payroll.toasttab.com` (3), `localhost` (3), `oauth.lovable.app` (1) [SW]. Third-party payroll backend (`toasttab.com`) and a shortened `bit.ly` link inside a chart chunk are supply-chain-adjacent surface [SW][S1].
- `secrets: []` — no `sb_secret_`/`sk-`-class patterns surfaced in client chunks [SW].
- Dev-server regexes (`localhost:3000`, `lovable.dev|gptengineer.app`) persist in production bundle text — build-hygiene noise, informational [S1].

**Decoding discrepancy (both readings preserved):** the archived decodings disagree on the JWT `iat` — one records `1773056107`, the other `1773456107`; both agree on `iss:supabase`, `role:anon`, and expiry in the `2089…` epoch class (March-2036) [B][SW]. Audit-relevant properties (issuer, role, lifetime class) are unaffected.

## 7. Audit method — the verbs this component teaches

1. **Differential visibility** — read the same table/resource under `anon` and `authenticated`; the delta *is* the policy. Validated: `documents` `[]`→1-row [S7][S9]; `scanFile` 401→200 [S9].
2. **Write-denial discrimination** — attempt a labeled write; classify by the **embedded** `code`, never the HTTP status: `42501`=policy denial (control present), `PGRST204`=schema leak (fix the probe), `200`=control *absent* (finding) [S1][S6][S9].
3. **Success-with-persistence check** — a `{"success":true}` from a function is an *ack*, not evidence of effect; re-read the target table afterwards. Validated: all four submit-family calls acked `true` while post-call reads showed zero persisted rows [S9] (root cause unresolved — see §9).
4. **RPC/function enumeration** — client code names its RPCs and functions; probe them directly, expecting uniform `404 NOT_FOUND`/`PGRST202` on misses and live data on hits [S1][SW].
5. **Bundle forensics** — locate embedded keys/endpoints by byte offset (Node `indexOf`/`slice` with documented offsets; grep context windows misfire on multi-MB single-line JS) and slice, don't summarize [B].
6. **Hygiene** — credentials byte-exact from source artifacts (never retyped); probe spacing ~1.4–1.6 s; every write labeled `pentest probe - safe to delete` and disclosed [S1][S6][S9][AF].

## 8. Empirical findings ledger — loungeatswift.com (authorized, disclosed)

| # | Finding | Evidence | Disposition |
|---|---|---|---|
| F1 | Anonymous writes RLS-denied (`42501` embedded in 401) on `contact_messages`, `party_inquiries` | [S1][S6] | Control effective |
| F2 | Denial identity carried in body `code`, not HTTP status (401-wrapping-42501) | [S1][S6] | Tooling requirement |
| F3 | `documents` differential visibility: anon `[]`, authenticated 1 SOP row (`requires_signature:true`) | [S7][S9] | Policy present; intent undocumented — unknown |
| F4 | Submit-family functions ack `{"success":true}` with zero persisted rows; cleanups all `204` | [S9] | **Open** — success-with-zero-persistence |
| F5 | Function cold-start/availability failure: `503 BOOT_ERROR` | [S9] | Availability finding |
| F6 | `getLoginStatus` under authenticated session → `{"users":{},"authStatus":"forbidden"}` — semantics unexplained by any archived source | [S9] | **Open** — unknown |
| F7 | Anon JWT inline in ≥4 chunks incl. explicit Bearer headers on two `/functions/v1/ai-*` calls | [B][SW] | Expected posture; confirms anon-only reachability of those functions |
| F8 | Unsubscribe path token-gated end-to-end | [S1][S7] | Control effective |
| F9 | Anonymous signup permitted; confirmation required before sign-in; email+google+apple external on, phone off | [S1][S6] | Consistent with platform defaults |
| F10 | Email-sending rate limit enforced (`429 over_email_send_rate_limit`, retry-after) | [S1] | Control effective |
| F11 | Schema-cache enumeration via `PGRST204`/`PGRST202` (column and function names surfaced) | [S1][S9] | Informational |
| F12 | RPC asymmetry: `get_events_reserved_counts` live to anon with real counts; time-clock RPCs absent | [S1] | Surface mapped |
| F13 | Realtime establishment failure `ws_error` under test conditions | [S7] | **Open** — infra or policy, undetermined |
| F14 | Third-party/dev-string surface: `payroll.toasttab.com`, `oauth.lovable.app`, `localhost:3000`, `bit.ly` | [SW][S1] | Informational supply-chain note |
| F15 | Storage buckets empty in both roles; `scanFile` differentially gated | [SW][S9] | Storage surface minimal |

## 9. Conflicts and known-unknowns (stated, not smoothed)

1. **F4 root cause** — ack-without-persistence could be a non-persisted sink, a client-side ack, or a downstream failure swallowed; the archived transcripts do not discriminate. Requires the parked row-persistence micro-wave before adjudication. `[S9]`
2. **`authStatus:"forbidden"`** — no archived primary source (platform or vendor) explains this field; treat semantics as unknown until sourced. `[S9]`
3. **`documents` policy intent** — authenticated visibility of the SOP row is consistent with design or with over-broad policy; the policy definition is not in the archive. `[S9]`
4. **JWT `iat` discrepancy** — two archived decodings disagree (see §6); readings preserved, audit-relevant properties agreed. `[B][SW]`
5. **Realtime failure semantics** — `ws_error` observed; the archived realtime documentation covers subscription semantics, not this failure mode. Thin spot. `[S7][S-RT]`

## Thin-spot statement

No archived primary source covers: Lovable's internal scan/audit engine behavior beyond its "not a full audit" disclaimer [L-CLOUD]; realtime failure-mode semantics `[S7]`; or the internals of `authStatus` reporting `[S9]`. Claims touching those areas above are labeled as such.
