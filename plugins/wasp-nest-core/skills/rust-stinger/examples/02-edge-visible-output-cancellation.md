# Example 02 - Edge case: cancellation after visible output

Demonstrates [typed design](../guides/02-design-workspace-and-types.md), [bounded implementation](../guides/03-implement-bounded-slices.md), [async/replay proof](../guides/04-prove-async-streams.md), [adapter boundaries](../guides/06-implement-adapters.md), and [closeout](../guides/09-close-the-loop.md).

## Input

```text
AC REPLAY-07: A provider disconnect before output may be retried once. After any visible chunk or harness-visible tool call, the turn must never be replayed automatically.
Fixture: provider emits chunk seq=0, then disconnects.
```

## State pattern

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Visibility {
    None,
    OutputSeen,
    ToolCallSeen,
}

enum Recovery {
    ReplayEligible(NoVisibleEffect),
    ResumeRequired { correlation_id: CorrelationId },
}

fn classify(trace: &TurnTrace) -> Recovery {
    match trace.visibility {
        Visibility::None => Recovery::ReplayEligible(NoVisibleEffect::new_private()),
        Visibility::OutputSeen | Visibility::ToolCallSeen => Recovery::ResumeRequired {
            correlation_id: trace.correlation_id,
        },
    }
}
```

Keep the proof-token constructor private so callers cannot manufacture replay eligibility; rustls uses private verification markers for the same omitted-check defense ([research](../research/security/2026-07-24-rustls-verification-markers.md)). Use an explicit tagged durable representation rather than an ambiguous untagged enum ([research](../research/boundaries/2026-07-24-serde-enum-representations.md)).

## Failure-focused proof

```bash
cargo test -p router-core replay_before_output_is_single_use
cargo test -p provider-fake disconnect_after_first_chunk_disables_replay
cargo test -p provider-fake tool_call_visibility_disables_replay
cargo test -p router-daemon dropped_body_cancels_upstream_and_releases_permit
```

The last test matters because an Axum body is pull-driven and only preserves the desired backpressure if upstream production stops on disconnect ([research](../research/async/2026-07-24-axum-streaming-body.md)). Each selected future is reviewed individually because Tokio cancellation safety is operation-specific ([research](../research/async/2026-07-24-tokio-select-cancellation.md)).

## Output

```markdown
## Outcome
Disconnect before visibility consumes one replay proof; disconnect after seq=0 returns `resume_required` and does not create a second provider request.

## Acceptance evidence
- REPLAY-07: four focused tests PASS; fake request count remains 1 after visible output.

## Safety and operations
- External effects used: none
- Recovery: correlation and last visible sequence persist; automatic replay remains disabled.
```
