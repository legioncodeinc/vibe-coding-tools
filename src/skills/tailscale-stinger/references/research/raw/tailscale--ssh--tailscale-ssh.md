# Tailscale SSH

- URL: https://tailscale.com/kb/1193/tailscale-ssh
- Fetched: 2026-08-14
- Source type: Official docs
- Component: SSH

## Content

Tailscale SSH lets Tailscale itself manage authentication and authorization of SSH connections inside the tailnet, replacing (for tailnet-originated connections only) the traditional SSH-key distribution model.

### How it differs from regular SSH

- Tailscale claims **port 22** on the Tailscale IP for connections **arriving from the tailnet only**; the host's real `sshd_config` and `~/.ssh/authorized_keys` are untouched, so non-Tailscale SSH access to the same box keeps working unmodified.
- The connection is authenticated and encrypted over WireGuard using Tailscale **node keys**; the SSH protocol's own authentication phase is skipped (`none` auth type) because Tailscale already knows who the remote party is. The SSH-layer encryption still runs on top, so there are two layers of encryption.
- Authorization is governed centrally by the tailnet's **access control policy**, not by which public keys happen to be in `authorized_keys`.

### Benefits

- No more manual SSH key lifecycle management - WireGuard keys auto-generate and expire with the session.
- **Check mode**: force re-authentication (via the identity provider) for high-risk connections or specific users (e.g. `root`) before they can connect, valid for a configurable `checkPeriod` (default 12h).
- **SSH session recording** for audit/compliance.
- **Revocation is instant**: updating the access control policy revokes SSH access within seconds and can terminate already-established sessions - no key purging required.

### Requirements

- Server component: **Linux** or **macOS** (open-source `tailscaled` variant only), Tailscale v1.24+. Any platform can be the *client* side.
- Must **advertise** SSH on the destination host: `tailscale set --ssh` (warning: this hangs any existing SSH session to that host's Tailscale IP; run it from console access, not over the SSH session itself).
- Must have an **access control policy** permitting (a) general network access src->dst and (b) SSH access src->dst with specific `users`. The **default** tailnet policy (no explicit ACLs) permits SSH from everyone to everyone - safe for a solo tailnet, not for a team one.

### SSH access rule shape (tailnet policy file)

```json
{
  "action": "check",
  "src": ["<sources>"],
  "dst": ["<destinations>"],
  "users": ["<ssh-usernames>"],
  "checkPeriod": "20h",
  "acceptEnv": ["GIT_EDITOR", "GIT_COMMITTER_*", "CUSTOM_VAR_V?"]
}
```

- `action: "accept"` trusts existing tailnet auth; `action: "check"` forces periodic IdP re-authentication.
- `src` cannot be a bare wildcard `*` - must be a user, group, tag, `user:*@domain`, or autogroup.
- Granting `autogroup:member` also grants access to externally-invited/shared users if the destination is shared with them - a subtlety worth flagging when auditing an SSH policy.

### Comparison table (SSH vs. Tailscale SSH)

| Aspect | SSH | Tailscale SSH |
| --- | --- | --- |
| IP addresses | Works | Works |
| MagicDNS names | Works | Works |
| DNS dependency | None if using IPs | Uses a custom `known_hosts`; DNS failures can cause errors |
| Access controls | External to Tailscale | Centralized in the tailnet policy |
| Session recording | No | Yes |
| macOS | Any variant | Requires the open-source `tailscaled` variant |

Practical framing for this skill: Tailscale SSH is the mechanism for reaching a dev/staging box or a bastion host without distributing or rotating SSH keypairs - pair it with tags (e.g. `tag:bastion`) and an explicit SSH policy rule, not the wide-open default.
