# 08: MFA and Passkeys

The factor hierarchy. Default to passkeys (WebAuthn); TOTP as the universal fallback; SMS only as a recovery channel; magic links with discipline.

Source: `research/2026-04-25-webauthn-and-totp.md`, https://www.w3.org/TR/webauthn-3/, RFC 6238 (TOTP).

## The factor hierarchy (best to worst)

1. **Passkeys / WebAuthn (platform or roaming authenticator)**: phishing-resistant, hardware-bound, biometric or PIN unlock. Best default for new flows in 2026.
2. **TOTP (RFC 6238)**: Google Authenticator / 1Password / Authy. Universal fallback. Good when passkeys aren't available.
3. **Email magic link / one-time code**: when no second factor exists. Treat as identity-verification, not as a factor.
4. **Push notifications via authenticator app**: Duo, Microsoft Authenticator. Phishing-vulnerable but better than SMS.
5. **SMS / voice OTP**: **recovery only**, never primary. SIM-swap risk is real and increasingly common.

## Default flow for a 2026 SaaS

1. **Sign-up**: email + password OR Google / Apple / GitHub OAuth. Email verification required if password.
2. **Post-sign-up nudge**: enroll a passkey within 24 hours.
3. **Optional second-factor enrollment**: TOTP for users on shared devices or who prefer authenticator apps.
4. **Recovery codes**: 10 single-use codes generated at MFA enrollment. Show once, hash on store.
5. **Account recovery**: identity-verified email + recovery code, OR support flow with hard identity verification.

## WebAuthn / passkeys

```ts
// Server-side registration (start)
import { generateRegistrationOptions } from '@simplewebauthn/server';

const options = await generateRegistrationOptions({
  rpName: 'Example App',
  rpID: 'app.example.com',         // your domain (no protocol)
  userID: Buffer.from(user.id),
  userName: user.email,
  attestationType: 'none',          // 'direct' only when you must verify authenticator make
  authenticatorSelection: {
    residentKey: 'preferred',       // discoverable credentials → conditional UI
    userVerification: 'preferred',
  },
});
// Store options.challenge in session; send options to client.
```

```ts
// Server-side registration (verify)
import { verifyRegistrationResponse } from '@simplewebauthn/server';

const verification = await verifyRegistrationResponse({
  response: clientResponse,
  expectedChallenge: session.challenge,
  expectedOrigin: 'https://app.example.com',
  expectedRPID: 'app.example.com',
});
if (!verification.verified) throw new Error('Verification failed');
// Persist credentialID, publicKey, counter, transports for future authentication.
```

Authentication mirrors registration: `generateAuthenticationOptions` / `verifyAuthenticationResponse`.

**Conditional UI**: let the browser autofill passkey selection on the username field. UX win; supported across all major browsers in 2026.

Use `@simplewebauthn/server` + `@simplewebauthn/browser` (or your provider's built-in: Better Auth's `passkey()` plugin, Clerk's passkey support, Supabase via WebAuthn extensions, Stytch's passkeys product).

## TOTP

```ts
import { authenticator } from 'otplib';

// Enrollment: generate a secret (base32, 32+ chars).
const secret = authenticator.generateSecret();

// Build the otpauth URI for QR rendering:
const otpauth = authenticator.keyuri(user.email, 'Example App', secret);

// Render as QR (e.g., qrcode library on server, or qr-code on client).

// Verification (window of ±1 step = ±30 seconds is standard):
const isValid = authenticator.check(userInputCode, secret);
```

Store `secret` encrypted at rest. Never log it. On disable, delete the row.

## Recovery codes

```ts
import crypto from 'node:crypto';

// Generate 10 codes, each 8 chars, base32-friendly.
const codes = Array.from({ length: 10 }, () =>
  crypto.randomBytes(5).toString('base32').toLowerCase().slice(0, 8)
);

// Show codes ONCE; hash before storing.
const hashed = await Promise.all(codes.map((c) => bcrypt.hash(c, 10)));
// Persist as recovery_codes table: { user_id, code_hash, used_at }.
```

When a user redeems a recovery code, mark it `used_at`; never accept twice. Re-prompt to generate fresh codes after redemption (regenerate-and-invalidate pattern).

## Magic links

```ts
// Token shape: opaque random, single-use, short TTL (5–15 min), bound to email.
const token = crypto.randomBytes(32).toString('base64url');
await db.magic_links.create({
  data: {
    token_hash: await bcrypt.hash(token, 10),
    email,
    expires_at: new Date(Date.now() + 10 * 60 * 1000),
    ip_address: req.ip,         // optional, for additional binding
  },
});
// Email the user the link: https://app.example.com/auth/magic?token=...
```

Critical:

- **Single-use**: mark redeemed on first use; reject reuse.
- **Short TTL**: 10 minutes is the common floor.
- **Hash the token**: leak via DB → still unusable without rainbow.
- **Bind to the email**: token alone shouldn't grant a session for a different email.
- **Token in URL is fine** (per OAuth norm); don't put it in a URL fragment (logging exposure).

## SMS (recovery channel only)

If SMS must be present for a recovery flow:

- Apply rate limits aggressively (3 sends per hour per phone, 5 per day).
- Pin the verification UI (don't auto-fill from clipboard for OTP).
- Treat a successful SMS recovery as a **higher-risk event**: log it, optionally re-prompt for a passkey on next login.
- Never use SMS as the primary second factor.

## MFA enforcement policy

Three modes:

- **Optional**: user opts in. Lowest friction; lowest assurance.
- **Step-up**: required for sensitive actions (changing password, deleting data, accessing billing).
- **Required**: must enroll within first session, can't bypass.

For B2B SaaS with admin tiers, "Required for admins, step-up for sensitive actions, optional for regular users" is a common policy.

## Common pitfalls

- **MFA without recovery codes**: DoS at scale. Always issue 10 codes at enrollment.
- **Recovery flow without MFA**: defeats the point. Recovery is itself MFA-protected (by SMS, by recovery code, or by hard identity verification).
- **Allowing TOTP secret reuse across users**: impossible if generated per-user, but check the wiring.
- **Storing TOTP secret unencrypted**: full account-takeover surface in a DB leak.
- **Magic link with multi-use semantics**: link sent twice, both work, replay attack possible.
- **SMS as primary**: SIM-swap. See above.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The factor set offered (passkeys / TOTP / SMS-recovery / magic links / email).
- The enforcement policy (optional / step-up / required).
- Recovery code generation, storage (hashed), and redemption rules.
- Magic link TTL and single-use enforcement.
- Rate limits on each channel.
- Whether enrollment events (passkey added, TOTP enabled, recovery code redeemed) are written to an audit log.
