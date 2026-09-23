# tailscale-wasp-drone

## Domain
Owns Tailscale specifically: tailnet setup and MagicDNS, the tailnet policy file (ACLs, grants, tags, `tagOwners`, `nodeAttrs`, policy tests), Tailscale SSH, subnet routers and exit nodes, the developer-machine-to-private-database connectivity pattern (including the fact that Neon has no native Tailscale integration), Funnel and Serve, OAuth clients and auth keys for automation, ephemeral CI nodes, and the key-expiry/security model. It writes the policy; it does not judge in depth whether a written ACL is actually least-privilege.

## Paired Stinger
[tailscale-stinger](../../tailscale-stinger) - ACL/tag guides, the subnet-router/exit-node/database-bastion pattern, SSH, Funnel/Serve, and the OAuth-client/ephemeral-CI security model.

## Trigger phrases
- "set up Tailscale"
- "write an ACL policy"
- "connect to the private database from my laptop"
- "expose this local service with Funnel"
- "add an ephemeral node to CI"
- "set up a subnet router"
- "enable Tailscale SSH"
- "should we even use Tailscale here"

## Do NOT route when
- The ask is auditing whether an already-written ACL is actually least-privilege in depth: route to security-wasp-drone (this Drone writes the policy, that Drone audits it).
- The ask is the broader CI/CD pipeline architecture surrounding the ephemeral-node step, not the Tailscale wiring itself: route to devops-wasp-drone.
- The ask is rotating the value of an OAuth client secret or auth key rather than deciding what tags/scopes it should carry: route to doppler-wasp-drone.
- The ask is the database schema or connection conventions on the Neon side: route to db-wasp-drone.
- The ask is branching/review conventions for a tailnet-policy-file change: route to git-wasp-drone.

## Inputs the Drone needs
- Whether this is a fresh tailnet, an existing shared one, or a solo-developer setup (changes whether ACL hardening is urgent).
- The surface in play: ACL/tags, subnet router/exit node, database reachability, SSH, Funnel/Serve, or CI credentials.
- For database reachability: whether Neon's own IP allowlist plus TLS might already cover the need before reaching for a bastion.
- For CI: the target tag already defined (or needing definition) in the policy file.

## Outputs
- A tailnet policy file (ACLs/grants/tags) with a `tests` block.
- A bastion or subnet-router configuration for reaching a private database.
- An OAuth client / ephemeral-node wiring for a CI workflow.
- Explicit handoffs for anything outside Tailscale's own scope.

## Commonly sequenced with
- security-wasp-drone: for the least-privilege audit of any ACL this Drone writes.
- devops-wasp-drone: for the CI/CD pipeline the ephemeral node plugs into.
- db-wasp-drone: for the Neon-side schema and connection conventions behind a bastion.
- doppler-wasp-drone: for rotating the secret value of an issued OAuth client or auth key.
