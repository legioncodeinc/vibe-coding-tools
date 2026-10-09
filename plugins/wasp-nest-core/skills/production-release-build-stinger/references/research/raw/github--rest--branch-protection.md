# GitHub REST API: Branch protection
- URL: https://docs.github.com/en/rest/branches/branch-protection
- Fetched: 2026-09-29
- Source type: official vendor docs (docs.github.com)

## Key facts
- Endpoint: /repos/{owner}/{repo}/branches/{branch}/protection; GET/PUT/DELETE; PUT requires admin/owner.
- lock_branch: boolean on PUT. "Whether to set the branch as read-only. If this is true, users will not be able to push to the branch." Default false. Response object: lock_branch.enabled (boolean).
- enforce_admins: required boolean-or-null on PUT; true = "Enforce all configured restrictions for administrators"; null disables. Response: enforce_admins.enabled. Also managed via GET/POST/DELETE .../protection/enforce_admins.
- required_status_checks on PUT: {strict: bool, contexts: [deprecated] | checks: [{context, app_id?}]}.
- Rulesets are NOT documented on this page; lock_branch is a classic-branch-protection field.
