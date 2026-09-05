# Probe tables — classification reference for Lovable × Supabase audits

Operational lookup tables. Every empirically validated row ends in a raw-archive citation (key defined in `research/distillation.md`). Rows without a citation are platform semantics from the official documentation, cited directly.

## 1. Write/read denial classification (the core table)

| Embedded `code` / shape | Outer HTTP | Meaning | Audit verdict | Empirical anchor |
|---|---|---|---|---|
| `42501` + "violates row-level security policy" | 401 (or 400) | Grant present, no matching policy | **Control effective** — do not report as finding | `probes.json`, `probe6.json` |
| `200` + `[]` | 200 | Rows filtered by `using` clause — mismatch, not absence | Control effective *or* empty data; disambiguate via differential visibility | `probes.json`, `probe7.json` |
| `200` + rows | 200 | Read permitted for this role | If anon: **Tier-1 candidate** (RLS gap / anon over-permission) | `probes.json` (`menu_items` anon read returned live rows) |
| `PGRST204` + "Could not find the '<col>' column" | 400 | Schema-cache miss — **probe was malformed**, not an app defect; leaks column-name expectation | Fix probe; note as informational enumeration surface | `probes.json`, `probe9.json` |
| `PGRST202` + function name | 404 | RPC not exposed to this role | Surface mapped (negative) | `probes.json` |
| `404` + `NOT_FOUND` ("Requested function was not found") | 404 | Function absent under that name | Surface mapped (negative) | `probes.json`, `sweep.json` |
| `400` + `"Token is required"` | 400 | Function gates on bearer token | **Control effective** | `probes.json` |
| `404` + `"Invalid or expired token"` | 404 | Token-gated, malformed token rejected | **Control effective** | `probe7.json` |
| `401` + `"Unauthorized"` (functions) | 401 | Function rejects anon role | **Control effective** (anon-only reachability denied) | `probes.json` |
| `503` + `BOOT_ERROR` | 503 | Function failed to start — **availability/infra**, not configuration | Record as availability finding, never as config verdict | `probe9.json` |
| `429` + `over_email_send_rate_limit` | 429 | Email-sending rate limit (retry-after hint present) | **Control effective** | `probes.json` |
| `403` + `"Admin access required"` | 403 | Role check inside RPC body | **Control effective** | `probe9.json` |
| `403`/`401` on `/auth/v1/...` | — | Auth-plane denial | Record, do not retry-loop | platform semantics |
| `{"success":true}` from a write-path function | 200 | **Ack only** — no persistence evidence | Run persistence check before closing | `probe9.json` |

**Rule of the table**: the embedded `code`/`message` is authoritative; the HTTP status is transport decoration. Tooling that classifies on status alone misreads every `42501`-in-401 event (`probes.json`, `probe6.json`).

## 2. Function-surface probe shapes

| Probe | Expected on miss | Expected on hit | Anchor |
|---|---|---|---|
| `GET /functions/v1` | `404 NOT_FOUND` | listing (rare) | `sweep.json` |
| `POST /functions/v1/<guessed>` | `404 NOT_FOUND` uniform across names | `401`/`400`-gated or `200` | `probes.json` |
| `POST /functions/v1/<client-named>` | — | `401` anon-denied / token-gated / `503 BOOT_ERROR` | `probes.json`, `probe7.json`, `probe9.json` |
| `POST /rest/v1/rpc/<client-named>` | `404 PGRST202` (names searched function) | `200` + data (anon-callable ⇒ Tier-1 candidate) or `200` + computed value | `probes.json` |

Function names are never guessed blindly: they are read out of client chunks first (`functionsPath`/`rpcCalls` inventories), then probed by name [SW].

## 3. Auth-posture probe shapes

| Probe | Read | Anchor / semantics |
|---|---|---|
| `GET /auth/v1/settings` | External providers, `mailer_autoconfirm`, `disable_signup` | empirically readable to anon (`probe6.json`); semantics `[S-PW]` |
| `POST /auth/v1/signup` (synthetic) | `200` + `confirmation_sent_at` ⇒ confirmation required before sign-in | `probes.json`; `[S-PW]` |
| `POST /auth/v1/otp` (resend) | `429` rate-limit shape | `probes.json`; `[S-PW]` |
| `POST /auth/v1/token?grant_type=password` (synthetic, confirmed) | `200` + JWT (`role`, `aal`, `amr`) | `probe9.json`; `[S-JWT]` |
| `GET /auth/v1/user` | Account shape: `email_confirmed_at`, metadata split | `probe9.json`; `[S-JWT]` |
| reset-for-email (synthetic) | non-enumerating response | `[S-PW]` |

## 4. Role-differential probe pairs (run in sequence, anon then auth)

| Resource | Anon shape | Auth shape | Signal |
|---|---|---|---|
| `documents` table | `200 []` | `200` + SOP row | `auth.uid()`-keyed policy live | `probe7.json` → `probe9.json` |
| `scanFile`-class function | `401` | `200 {"safe":true}` | server-side role gating | `probe9.json` |
| `get_events_reserved_counts` RPC | `200` + live counts | — | anon-callable ⇒ Tier-1 candidate | `probes.json` |
| bucket listing | `[]` | `[]` | storage surface minimal | `sweep.json`, `probe9.json` |

## 5. Hygiene constants (mandatory)

| Constant | Value | Source |
|---|---|---|
| Probe spacing | ~1.4–1.6 s between requests | operator rule, observed in `probe9.js` transcript (`sleep(1600)`) |
| Write labeling | every mutating probe labeled `pentest probe - safe to delete`, disclosed in report | `probes.json`, `probe6.json`, `probe9.json` |
| Credential handling | anon key byte-exact from bundle (documented offsets); synthetic-account password from the fixture file only — never retyped | `lovable--bundle--key-and-endpoint-excerpts.txt`, `empirical--loungeatswift--test-account.md` |
| Accounts | synthetic, disclosed, deletable | `empirical--loungeatswift--test-account.md` |
| Key extraction | Node `indexOf`/`slice` with documented offsets; grep context windows misfire on multi-MB single-line JS | `lovable--bundle--key-and-endpoint-excerpts.txt` |
