# Scale to Zero / Compute lifecycle / Connection latency - Neon Docs

- URL: https://neon.com/docs/introduction/scale-to-zero (primary); supplementary quotes from https://neon.com/docs/introduction/compute-lifecycle and https://neon.com/docs/connect/connection-latency
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon architecture (autoscaling, scale-to-zero, cold starts)

## Scale to Zero, summary (as stated on the page)

Scale to Zero suspends inactive Lakebase Postgres computes after 5 minutes and reactivates them in milliseconds on the next query, so you pay only for active compute time. Use this feature for development, test, or intermittently active production databases where always-on compute is unnecessary. Free plan users cannot disable it; paid plan users can. Very large computes remain always active and are not eligible for scale to zero.

- When your database is inactive, it automatically scales to zero after **5 minutes**. You pay only for active time.
- On the next query, it reactivates automatically within a **few hundred milliseconds**.
- For Neon Free plan users this setting is fixed. **Paid plan users can disable scale-to-zero** to keep a compute always-active.
- **Scale to zero is only available for computes up to 16 CU.** Computes larger than 16 CU remain always active.
- Logical replication **from** Neon keeps compute active while subscribers are connected, so the database does not scale to zero in that case.

## Compute lifecycle, summary and detail

A compute in Neon is a stateless Postgres process (storage/compute separation). It has two states: `Idle` and `Active`. An idle compute has been suspended by scale to zero due to inactivity; an active compute has been activated by a connection or operation.

- If there are no active queries for 5 minutes (the scale-to-zero setting), the compute is placed into idle state (unless disabled on a paid plan).
- **Scale to Zero is conservative**: it treats an "idle-in-transaction" connection as active, to avoid breaking application logic involving long-running transactions. Only truly inactive connections are closed after the inactivity period.
- Connecting to an idle compute **automatically activates it**, generally taking **a few hundred milliseconds**. If the project has been idle more than **7 days**, activation may take slightly longer.
- **Postgres memory buffers are cold** after wakeup, initial queries may take longer until buffers warm up.
- Session-scoped objects (temporary tables, prepared statements, advisory locks, LISTEN/NOTIFY subscriptions) are **lost when the compute suspends**.

## Connection latency, mitigation strategies

Connection latency is primarily caused by cold starts when a compute wakes from Scale to Zero, typically adding a few hundred milliseconds. Mitigations:

- Disable scale-to-zero entirely on a paid plan to keep compute always active.
- Tune the suspend timeout: default is 5 minutes; can be extended up to 7 days, or (on Scale) configured down to as little as 1 minute.
- Co-locate the application and database in the same region.
- Add retry logic with exponential backoff.
- Use `sslnegotiation=direct`, which shortens SSL handshake time on Neon's proxy layer regardless of underlying Postgres version.
- Combine with **Autoscaling**: run a compute with a minimal resource floor and scale up on demand, rather than always paying for a larger fixed size.

**Important operational note**: if you disable scale to zero or your compute is never idle long enough to suspend automatically, you may need to **manually restart the compute** to pick up weekly compute-image updates from Neon, since not all releases apply via scheduled update.

## Compute sizing / autoscaling context (from `manage/computes`)

- **Fixed size**: 0.25 CU to 56 CU, does not scale to meet demand.
- **Autoscaling**: specify min/max compute size; Neon scales within those bounds in response to load. Autoscaling range is currently **0.25 CU to 16 CU**, with a maximum permitted range (max − min) of **8 CU**. The 0.25 CU and 0.5 CU settings are *shared compute*.
- Compute size support differs by plan: autoscaling supported up to 16 CU on all plans; fixed sizes above 16 CU available (no autoscaling at that size).
- Changing fixed compute size or autoscaling min/max **restarts the endpoint and disconnects existing connections**; autoscaling adjustments during normal operation do not restart or disconnect.
