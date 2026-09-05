# 08. Migration and environments

## Migrating an existing user base onto WorkOS

`npx workos migrations` is the primary tool across Auth0, Clerk, Firebase, Stytch, Descope, Cognito, Supabase, and Better Auth: authenticate read-only against the source, page through users with local resumable checkpointing, bulk-import into WorkOS with retry/backoff, optionally diff before cutover [raw/workos--migrate--supabase-and-clerk-to-workos.md].

### From Supabase Auth

- Supabase stores auth data directly in the app's own Postgres `auth` schema - full query access, including password hashes, no export-request needed [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- Fastest path: `npx workos migrations import --csv supabase-users.csv`, or the interactive `npx workos migrations wizard`.
- Password import: Supabase uses bcrypt, which WorkOS accepts directly (`password_hash_type: 'bcrypt'`, `password_hash: encrypted_password`) - existing users sign in with their current password, no forced reset [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **Supabase has no native multi-tenancy** (commonly RLS + a `tenant_id` column, or `app_metadata`); you must explicitly create WorkOS Organizations and Organization Memberships to model whatever tenancy scheme you were faking before [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **MFA does not carry over cleanly**: Supabase TOTP secrets cannot be exported at all (users must re-enroll); Supabase SMS-MFA users must switch to TOTP or Magic Auth, since WorkOS has no SMS second factor by policy [raw/workos--migrate--supabase-and-clerk-to-workos.md].

### From Clerk

- `npx workos migrations export clerk --from-file clerk-export.csv --output-dir ./migration-clerk` transforms Clerk's export columns into the WorkOS shape, then `npx workos migrations import-package ./migration-clerk` pushes it. Add `--secret-key <Clerk Backend API key>` to also export Clerk's enterprise SAML/OIDC connections as SSO handoff artifacts [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- Same bcrypt password passthrough as Supabase.
- Same no-SMS-MFA gap as Supabase - Clerk SMS-second-factor users need to move to TOTP or Magic Auth.

### The pitfall both migrations share: interim signups

Users who sign up between your export snapshot and the WorkOS cutover get missed unless handled deliberately. Two strategies: (A) freeze signups behind a feature flag during the migration window, or (B) dual-write new signups to both systems until cutover, keeping profile/password updates in sync across both in the interim [raw/workos--migrate--supabase-and-clerk-to-workos.md].

### Enterprise SSO connection migration at scale

Fewer than 15 existing SAML/OIDC connections: hand each customer's IT admin a per-connection Admin Portal setup link. 15 or more: use the transparent-proxy approach - your existing ACS URL / OAuth callback stays live and forwards to WorkOS, so customers never touch their IdP configuration [raw/workos--migrate--supabase-and-clerk-to-workos.md].

### Cutover sequencing (avoid dropping events)

1. Disable webhooks on the **old** provider before starting the bulk import - not during it.
2. Run the import against a known-quiet source.
3. Flip traffic to WorkOS behind a feature flag, watching the WorkOS Events API to confirm event flow.
4. Deliberately drain or discard the old provider's queued webhook backlog rather than trusting it to flush cleanly on re-enable.

[raw/workos--migrate--supabase-and-clerk-to-workos.md]

## Staging and production are fully separate WorkOS environments

**Nothing carries over automatically**: API keys, Client IDs, organizations, connections, users, webhook endpoints/secrets, and branding are all scoped to a single environment [raw/workos--sdks--node-sdk-api-keys-environments.md]. Full checklist: `references/env-var-checklist.md`.

Key facts to plan around:

- Production API keys are **shown once at creation** - store immediately in your secrets manager.
- Production redirect URIs require `https://` (native `127.0.0.1` excepted); staging allows `http://localhost`.
- Staging is free regardless of usage; production bills per-connection for SAML/SCIM once billing info is added, with AuthKit itself free up to 1M MAUs [raw/workos--pricing--authkit-pricing.md].
- Branding, organizations, and SSO/SCIM connections must all be re-created for production - none of them copy over from staging automatically, though branding has a dashboard "copy from another environment" convenience tool [raw/workos--authkit--branding-customization.md, raw/workos--sdks--node-sdk-api-keys-environments.md].

## Next

`09-security-checklist.md` pulls the cross-cutting security requirements from every guide above into one pass-before-ship list.
