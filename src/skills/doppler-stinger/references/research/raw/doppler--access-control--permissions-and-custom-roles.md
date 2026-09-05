# Access control: workplace roles, project permissions, custom roles, advanced group composition

- URL: https://docs.doppler.com/docs/project-permissions ; https://docs.doppler.com/docs/custom-roles ; https://docs.doppler.com/docs/advanced-permissions
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: Access control / RBAC

## Content

### Workplace-level vs. project-level roles

- **Workplace role** (Owner, Admin, Collaborator, or a Custom Workplace Role): each user gets exactly one. Owner/Admin automatically get full access to every project and environment. Collaborator gets none by default and must be explicitly granted per project (and per environment within that project).
- **Project role**: Viewer, Collaborator, Admin, or None (`no_access` via API/Terraform). Requires Team or Enterprise plan for role-based access at all.

Collaborators can manage secrets, trusted IPs, and service tokens on configs they have access to, but cannot rename or delete configs (renames can break services fetching secrets via API by name).

The model's stated advantage: you can restrict a user at the workplace level while still giving them Admin on a specific project - this keeps the count of full workplace Owner/Admins low without blocking legitimate per-project administration (e.g. configuring integrations).

Granting access: by user (from their Team page, add projects + role + which environments) or by project (Members button > add user/group > set role + environments). Removing access is immediate in both dashboard and API.

### Custom Roles

Custom Roles allow finer-grained permission sets than the built-in Workplace/Project roles, created under Team > Roles. Two scopes:

- **Workplace**: one custom role per user (groups cannot hold a workplace role); governs logs, team management, settings, billing, etc.
- **Project**: one role per user or group per project; if different permission levels are needed per config within one project, compose multiple groups (see Advanced Permissions below). A user's effective permission is the union/most-permissive of every role applied to them.

Selected permissions relevant to secret operations and auditing (from the Custom Roles permission table):

| Permission | Slug | Category | Dependency |
| --- | --- | --- | --- |
| View Logs | `logs` | Activity Logs | - |
| View All Logs | `logs_audit` | Activity Logs | View Logs |
| Manage Custom Roles | `custom_roles_manage` | Team Management | View Team |
| View Config Logs | `enclave_config_logs` | Config Logs | View Secrets |
| View Config Access Logs | `enclave_config_access_logs` | Access Logs | View Secrets |

Dependencies are transitive and auto-enabled in the dashboard UI, but must be explicitly included when assigning permissions via the API.

### Advanced Permissions: composing groups for asymmetric per-environment access

Doppler's own worked example: give one group write access to `dev`/`ci`, another group read-only on `stg`, and a third group visibility-only (existence, no secret values) on `prd` - impossible with a single role assignment to a single group, because one project-role assignment is all-or-nothing per environment set. Solution:

1. Create three Custom Project Roles: "Secret Read-only" (View Secrets), "Secret Write" (View Secrets + Manage Secrets), "No Secrets" (no permissions).
2. Create three User Groups and assign: Dev+CI Write group -> Secret Write role, scoped to `dev`+`ci` only; Staging Read-only group -> Secret Read-only role, scoped to `stg` only; Prod No Secrets group -> No Secrets role, scoped to `prd` only.
3. The permissions model unions all of a user's group memberships and takes the **most permissive** applicable set per config - so a user can be in multiple groups without those grants canceling each other out.

### Security posture summary (from Doppler's Security Fact Sheet)

Doppler states it maintains "an immutable audit log," attributes every secret modification to the user who made it, supports rollback from that log for sufficiently-permissioned users, and explicitly claims no internal "God Mode": employees cannot access customer secrets, issued API keys, or audit logs without explicit customer approval.
