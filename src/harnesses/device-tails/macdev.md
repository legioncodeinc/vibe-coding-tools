## Device facts: macdev (always-on agent plane)

- Fabric bearer key: ~/fabric/secrets/master.key (or fabric.key), or the
  FABRIC_MASTER_KEY env var. Referenced by path only, never inlined or
  committed.
- Any device change lands in docs/status.md in the macdev control repo the
  same session, with verification output. Device changes follow the phases
  and gates in docs/plan.md.
- MagicDNS names only (macdevs-macbook-pro.tail8264da.ts.net), never raw
  Tailscale IPs, they drift.
- Secrets stay on device (keychain or device-local env files), referenced by
  name only.
