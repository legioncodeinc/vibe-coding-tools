# 04. SSH via Tailscale

## What it changes and what it doesn't

Tailscale SSH takes over port 22 on a device's Tailscale IP **for tailnet-originated connections only** - the box's real `sshd_config` and `authorized_keys` are untouched, so non-tailnet SSH access keeps working exactly as before. Authentication runs over WireGuard using the device's node key rather than a distributed public key, and authorization is governed entirely by the tailnet's access control policy [raw/tailscale--ssh--tailscale-ssh.md].

Server-side support is **Linux, and macOS's open-source `tailscaled` variant only** - the App Store/Standalone GUI macOS builds can't run the server side [raw/tailscale--ssh--tailscale-ssh.md].

## Enabling it

```bash
tailscale set --ssh
```

Run this from console access to the host, not over an existing SSH session through its Tailscale IP - enabling it hangs any session already using that path [raw/tailscale--ssh--tailscale-ssh.md].

## The policy is not optional

Two rules must both exist for a connection to work: a general network-access rule permitting the source to reach the destination at all, and an SSH-specific rule naming which `users` are permitted. The unmodified default policy actually permits SSH from everyone to everyone - fine for a solo tailnet, not for a shared one [raw/tailscale--ssh--tailscale-ssh.md]. Use `references/example-acl-policy.md`'s `ssh` block as a starting shape.

```json
{
  "action": "check",
  "src": ["group:engineering"],
  "dst": ["tag:db-bastion"],
  "users": ["autogroup:nonroot", "root"],
  "checkPeriod": "12h"
}
```

`action: "accept"` trusts the existing tailnet session; `action: "check"` forces a fresh identity-provider re-authentication before the shell opens, for every session or scoped just to sensitive users like `root` [raw/tailscale--ssh--tailscale-ssh.md]. Default to `check` for anything that reaches a bastion or a production-adjacent box.

## Revocation is policy, not key rotation

Removing someone's SSH access is an ACL edit, not a key purge - it propagates within seconds and can terminate an already-open session [raw/tailscale--ssh--tailscale-ssh.md]. This is the single biggest operational win over managing `authorized_keys` files by hand across a fleet.

## A subtlety worth flagging in review

Granting `autogroup:member` SSH access also grants it to externally-invited/shared users if the destination device is shared outside the tailnet, even if they have no other devices in it. Don't assume `autogroup:member` means "only my own team" once sharing is in play [raw/tailscale--ssh--tailscale-ssh.md].

## Next

`05-funnel-and-serve-for-exposing-local-services.md` covers the opposite direction: letting something reach *into* the tailnet from outside, or sharing a local dev server with teammates.
