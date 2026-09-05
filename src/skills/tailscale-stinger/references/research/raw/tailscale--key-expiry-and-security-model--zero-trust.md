# Key expiry and the security model

- URL: https://tailscale.com/kb/1028/key-expiry
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Security model / Key expiry

## Content

### Node key expiry (the baseline security rhythm of a tailnet)

Every device that logs into Tailscale gets a **node key**, and by default that key **expires every 180 days**, forcing periodic reauthentication - this is Tailscale's core "keys don't live forever" security posture for user-identity devices. If a device's key expires without reauthentication, **connections to and from that device stop working entirely** until it reauthenticates.

- **Custom authentication period**: an Owner/Admin can set a tailnet-wide value from **1 to 180 days** on the Device Management page. Changing this value only affects devices that log in **after** the change - already-logged-in devices keep their prior schedule until their next login.
- **Disabling key expiry** per-device is explicit and manual (Machines page > Disable Key Expiry, or via the API) - the documented use case is **trusted servers, subnet routers, or hard-to-reach remote/IoT devices** where a lockout from an expired key would be operationally painful (you can't easily walk up to a headless cloud VM to reauthenticate it).
- **Tagged devices get key expiry disabled by default** on first tag+auth - this is a deliberate design choice (service accounts shouldn't silently stop working), not an oversight, but it does mean a team should not assume "tagging a device" is neutral from a rotation-hygiene standpoint - it opts that device **out** of the periodic-reauth safety net unless re-enabled.
- **Recovering an expired device with no other access path**: an Admin can use **"Temporarily extend key"** from the Machines page, which grants a **30-minute** window for the device owner to reauthenticate (or disable expiry within that window) - critical for a device that was hardened to Tailscale-only access (no direct SSH/console fallback) and got locked out by its own expiry.
- **Admin console session expiry** (30 days) is a separate mechanism from node key expiry - don't conflate a human's dashboard login session with a device's node key lifecycle.

### How this composes with tags, auth keys, and OAuth (cross-reference)

- Tag-based key-expiry-disabled-by-default [raw/tailscale--acls-and-tags--access-control.md] plus auth-key expiry being independent of node-key expiry [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] means the actual **security model has three separate clocks**: (1) the auth key's own 1-90 day expiry, which only gates *initial* registration, (2) the node key's expiry, which gates *ongoing* connectivity and defaults to off for tagged devices, and (3) an OAuth client's API access token, which is a hard 1-hour non-configurable window used only for *API calls*, not device connectivity.
- The zero-trust framing carried over from the ACLs research [raw/tailscale--acls-and-tags--access-control.md] applies here too: Tailscale's default-deny ACL model plus per-device key rotation is the "don't trust the network, verify the device and the policy every time" posture - but a team that disables key expiry on a fleet of tagged servers and never revisits it has quietly reintroduced a "trust the box forever" gap into an otherwise zero-trust design. The corrective practice implied by the docs (not a direct quote, an inference from the "disable key expiry for trusted servers" framing plus the general least-privilege framing in the ACLs source) is: disabling expiry should be a deliberate, documented exception per device (bastion, subnet router, CI-adjacent long-lived node), not a blanket default applied to every tagged device just because that's the out-of-the-box behavior.

**Gap, stated plainly**: no dedicated Tailscale "security whitepaper" or threat-model document was fetched in this research sweep beyond what's referenced inline on the ACLs and key-expiry pages (zero-trust, least-privilege). If a task needs deeper cryptographic/WireGuard-protocol-level security claims (e.g. specific handshake properties, DERP relay trust boundaries), that is outside what this research sweep grounds and should be flagged as a gap rather than answered from training data.
