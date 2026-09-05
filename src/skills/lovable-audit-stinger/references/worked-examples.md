# Worked examples — complete audit sequences from the loungeatswift.com engagement

Each example is a validated sequence: intent, the probe steps with their **observed** outcomes, the verdict, and the raw-archive anchors. These are the canonical shapes; parameterize, don't improvise.

---

## Example A — Differential visibility (the core move)

**Intent**: discover whether a table's rows are role-keyed, without ever writing.

| Step | Request (shape) | Observed |
|---|---|---|
| A1 | anon `GET /rest/v1/documents` | `200 []` |
| A2 | sign in (synthetic, confirmed account) | `200` + JWT `role:authenticated` |
| A3 | auth `GET /rest/v1/documents` | `200` + one SOP row, `requires_signature:true` |

**Verdict**: delta `[]`→1-row ⇒ a policy keyed on `auth.uid()` (or role) is live. Visibility of the SOP row to every authenticated user is then an *intent* question the archive cannot answer — reported as unknown, not assumed [S-RLS].
**Anchors**: `probe7.json` (A1), `probe9.json` (A2–A3).

**Anti-pattern**: reading one role and calling `[]` "the table is empty." Filter-out and absence are indistinguishable inside a single role [S-RLS].

---

## Example B — Write-denial discrimination

**Intent**: prove the write-path control exists (or find that it doesn't), with a labeled, deletable write.

| Step | Request (shape) | Observed |
|---|---|---|
| B1 | anon `POST /rest/v1/contact_messages` body `{"name":"pentest probe - safe to delete", …}` | `401` wrapping `"code":"42501","message":"new row violates row-level security policy"` |
| B2 | anon `POST /rest/v1/party_inquiries` with a guessed column | `400 PGRST204` — probe malformed, column absent from schema cache |
| B3 | corrected probe, `party_inquiries`, minimal body | `401` wrapping `42501` again |

**Verdict**: B1/B3 = control effective (deny). B2 = probe-authoring error surfaced *usefully* — the platform told us the column doesn't exist; correct the probe, log the enumeration surface as informational. Never report a `PGRST204` as an application vulnerability.
**Anchors**: `probes.json` (B1, B2), `probe6.json` (B3).

---

## Example C — Bundle forensics (keys & endpoints out of client JS)

**Intent**: enumerate embedded credentials/keys and third-party endpoints from the shipped bundle without guessing.

| Step | Action | Observed |
|---|---|---|
| C1 | Locate every `eyJ` occurrence in `bundle.js` via Node `indexOf` loop; slice ±250 chars at each hit | single embedded anon JWT at documented offsets; two adjacent matches are the header+payload segments of the *same* JWT |
| C2 | Sweep all ~185 route chunks for `eyJ`/hostnames/`functions/v1/`/table names/RPC names | 5 JWT occurrences across 4 chunks; the JWT is inlined as `Authorization:"Bearer <jwt>"` on calls to `/functions/v1/ai-generate-checklist` and `/functions/v1/ai-write-document`; hostnames incl. `payroll.toasttab.com`, `oauth.lovable.app`, `localhost:3000`; `secrets: []` |
| C3 | Decode the JWT claims (base64url segments) | `iss:supabase`, `role:anon`, ~10-year lifetime |

**Verdict**: anon-key presence is expected posture [S-API]; the audit-relevant facts are (a) which functions are anon-reachable from the bundle, (b) which third parties receive data, (c) whether any non-anon secret class surfaced (none did). Two archived decodings disagree on `iat` (`1773056107` vs `1773456107`) — preserved as discrepancy, audit-relevant properties agree.
**Anchors**: `lovable--bundle--key-and-endpoint-excerpts.txt`, `sweep.json`.

**Anti-pattern**: grepping context windows on multi-MB single-line minified JS — produces merged/phantom regions; use per-occurrence slicing with recorded offsets.

---

## Example D — Function-surface enumeration

**Intent**: map which Edge Functions exist and how each gates.

| Step | Request (shape) | Observed |
|---|---|---|
| D1 | `GET /functions/v1` | `404 NOT_FOUND` |
| D2 | `POST` guessed names (`hello`, `webhook`, `otp`, …) | uniform `404 NOT_FOUND` — misses are cleanly distinguishable |
| D3 | `POST /functions/v1/ai-generate-checklist` (anon) | `401 Unauthorized` |
| D4 | `POST /functions/v1/handle-email-unsubscribe` (anon, no token) | `400 "Token is required"` |
| D5 | same, malformed token | `404 "Invalid or expired token"` |
| D6 | client-named scrape-path function (auth) | `503 BOOT_ERROR "Function failed to start"` |

**Verdict**: D3/D4/D5 = gating controls effective. D6 = availability/infra finding only — never adjudicated as configuration from the transcript alone.
**Anchors**: `sweep.json` (D1), `probes.json` (D2–D4), `probe7.json` (D5), `probe9.json` (D6).

---

## Example E — Ack-without-persistence detection

**Intent**: decide whether a write-path function actually persisted anything.

| Step | Request (shape) | Observed |
|---|---|---|
| E1 | auth `POST` submit-family functions (contact/party/reservation/newsletter) | all `200 {"success":true}` |
| E2 | auth re-read of target tables | `contact_messages []`, `party_inquiries []`, `event_reservations []` |
| E3 | cleanup deletes (labeled) | uniform `204` |

**Verdict**: acks with zero persisted rows ⇒ **open question** (F4). The transcript cannot discriminate between a non-persisted sink, a client-side ack, or a swallowed downstream failure. Correct handling: report as open, run the parked row-persistence micro-wave (corrected-schema INSERT + immediate re-read) before any adjudication. Do **not** write "no write occurred" or "write succeeded" — the transcript supports neither.
**Anchor**: `probe9.json`.

---

## Example F — Auth-posture readout (non-mutating)

**Intent**: characterize signup/confirmation/rate-limit posture without touching production data.

| Step | Request (shape) | Observed |
|---|---|---|
| F1 | `GET /auth/v1/settings` (anon) | `200`: email+google+apple on, phone off, `mailer_autoconfirm:false` |
| F2 | `POST /auth/v1/signup` (synthetic, composition-guaranteed password) | `200` + `confirmation_sent_at`, `email_verified:false` |
| F3 | `POST /auth/v1/otp` (resend) | `429 over_email_send_rate_limit` + retry-after |

**Verdict**: confirmation-gated sign-in with rate-limited email — consistent with platform defaults; posture documented, no finding. Synthetic account disclosed as deletable.
**Anchors**: `probe6.json` (F1), `probes.json` (F2–F3), `empirical--loungeatswift--test-account.md` (fixture).
