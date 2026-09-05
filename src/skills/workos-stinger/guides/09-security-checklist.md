# 09. Security checklist

Cross-cutting checklist pulled from every guide above. Run this before shipping any WorkOS-backed auth surface, and again before the Ship Gate (see `SKILL.md`).

## Sessions and cookies

- [ ] `WORKOS_COOKIE_PASSWORD` is 32+ characters, generated with a real random source (e.g. `openssl rand -base64 24`), and stored only in server-side secrets - never in a public env var [raw/workos--authkit--sveltekit-sdk.md].
- [ ] Session cookie is `httpOnly`, `secure`, `sameSite: 'lax'` [raw/workos--authkit--nodejs-quickstart-sessions.md].
- [ ] Logout endpoint is **POST**, not GET, with CSRF protection - a GET logout can be triggered by browser prefetch [raw/workos--authkit--nodejs-quickstart-sessions.md].
- [ ] A **Sign-out URI** is configured in the WorkOS dashboard, or users see an error on logout [raw/workos--authkit--nodejs-quickstart-sessions.md].
- [ ] Refresh failures clear the cookie and redirect to sign-in rather than leaving a stale/invalid cookie in place [raw/workos--authkit--nodejs-quickstart-sessions.md].

## Redirects and PKCE

- [ ] The **Initiate login URL / Sign-in endpoint** is registered in the dashboard, not just the callback URI - otherwise dashboard impersonation and IdP-initiated SSO fail PKCE/CSRF verification [raw/workos--authkit--sveltekit-sdk.md].
- [ ] `withAuth` (or the SDK equivalent) is applied only to routes rendering top-level HTML documents, never to JSON API endpoints - misuse here sets orphaned PKCE cookies and can produce HTTP 431 under load [raw/workos--authkit--sveltekit-sdk.md].
- [ ] Production redirect URIs use `https://` [raw/workos--sdks--node-sdk-api-keys-environments.md].

## JWT / token handling

- [ ] Any manual JWT verification passes `algorithms`, `issuer`, and `audience` explicitly - never rely on library defaults [raw/workos--authkit--jwt-jwks-verification.md].
- [ ] JWKS lookups are cached at module scope, not re-fetched per request [raw/workos--authkit--jwt-jwks-verification.md].
- [ ] Tokens live only in `httpOnly` cookies, never in `localStorage` or a client-readable store [raw/workos--authkit--jwt-jwks-verification.md].

## Secrets and environments

- [ ] `WORKOS_API_KEY` is server-only, never referenced from `$env/static/public` or `$env/dynamic/public` [raw/workos--sdks--node-sdk-api-keys-environments.md].
- [ ] Production API key was saved immediately at creation (it's shown once) [raw/workos--sdks--node-sdk-api-keys-environments.md].
- [ ] Staging and production use fully separate API keys, Client IDs, webhook secrets, and branding configs - none of it was assumed to carry over [raw/workos--sdks--node-sdk-api-keys-environments.md].

## Webhooks

- [ ] Signature verification runs against the **raw** request body, not a parsed/re-serialized object [raw/workos--events--webhooks-guide.md].
- [ ] Handler branches on the `event` field, not `type` [raw/workos--events--webhooks-guide.md].
- [ ] Processing is idempotent, keyed on the event `id`, persisted durably (not an in-memory `Set`) [raw/workos--events--webhooks-guide.md].
- [ ] The endpoint is subscribed only to the specific event types it actually handles [raw/workos--events--webhooks-guide.md].
- [ ] The endpoint responds `2xx` fast and defers processing, rather than doing synchronous work before acknowledging [raw/workos--events--webhooks-guide.md].

## RBAC

- [ ] Roles/permissions are enforced in **both** the route/hooks layer and the data-access layer (RLS or an explicit org-scoped filter) - a single JWT check is a single point of failure (Hive convention, see `references/rbac-model.md`).
- [ ] Any in-app "admin can override a member's role" UI accounts for IdP role mapping precedence - a manual override is silently clobbered on the next SSO login or directory sync event if that org has IdP group role mapping configured [raw/workos--rbac--configuration-and-integration.md].
- [ ] Permission slugs are kept short - a bloated permission set on one role risks blowing the ~4KB session-JWT-in-cookie ceiling in some browsers [raw/workos--rbac--configuration-and-integration.md].

## MFA / passkeys

- [ ] If passkeys are enabled, an AuthKit **custom domain** was configured first - adding a custom domain after users have already registered passkeys invalidates those passkeys, since they're bound to the domain at registration time [raw/workos--authkit--mfa-passkeys-magic-auth.md].
- [ ] SMS is not relied on as a primary or sole second factor - WorkOS's own migration guidance flags it as insecure (SIM-swap risk) even though the MFA API technically supports it for US numbers [raw/workos--authkit--mfa-passkeys-magic-auth.md].

## Migration-specific (if applicable)

- [ ] Old provider's webhooks were disabled **before**, not during, the bulk import [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- [ ] A strategy exists for interim signups during the migration window (freeze via flag, or dual-write) [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- [ ] Users with SMS-based MFA on the old provider have an explicit path to TOTP or Magic Auth, since WorkOS won't silently carry an SMS factor forward [raw/workos--migrate--supabase-and-clerk-to-workos.md].

## Before this ships

Run the Ship Gate defined in `SKILL.md`: security-stinger, then quality-stinger, then github-repo-health-stinger, in that order, with a re-evaluation pass after any medium-or-higher finding, and user approval before commit or push.
