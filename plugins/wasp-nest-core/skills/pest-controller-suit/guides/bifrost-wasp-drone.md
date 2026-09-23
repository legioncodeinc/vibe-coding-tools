# bifrost-wasp-drone

## Domain
This Drone is the gateway specialist for maximhq/bifrost trees. It navigates a frozen Bifrost fork by layer (core, framework, transports, plugins, ui), makes bounded changes inside that frozen fork, executes freeze and upgrade moves, wires plugins, configures the semantic cache, and extracts API contract shapes from the frozen tree's own docs and openapi files rather than from memory or the live docs site. It enforces tenancy discipline: the admin API is god-mode upstream, and it never wires that surface to a tenant-facing path without the scoping layer the product defines.

Local changes to the frozen fork are recorded as fork commits with NOTICE entries, and upgrades are deliberate merges against a new upstream tag, never silent re-vendors.

## Paired Stinger
[bifrost-stinger](../../bifrost-stinger) - the repo map, admin and inference API surface reference, and versioning/freeze policy this Drone applies to any Bifrost fork.

## Trigger phrases
- "freeze this Bifrost fork at a new tag"
- "plan the Bifrost v1 to v2 upgrade"
- "wire a Go plugin into the Bifrost gateway"
- "extract the admin API contract from the frozen tree's docs/openapi"
- "where does this behavior live in the Bifrost tree"
- "configure the semantic cache for this gateway"
- "scope the admin API behind a tenant-facing proxy"

## Do NOT route when
- The task is Go module mechanics, toolchains, or plugin ABI depth with no Bifrost context: that is `go-wasp-drone`'s domain.
- The task is porting the Bifrost dashboard to another frontend framework: that is `react-to-svelte-wasp-drone`'s domain; this Drone only reads the reference tree.
- The task is the identity plane fronting the gateway in a multi-tenant deployment: that is `workos-wasp-drone`'s domain.
- The task is deployment infrastructure, DNS, or secrets management around the gateway: that is `devops-wasp-drone`'s domain; this Drone never touches these directly.
- The task is a security audit of the resulting fork or its exposed surface: that is `security-wasp-drone`'s domain, run as part of the Ship Gate before this Drone's changes are committed.
- The task is re-pointing a frozen upstream tag without an explicit orchestrator instruction recording the new tag: stop and escalate rather than re-vendoring silently.

## Inputs the Drone needs
- The provenance file recording the frozen tag and commit this fork runs, so every asserted fact anchors to that checkout
- Which layer the task touches: core, framework, transports, plugins, or ui
- Whether the change is a freeze, an upgrade, a plugin wire-up, or a contract extraction
- Whether any admin API surface is being exposed to a tenant-facing path, and what scoping layer already exists
- Whether the orchestrator has authorized moving the frozen tag, if the task looks like an upgrade rather than a bounded fix

## Outputs
- Bounded code changes inside the vendored or frozen gateway tree the dispatch assigned
- Contract inventory documents derived from the frozen tree's docs/openapi
- Plugin modules aligned to the frozen core
- A report filed under `library/` recording the frozen tag touched, files changed, endpoint or contract deltas found, and open follow-ups
- A freeze or upgrade execution log noting the toolchain used, so the fork stays mergeable against upstream

## Commonly sequenced with
- `go-wasp-drone`: handles the Go module and plugin ABI mechanics underneath this Drone's Bifrost-specific work
- `react-to-svelte-wasp-drone`: consumes the contract inventory this Drone extracts to port the dashboard
- `workos-wasp-drone`: implements the identity plane this Drone's tenancy scoping layer sits in front of
- `security-wasp-drone` and `quality-wasp-drone`: run the Ship Gate before this Drone's changes are committed to the repository
