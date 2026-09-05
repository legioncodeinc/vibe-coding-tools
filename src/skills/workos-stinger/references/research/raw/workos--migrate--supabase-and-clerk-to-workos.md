# Migration guides: Supabase Auth -> WorkOS and Clerk -> WorkOS (users, orgs, passwords, MFA, SSO)

- URL: https://workos.com/docs/migrate/supabase ; https://workos.com/docs/migrate/clerk ; https://workos.com/docs/migrate ; https://github.com/workos/workos-migrations ; https://github.com/workos/migrate-clerk-users ; https://workos.com/blog/migrating-auth-at-scale
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS GitHub tooling + official WorkOS blog
- Component: Migration / Environments

## Content

### General migration tooling

`npx workos migrations` (package `workos-migrations` on GitHub) is described as "the primary import workflow" across every provider guide WorkOS publishes: Auth0, Clerk, Firebase, Stytch, Descope, Cognito, Supabase, Better Auth. Shared shape regardless of source:

1. Authenticate against the source provider with **read-only** credentials (the CLI never asks for production write credentials on the source side).
2. Page through users, writing progress to a local state file so an interrupted run can resume without re-importing anyone already done.
3. Import via WorkOS's bulk endpoint, batched with retry/backoff on transient failures; each successful batch is checkpointed; failures are written to an error file with the source payload and WorkOS's API response for inspection/retry.
4. Optional diff-before-cutover pass, re-confirming each source user has a corresponding WorkOS user before flipping production auth over.

CLI commands relevant to migration: `export <provider>`, `wizard` (interactive), `merge-passwords`, `validate`, `import`, `import-package`, `enroll-totp`, `process-role-definitions`. The migration package is a provider-neutral directory: `users.csv`, `organizations.csv`, `organization_memberships.csv`, `role_definitions.csv`, `user_role_assignments.csv`, `totp_secrets.csv`, `sso/` handoff CSVs, `manifest.json`.

**Enterprise SSO connection migration strategy depends on connection count**: fewer than 15 SAML/OIDC connections - use the WorkOS Admin Portal, generate a per-connection setup link, send to the customer's IT admin to reconfigure their IdP directly against WorkOS. 15 or more connections - use a transparent proxy approach: the existing callback URL stays in place and routes SAML responses/OIDC callbacks to WorkOS, so customers don't have to touch their IdP config at all.

### Migrate from Supabase Auth

1. **Export**: Supabase stores auth data directly in the app's Postgres `auth` schema, giving full query access including password hashes.
2. **Import**: fastest path is `npx workos migrations import --csv supabase-users.csv`, or a guided `npx workos migrations wizard`. Manual path: Create User API per row, rate-limited so batch large migrations with delays.
3. **Field mapping**: `email -> email`, `email_confirmed_at IS NOT NULL -> email_verified`, `raw_user_meta_data->>'full_name' -> first_name/last_name` (split).
4. **Password import**: Supabase uses **bcrypt**, which WorkOS supports directly - pass `password_hash_type: 'bcrypt'` and `password_hash: encrypted_password` on Create/Update User. Users can then sign in with their existing password, no reset required.
5. **Social auth users**: continue working post-migration once the same provider (Google/Microsoft) is configured in WorkOS - WorkOS matches by **email address** to link automatically.

**Key architectural differences to plan around:**
- Supabase Auth has **no native multi-tenancy/organizations concept** - apps commonly fake it with RLS + a `tenant_id` column or `app_metadata`. WorkOS has first-class Organizations: create orgs via the Create Organization API, add users via Organization Membership API, assign roles via `roleSlug`.
- **MFA**: Supabase supports TOTP and SMS-based phone MFA. WorkOS supports **TOTP only, no SMS second factor** (documented security rationale: SIM-swap risk). TOTP secrets **cannot be exported from Supabase** - users must re-enroll. SMS-MFA users must switch to TOTP or email-based Magic Auth.
- **SSO**: both support SAML 2.0; existing enterprise customers must reconfigure their IdP to point at WorkOS instead of Supabase.
- **Magic links / OTP passwordless**: Supabase's Magic Links / email OTP map to WorkOS Magic Auth.
- **Interim new users during migration**: users who sign up between the Supabase export and the WorkOS cutover are missed unless handled. Two strategies: (A) temporarily disable signup via feature flag during the migration window, or (B) dual-write new signups to both systems until migration completes (requires keeping updates like email/password changes in sync across both in the interim).

### Migrate from Clerk

1. **Export**: Clerk's Backend SDK/API exports user data; for password digests specifically, use the Clerk backend API to export a CSV including `password_digest`.
2. **Import path A (CLI, recommended)**: Clerk's raw export columns (`primary_email_address`, `password_digest`, etc.) don't match the WorkOS CSV format, so transform first:
   ```bash
   npx workos migrations export clerk --from-file clerk-export.csv --output-dir ./migration-clerk
   npx workos migrations import-package ./migration-clerk
   ```
   Passing `--secret-key <Clerk Backend API key>` additionally exports Clerk's enterprise SAML/OIDC connections as SSO handoff artifacts.
3. **Import path B (manual API)**: Create User API per row, same rate-limit caveat as Supabase.
4. **Password import**: Clerk also uses **bcrypt** - same `password_hash_type`/`password_hash` mapping as Supabase.
5. **Social auth users**: same email-matching auto-link behavior as the Supabase path.
6. **Organizations/memberships**: export via Clerk Backend SDK pagination, create matching WorkOS Organizations and Organization Memberships via the respective create APIs, or let `export clerk --org-mapping orgs.csv --role-mapping roles.csv` do the mapping automatically from sidecar CSVs.
7. **MFA**: Clerk supports SMS second factors; WorkOS does not (same SIM-swap rationale) - migrate those users to Magic Auth or re-enrolled TOTP.

A dedicated community/official tool `workos/migrate-clerk-users` also exists for straight Clerk-JSON/CSV-to-WorkOS-user import including password-hash passthrough, independent of the newer unified `workos-migrations` CLI.

### Scale considerations (200K+ users, from the official "migrating auth at scale" post)

- The unified CLI's shape stays identical across providers: authenticate read-only against source, page + checkpoint locally, bulk-import with retry, diff before cutover.
- **Cutover sequencing to avoid dropped events**: disable webhooks on the OLD provider before starting the bulk import (not during it) -> run the import against a known-quiet source -> cut traffic to WorkOS behind a feature flag, verifying event flow via the WorkOS Events API -> deliberately drain or discard the old provider's queued webhook backlog rather than relying on it to flush itself on re-enable.
