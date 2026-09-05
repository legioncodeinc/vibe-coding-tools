# Example 01 - Happy path: bounded service slice

Demonstrates [authority](../guides/00-authority-and-principles.md), [workspace inspection](../guides/01-inspect-workspace.md), [bounded implementation](../guides/03-implement-bounded-slices.md), [async proof](../guides/04-prove-async-streams.md), [adapter boundaries](../guides/06-implement-adapters.md), and [verification](../guides/08-verify-and-package-evidence.md).

## Input

```text
Repo: /work/router
Owned paths: crates/router-daemon/**, crates/provider-fake/**, tests/stream_contract.rs
AC ROUTE-12: At most 16 in-flight requests; provider chunks preserve order; shutdown drains accepted turns in 2 seconds.
Gates: fake provider only; HTTP error schema already approved; no live credentials.
```

## Implementation pattern

```rust
use tokio::sync::{mpsc, Semaphore};
use tokio_util::sync::CancellationToken;

struct RuntimeOwner {
    cancel: CancellationToken,
    capacity: std::sync::Arc<Semaphore>,
    queue: mpsc::Sender<Turn>,
}

impl RuntimeOwner {
    async fn submit(&self, turn: Turn) -> Result<(), SubmitError> {
        let permit = self.queue.reserve().await.map_err(|_| SubmitError::Stopping)?;
        permit.send(turn);
        Ok(())
    }
}
```

The bounded queue and reservation-before-send pattern follows Tokio's documented backpressure and cancellation behavior ([bounded MPSC](../research/async/2026-07-24-tokio-mpsc.md), [`reserve`](../research/async/2026-07-24-tokio-send-reserve.md)). The implementation also owns listener shutdown separately from joined background work ([Axum shutdown](../research/async/2026-07-24-axum-graceful-shutdown.md), [Tokio shutdown](../research/async/2026-07-24-tokio-graceful-shutdown.md)).

## Focused proof

```bash
cargo test -p router-daemon --test stream_contract bounded_admission
cargo test -p router-daemon --test stream_contract preserves_chunk_order
cargo test -p router-daemon --test shutdown drains_accepted_turns
cargo clippy -p router-daemon -p provider-fake --all-targets -- -D warnings
```

The contract test calls the Axum Router as a Tower service; a separate loopback test proves bind and shutdown ([research](../research/async/2026-07-24-axum-service-testing.md)).

## Output

```markdown
# Rust implementation handoff: ROUTE-12 bounded fake-provider route

## Outcome
The fake-provider route admits no more than 16 concurrent turns, preserves chunk order, and drains accepted work during bounded shutdown.

## Acceptance evidence
- ROUTE-12: three focused tests PASS; no live provider or credential path executed.

## Safety and operations
- External effects used: none
- Shutdown: listener admission stops, root token cancels workers, owner joins tracked tasks.

## Peer handoffs and remaining gates
- Security: ready for redaction and shutdown review.
- Quality: wait until Security and affected-check reruns complete.
```
