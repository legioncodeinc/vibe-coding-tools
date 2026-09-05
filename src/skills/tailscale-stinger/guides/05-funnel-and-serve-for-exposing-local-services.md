# 05. Funnel and Serve for exposing local services

## The one-line distinction

`tailscale serve` shares a local service with the **tailnet only**. `tailscale funnel` shares it with the **public internet**, no Tailscale client required on the visitor's end. They cannot both be active on the same port simultaneously - whichever command ran most recently on a given port wins entirely, private or public [raw/tailscale--funnel-and-serve--exposing-local-services.md]. That's an easy thing to get wrong in review: check `tailscale serve status` for what's actually live before trusting what a script or a teammate says is configured.

## Serve: the everyday case

Sharing a local SvelteKit dev server with a teammate for a quick look, without deploying anything:

```bash
tailscale serve --bg 5173
```

They reach it at `https://<your-machine>.<tailnet>.ts.net` - fully private to the tailnet [raw/tailscale--funnel-and-serve--exposing-local-services.md]. Full command reference: `references/serve-and-funnel-commands.md`.

Serve's reverse-proxy mode only proxies to `http://127.0.0.1` targets on the same device - it can't reach an arbitrary remote host. For anything else (a bastion forwarding to a remote database's wire protocol, for instance), use the raw or TLS-terminated TCP-forwarder flags instead, as in `references/db-bastion-pattern.md` [raw/tailscale--funnel-and-serve--exposing-local-services.md].

## Funnel: the occasional case, treat it as temporary

Funnel is for the narrow case of "something outside the tailnet - a webhook provider testing against your local dev server, an external stakeholder previewing something - needs to hit one specific local endpoint, right now." It is explicitly **in beta** per Tailscale's own docs, restricted to ports 443/8443/10000, restricted to the tailnet's own `.ts.net` domain (no custom domain), and subject to non-configurable bandwidth limits [raw/tailscale--funnel-and-serve--exposing-local-services.md]. None of that makes it a production ingress substitute - a real Vercel deployment is still the right answer for anything customer-facing and permanent.

```bash
tailscale funnel 3000       # turn on
tailscale funnel 3000 off   # turn off - don't leave it running unattended
```

Requires the `funnel` node attribute present in the tailnet policy file for whoever is running it; the CLI adds this automatically the first time you enable Funnel, but it's worth knowing it's a policy-file change under the hood, not just a local toggle [raw/tailscale--funnel-and-serve--exposing-local-services.md]. Watch out for Let's Encrypt's certificate rate limit on repeated enable/disable cycles - hitting it means up to a 34-hour wait before Funnel can provision a cert again [raw/tailscale--funnel-and-serve--exposing-local-services.md].

## Next

`06-oauth-clients-auth-keys-ephemeral-ci-and-security.md` covers the credential side: how CI or any automation authenticates to the tailnet in the first place, and the key-expiry model underneath all of it.
