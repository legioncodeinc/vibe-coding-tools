# Serve and Funnel: copy-paste commands

Grounded in [raw/tailscale--funnel-and-serve--exposing-local-services.md]. Serve = tailnet-only. Funnel = public internet. They cannot both be active on the same port at once - whichever command ran most recently on a port wins entirely.

## Serve: share your local SvelteKit dev server with teammates only

```bash
# SvelteKit's dev server defaults to 5173.
tailscale serve --bg 5173

# Check what's currently being served.
tailscale serve status

# Turn it off.
tailscale serve --https=443 5173 off
```

Teammates on the tailnet reach it at `https://<your-machine>.<tailnet>.ts.net` - nobody outside the tailnet can, even by URL guess [raw/tailscale--funnel-and-serve--exposing-local-services.md].

## Serve: forward a non-HTTP port (e.g. testing the DB bastion pattern locally)

```bash
tailscale serve --bg --tcp=5432 tcp://localhost:5432
```

## Funnel: expose a local endpoint to the public internet temporarily

Use case: testing a webhook receiver (Stripe, GitHub, etc.) against your local dev server before it's deployed to Vercel.

```bash
# One-time: enable Funnel for your tailnet (prompts for approval, provisions
# HTTPS certs, and adds the required nodeAttrs entry to the policy file).
tailscale funnel 3000

# Turn it off when done - Funnel is explicitly in beta and not a production
# ingress substitute; don't leave it running unattended.
tailscale funnel 3000 off
```

Hard limits to remember before reaching for Funnel: only ports 443/8443/10000, only the tailnet's own `.ts.net` domain (no custom domain), non-configurable bandwidth caps, and it requires the `funnel` node attribute to be present in the tailnet policy file for the user running it [raw/tailscale--funnel-and-serve--exposing-local-services.md]. If you hit Let's Encrypt's certificate rate limit from repeated enable/disable cycles, expect up to a 34-hour cooldown before retrying [raw/tailscale--funnel-and-serve--exposing-local-services.md].

## Reverse-proxy content mode reminder

`tailscale serve`'s reverse-proxy mode only supports `http://127.0.0.1` targets - it cannot proxy to an arbitrary remote host. For anything not running on the Serve/Funnel node itself, use the TCP-forwarder flags (`--tcp=` / `--tls-terminated-tcp=`) instead, as in `db-bastion-pattern.md` [raw/tailscale--funnel-and-serve--exposing-local-services.md].
