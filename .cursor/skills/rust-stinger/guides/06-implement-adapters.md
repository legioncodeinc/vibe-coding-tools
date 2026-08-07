# 06 — Implement adapters behind approved contracts

## Purpose

Implement provider and harness edges without granting providers agency or inventing protocol policy. This guide covers Command Brief action 7.

## Boundary design

1. Import approved protocol/domain types into edge crates; do not leak SDK types inward.
2. Normalize provider chunks, usage, finish reasons, and errors into the approved internal contract.
3. Preserve correlation, ordering, visibility, tool-call, retry, reservation, and cancellation facts explicitly.
4. Inject credentials only through approved secret-reference interfaces. Secret wrappers require explicit exposure and reduce accidental Debug/copying, but do not replace the secret store ([research](../research/security/2026-07-24-secrecy.md)).
5. Start provider/request functions with `#[instrument(skip_all)]` and add only allowlisted fields; function arguments are captured by default otherwise ([research](../research/observability/2026-07-24-tracing-instrument.md)).
6. Let libraries emit structured events while daemon/CLI binaries own subscriber and sink initialization; tracing advises libraries not to set a global subscriber ([research](../research/observability/2026-07-24-tracing-subscriber.md)).
7. Use stable rustls safe builders and approved roots. Custom verifier APIs are deliberately dangerous and require Security review ([research](../research/security/2026-07-24-rustls-config-builder.md)).
8. Keep unsupported, unauthorized, and unconfigured routes disabled.

## Fake-first contract suite

Use fake HTTP servers and fixtures for:

- success and chunk-boundary variation;
- malformed/unknown fields and structured errors;
- disconnect and cancellation at every visible-output boundary;
- throttling, timeout, server error, retry eligibility, and backpressure;
- usage/reservation/reconciliation and duplicate idempotency keys;
- secret/header/prompt redaction in logs, crashes, metrics, diagnostics, and support exports.

Direct Router/Tower calls cover most HTTP contracts without a live listener ([research](../research/async/2026-07-24-axum-service-testing.md)); keep a narrow loopback test for bind/shutdown/stream disconnect.

## Prohibited effects

Do not use live credentials, paid/subscription traffic, public endpoints, signing identity, or provider activation unless the gate explicitly authorizes them. Adapter implementation never gives a provider tools, approvals, filesystem/repository access, memory, or user interaction.

## Worked examples

See [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md) and [visible-output cancellation](../examples/02-edge-visible-output-cancellation.md).
