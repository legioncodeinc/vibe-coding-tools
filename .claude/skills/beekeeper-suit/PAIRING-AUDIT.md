# Pairing audit

Ground truth pulled from the filesystem on 2026-08-14, after the repair pass. This file is a record of current state, refreshed whenever the colony changes.

## Totals

- Bees (`.claude/agents/*.md`): **76**
- Stinger folders (`.claude/skills/*`): **79**
- Orchestrator-level skills with no paired Bee by design: **3** (`beekeeper-suit`, `queen-bee-stinger`, `get-started-stinger`)
- Pairable Stingers: **76**

## Pairing integrity

Clean. Every Bee has a matching Stinger and every pairable Stinger has a matching Bee, verified in both directions by naming convention. Zero orphans.

Every Bee also has a routing guide at `guides/<bee-name>.md`. 76 Bees, 76 guides, one-to-one.

## New additions

`rust-worker-bee` / `rust-stinger` was ported in from a prior fork and registered here: Rust implementation and code review for Cargo workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, tests, and local packaging evidence.

## Path integrity

Clean. The dead `.cursor/skills/`, `.cursor/agents/`, `ai-tools/skills/`, and `ai-tools/agents/` prefixes have been repaired to `.claude/skills/` and `.claude/agents/` across 146 files. Zero references remain outside the verbatim research archives under `references/research/raw/`, where source punctuation and source paths are preserved on purpose.

The three previously fully-broken Bees (`asset-worker-bee`, `knowledge-worker-bee`, `library-worker-bee`) now carry working paths to their Stingers.

## Stack coverage repair

Eight pairs were written for a prior product (Hivemind, a Deep Lake backed agent-memory tool distributed as an npm package across six coding harnesses). They have been broadened rather than deleted: the old material is retained as a clearly-labeled case study or alternative implementation, and each pair now leads with this repo's actual stack.

| Pair | Repair |
|---|---|
| `deeplake-dataset` renamed to `vector-store` | Vector and embedding storage generally. pgvector on Neon is primary (HNSW vs IVFFlat, distance operators, Drizzle schema, hybrid full text). Deep Lake, Qdrant, and managed services documented as alternatives with a selection matrix |
| `embeddings-runtime` | Embedding model selection generally (hosted and open weight), dimension and cost tradeoffs, batching, caching. Local daemon retained as the self-hosted option |
| `retrieval` | Retrieval on Postgres: full-text search, pgvector similarity, reciprocal rank fusion, reranking, chunking, recall@k evaluation. Deep Lake hybrid recall retained as one implementation |
| `mind` | Stack-neutral cognitive architecture with Neon plus pgvector as this repo's default substrate and SvelteKit streaming patterns added. Qdrant, Cohere, Valkey, OpenRouter retained as a documented alternative stack |
| `typescript-node` | Modern TypeScript and Node with SvelteKit first (tsconfig, load and action typing, Drizzle inference, Vitest plus Playwright, Biome vs ESLint, pnpm). Hivemind esbuild, jscpd, and npm publishing retained as the library and CLI case |
| `ci-release` | CI and release generally with SvelteKit on Vercel first (Actions job shapes, double-build avoidance, preview promotion, Drizzle plus Neon migration gating, OIDC and Doppler secrets). npm package publishing retained as the secondary case |
| `harness-integration` | Integrating capabilities across The Hive's four harnesses (Claude Code, Cursor, Codex, Cowork), grounded in the queen-bee-stinger research. Six-host installer work retained as a case study |
| `mcp-protocol` | Building and auditing MCP servers generally, including registration in all four harnesses and the Codex TOML trap. Hivemind's server retained as a worked example |
| `mcp-tool-docs` | Documenting tool, API, and CLI surfaces generally. Hivemind examples retained as worked examples |

All routing references to the renamed `deeplake-dataset-worker-bee` were repaired to `vector-store-worker-bee` across 20 files.

## Validation

All 79 Stingers pass `per-type-validation.py --type skill --harness all` with zero errors. All 76 Bees pass `--type agent --harness claude-code` with zero errors. Remaining warnings are repo-wide patterns, not defects: descriptions above Cowork's 200 character soft cap on some legacy skills, and the `proactive` frontmatter field, which every Bee in this colony uses.

## Dead reference repair

Nested duplicate directories: 16 skills each contained a stale copy of themselves at `<skill>/<skill>/`, unreachable by any harness. The outer copy was canonical in every case, confirmed by checking which version used current paths. Before deleting, 36 files that existed only in the nested copies were salvaged up into their outer equivalents. All 16 nested trees are gone.

Dead component references repointed to live components:

| Dead name | Repointed to | Files |
|---|---|---|
| `ux-ui-worker-bee` | `ux-ui-svelte-worker-bee` | 99 |
| `ai-platform-worker-bee` | `mind-worker-bee` | 12 |
| `cms-payload-stinger` and `cms-payload-worker-bee` | `website-stinger` and `website-worker-bee`, which own the Payload surface | 11 |
| `ux-ui-stinger` | `ux-ui-svelte-stinger` | 8 |
| `ai-platform-stinger` | `mind-stinger` | 6 |
| `runbook-automation-worker-bee` | `runbook-writing-worker-bee` | 2 |
| `idp-worker-bee` | `workos-worker-bee` for hosted IdP; self-hosted Keycloak and Ory stated as unowned | 2 |

References to Bees that were never forged (`postmortem-worker-bee`, `email-worker-bee`, `documentation-worker-bee`, `issue-worker-bee`) now say plainly that the domain is unowned or name the Bee that absorbed it, instead of pointing at a file that does not exist.

## Known outstanding

- **Guide numbering in `ci-release-stinger`.** New primary-case guides are numbered 09 through 16 while the legacy npm-publishing guides hold 01 through 08. The SKILL.md routing table orders them correctly regardless, but a clean renumber is a worthwhile follow-up.
- **Aspirational references kept on purpose.** A few research and open-question files mention Bees that do not exist (`mobile-auth-stinger`, `gitlab-worker-bee`) as candidates worth forging. Those are phrased as open questions, not as routing targets, so they were left as written.
