# MFA (TOTP/SMS), Passkeys, and Magic Auth

- URL: https://workos.com/docs/authkit/mfa ; https://workos.com/docs/authkit/passkeys ; https://workos.com/docs/authkit/magic-auth ; https://workos.com/docs/mfa ; https://workos.com/docs/reference/authkit/authentication/totp ; https://workos.com/blog/passwordless-authentication
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS blog
- Component: AuthKit / Authentication methods

## Content

### MFA (TOTP + SMS)

MFA adds a second factor at sign-in: a time-based one-time password. Enabled per-environment in Dashboard > Authentication. Once enabled, **new and existing users are required to enroll** an authenticator app (TOTP) before they can sign in. **The MFA requirement does NOT apply to SSO users** - SSO delegates second-factor enforcement to the customer's IdP.

AuthKit's hosted UI handles first-time MFA factor enrollment and one-time-code validation automatically as part of the sign-in flow. For custom UI, use the MFA API directly.

MFA API factor types: `totp` (authenticator app) and `sms` (US phone numbers only; malformed/non-US numbers error).

Enroll a TOTP factor:

```js
import { WorkOS } from '@workos-inc/node';
const workos = new WorkOS('sk_example_123456789');

const factor = await workos.multiFactorAuth.enrollFactor({
  type: 'totp',
  issuer: 'Foo Corp',
  user: 'alan.turing@example.com',
});
// response includes `qr_code` (base64 data URI) and `secret` (manual entry fallback)
```

Enroll an SMS factor:

```js
const factor = await workos.multiFactorAuth.enrollFactor({
  type: 'sms',
  phoneNumber: '+15005550006',
});
```

Challenge + verify:

```js
const challenge = await workos.multiFactorAuth.challengeFactor({
  authenticationFactorId: 'auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ',
});
// then verify the user-provided code against the challenge; response has `valid: true|false`
```

SMS challenges are verifiable for **10 minutes** only. Custom SMS templates support a `{{code}}` token.

### Passkeys

Enabled in Dashboard > Authentication. **Passkeys are bound to the domain they were registered on** - WorkOS strongly recommends configuring an AuthKit custom domain *before* enabling passkeys in production, since adding a custom domain later invalidates passkeys registered under the old WorkOS-hosted domain.

- **Progressive enrollment**: password-based users can be prompted to create a passkey on next sign-in. Disabled by default, toggled alongside passkey auth.
- Passkeys act as **both first and second factor**: if MFA is also required, a user who signs in with a passkey is NOT separately prompted for a TOTP code, because AuthKit requires "user verification" (fingerprint/PIN/face) when the passkey is presented, satisfying the second-factor requirement.
- Hosted AuthKit currently has **no self-service UI** for users to view/rename/add/remove their own passkeys after enrollment. To remove a user's passkey, an admin must do it manually via Dashboard > Users > find the passkey under auth methods > "Delete passkey"; the user must then use another method.
- **Passkey auth is currently only available via the hosted UI**, not the headless/custom API.

### Magic Auth

Passwordless method: a unique six-digit one-time-use code sent to the user's email inbox for sign-in or sign-up. Codes expire after **10 minutes**. Enabled in Dashboard > Authentication. AuthKit issues the codes and verifies them automatically; custom emails can be sent by the app instead if desired. For custom UI, use the Magic Auth API directly.

```js
const { user } = await workos.userManagement.authenticateWithMagicAuth({
  clientId: 'client_123456789',
  code: '123456',
  email: 'marcelina.davis@example.com',
  ipAddress: '192.0.2.1',
  userAgent: 'Mozilla/5.0 ...',
});
```

### Passwordless method comparison (official WorkOS framing)

- **OTPs** (TOTP/HOTP): easy to implement, difficult to guess, user-friendly, but fail if the code-delivery channel fails or the user loses their hardware token; SMS specifically is discouraged due to SIM-swap risk and poor scaling.
- **Magic links/Magic Auth**: easy to implement and use, but only as secure as the user's email account.
- **Passkeys**: very secure, count as a genuine second factor, easy to use, render server-side credential breaches useless - but cross-device passkey portability and broad adoption are still maturing.
- WorkOS's own summary: "there is no perfect passwordless solution yet... for the best security and user experience, you will probably have to combine different technologies," e.g. SSO plus biometrics.
