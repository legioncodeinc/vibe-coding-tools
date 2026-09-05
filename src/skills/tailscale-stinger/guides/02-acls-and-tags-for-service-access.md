# 02. ACLs and tags for service access control

## Start here: the default policy is not a policy

Before you invite anyone else into a shared tailnet, know that Tailscale's default (a tailnet with no `acls` section written) is **allow-all**: every device can reach every other device on every port [raw/tailscale--acls-and-tags--access-control.md]. Multiple independent sources call this out as a real trap the moment a tailnet stops being a single person's own devices [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md]. Write an explicit policy first. `references/example-acl-policy.md` is a working starting point.

## ACLs vs. grants

Both live in the same tailnet policy file (huJSON) and are both deny-by-default once present. ACLs are the older, source/destination/port syntax; grants are newer and more expressive (and required for some newer features like Funnel node attributes and app capabilities). New policy files in this skill default to `grants` where both would work, since it's the direction Tailscale's own docs and examples lean [raw/tailscale--acls-and-tags--access-control.md].

## Tags: the service-identity primitive

Any device that isn't a person's laptop or phone - a bastion host, a CI runner, a staging server - should be a **tagged** device, never authenticated under someone's personal login. Tagging and user-identity are mutually exclusive on a single device: applying a tag strips any existing user identity, and vice versa [raw/tailscale--acls-and-tags--access-control.md].

Define tags and their owners in `tagOwners` before anything tries to use them:

```json
"tagOwners": {
  "tag:db-bastion": ["autogroup:admin"]
}
```

A tag can itself own other tags, which is how one automation identity (e.g. an OAuth client or a Terraform service account) provisions multiple device roles without being a full tailnet Owner - see `references/example-acl-policy.md`'s `tag:admin-tooling` pattern and cross-reference `guides/06-oauth-clients-auth-keys-ephemeral-ci-and-security.md` for the exact-match-or-owned rule that governs which tags an automation identity can hand out [raw/tailscale--acls-and-tags--access-control.md].

## Composite tags over ANDed rules

You cannot write a policy rule that means "has both `tag:prod` and `tag:database`" - tags aren't ANDed in access rules. If you need that intersection, create a composite tag (`tag:prod-database`) and apply it directly [raw/tailscale--acls-and-tags--access-control.md]. Plan tag names around role + environment (+ app/location if needed) from the start; retrofitting a naming convention across a live fleet is more work than picking one up front.

## Verify before you ship a policy change

Use the `tests` block in the tailnet policy file to assert both what should be allowed and what should be denied, and run it (via the admin console's built-in check, or GitOps-for-Tailscale-ACLs in CI) before merging any policy change:

```json
"tests": [
  { "src": "tag:ci", "accept": ["tag:db-bastion:5432"] },
  { "src": "tag:ci", "deny": ["tag:staging:22"] }
]
```

This is deny-by-default's actual safety net - a rule that "looks right" but grants too much is caught here, not in production [raw/tailscale--acls-and-tags--access-control.md].

## Next

Once devices are tagged and grants are written, `03-subnet-routers-exit-nodes-and-reaching-a-private-database.md` covers making a private network segment (or a database bastion) actually reachable through those grants.
