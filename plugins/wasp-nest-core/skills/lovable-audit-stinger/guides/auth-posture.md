# Guide — auth-posture readout

**Verb**: `audit-auth-posture` · paired knowledge: `references/probe-tables.md` §3, `references/worked-examples.md` Example F.

## Purpose
Characterize the authentication plane's posture — enabled providers, confirmation gating, rate limits, reset semantics — with non-mutating or fully-disclosed synthetic probes.

## Preconditions
- Authority; anon key (byte-exact); synthetic account fixture (disclosed, deletable) [account fixture]; spacing ~1.4–1.6 s.

## Procedure
1. **Settings readout**: `GET /auth/v1/settings` (anon). Record: enabled external providers, `disable_signup`, `mailer_autoconfirm`, `phone_autoconfirm`. Empirically readable to anon [probe6.json].
2. **Confirmation posture**: if signup is open — synthetic signup with a composition-guaranteed password; expect `200` + `confirmation_sent_at` and `email_verified:false`; confirm the sign-in attempt before confirmation is blocked. Platform default: hosted projects confirm by default [S-PW].
3. **Rate-limit shape**: OTP/resend probe; expect `429 over_email_send_rate_limit` with retry-after — record as verified control [probes.json][S-PW].
4. **Reset semantics**: exercise the reset-for-email shape only with the synthetic account; platform semantics are non-enumerating — verify the response shape is identical for existing/non-existing synthetic addresses where the posture allows it [S-PW].
5. **Token anatomy** (authenticated leg): sign in; decode the JWT — `role`, `aal`, `amr` must match the claimed method (`password` ⇒ `amr:[{method:password}]`, `aal:aal1`) [probe9.json][S-JWT].
6. **Metadata split**: from the user record, verify `user_metadata` (mutable) vs `app_metadata` (server-controlled) separation and record which fields the application surfaces to clients [S-JWT][probe9.json].

## Expected shapes (validated)
Settings: email+google+apple on, phone off, `mailer_autoconfirm:false` [probe6.json]. Signup: confirmation-gated [probes.json]. OTP: `429` rate-limit [probes.json]. Sign-in: `role:authenticated`, `aal:aal1`, `amr` password [probe9.json].

## Anti-patterns
- Retyping credentials — the password exists only in the fixture file [account fixture].
- Treating the settings endpoint as authenticated-only — empirically anon-readable; the posture readout *is* the finding surface [probe6.json].
- Inferring inbox-takeover exposure from reset semantics without the reset-flow transcript — report as unknown if unprobed.
