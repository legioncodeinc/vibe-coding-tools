# 05. RBAC: roles and permissions

Full field tables: `references/rbac-model.md`. This guide is the procedure; that file is the reference.

## Start simple, add permissions when roles alone get cramped

Use **roles alone** for coarse-grained access control with minimal overlap between categories of user. Move to **roles + permissions** once you're frequently tweaking access rights, roles start overlapping with small variations, or you want to reassign what a role can do from the dashboard without a code deploy [raw/workos--rbac--configuration-and-integration.md].

## Configure in the WorkOS Dashboard first

Roles and permissions are configured under Authorization in the Dashboard (or via the Roles/Permissions API), not in application code [raw/workos--rbac--configuration-and-integration.md]. Every environment ships a `member` default role that cannot be deleted (though you can promote a different role to be the default) [raw/workos--rbac--configuration-and-integration.md].

## Single-role vs. multiple-roles

Multiple roles is an environment-level toggle, off by default. **Start single-role.** Adopt multiple roles only once you find yourself wanting to create combinatorial roles like `designer-engineer` - that's the signal that additive, stackable roles fit your access model better than one-role-per-membership [raw/workos--rbac--configuration-and-integration.md].

## Precedence you must design around

IdP-sourced role assignment (SSO group mapping or Directory Sync group mapping) **always wins** over roles you set manually via the dashboard or API [raw/workos--rbac--configuration-and-integration.md]. Concretely:

- SSO group role assignment re-evaluates **on every authentication**.
- Directory group role assignment re-evaluates **on every directory sync event** received for that user.

If your app lets an admin manually override a member's role in-app, and that org also has SSO or SCIM configured with group role mapping, the manual override will silently be clobbered the next time the user authenticates or the directory syncs. Surface this in your admin UI rather than letting it be a support ticket.

## Permission naming and the JWT size ceiling

Recommended pattern: `resource:action`, e.g. `users:view` (delimiters `- . : _ *` are permitted) [raw/workos--rbac--configuration-and-integration.md]. Keep permission slugs short: assigned permissions ride in the session JWT, and JWT-in-cookie is commonly capped around 4KB in modern browsers - a sprawling permission set on one role can blow that budget [raw/workos--rbac--configuration-and-integration.md].

## Reading roles/permissions in SvelteKit

```typescript
export const load: PageServerLoad = authKit.withAuth(async ({ auth }) => {
  if (!auth.permissions?.includes('billing:manage')) {
    throw error(403, 'Forbidden');
  }
  return { user: auth.user };
});
```

`auth.role` and `auth.permissions` come straight off the session JWT claims, avoiding an extra API call per request [raw/workos--rbac--configuration-and-integration.md].

## Resource-level checks beyond org-wide roles

For "can this specific membership do X to this specific resource" (not just "what's their org-wide role"), use the Authorization API's `POST /authorization/organization_memberships/{id}/check` rather than trying to encode per-resource logic into roles. WorkOS's own guidance: check the JWT directly for org-wide permission questions, reserve this endpoint for genuinely resource-specific checks [raw/workos--user-management--organization-membership-api.md].

## Two-layer enforcement

Enforce every role/permission check in **both** `hooks.server.ts`/route guards AND at the data-access layer (RLS policy, or an explicit `organizationId`/`role` filter on the query). A single JWT check in one route guard is a single point of failure the moment a new route ships without the same guard. This is a Hive convention carried over from `auth-stinger`, not a WorkOS-sourced claim - flagged as such in `references/rbac-model.md`.

## Next

`06-sso-and-directory-sync.md` covers when your B2B app actually needs SAML/OIDC and SCIM, and how connection-level role mapping interacts with everything above.
