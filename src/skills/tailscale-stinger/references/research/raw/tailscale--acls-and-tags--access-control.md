# ACLs, grants, and tags for service access control

- URL: https://tailscale.com/kb/1018/acls ; https://tailscale.com/kb/1068/tags
- Fetched: 2026-08-14
- Source type: Official docs
- Component: ACLs / Tags / Access control

## Content

### ACLs and grants (the tailnet policy file)

Tailscale access control follows **least privilege** and **zero trust** principles. Two ways to define access: **ACLs** (traditional network-layer source/destination/port rules) and **grants** (the newer, more expressive selector). Both are **deny-by-default** and live in the **tailnet policy file**, written in declarative huJSON.

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["<list-of-sources>"],
      "dst": ["<destination>:<port>"]
    }
  ]
}
```

Key properties of ACLs:
- **Deny-by-default** once an `acls` section exists. If the tailnet policy file has **no** `acls` section at all, Tailscale falls back to an implicit **allow-all** default policy - this is a real footgun for a team that hasn't yet written a policy file.
- **Directional.** Source-to-destination access does not imply the reverse.
- **Locally enforced.** Each device enforces the distributed rules itself; the coordination server is not in the data path.
- ACLs do not affect purely local-network (non-Tailscale) traffic.

Availability by plan: ACLs/grants exist on all plans, but targeting by **Groups**, **Users**, **Tags**, **Hosts**, and **IP sets**, plus `postures` with custom/third-party attributes, are Premium/Enterprise-plan features; targeting **Any**, **Tailscale IP**, or **Subnet CIDR range**, and port/protocol rules, are on all plans.

Grants example (same intent as an ACL, newer syntax):

```json
{
  "grants": [
    {
      "src": ["tag:prod"],
      "dst": ["tag:tailsql"],
      "ip": ["*"]
    }
  ]
}
```

Editing: admin console **Access controls** page, GitOps for Tailscale ACLs (policy-file-as-code in a git repo with CI-driven apply), or the Tailscale API.

### Tags

Tags are how you authenticate and identify **non-user, service-role devices** (servers, ephemeral CI nodes, subnet routers, app connectors) - they are service-account identities, not user identities.

- A tagged device's identity is the **union of all its tags** (not an intersection); an access policy for any one of a device's tags applies to it.
- **Applying a tag removes user-based authentication from a device, and vice versa** - a device cannot have both simultaneously.
- Tags are defined by their **owners** in the `tagOwners` section of the tailnet policy file; only tag owners (or Owner/Admin/Network admin roles) can apply a tag to a device.
- **Tagged devices can only SSH into other tagged devices**, never into a user-identity device.
- **Key expiry is disabled by default** the first time a device is tagged and authenticated (see key-expiry raw file for full detail).
- All plans include **50 tagged devices** free; more requires contacting sales.

Defining a tag and its owner:

```json
{
  "tagOwners": {
    "tag:server": ["dave@example.com"]
  }
}
```

A tag can have an **empty owner list** (`[]`) - it's then implicitly owned by all Owners/Admins/Network admins, usable from the admin console or baked into an auth key.

Applying tags: admin console (Owner/Admin/Network admin only, no re-auth needed), CLI (`tailscale login --advertise-tags=tag:server` or `tailscale up --advertise-tags=... --force-reauth`, cannot remove tags from a device that used an auth key - must issue a new key), or the API (`POST /device/{id}/tags`).

**Tag-from-tag hierarchies**: a tag can own another tag, enabling deployment tooling to hold a broad tag (e.g. `tag:deployment-1`) that in turn owns narrower tags (`tag:prod-2`, `tag:test-2`) it's allowed to apply to freshly-provisioned devices. Important nuance for OAuth/auth-key-driven tagging: **the requested tag set must either exactly match the authenticating tag set, or every requested tag must be owned by one of the authenticating tags in `tagOwners`.** Applying a *subset* of an OAuth client's tags requires each target tag to explicitly list the parent tag as an owner (and often itself, to support the exact-match path too).

### Recommended tag naming pattern (best practice, not enforced by Tailscale)

Composite tags encoding role + environment + optionally app/location, e.g. `tag:prod-app`, `tag:nonprod-db`, `tag:prod-app-finance-reporting`. Tags are **not** ANDed together in access rules - you cannot write a rule for "has both `tag:prod` and `tag:database`"; instead create a composite tag like `tag:prod-database` for that segment.

### ACL/tag worked example (all tag:prod devices talk to each other)

```json
{
  "acls": [
    { "action": "accept", "src": ["tag:prod"], "dst": ["tag:prod:*"] }
  ]
}
```

### Policy-file tests (verification before saving)

```json
"tests": [
  { "src": "group:sre", "accept": ["tag:prod:1234"] }
]
```

Tests validate a proposed policy file before it's applied - directly relevant to a CI-gated GitOps ACL workflow.
