# 06: Google OAuth

The deep dive. The Google Auth Platform reality, scope discipline, GIS migration, and the **October 2025 unused-client deletion policy**.

Source: `research/2026-04-25-google-oauth-scopes-and-policies.md`, `research/2026-04-25-google-identity-services-migration.md`, `research/2026-04-25-october-2025-oauth-deletion-policy.md`, https://developers.google.com/identity/protocols/oauth2.

## The Google Auth Platform: three pages

Google consolidated the OAuth Consent Screen UI into the **Google Auth Platform** (Cloud Console → APIs & Services → OAuth consent screen). Three pages matter:

1. **Branding**: app name, support email, app logo, homepage URL, privacy policy URL, terms of service URL. The privacy policy and terms URLs must be reachable; the logo is reviewed during verification.
2. **Audience**: `Internal` (Workspace-only) vs `External`. External requires verification for sensitive / restricted scopes when in `Production`. `Testing` mode allows up to 100 test users without verification.
3. **Data Access**: the scope list. Every scope here is a verification cost. Add only the minimum needed.

Cite https://developers.google.com/workspace/guides/configure-oauth-consent.

## Scope tiers

| Tier | Examples | Verification |
|---|---|---|
| **Non-sensitive** | `openid`, `email`, `profile`, `userinfo.email`, `userinfo.profile` | None for sign-in only |
| **Sensitive** | `gmail.readonly`, `calendar`, `drive.metadata.readonly`, `tasks` | Required when External / Production: app verification |
| **Restricted** | `gmail.modify`, `drive`, `gmail.send`, `https://mail.google.com/` | Required: app verification + annual independent CASA security assessment |

See `guides/07-google-oauth-verification.md` for the verification process. See `templates/scope-justification-template.md` for the per-scope justification you must write.

**Default to:** `openid email profile` for sign-in. Anything beyond is a deliberate, justified choice.

## The OAuth flow (Web Server, the canonical pick)

```
1. User clicks "Sign in with Google".
2. Server generates: state (random, opaque), nonce (random, opaque),
   PKCE code_verifier + code_challenge.
3. Server stores state + nonce + code_verifier in session.
4. Server redirects user to:
     https://accounts.google.com/o/oauth2/v2/auth
       ?response_type=code
       &client_id=...
       &redirect_uri=...   (must EXACTLY match a registered URI)
       &scope=openid email profile
       &state=...
       &nonce=...
       &code_challenge=...
       &code_challenge_method=S256
       &access_type=offline   (only if you need refresh tokens)
       &prompt=consent        (only if you need a fresh refresh token)
5. Google authenticates the user, prompts consent if needed, redirects back to
   redirect_uri with ?code=...&state=...
6. Server verifies state matches. (CSRF protection.)
7. Server POSTs to https://oauth2.googleapis.com/token with code + code_verifier.
8. Receives access_token, id_token, optional refresh_token.
9. Server verifies id_token signature against Google's JWKS,
   validates iss = "https://accounts.google.com", aud = client_id,
   exp not past, nonce matches.
10. Server creates a session and redirects user to the app.
```

Use a library: `google-auth-library` (Node), `@auth/google-provider` (Auth.js), Better Auth's built-in Google provider, or Supabase's Google provider. The library should do steps 7-9. **Confirm it does, especially step 9 (signature verification, `iss` / `aud` / `exp` / `nonce` validation).**

Cite RFC 6749 (OAuth 2.0), RFC 7636 (PKCE), OpenID Connect Core 1.0.

## Google Identity Services (GIS): for client-side sign-in

GIS is the modern client-side library at `https://accounts.google.com/gsi/client`. Two flows:

- **One Tap / Sign In With Google**: embeddable button or popup. Returns an ID token to the page.
- **Authorization Code flow**: initiates the Web Server flow above; usually you don't need this client-side.

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>

<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID"
     data-callback="handleCredentialResponse"
     data-nonce="OPAQUE_RANDOM_FROM_SERVER"></div>
