# Branching - Neon Docs

- URL: https://neon.com/docs/introduction/branching
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon architecture (branching, history window, PITR foundation)

## Summary (as stated on the page)

Neon branching creates copy-on-write clones of your database instantly, with writes saved as deltas so parent branches see zero load or performance impact. Use branching to spin up isolated development or test environments pre-loaded with production data, or run parallel CI/CD pipelines. You can also recover from data loss by rolling back to any point within your history window.

## What is a branch?

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state (including all data up to the current time, or an earlier time). Neon also supports schema-only branching.

A branch is isolated from its originating data, free to modify or delete without affecting the parent. A branch and its parent share the same data but diverge at the point of branch creation; writes to a branch are saved as a delta. **Creating a branch does not increase load on the parent branch or affect it in any way**, you can branch without impacting production performance.

Each Neon project is created with a root branch called `main`. The first branch you create branches from the project's root branch. Subsequent branches can branch from the root branch or from a previously created branch.

Object Storage, Functions, and AI Gateway all branch with your data too: each branch gets its own storage namespace, function deployment, and gateway endpoint, isolated from its parent.

## Branching workflows

- **Development branches**: create a branch of production that developers can freely modify. Branches are created with all data that existed in the parent, eliminating setup time.
- **CI/CD integration**: integrate branching via the Neon CLI, API, or GitHub Actions. On Vercel, use the Neon-managed Vercel integration to create a branch for each preview deployment.
- **Testing**: testers can create branches for schema-change testing, validating new queries, or testing destructive queries before deploying to production. Tests can run on separate branches in parallel, each with dedicated compute resources.
- **TTL branches**: create branches with TTL by setting an expiration date, useful for temporary dev/test environments needing automatic deletion.

## Restore and recover data

If data is lost to unintended deletion or another event, use **instant restore** to roll a branch back to any point within the project's **history window** (retention configured under Settings → Instant restore). You can also create a new restore branch for historical analysis.

### History window

Instant restore (and Time Travel, branching from the past, and snapshots) need Neon to keep a log of data changes. The **history window** is the project-wide setting (Settings → Instant restore in the Console) controlling how long change history is retained, which sets how far back instant restore and other features can reach.

Neon retains a history of changes with defaults of **6 hours on the Free plan** and **1 day on paid plans**. Increasing the history window expands recovery options but also increases storage costs. Configurable up to **7 days on Launch** or **30 days on Scale**.

## Related docs referenced on this page

- Branching with the Neon API
- Branching with the Neon CLI
- Branching with GitHub Actions
- The Neon-Managed Vercel Integration (branch per preview deployment)
- Instant restore
- Reset from parent
- Time Travel queries
- Branching workflow primer
- Branching Authentication
