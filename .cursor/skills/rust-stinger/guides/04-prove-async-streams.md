# 04 — Prove async and stream correctness

## Purpose

Make task ownership, cancellation, timeout, retry, backpressure, ordering, shutdown, and cleanup observable. This guide covers Command Brief action 5.

## Lifecycle model

1. Name the root owner of every spawned task.
2. Define admission stop, cooperative cancellation signal, drain policy, join deadline, escalation, and cleanup.
3. Use bounded channels on hot paths and state the capacity rationale.
4. Review every `select!` awaited operation for documented cancellation safety; dropping and recreating a future must not lose observable work ([research](../research/async/2026-07-24-tokio-select-cancellation.md)).
5. Reserve channel capacity before expensive/fallible message construction when cancellation could otherwise lose the message; Tokio documents that cancelled `send` loses the message and queue position ([research](../research/async/2026-07-24-tokio-send-reserve.md)).
6. Call Tower readiness before dispatch and prove reserved capacity is released if dispatch/future is dropped ([research](../research/async/2026-07-24-tower-service-readiness.md)).
7. Record Tower layer order and test saturation, timeout, load shedding, and error mapping because layer order changes observable behavior ([research](../research/async/2026-07-24-tower-service-builder.md)).
8. Stop upstream production when an Axum response body is dropped; HTTP pull-based framing only provides backpressure if the producer is bounded and cancellation-aware ([research](../research/async/2026-07-24-axum-streaming-body.md)).
9. Detect shutdown, notify owned work, and wait for completion as separate phases ([research](../research/async/2026-07-24-tokio-graceful-shutdown.md)).

## Replay boundary

Track `visible_output`, `tool_call`, sequence/correlation ID, and reservation state as explicit facts. Once output or a harness-visible tool call occurs, consume/withhold the replay proof and return a structured terminal or recoverable state according to the approved contract; never infer safety from a transport error alone.

## Required tests

- cancellation before and after channel reservation;
- cancellation between `poll_ready` and `call`;
- client disconnect while producer is blocked;
- chunk ordering and correlation preservation;
- timeout at each side-effect boundary;
- retry only before the approved visibility boundary;
- shutdown under idle, saturated, streaming, and database-flush states;
- task/permit/handle cleanup after every failure path.

## Worked examples

See [visible-output cancellation](../examples/02-edge-visible-output-cancellation.md) and [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md).
