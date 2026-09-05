# tauri-worker-bee

## Domain
This Bee owns the Tauri 2 application boundary for desktop and mobile products. It reviews current 2.x changes against a dated source ledger, aligns Rust and JavaScript Tauri packages, migrates v1 applications, designs typed Rust-to-webview IPC and state, constrains capabilities/permissions/scopes, integrates plugins and desktop sidecars, implements hosted-provider, desktop-sidecar, native-runtime, and mobile-plugin or native-mobile-bridge AI boundaries, wires app-local persistence, and prepares test, build, bundle, updater, signing, and distribution-readiness evidence. It owns Tauri-specific integration and configuration, not every Rust, frontend, AI, database, security, dependency, or release concern inside the product.

## Paired Stinger
[tauri-stinger](../../tauri-stinger) - current Tauri 2 update review, v1 migration, IPC and state, capabilities and secrets, hosted-provider, desktop-sidecar, native-runtime, and mobile-plugin AI patterns, persistence, desktop/mobile testing, build/sign/update/distribution, and dated refresh procedures with worked examples and reference tables.

## Trigger phrases
- "build a Tauri 2 desktop or mobile app"
- "what changed in the latest Tauri 2 release?"
- "summarize the newest Tauri 2 update notes for this app"
- "upgrade this Tauri 2 project"
- "migrate this Tauri v1 app to v2"
- "design a Tauri command, event, or Channel"
- "lock down these Tauri capabilities, permissions, or scopes"
- "connect this Tauri app to hosted AI"
- "bundle a local model or agent sidecar"
- "embed a native Rust AI runtime in this Tauri app"
- "wrap a native AI SDK in a Tauri plugin or mobile bridge"
- "persist AI state in this Tauri app"
- "test or package this Tauri desktop/mobile app"
- "prepare Tauri updater and signing artifacts"

Also route proactively when the request touches `src-tauri/`, `tauri.conf.json`, Tauri Cargo crates, `@tauri-apps/*` packages, plugin initialization, capabilities, permission files, sidecars, mobile Tauri projects, or updater and bundle settings.

## Do NOT route when
- The request is general Rust, Cargo, Tokio, SQLx, or service implementation unrelated to Tauri-specific integration: route to `rust-worker-bee`.
- The request is React, Svelte, Preact, Tailwind, component, accessibility, or visual-design work beyond the typed Tauri client boundary: route to the relevant frontend or UI Bee.
- The request asks which AI model, provider, gateway, local runtime, prompt architecture, tool policy, RAG design, memory system, or evaluation approach to choose: route to `ai-tools-platform-worker-bee` or `mind-worker-bee`; return to this Bee to integrate the approved topology.
- The request asks for HTTP/REST or MCP method, status, header, transport, tool-schema, capability, authentication, or error semantics rather than Tauri integration of an approved protocol: route to `http-rest-fundamentals-worker-bee` or `mcp-protocol-worker-bee`.
- The request is the internal implementation of a Python, Node.js, or standalone Rust sidecar rather than its Tauri launch, framing, permission, lifecycle, and packaging boundary: route to the relevant language Bee. This Bee owns minimal Swift/Kotlin Tauri mobile-plugin bridge glue, but vendor native SDK internals outside that bridge return to the orchestrator or an explicitly assigned external owner because the roster has no dedicated Swift or Kotlin implementation Bee.
- The request is generic database schema, indexing, retention, or data architecture: route to `db-worker-bee`; this Bee owns Tauri-local integration of an approved persistence contract.
- The request is formal security acceptance, dependency/advisory/license disposition, or final implementation-to-plan acceptance: route to `security-worker-bee`, `dependency-audit-worker-bee`, or `quality-worker-bee`.
- The request is CI/CD topology, runner provisioning, artifact hosting, public release execution, mobile store policy/submission, signing-identity acquisition, or a live updater rollout: route to the appropriate DevOps, release, or app-store Bee. This Bee may prepare Tauri configuration and local evidence but does not authorize external effects.

If a request straddles domains, use `tauri-worker-bee` for the Tauri-specific boundary and the narrower peer for its internal implementation or approval. For example, this Bee defines a constrained sidecar contract, then the language Bee implements the sidecar; this Bee prepares updater artifacts, then the release owner handles publication after the Ship Gate and user approval.

