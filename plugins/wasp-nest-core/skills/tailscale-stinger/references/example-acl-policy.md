# Example ACL policy file: small-team pattern with tags and grants

Grounded in [raw/tailscale--acls-and-tags--access-control.md]. This replaces the default allow-all policy - write something like this **before** inviting a second person into a shared tailnet [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].

## The pattern

- Every human gets tailnet access through `autogroup:member` (or a named group if you need finer split, e.g. contractors vs. staff).
- Every service/server device is **tagged**, never given a personal login.
- Access is granted by tag, not by hostname or IP, so the policy survives a device being rebuilt.
- The database bastion, CI, and staging app server each get their own tag so a compromise of one doesn't blanket-grant the others.

```json
{
  "tagOwners": {
    "tag:admin-tooling": ["autogroup:admin"],
    "tag:ci":            ["tag:admin-tooling"],
    "tag:db-bastion":    ["tag:admin-tooling"],
    "tag:staging":       ["tag:admin-tooling"]
  },

  "groups": {
    "group:engineering": ["alice@example.com", "bob@example.com"]
  },

  "grants": [
    // Engineers can reach the staging app server on its web port and SSH.
    {
      "src": ["group:engineering"],
      "dst": ["tag:staging"],
      "ip": ["443", "22"]
    },

    // Engineers can reach the DB bastion's forwarded Postgres port.
    {
      "src": ["group:engineering"],
      "dst": ["tag:db-bastion"],
      "ip": ["5432"]
    },

    // CI (ephemeral nodes) can reach the DB bastion, nothing else.
    {
      "src": ["tag:ci"],
      "dst": ["tag:db-bastion"],
      "ip": ["5432"]
    },

    // The DB bastion and staging server can reach each other for deploy hooks.
    {
      "src": ["tag:db-bastion"],
      "dst": ["tag:staging"],
      "ip": ["443"]
    }
  ],

  "ssh": [
    {
      "action": "check",
      "src": ["group:engineering"],
      "dst": ["tag:db-bastion", "tag:staging"],
      "users": ["autogroup:nonroot", "root"],
      "checkPeriod": "12h"
    }
  ],

  "nodeAttrs": [
    // Uncomment if this tailnet needs Funnel for a demo/webhook-testing endpoint.
    // { "target": ["group:engineering"], "attr": ["funnel"] }
  ],

  "tests": [
    { "src": "group:engineering", "accept": ["tag:db-bastion:5432"] },
    { "src": "tag:ci", "accept": ["tag:db-bastion:5432"] },
    { "src": "tag:ci", "deny": ["tag:staging:22"] }
  ]
}
```

## Notes on this pattern

- `tag:admin-tooling` is a parent tag that owns the three service tags - this lets one Terraform/OAuth-client identity provision all three roles without needing to be a full tailnet Owner [raw/tailscale--acls-and-tags--access-control.md, raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]. Remember the exact-match-or-owned rule: an OAuth client holding `tag:admin-tooling` can mint keys for `tag:ci`, `tag:db-bastion`, or `tag:staging` individually because each is owned by `tag:admin-tooling` in `tagOwners` above.
- `tag:ci` is deliberately scoped to **only** the DB bastion on the Postgres port - a compromised or misconfigured CI job cannot reach the staging app server or anything else, even though it's on the same tailnet.
- The `ssh` block uses `action: "check"` for both non-root and root so that even a valid tailnet session must re-authenticate against the identity provider before an interactive shell opens on the bastion or staging box [raw/tailscale--ssh--tailscale-ssh.md].
- The `tests` block should be run (`GitOps for Tailscale ACLs` in CI, or the admin console's built-in test runner) on every policy-file change before it merges - this is the deny-by-default model's actual safety net [raw/tailscale--acls-and-tags--access-control.md].
- This policy intentionally has **no** rule granting `autogroup:internet` - nobody uses an exit node in this pattern. Add one explicitly, scoped to a specific group, only if a real need for it shows up [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].
