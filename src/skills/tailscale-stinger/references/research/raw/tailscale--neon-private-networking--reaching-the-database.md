# Neon Postgres private networking vs. a Tailscale subnet-router/bastion pattern

- URL: https://neon.com/docs/guides/neon-private-networking ; https://neon.com/blog/aws-privatelink-for-neon-databases ; https://neon.com/docs/reference/cli-vpc ; https://neon.com/docs/security/security-overview ; https://tailscale.com/docs/install/cloud/aws
- Fetched: 2026-08-14
- Source type: Official docs (Neon) + Official blog (Neon) + Official docs (Tailscale)
- Component: Neon private networking / Database access pattern

## Content

### Neon DOES have a native private-networking feature - and it is not Tailscale

Neon's answer to "connect to the database without crossing the public internet" is **Neon Private Networking**, built on **AWS PrivateLink**, not a Tailscale integration. This is the single most important grounding fact for this topic: **there is no native Neon-Tailscale integration** in the fetched sources. The two are separate mechanisms solving overlapping but distinct problems.

How Neon Private Networking works:
1. Neon provisions an AWS PrivateLink **endpoint service** in the same AWS region as the database.
2. The customer creates a **VPC endpoint** in their own AWS VPC, pointed at that service (via specific `vpce-svc-*` service names that vary per AWS region - e.g. `us-east-1` needs 12 separate service-name entries as of this fetch).
3. The VPC endpoint ID is registered to the Neon organization (Neon CLI `neon vpc endpoint` subcommands, or the API).
4. The application then connects through the private endpoint; Neon's isolated proxy forwards traffic to the database. **No application code changes are required** - the connection string stays the same shape, DNS just resolves to the private endpoint once "private DNS names" is enabled on the VPC endpoint (a step that must happen *after* registering the endpoint with Neon, not before).
5. Optionally, **restrict the Neon project to only accept connections from the registered VPC endpoint(s)**, closing the public-internet path entirely.

### Requirements and constraints (Neon side)

- **Plan gating**: Private Networking requires Neon's **Scale** plan (the raw source also shows the Neon blog announcing it under "Business and Enterprise" - the docs page and blog differ slightly on exact plan naming; treat "Scale/Business-tier and above" as the safe summary and verify current plan names against Neon's live pricing page before advising a customer). Must be a Neon **organization** account with **Admin** role - not available on personal Neon accounts.
- **Region-matched**: the client application and the Neon database must be in the **same AWS region**, and that region must be one of Neon's supported AWS regions for this feature.
- **AWS-only**: this is specifically AWS PrivateLink; the sources here do not describe an equivalent for other clouds.
- Limit: max **10 private networking configurations per AWS region** per organization.
- **Irreversible removal**: a removed VPC endpoint cannot be re-added to the same Neon organization - a new one must be created.

### Where this leaves a SvelteKit-on-Vercel + Neon stack

This is the load-bearing judgment call for this skill: **Vercel's serverless/edge functions do not run inside your own AWS VPC**, so Neon Private Networking (which requires the *client application* to be deployed inside a matching AWS VPC) is not reachable from a standard Vercel deployment. Neon Private Networking is the right tool when the *application* itself runs in an AWS VPC you control (e.g. an EC2/ECS/Lambda-in-VPC workload) - not when the application is a Vercel-hosted SvelteKit app. This is an inference drawn from the mechanics described in the raw source (VPC endpoint must live in the same VPC as the client), not a directly stated Vercel-compatibility claim from Neon - flagged as such, and worth re-verifying against Neon's current docs before treating it as permanent, since both Neon and Vercel ship changes quickly.

Given that gap, the practical uses for Tailscale in this stack are:
1. **Developer-machine-to-database reachability during local development or one-off admin/ops work**: a small team can run a **Tailscale subnet router** (or a single tagged bastion node) positioned wherever the database's network boundary actually is reachable from (e.g. inside the VPC if using Neon Private Networking's endpoint, or simply as a jump host with the Neon connection string as an environment secret) so a developer's laptop reaches it over the tailnet instead of opening the database to `0.0.0.0/0` in Neon's own IP-allowlist feature.
2. **Neon's own default security posture already covers the common case**: Neon terminates connections through a **proxy** (authenticates before ever reaching Postgres) and offers a Scale-plan **IP allowlist** feature independent of Tailscale entirely - for a small team where every developer has a stable IP or a company VPN, the IP allowlist may fully solve "keep the database off the open internet" without introducing Tailscale at all. This is the honest "is it overkill" answer for the database-access topic specifically: Tailscale-for-database-access is justified when the team's IPs are not stable (remote/coffee-shop work) or when a shared bastion pattern is preferred over per-developer IP allowlisting, not as a default reach-for-it action [raw/tailscale--small-team-fit--when-to-use.md].
3. **A bastion-host pattern is the generically-correct Tailscale answer** when Neon Private Networking doesn't apply (non-AWS-VPC client): stand up one small, tagged (`tag:db-bastion`), key-expiry-disabled Tailscale node with network-level reachability to the database (however that reachability is actually established for the given Neon setup - could be the Neon Private Networking VPC endpoint if the bastion itself lives in-VPC, or just a normal Postgres connection if only IP-allowlisting the bastion's static IP), and let developers reach the database through that bastion over the tailnet rather than each developer's raw IP needing allowlisting. See `references/db-bastion-pattern.md` for the concrete command sequence built from the subnet-router mechanics in [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].

### Neon's baseline security controls (context, not Tailscale-specific)

- SSL/TLS enforced (`verify-full` mode by default).
- 60-bit-entropy generated passwords.
- AES-256 encryption at rest.
- IP allowlist support (Scale plan).
- A connection proxy in front of Postgres that blocks unauthorized login attempts before they reach the database process.

**Gap, stated plainly**: no source fetched here describes a first-party Neon-Tailscale partnership, app-connector, or marketplace integration. If one exists, it was not surfaced by this research sweep and should not be assumed.