<div class="g_id_signin" data-type="standard"></div>

<script>
  function handleCredentialResponse(response) {
    // POST response.credential (ID token) to your server.
    // Server verifies signature, iss, aud, exp, nonce.
  }
</script>
```

The legacy Google Sign-In JavaScript Library (`apis.google.com/js/platform.js` and `gapi.auth2`) is **deprecated**. New clients use GIS. Cite https://developers.google.com/identity/oauth2/web/guides/migration-to-gis.

## Domain verification

For production-mode external apps you must verify ownership of any domain you list in the consent screen (homepage URL, privacy policy, etc.). Verify via Google Search Console (DNS TXT, HTML file, or HTML tag). Without verification, the consent screen lists the domain with a warning that depresses click-through.

## Unused-client deletion (October 2025 policy): load-bearing

In October 2025 Google began deleting OAuth client IDs that have had no API traffic for **6 months**. Once deleted, a client ID is gone. You cannot recover it; users on that client see "deleted_client" errors.

The risk:

- A feature that uses Google sign-in for a **rarely-used flow** (e.g., an admin import that runs once a quarter): the client looks idle to Google's metrics. Six months later, deleted.
- A staging client that exists for emergency rollback: looks idle. Deleted.
- A pre-launch client created during dev, paused for re-design, returned to months later: deleted.

The defenses:

1. **A recurring synthetic call.** A scheduled job (weekly is plenty) that hits `https://oauth2.googleapis.com/tokeninfo` or makes a no-op API call with the client. Keeps the client warm.
2. **A health-check item in the runbook.** Production-critical OAuth clients are listed in the ops doc with their last-used date; quarterly review confirms each has had traffic.
3. **Email subscription.** Google sends a notification email 30 days before deletion to the project owner. Confirm the email is monitored and routes to a real human.

Cite https://support.google.com/cloud/answer/13463073 (Google Cloud: OAuth client deletion) and `research/2026-04-25-october-2025-oauth-deletion-policy.md`.

## Service accounts (machine-to-machine)

For server-to-server access without a user, Google uses **service accounts** with JWT-based authentication. The service account has an email and a key (JSON file or Workload Identity).

- **Don't impersonate a user with a service account** unless you're a Workspace domain-wide-delegation admin (and even then, the security review is real).
- **Workload Identity Federation** is the modern alternative to long-lived JSON keys for cloud-to-cloud workflows (GitHub Actions → GCP, AWS → GCP).
- **Cross-Account Protection (RISC)** sends out-of-band events when a Google account is compromised; subscribe and revoke sessions on receipt.

Cite https://developers.google.com/identity/protocols/oauth2/service-account, https://cloud.google.com/iam/docs/workload-identity-federation, https://developers.google.com/identity/protocols/risc.

## Common pitfalls

- **Not registering every redirect URI**: including dev (`http://localhost:3000/auth/callback`), preview deploys, and staging. The error "redirect_uri_mismatch" is unforgiving.
- **`http://` redirect URIs in production**: rejected. Use HTTPS.
- **Skipping ID-token signature verification**: accepting `aud` and `exp` without verifying the signature means anyone can forge a token. The library should do it; confirm.
- **Storing access tokens in `localStorage`**: XSS-readable. Use server-side session, return the user ID to the client.
- **Treating refresh tokens as long-lived passwords**: they are. Rotate, bind to session, revoke on logout.
- **Adding scopes incrementally without justification**: every new scope re-triggers consent and (for sensitive / restricted) re-verification.
- **Not monitoring the unused-client-deletion email**, see above.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The full scope list and the per-scope justification (`templates/scope-justification-template.md`).
- ID-token verification configuration (which library, which JWKS endpoint, which validation rules).
- Refresh-token storage location and rotation policy.
- The unused-client deletion defense (synthetic call + runbook entry).
- PKCE configuration (`code_challenge_method=S256`, not `plain`).
- The `state` and `nonce` generation, storage, and validation.
- Domain verification status on each consent-screen domain.
