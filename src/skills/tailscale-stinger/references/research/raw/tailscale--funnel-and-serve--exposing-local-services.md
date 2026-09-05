# Tailscale Funnel and Serve

- URL: https://tailscale.com/kb/1223/tailscale-funnel ; https://tailscale.com/kb/1242/tailscale-serve
- Fetched: 2026-08-14
- Source type: Official docs (Funnel is noted as in beta by Tailscale)
- Component: Funnel / Serve

## Content

### The core distinction

- **`tailscale serve`**: shares a local service **within the tailnet only** - other tailnet members reach it, nobody outside does.
- **`tailscale funnel`**: shares a local service **with the broader public internet**, even to people who don't run Tailscale at all, via a public HTTPS URL on the tailnet's own domain.
- The same port cannot run Serve and Funnel simultaneously with different visibility; whichever command last configured a given port wins - "if the most recent command was `serve`, the port is completely private; if `funnel`, completely public." This is an easy misconfiguration to audit for.

### How Funnel works (mechanically)

1. Sharing a resource creates a unique Funnel URL scoped only to that resource (a web server, or a specific file/directory).
2. A device resolving the Funnel URL gets DNS pointed at a **Funnel relay server**, not the origin device's real IP - hiding the device's network location.
3. The relay establishes a TCP proxy to the origin device over Tailscale; this is an encrypted tunnel the relay **cannot decrypt** (TLS terminates on the origin device itself, not at the relay).
4. The origin device's local `tailscaled` terminates TLS, hands the decrypted request to the local service, and reverses the same path for the response.

### Funnel requirements and hard limits

- Tailscale v1.38.3+, MagicDNS enabled, valid HTTPS certs for the tailnet, and a `funnel` **node attribute** (`nodeAttrs`) in the tailnet policy file naming which users can use it.
- Funnel **can only use the tailnet's own `.ts.net` domain** - no custom domains.
- Funnel **can only listen on ports 443, 8443, or 10000.**
- **Non-configurable bandwidth limits** apply to Funnel traffic - not a substitute for a real CDN/production ingress.
- macOS file/directory sharing over Funnel only works with the open-source `tailscaled` variant, not the App Store or Standalone GUI variants (port sharing works on those, files/dirs do not).
- Requesting new HTTPS certs too frequently can hit **Let's Encrypt rate limits**, imposing up to a **34-hour** cooldown.

Enabling Funnel via CLI auto-provisions certs and updates the tailnet policy file's `nodeAttrs`:

```shell
tailscale funnel 3000
# Available on the internet: https://amelie-workstation.pango-lin.ts.net
```

Default `nodeAttrs` shape once enabled:

```json
"nodeAttrs": [
  { "target": ["autogroup:member"], "attr": ["funnel"] }
]
```

### `tailscale serve` mechanics and flags

`serve` supports four content modes: **reverse proxy** to a local HTTP backend (only `http://127.0.0.1` targets are supported for the proxy mode), a **file server** (single file or directory listing), a **static text** responder (debugging), and raw/TLS-terminated **TCP forwarding** (for non-HTTP protocols like a database wire protocol, SSH, or RDP).

Key flags: `--https=<port>` (default mode, auto TLS cert), `--http=<port>`, `--tcp=<port>` (raw TCP forwarder), `--tls-terminated-tcp=<port>`, `--set-path=<path>` (URL path mount point), `--proxy-protocol=<1|2>` (preserve original client IP through the proxy - "most situations use version 2"), `--bg` (persist across reboot/restart; without it, Serve must be manually restarted after `tailscale down`/`up` or a reboot).

```shell
tailscale serve localhost:3000              # reverse proxy, tailnet-only, HTTPS
tailscale serve --http=80 localhost:3000    # plain HTTP variant
tailscale serve /home/alice/blog/index.html # file/dir server
tailscale serve --tcp=5432 tcp://localhost:5432   # raw TCP forwarder, e.g. a DB port
```

Turning a config off requires repeating the same flags with `off` appended (the target argument itself is optional in the `off` form, but the original flags are not).

Practical framing for this skill: Serve is the right call for "let a teammate preview my locally-running SvelteKit dev server" (`tailscale serve 5173`), staying entirely inside the tailnet. Funnel is for "let an external stakeholder, client, or webhook provider (who isn't on the tailnet) hit this one local endpoint temporarily" - e.g. testing a webhook receiver against a local dev server before it's deployed to Vercel. Funnel is explicitly **not** positioned as a production ingress replacement (beta status, bandwidth caps, `.ts.net`-only domains) - a real Vercel deployment remains the right answer for anything customer-facing and permanent.
