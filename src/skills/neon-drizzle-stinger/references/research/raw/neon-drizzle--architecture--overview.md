# The lakebase architecture (Neon architecture overview)

- URL: https://neon.com/docs/introduction/architecture-overview
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon architecture (compute vs storage, branching foundation, autoscaling foundation, PITR foundation)

## Summary (as stated on the page)

The lakebase architecture splits Postgres into an ephemeral compute layer and a durable storage layer connected by WAL, so compute nodes can scale, restart, or fail without data loss. The storage layer uses Paxos-based WAL quorum across safekeepers to define commit correctness, a pageserver to reconstruct page versions on demand, and object storage for immutable long-term history. None of those components sit on the hot query path. This design enables copy-on-write branching, instant point-in-time restores, and serverless autoscaling including scale-to-zero, all as metadata operations rather than data copies. Lakebase Postgres on Neon and on Databricks both run on this architecture.

## Top-level overview

Instead of running Postgres as a single stateful system tied to a VM and its filesystem, Lakebase Postgres (the architecture underlying Neon) splits the system into two independent layers: compute and storage. These layers communicate over the network, with a stream of write-ahead log (WAL) records connecting them.

- **Ephemeral compute layer**: optimized for latency and execution. Runs Postgres, executing queries and transactions using RAM and local NVMe for performance. Compute nodes do not own durable state and can be replaced freely.
- **Durable storage layer**: optimized for correctness, history, and scale. Defines durability by replicating WAL via quorum, materializes Postgres pages on demand, and stores long-term, immutable history in object storage.

Object storage is intentionally kept off the critical query path. It provides durability and scale but never sits in front of query execution.

## Resource hierarchy

| Concept | Description | Relationship |
|---|---|---|
| Organization | Highest-level container for billing, users, and projects | Contains Projects |
| Project | Primary container for all database resources for an application | Contains Branches |
| Branch | Lightweight, copy-on-write clone of database state | Contains Databases, Roles |
| Compute Endpoint | Running Postgres instance (CPU/RAM for queries) | Attached to a Branch |
| Database | Logical container for data (tables, schemas, views) | Exists within a Branch |
| Role | Postgres role for authentication and authorization | Belongs to a Branch |
| Operation | Async action by the control plane (creating branch, starting compute) | Associated with Project |

## Compute layer

Each Lakebase Postgres compute node is a standard Postgres instance: it parses SQL, plans queries, executes transactions, enforces MVCC, and manages locks and indexes. Nothing about Postgres itself is rewritten. What differs is that the compute node exists to execute work, not to preserve data, it can start, stop, scale, or fail at any time without risking durability.

## Storage layer: safekeepers, pageserver, object storage

- **Safekeepers** (WAL service): a durable write buffer. When a compute node writes data, it streams WAL records to multiple safekeeper nodes using a Paxos-based consensus algorithm. A transaction is considered committed once a quorum of safekeepers acknowledges the WAL record. The compute node does not wait for data to be written to disk or object storage.
- **Pageserver**: sits between WAL and data pages. It materializes page versions by combining previously materialized base pages and committed WAL records. When a compute node needs a page at a given LSN (Log Sequence Number), it asks the pageserver, which reconstructs the page by replaying WAL up to that LSN if it doesn't already have it cached.
- **Object storage**: holds the durable, long-term history of the database, materialized page versions, historical snapshots, and immutable representations of past states. It is never accessed directly by the compute layer; it backs the pageserver.

## Why this design matters (mechanism behind branching, restore, autoscaling)

This design turns traditionally heavy-weight database operations (which usually require copying large amounts of data) into simple metadata operations. These include creating a new branch, restoring from a snapshot, spinning up a read replica, or attaching a new compute node. Because durable state lives outside the compute layer:

- **Serverless compute provisioning**: compute endpoints can automatically scale up/down according to load, or scale to zero entirely. When compute starts, it attaches to existing database history rather than reconstructing local state.
- **Copy-on-write branching**: creating a branch does not duplicate files or pages. The new branch points to an existing point in history and diverges from there using copy-on-write semantics. Only new or modified data consumes additional storage.
- **Instant restores**: because history is preserved as immutable page versions in object storage, restoring the database does not involve copying data back into place. Compute can reattach to a past point in history and execution resumes from the restored state, fast and predictably even for multi-terabyte databases.

## Sources cross-referenced on this page

Links to `branching`, `autoscaling`, `scale-to-zero`, and `branch-restore` docs confirm these features share this single underlying storage/compute separation, they are not independent subsystems.