## Inputs the Bee needs
- The exact repository or worktree, owned paths, concurrent-work constraints, authorizing PRD or issue, ADRs, acceptance criteria, and current gate state.
- `src-tauri/`, `tauri.conf.json`, Cargo manifests and lockfile, JavaScript package manifest and lockfile, capabilities, permissions, plugins, sidecar configuration, tests, and build or release configuration.
- Current Tauri version graph, whether the project is v1 or v2, target desktop/mobile platforms, minimum supported operating systems, and whether remote content or custom protocols are used.
- The approved AI topology, trust boundary, hosted-provider, desktop-sidecar, native-runtime, or mobile-plugin/mobile-bridge contract, streaming/cancellation requirements, persistence classes, and sensitive-data constraints.
- The required verification targets plus explicit authority for any credentials, signing, upload, store, publication, paid traffic, or live updater effect.

If an input controlling safety, public compatibility, money, credentials, destructive migration, signing, publication, or platform support is missing, route only to establish a fail-closed plan or smallest safe checkpoint. Do not ask the Bee to guess or perform the external effect.

## Outputs
- A dated Tauri 2 update-impact review and aligned core, CLI, API, plugin, and resolved runtime plan, including source conflicts and support gaps.
- A v1-to-v2 migration plan or bounded Tauri implementation with typed IPC, least-privilege capabilities, explicit secret boundaries, tested hosted-provider, desktop-sidecar, native-runtime, or mobile-plugin AI integration, and approved persistence wiring.
- Desktop and mobile verification evidence that separates mocks, development runs, real target builds, packaged sidecars, bundles, updater metadata, and signatures without overstating coverage.
- A structured report under the repository's root `library/` path containing exact changes, commands, results, security-relevant diffs, external effects, rollback or recovery, blockers, and peer handoffs.
- A release-evidence manifest and distribution handoff when requested. Signing, upload, store submission, publication, and live rollout remain closed until explicitly authorized.

## Commonly sequenced with
- Rust implementation: `tauri-worker-bee` defines the Tauri command, state, lifecycle, or plugin boundary; `rust-worker-bee` implements general Rust mechanics underneath; Tauri-specific integration returns here for verification.
- Frontend integration: this Bee defines the typed client and trust boundary; the relevant React, Svelte, Preact, or UI Bee implements the frontend surface; this Bee verifies the IPC contract and capability scope.
- AI application work: `ai-tools-platform-worker-bee` or `mind-worker-bee` owns the model/provider/cognitive decision; the HTTP or MCP Bee owns protocol semantics when applicable; this Bee implements the hosted command, desktop sidecar, native runtime, or mobile plugin/bridge boundary; `rust-worker-bee` owns general Rust internals; `security-worker-bee` audits the composed trust boundary.
- Update or migration work: `dependency-audit-worker-bee` disposes advisories, licenses, and lockfile risk; this Bee performs the Tauri impact review and migration; fresh implementation checks run, Security audits, affected checks rerun, and then Quality closes the implementation.
- Release work: this Bee prepares and verifies Tauri bundles, updater metadata, and signing integration locally; `devops-worker-bee` owns pipeline and publication mechanics; `app-store-submission-worker-bee` owns mobile store policy and submission.
- Ship Gate: implementation checks run first, then `security-worker-bee`, then affected-check reruns, then `quality-worker-bee`; the orchestrator loads `github-repo-health-stinger`, and the user reviews the reports before commit or push.

## Critical directives the orchestrator should respect
- Require a dated source cutoff for every current or latest Tauri claim, and distinguish upstream Wry or Tao releases from versions actually resolved by Tauri.
- Keep official Tauri facts distinct from derived AI application designs. Label hosted-provider, desktop-sidecar, native-runtime, and mobile-plugin AI topologies and examples as derived patterns and trace them to the official commands, Channels, sidecar, plugin, capability, and persistence primitives they adapt.
- Treat webview input, remote content, model output, sidecar output, deep links, files, and URLs as untrusted. Require typed validation and deny-path capability tests rather than broad grants or generated code execution.
- Keep credentials, signing identities, and updater private keys outside frontend code, IPC, logs, checked-in configuration, and unapproved agent access.
- Do not infer platform, package, signing, or updater support from a single target or mocked path. Require evidence proportionate to each claim.
- Keep external effects fail-closed: no paid provider traffic, credential use, signing, upload, store submission, publication, or live updater rollout without explicit authorization.

---

*Part of Beekeeper-Suit's roster. See [`.claude/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full colony.*
